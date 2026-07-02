import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from core.supabase_client import get_supabase_client
import json

def test_supabase():
    supabase = get_supabase_client()
    if not supabase:
        print("Supabase client not initialized")
        return
        
    try:
        response = supabase.table('user_meal_plans').select('*').execute()
        print("Select successful")
        print(response.data)
        
        # Test insert with tiny payload
        dummy = {
            "user_id": "00000000-0000-0000-0000-000000000000",
            "plan_data": {"test": "data"}
        }
        upsert_res = supabase.table('user_meal_plans').upsert(dummy).execute()
        print("Upsert response:")
        print(upsert_res.data)
        print(upsert_res.error)
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_supabase()
