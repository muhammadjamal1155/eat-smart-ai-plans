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
            "name": "Empty Payload Test",
            "payload": {}
        },
        {
            "name": "Missing Fields Test",
            "payload": {
                "age": "30", "gender": "male"
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
                print(f"Meals Found: {len(data.get('meals', []))}")
            else:
                print("Response Text:", response.text)
                try:
                    print("Error JSON:", response.json())
                except:
                    pass
        except Exception as e:
            print("Error:", e)

if __name__ == "__main__":
    reproduce()
