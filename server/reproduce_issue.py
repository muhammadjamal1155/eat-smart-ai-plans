import requests
import json

def reproduce():
    url = 'http://localhost:5000/recommend'
    
    test_cases = [
        {
            "name": "Standard",
            "payload": {
                "age": "25", "weight": "70", "height": "175", "gender": "male",
                "goal": "weight-loss", "activity_level": "sedentary", "diet_type": "any", "allergies": []
            }
        },
        {
            "name": "Diet None",
            "payload": {
                "age": "25", "weight": "70", "height": "175", "gender": "male",
                "goal": "weight-loss", "activity_level": "sedentary", "diet_type": "none", "allergies": []
            }
        },
        {
            "name": "Allergies Regex",
            "payload": {
                "age": "25", "weight": "70", "height": "175", "gender": "male",
                "goal": "weight-loss", "activity_level": "sedentary", "diet_type": "any", "allergies": ["Peanuts (all)"]
            }
        },
        {
            "name": "User Case (Corrected Units)",
            "payload": {
                "age": "30", "weight": "60", "height": "152.4", "gender": "female",
                "goal": "weight-gain", "activity_level": "lightly-active", "diet_type": "vegan", "allergies": []
            }
        }
    ]
    
    for case in test_cases:
        print(f"\nTesting Case: {case['name']}")
        try:
            response = requests.post(url, json=case['payload'])
            print("Status Code:", response.status_code)
            if response.status_code == 200:
                data = response.json()
                print(f"Target Calories: {data.get('target_calories')}")
                print(f"Meals Found: {len(data.get('meals', []))}")
                if data.get('meals'):
                    print("First meal:", data['meals'][0]['name'])
            else:
                print("Response Text:", response.text)
        except Exception as e:
            print("Error:", e)

if __name__ == "__main__":
    reproduce()
