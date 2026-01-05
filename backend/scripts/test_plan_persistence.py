import requests
import json
import datetime

BASE_URL = "http://localhost:5000"
USER_ID = "test_user_plans"

def test_plan_persistence():
    print(f"Testing Plan Persistence for {USER_ID}...")
    
    # 1. Save Plan
    plan_data = {
        "Monday": {
            "breakfast": {"id": "1", "name": "Oatmeal", "calories": 300},
            "lunch": None,
            "dinner": None
        }
    }
    
    print("Saving plan...")
    try:
        resp = requests.post(f"{BASE_URL}/plans", json={
            "user_id": USER_ID,
            "plan_data": plan_data
        })
        print(f"Save Status: {resp.status_code}")
        print(resp.text)
        
        if resp.status_code != 200:
            print("Failed to save.")
            return

        # 2. Get Plan
        print("Fetching plan...")
        resp = requests.get(f"{BASE_URL}/plans", params={"user_id": USER_ID})
        print(f"Get Status: {resp.status_code}")
        print(resp.text)
        
        data = resp.json()
        if data and data.get('plan_data'):
            print("SUCCESS: Plan retrieved correctly.")
            print(f"Data: {data['plan_data']['Monday']['breakfast']['name']}")
        else:
            print("FAILURE: Plan data missing or empty.")

    except Exception as e:
        print(f"Connection failed: {e}")
        print("Is the backend running?")

if __name__ == "__main__":
    test_plan_persistence()
