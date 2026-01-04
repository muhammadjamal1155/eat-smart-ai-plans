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
            "name": "Filter Tags Test",
            "payload": {
                "age": "30", "weight": "70", "height": "175", "gender": "male",
                "goal": "maintenance", "activity_level": "sedentary", "diet_type": "any", "allergies": []
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
                if data.get('meals'):
                    print("First 3 meals tags:")
                    for i, meal in enumerate(data['meals'][:3]):
                        print(f"Meal {i+1}: {meal['tags']}")
            else:
                print("Response Text:", response.text)
        except Exception as e:
            print("Error:", e)

if __name__ == "__main__":
    reproduce()
