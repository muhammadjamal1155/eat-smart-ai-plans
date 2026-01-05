import requests
import json
import datetime

BASE_URL = "http://localhost:5000"
USER_ID = "test_user_meal_log"
DATE = datetime.date.today().isoformat()

def test_log_meal():
    print(f"Testing Log Meal Increment for {USER_ID} on {DATE}...")
    
    # 1. Reset (Delete) or Overwrite with 0
    # Since we don't have delete endpoint easily exposed without auth, we'll just set to known value via upsert first
    initial = {
        "user_id": USER_ID,
        "date": DATE,
        "calories": 100,
        "protein": 10,
        "carbs": 10,
        "fats": 5
    }
    requests.post(f"{BASE_URL}/analytics/log", json=initial)
    
    # 2. Add Meal (200 cals)
    meal = {
        "user_id": USER_ID,
        "date": DATE,
        "calories": 200,
        "protein": 20,
        "carbs": 20,
        "fats": 10
    }
    print("Sending meal log...")
    resp = requests.post(f"{BASE_URL}/analytics/log-meal", json=meal)
    print(f"Log Meal Status: {resp.status_code}")
    print(resp.text)
    
    # 3. Check Result
    resp = requests.get(f"{BASE_URL}/analytics/history", params={"user_id": USER_ID, "days": 1})
    data = resp.json()
    if not data:
        print("Error: No data found")
        return

    entry = data[0] # Should be today
    print(f"Result: Calories={entry['calories']} (Expected 300)")
    
    if int(entry['calories']) == 300:
        print("SUCCESS: Incremental update worked.")
    else:
        print("FAILURE: Calculation wrong.")

if __name__ == "__main__":
    test_log_meal()
