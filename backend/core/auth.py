import os
from functools import wraps
from flask import request, jsonify, g
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_KEY")

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
            
        token = auth_header.split(' ')[1]
        
        if not SUPABASE_URL or not SUPABASE_KEY:
             return jsonify({"error": "Database configured incorrectly"}), 503
             
        try:
            # Verify the token by calling Supabase Auth API
            auth_url = f"{SUPABASE_URL}/auth/v1/user"
            headers = {
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(auth_url, headers=headers)
            
            if response.status_code != 200:
                 return jsonify({"error": "Invalid or expired token"}), 401
                 
            user_data = response.json()
            g.user_id = user_data.get('id')
            g.user_email = user_data.get('email')
            
        except Exception as e:
            print(f"Auth verification error: {e}")
            return jsonify({"error": "Unauthorized"}), 401
            
        return f(*args, **kwargs)
    return decorated_function
