import requests
import json

def test_recommendation():
    url = 'http://localhost:5000/recommend'
    
    # Test Case 1: Standard User
    payload = {
        "age": 30,
        "weight": 75,
        "height": 175,
        "gender": "male",
        "goal": "weight-loss",
        "activity_level": "moderately_active",
        "diet_type": "any",
        "allergies": []
    }
    
    print("Testing with payload:", json.dumps(payload, indent=2))
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("Success!")
            data = response.json()
            print("Target Calories:", data.get('target_calories'))
            print("Number of meals recommended:", len(data.get('meals', [])))
            if data.get('meals'):
                print("First meal:", data['meals'][0]['name'])
        else:
            print("Failed:", response.status_code, response.text)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test_recommendation()
