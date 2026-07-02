import datetime

def test_log_stats_unauthorized(client):
    # This should fail since we haven't provided a valid token
    response = client.post("/analytics/log", json={
        "date": datetime.date.today().isoformat(),
        "weight": 75.5,
        "calories": 2000
    })
    # After require_auth decorator, it should return 401 Unauthorized or 503 if DB is not configured.
    # Since require_auth checks header, it will return 401.
    assert response.status_code == 401

def test_goals_unauthorized(client):
    response = client.post("/goals", json={
        "goal": {
            "id": "goal_1",
            "title": "Test Goal",
            "target": 5,
            "deadline": "2026-06-01",
            "status": "active"
        }
    })
    assert response.status_code == 401
