import requests
import json

def verify_goals():
    url = 'http://localhost:5000/recommend'
    
    base_profile = {
        "age": "30", "weight": "70", "height": "175", "gender": "male",
        "diet_type": "any", "allergies": []
    }
    
    scenarios = [
        {"goal": "maintenance", "activity_level": "sedentary"},
        {"goal": "weight-loss", "activity_level": "sedentary"},
        {"goal": "weight-gain", "activity_level": "sedentary"},
        {"goal": "maintenance", "activity_level": "very_active"},
    ]
    
    print(f"{'Goal':<15} | {'Activity':<15} | {'Target Calories':<15} | {'TDEE':<10}")
    print("-" * 65)
    
    for s in scenarios:
        payload = base_profile.copy()
        payload.update(s)
        
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                data = response.json()
                print(f"{s['goal']:<15} | {s['activity_level']:<15} | {data['target_calories']:<15} | {data['tdee']:<10}")
            else:
                print(f"Error for {s}: {response.text}")
        except Exception as e:
            print(f"Exception: {e}")

if __name__ == "__main__":
    verify_goals()
