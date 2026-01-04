import requests
import json

BASE_URL = "http://localhost:5000"
USER_ID = "test_user_123"

def test_get_history():
    print(f"Testing GET {BASE_URL}/analytics/history...")
    try:
        response = requests.get(f"{BASE_URL}/analytics/history", params={
            "user_id": USER_ID,
            "days": 30
        })
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
             print("Response JSON:")
             # print(json.dumps(response.json(), indent=2))
             print(f"Got {len(response.json())} entries.")
        else:
             print(f"Error: {response.text}")

    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_get_history()
