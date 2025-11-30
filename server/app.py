from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from recommendation_engine import RecommendationEngine

app = Flask(__name__)
CORS(app)

# Initialize Recommendation Engine
engine = RecommendationEngine()

@app.route('/')
def home():
    return "Eat Smart AI Plans API is running!"

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    
    # Use the engine to get recommendations
    recommendations = engine.recommend(data)
    
    if "error" in recommendations:
        return jsonify(recommendations), 500

    return jsonify(recommendations)
    
@app.route('/meals', methods=['GET'])
def get_meals():
    query = request.args.get('query', '')
    meals = engine.search_meals(query)
    return jsonify(meals)

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
        
    # In a real application, you would generate a token and send an email here.
    # For now, we will log it to the console to simulate the action.
    print(f"----------------------------------------------------------------")
    print(f"SIMULATION: Password reset requested for {email}")
    print(f"Email would be sent to: {email}")
    print(f"Reset Link: http://localhost:5173/reset-password-confirm?token=simulation-token")
    print(f"----------------------------------------------------------------")
    
    return jsonify({"message": "Password reset link sent (simulated)", "status": "success"})

@app.route('/api/email-grocery-list', methods=['POST'])
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

if __name__ == '__main__':
    app.run(debug=True)
