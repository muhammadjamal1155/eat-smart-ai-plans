from flask import Blueprint, request, jsonify
from services.recommendation_service import RecommendationService

api = Blueprint('api', __name__)

@api.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    service = RecommendationService.get_instance()
    
    # Use the service to get recommendations
    recommendations = service.get_recommendations(data)
    
    if "error" in recommendations:
        return jsonify(recommendations), 500

    return jsonify(recommendations)
    
@api.route('/meals', methods=['GET'])
def get_meals():
    query = request.args.get('query', '')
    tag = request.args.get('tag', 'all')
    service = RecommendationService.get_instance()
    meals = service.search_meals(query, tag)
    return jsonify(meals)

@api.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
        
    # In a real application, you would generate a token and send an email here.
    print(f"----------------------------------------------------------------")
    print(f"SIMULATION: Password reset requested for {email}")
    print(f"Email would be sent to: {email}")
    print(f"Reset Link: http://localhost:5173/reset-password-confirm?token=simulation-token")
    print(f"----------------------------------------------------------------")
    
    return jsonify({"message": "Password reset link sent (simulated)", "status": "success"})

@api.route('/api/email-grocery-list', methods=['POST'])
def email_grocery_list():
    data = request.json
    email = data.get('email')
    items = data.get('items')
    
    if not email or not items:
        return jsonify({"error": "Email and items are required"}), 400
        
    # Simulation
    print(f"----------------------------------------------------------------")
    print(f"SIMULATION: Sending Grocery List to {email}")
    print(f"Items:")
    for item in items:
        print(f" - {item}")
    print(f"----------------------------------------------------------------")
    
    return jsonify({"message": "Grocery list sent (simulated)", "status": "success"})
