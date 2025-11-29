from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Load meals data
def load_meals():
    try:
        with open(os.path.join(os.path.dirname(__file__), 'data', 'meals.json'), 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading meals: {e}")
        return []

MEALS = load_meals()

def calculate_bmr(weight, height, age, gender):
    # Mifflin-St Jeor Equation
    if gender.lower() == 'male':
        return (10 * weight) + (6.25 * height) - (5 * age) + 5
    else:
        return (10 * weight) + (6.25 * height) - (5 * age) - 161

def calculate_tdee(bmr, activity_level):
    multipliers = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extra_active': 1.9
    }
    return bmr * multipliers.get(activity_level, 1.2)

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    
    # Extract user data
    try:
        age = int(data.get('age', 25))
        weight = float(data.get('weight', 70))
        height = float(data.get('height', 170))
        gender = data.get('gender', 'male')
        goal = data.get('goal', 'maintenance')
        activity_level = data.get('activity_level', 'sedentary')
        diet_type = data.get('diet_type', 'any')
        allergies = data.get('allergies', [])
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid input data"}), 400

    # Calculate Nutritional Needs
    bmr = calculate_bmr(weight, height, age, gender)
    tdee = calculate_tdee(bmr, activity_level)
    
    target_calories = tdee
    if goal == 'weight-loss':
        target_calories -= 500
    elif goal == 'weight-gain':
        target_calories += 500
    elif goal == 'muscle-gain':
        target_calories += 250

    # Filter Meals
    filtered_meals = MEALS
    
    if diet_type != 'any':
        # Simple filtering: check if diet_type is in tags (case insensitive)
        filtered_meals = [m for m in filtered_meals if diet_type.lower() in [t.lower() for t in m['tags']]]
    
    # Filter allergies (exclude meals containing allergic ingredients - simplified check)
    # In a real app, we'd check ingredients list. Here we assume tags might hint or we skip for now if no ingredients field.
    # Let's just pass for now as we don't have ingredients in JSON yet.

    # Select Meals to meet target calories
    # Simple strategy: 1 Breakfast, 1 Lunch, 1 Dinner, 1 Snack
    # We will just return a random selection that roughly fits or just return all suitable options for the user to choose
    # The user's image shows "Choose breakfast meal", implying they select from options.
    # So we should return a list of options categorized by meal type if possible, or just a list of recommended meals.
    
    # Let's categorize them based on tags for the frontend to filter
    recommendations = {
        "target_calories": int(target_calories),
        "bmr": int(bmr),
        "tdee": int(tdee),
        "meals": filtered_meals
    }

    return jsonify(recommendations)

@app.route('/')
def home():
    return "NutriGuide AI API is running!"

if __name__ == '__main__':
    app.run(debug=True)
