import requests
import datetime

BASE_URL = "http://localhost:5000"

def test_log_stats():
    print(f"Testing POST {BASE_URL}/analytics/log...")
    try:
        response = requests.post(f"{BASE_URL}/analytics/log", json={
            "user_id": "test_user_123",
            "date": datetime.date.today().isoformat(),
            "weight": 75.5,
            "calories": 2000
        })
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

def test_goals():
    print(f"Testing POST {BASE_URL}/goals...")
    try:
        response = requests.post(f"{BASE_URL}/goals", json={
            "user_id": "test_user_123",
            "goal": {
                "id": "goal_1",
                "title": "Test Goal",
                "target": 5,
                "deadline": "2026-06-01",
                "status": "active"
            }
        })
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_log_stats()
    test_goals()
