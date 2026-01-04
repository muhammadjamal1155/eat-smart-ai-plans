import requests
import json

BASE_URL = "http://localhost:5000"
USER_ID = "test_user_123"

def test_coach_insights():
    print(f"Testing POST {BASE_URL}/insights/coach...")
    try:
        response = requests.post(f"{BASE_URL}/insights/coach", json={
            "user_id": USER_ID
        })
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
             print("Response JSON:")
             print(json.dumps(response.json(), indent=2))
        else:
             print(f"Error: {response.text}")

    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_coach_insights()
