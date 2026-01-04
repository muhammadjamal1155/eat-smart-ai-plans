import os
import pandas as pd
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
# Use Service Key (Admin) if available, otherwise Anon Key
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'healthy_eating.csv')

def seed_meals():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: Missing Supabase credentials in .env")
        return

    print(f"Reading data from {DATA_FILE}...")
    try:
        df = pd.read_csv(DATA_FILE)
    except FileNotFoundError:
        print("Error: healthy_eating.csv not found.")
        return

    # Clean / Transform keys to match Database Schema
    # DB Schema (from schema.sql):
    # name, calories, protein, carbs, fats, image, time, tags[], ingredients[], steps[]
    
    # CSV Columns (mapped in recommendation_engine.py):
    # meal_name -> name
    # calories -> calories
    # protein_g -> protein
    # carbs_g -> carbs
    # fat_g -> fats
    # image -> image
    # (time, tags, ingredients, steps might be missing or need defaults)

    records = []
    print("Preparing records...")
    
    for _, row in df.iterrows():
        # Basic mapping
        record = {
            "name": str(row.get('meal_name', row.get('name', 'Unknown Meal'))),
            "calories": int(pd.to_numeric(row.get('calories', 0), errors='coerce') or 0),
            "protein": int(pd.to_numeric(row.get('protein_g', row.get('protein', 0)), errors='coerce') or 0),
            "carbs": int(pd.to_numeric(row.get('carbs_g', row.get('carbs', 0)), errors='coerce') or 0),
            "fats": int(pd.to_numeric(row.get('fat_g', row.get('fats', 0)), errors='coerce') or 0),
            "image": str(row.get('image', '')),
            "time": "30 min", # Default
            "tags": [],
            "ingredients": [],
            "steps": []
        }
        
        # Construct tags from CSV columns if available
        tags = []
        if 'diet_type' in row: tags.append(str(row['diet_type']))
        if 'cuisine' in row: tags.append(str(row['cuisine']))
        if 'meal_type' in row: tags.append(str(row['meal_type']))
        record['tags'] = list(set([t for t in tags if t and t.lower() != 'nan']))

        records.append(record)

    print(f"Uploading {len(records)} meals to Supabase...")
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal" # Don't return all inserted rows
    }

    # Batch upload (Supabase allows bulk inserts)
    BATCH_SIZE = 100
    for i in range(0, len(records), BATCH_SIZE):
        batch = records[i:i + BATCH_SIZE]
        url = f"{SUPABASE_URL}/rest/v1/meals"
        
        response = requests.post(url, headers=headers, json=batch)
        
        if response.status_code == 201:
            print(f"Batch {i//BATCH_SIZE + 1} uploaded successfully.")
        else:
            print(f"Error uploading batch {i//BATCH_SIZE + 1}: {response.status_code} - {response.text}")

    print("Seeding complete!")

if __name__ == "__main__":
    seed_meals()
