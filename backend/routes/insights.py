from flask import Blueprint, request, jsonify
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

insights_bp = Blueprint('insights', __name__)

# Load env variables
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

from core.supabase_client import get_supabase_client

@insights_bp.route('/insights/analyze', methods=['POST'])
def analyze_insights():
    try:
        data = request.json
        profile = data.get('profile', {})
        meals = data.get('meals', {})

        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            return jsonify({"error": "OpenAI API Key missing"}), 500

        client = OpenAI(api_key=api_key)

        # Construct Prompt
        system_prompt = """You are an expert Nutritionist AI. Analyze the user's profile and weekly meal plan.
        Identify gaps, improvements, and habits.
        Return a JSON response with a key 'recommendations' which is a list of objects.
        Each object must have:
        - "id": string (unique)
        - "type": one of ["meal", "nutrition", "habit", "goal"]
        - "title": string (short punchy title)
        - "description": string (explanation of why this recommendation matters based on their data)
        - "impact": one of ["high", "medium", "low"]
        - "category": string (e.g. "Wellness", "Efficiency", "Health")
        - "actionText": string (short action button text)
        
        Generate exactly 4 tailored recommendations.
        """

        user_prompt = f"""
        User Profile: {json.dumps(profile)}
        Weekly Meals: {json.dumps(meals)}
        
        Analyze this data and provide actionable specific insights.
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        result = json.loads(content)
        
        return jsonify(result)

    except Exception as e:
        print(f"Error in insights analysis: {e}")
        return jsonify({"error": str(e)}), 500

@insights_bp.route('/insights/coach', methods=['POST'])
def coach_insights():
    try:
        data = request.json
        user_id = data.get('user_id')
        if not user_id:
             return jsonify({"error": "User ID required"}), 400

        # Fetch Data from Supabase
        supabase = get_supabase_client()
        if not supabase:
             return jsonify({"error": "Database not configured"}), 500

        # 1. Fetch History (Last 30 days)
        history_resp = supabase.table('daily_logs').select("*").eq('user_id', user_id).order('date', desc=True).execute()
        history = history_resp.data if history_resp.data else []
        
        # 2. Fetch Goals
        goals_resp = supabase.table('user_goals').select("*").eq('user_id', user_id).eq('status', 'active').execute()
        goals = goals_resp.data if goals_resp.data else []

        # 3. Fetch User Profile (CRITICAL for context like "Gain Weight" vs "Lose Weight")
        try:
            profile_resp = supabase.table('profiles').select("*").eq('id', user_id).execute()
            profile = profile_resp.data[0] if profile_resp.data and len(profile_resp.data) > 0 else {}
        except Exception as e:
            print(f"Warning: Could not fetch profile for context: {e}")
            profile = {}
            
        primary_goal = profile.get('goal', 'general fitness') # e.g. 'muscle-gain', 'weight-loss'

        api_key = os.environ.get("OPENAI_API_KEY")
        client = OpenAI(api_key=api_key)

        system_prompt = f"""You are an elite Fitness & Nutrition Coach.
        The user's PRIMARY GOAL is: "{primary_goal.upper()}".
        Analyze the user's last 30 days of data and their active goals in this context.
        Alert them if their calorie/macro intake is contradictory to this goal (e.g. eating too little for gain, or too much for loss).
        Your tone is motivating but strict/direct.
        
        Output JSON:
        {{
          "analysis": "2-3 sentences summarizing their progress and identifying trends.",
          "status": "on_track" | "at_risk" | "off_track",
          "suggestions": ["Specific action 1", "Specific action 2", "Specific action 3"],
          "encouragement": "Short motivating punchline."
        }}
        """

        user_prompt = f"""
        User Goal: {primary_goal}
        History (Last 30 entries): {json.dumps(history)}
        Active Goals: {json.dumps(goals)}
        
        Assess my performance.
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content
        return jsonify(json.loads(content))

    except Exception as e:
        print(f"Error in coach insights: {e}")
        return jsonify({"error": str(e)}), 500
