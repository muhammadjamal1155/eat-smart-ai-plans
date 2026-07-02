from flask import Blueprint, request, jsonify, g
from core.supabase_client import get_supabase_client
from services.ai_service import AIService
from core.auth import require_auth
from core.extensions import limiter
import datetime

plans_bp = Blueprint('plans', __name__)



@plans_bp.route('/plans', methods=['GET'])
@require_auth
def get_plan():
    supabase = get_supabase_client()
    if not supabase:
        return jsonify({"error": "Database not configured"}), 503

    try:
        user_id = g.user_id

        response = supabase.table('user_meal_plans')\
            .select('*')\
            .eq('user_id', user_id)\
            .execute()
        
        if response.error:
             return jsonify({"error": str(response.error)}), 500

        data = response.data[0] if response.data else None
        return jsonify(data)

    except Exception as e:
        print(f"Error fetching plan: {e}")
        return jsonify({"error": str(e)}), 500

@plans_bp.route('/plans/grocery-list', methods=['POST'])
@require_auth
@limiter.limit("5 per minute")
def generate_grocery_list():
    try:
        data = request.json
        ingredients = data.get('ingredients', [])
        
        if not ingredients:
            return jsonify({"error": "Ingredients list required"}), 400
            
        ai_service = AIService.get_instance()
        generated_items = ai_service.generate_grocery_list(ingredients)
        
        if generated_items is None:
             return jsonify({"error": "AI service unavailable"}), 503
             
        return jsonify({"items": generated_items})

    except Exception as e:
        print(f"Error generating grocery list: {e}")
        return jsonify({"error": str(e)}), 500
