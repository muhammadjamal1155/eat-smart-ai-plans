import sys
import os
# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.recommendation_engine import RecommendationEngine
import pandas as pd

def test_engine():
    print("--- 1. Initializing Engine ---")
    try:
        engine = RecommendationEngine()
    except Exception as e:
        print(f"FAILED to initialize: {e}")
        return

    if engine.data is None or engine.data.empty:
        print("FAILED: Data not loaded or empty.")
        return

    print(f"SUCCESS: Loaded {len(engine.data)} recipes.")
    
    # Check a sample row
    print("\n--- 2. Checking Sample Data ---")
    sample = engine.data.iloc[0]
    print(f"Name: {sample['name']}")
    print(f"Steps (Type: {type(sample['steps_list'])}): {sample['steps_list'][:2]}...")
    print(f"Ingredients (Type: {type(sample['ingredients_list'])}): {sample['ingredients_list'][:3]}...")
    print(f"Calories: {sample['calories']}")
    print(f"Protein (g): {sample['protein']:.1f}")
    
    if not isinstance(sample['steps_list'], list) or not isinstance(sample['ingredients_list'], list):
        print("FAILED: Steps or Ingredients not parsed as lists.")
        return

    print("\n--- 3. Testing Recommendation ---")
    user_data = {
        'age': 30,
        'weight': 80, # kg
        'height': 180, # cm
        'gender': 'male',
        'goal': 'muscle-gain',
        'activity_level': 'moderately_active',
        'diet_type': 'any',
        'allergies': []
    }
    
    result = engine.recommend(user_data)
    
    if "error" in result:
        print(f"FAILED: Recommendation error: {result['error']}")
        return

    meals = result.get('meals', [])
    print(f"Generated {len(meals)} meals.")
    
    if not meals:
        print("FAILED: No meals returned.")
        return

    first_meal = meals[0]
    print(f"Meal 1: {first_meal['name']}")
    print(f"Meal 1 Steps: {first_meal['steps']}")
    print(f"Meal 1 Ingredients: {first_meal['ingredients']}")
    
    if first_meal['steps'] == ["Simple steps"] or first_meal['ingredients'] == ["View Online"]:
         print("FAILED: Returned fallback generic steps/ingredients instead of real data.")
    else:
         print("SUCCESS: Real steps and ingredients found in output!")

if __name__ == "__main__":
    test_engine()
