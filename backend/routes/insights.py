from flask import Blueprint, request, jsonify
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

insights_bp = Blueprint('insights', __name__)

# Load env variables
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

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
