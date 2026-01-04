import sys
import os

# Add parent directory to path so we can import from core
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.supabase_client import get_supabase_client

def test_connection():
    print("Testing Supabase connection...")
    client = get_supabase_client()
    
    if not client:
        print("FAIL: Client not initialized. Check .env variables.")
        return

    try:
        # Try a simple select. Even if table doesn't exist, we get a specific error
        # But we need auth to select usually? Or RLS policies might block.
        # Let's try to query 'profiles' which typically exists in Supabase starters
        response = client.table('profiles').select("*").execute()
        if response.error:
            print(f"Connected but received error from DB: {response.error}")
        else:
            print(f"SUCCESS: Connected to Supabase. Data: {response.data}")
    except Exception as e:
        print(f"WARNING: Connection attempted but encountered error: {e}")
        print("This might be due to missing tables or RLS policies.")

if __name__ == "__main__":
    test_connection()
