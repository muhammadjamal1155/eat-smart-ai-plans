import os
import requests
import json
from dotenv import load_dotenv

# Load env variables
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

SUPABASE_URL = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")

class SupabaseClient:
    def __init__(self, url, key):
        self.url = url
        self.key = key
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

    def table(self, table_name):
        return SupabaseQueryBuilder(self.url, self.headers, table_name)

class SupabaseQueryBuilder:
    def __init__(self, base_url, headers, table_name):
        self.url = f"{base_url}/rest/v1/{table_name}"
        self.headers = headers
        self.params = {}
        self.method = "GET"
        self.json_data = None
        self.extra_headers = {}
    
    def select(self, columns="*"):
        self.params["select"] = columns
        self.method = "GET"
        return self

    def eq(self, column, value):
        self.params[f"{column}"] = f"eq.{value}"
        return self
    
    def gte(self, column, value):
        self.params[f"{column}"] = f"gte.{value}"
        return self
        
    def order(self, column, desc=False):
        direction = "desc" if desc else "asc"
        self.params["order"] = f"{column}.{direction}"
        return self

    def execute(self):
        # Merge extra headers
        headers = {**self.headers, **self.extra_headers}
        
        if self.method == "POST":
             response = requests.post(self.url, headers=headers, json=self.json_data, params=self.params)
        elif self.method == "PATCH":
             response = requests.patch(self.url, headers=headers, json=self.json_data, params=self.params)
        elif self.method == "DELETE":
             response = requests.delete(self.url, headers=headers, params=self.params)
        else:
             response = requests.get(self.url, headers=headers, params=self.params)
             
        return SupabaseResponse(response)

    def insert(self, data):
        self.method = "POST"
        self.json_data = data
        return self

    def upsert(self, data, on_conflict=None):
        self.method = "POST"
        self.json_data = data
        self.extra_headers["Prefer"] = "resolution=merge-duplicates,return=representation"
        if on_conflict:
             self.extra_headers["On-Conflict"] = on_conflict
        return self

class SupabaseResponse:
    def __init__(self, response):
        self.data = None
        self.error = None
        try:
            response.raise_for_status()
            self.data = response.json()
        except Exception as e:
            self.error = str(e)
            try:
                # Try to parse error from body
                self.error = response.json()
            except:
                pass

supabase = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = SupabaseClient(SUPABASE_URL, SUPABASE_KEY)
else:
    print("Warning: SUPABASE_URL or SUPABASE_KEY missing.")

def get_supabase_client():
    return supabase
