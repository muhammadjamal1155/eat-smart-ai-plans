import requests
import json

url = 'http://localhost:5000/recommend'
data = {
    "age": 30,
    "weight": 80,
    "height": 180,
    "gender": "male",
    "goal": "weight-loss",
    "activity_level": "moderately_active",
    "diet_type": "any",
    "allergies": []
}

try:
    response = requests.post(url, json=data)
    if response.status_code == 200:
        print("Success!")
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Failed with status code: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
