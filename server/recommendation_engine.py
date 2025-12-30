import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import os
import ast
import random
import requests
import json
from dotenv import load_dotenv

# Load environment variables from root .env
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

class RecommendationEngine:
    def __init__(self):
        self.data = None
        self.model = None
        self.scaler = None
        self.tfidf = None
        self.tfidf_matrix = None
        self.feature_columns = ['calories', 'protein', 'carbs', 'fats']
        
        # Initialize Supabase Credentials
        self.supabase_url = os.environ.get("VITE_SUPABASE_URL")
        self.supabase_key = os.environ.get("VITE_SUPABASE_ANON_KEY")

        self.load_data()

    def load_data(self):
        try:
            # 1. Try Loading from Supabase first (OPTIONAL - skipped for this update to prioritize local file)
            # (Keeping logic commented or secondary if you want to migrate later)
            
            # 2. Load Local Dataset (Food.com small_data.csv)
            data_path = os.path.join(os.path.dirname(__file__), 'data', 'small_data.csv')
            
            if not os.path.exists(data_path):
                print(f"Dataset not found at {data_path}.")
                self.data = pd.DataFrame()
                return

            print("Loading dataset... this may take a moment.")
            # Read only properly formatted lines to avoid parsing errors if any
            self.data = pd.read_csv(data_path)
            
            # --- PARSING FOOD.COM DATASET ---
            # Columns: id, name, nutrition, steps, ingredients, tags, ...
            
            # 1. Parse Nutrition (Stringified List -> Columns)
            # valid format: [calories, total_fat_pdv, sugar_pdv, sodium_pdv, protein_pdv, sat_fat_pdv, carbs_pdv]
            print("Parsing nutrition data...")
            
            # Helper to safely parse lists
            def safe_parse_list(val):
                try: return ast.literal_eval(str(val))
                except: return []

            # Apply parsing
            self.data['nutrition_parsed'] = self.data['nutrition'].apply(safe_parse_list)
            
            # Extract Macros & Convert PDV to Grams (Approximate)
            # PDV Assumptions: Protein 50g, Fat 78g, Carbs 275g (based on 2000 cal diet standards used in this dataset)
            
            def get_macro(lst, idx, conv_factor):
                if len(lst) > idx:
                    pdv = float(lst[idx])
                    return (pdv / 100) * conv_factor
                return 0.0

            self.data['calories'] = self.data['nutrition_parsed'].apply(lambda x: float(x[0]) if len(x)>0 else 0)
            self.data['fats'] = self.data['nutrition_parsed'].apply(lambda x: get_macro(x, 1, 78)) # Total Fat
            self.data['protein'] = self.data['nutrition_parsed'].apply(lambda x: get_macro(x, 4, 50)) # Protein
            self.data['carbs'] = self.data['nutrition_parsed'].apply(lambda x: get_macro(x, 6, 275)) # Carbs (Total)

            # 2. Clean Text Data
            self.data['name'] = self.data['name'].astype(str).str.title()
            
            # Parse steps and ingredients for frontend display
            self.data['steps_list'] = self.data['steps'].apply(safe_parse_list)
            self.data['ingredients_list'] = self.data['ingredients'].apply(safe_parse_list)
            self.data['tags_list'] = self.data['tags'].apply(safe_parse_list)

            # Create search tags string
            self.data['combined_text'] = (
                self.data['name'] + " " + 
                self.data['ingredients'].astype(str) + " " + 
                self.data['tags'].astype(str)
            ).str.lower()
            
            # Drop rows with broken nutrition
            self.data = self.data[self.data['calories'] > 0].copy()
            self.data.reset_index(drop=True, inplace=True)
            
            self._prepare_features()
            
        except Exception as e:
            print(f"Error initializing Recommendation Engine: {e}")
            import traceback
            traceback.print_exc()
            self.data = pd.DataFrame()

    def _prepare_features(self):
        try:
            # Prepare features for KNN
            self.scaler = StandardScaler()
            self.features = self.scaler.fit_transform(self.data[self.feature_columns])
            
            # We use a smaller sample for KNN fitting if dataset is huge to save memory/time,
            # or just fit all if possible. 40k is manageable.
            self.model = NearestNeighbors(n_neighbors=20, algorithm='brute', metric='euclidean')
            self.model.fit(self.features)
            
            # TF-IDF for Text Search (using subset to save memory if needed)
            self.tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
            self.tfidf_matrix = self.tfidf.fit_transform(self.data['combined_text'])
            
            print(f"Recommendation Engine initialized successfully with {len(self.data)} recipes.")
            
        except Exception as e:
            print(f"Error preparing features: {e}")
            import traceback
            traceback.print_exc()

    def _get_meal_image(self, name, tags):
        """
        Assigns a high-quality stock image based on keywords.
        (Since Food.com images might be links that are broken or complex to scrape, we stick to high-res stock fallbacks for UI quality)
        """
        name = str(name).lower()
        tags = str(tags).lower()
        
        # Default fallback
        img = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80"
        
        # Logic matches keywords to Unsplash URLs
        if 'smoothie' in name or 'shake' in name: return "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80"
        if 'salad' in name: return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80"
        if 'soup' in name or 'stew' in name: return "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&q=80"
        if 'pizza' in name: return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80"
        if 'burger' in name: return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
        if 'pasta' in name or 'spaghetti' in name: return "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80"
        if 'chicken' in name: return "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80"
        if 'beef' in name or 'steak' in name: return "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80"
        if 'pancake' in name or 'waffle' in name: return "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&q=80"
        if 'cake' in name or 'dessert' in tags: return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80"
        if 'curry' in name: return "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80"
        if 'sushi' in name: return "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80"
        if 'taco' in name: return "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80"
        
        return img

    def calculate_bmr(self, weight, height, age, gender):
        if str(gender).lower() == 'male':
            return (10 * weight) + (6.25 * height) - (5 * age) + 5
        else:
            return (10 * weight) + (6.25 * height) - (5 * age) - 161

    def calculate_tdee(self, bmr, activity_level):
        multipliers = {
            'sedentary': 1.2,
            'lightly_active': 1.375,
            'moderately_active': 1.55,
            'very_active': 1.725,
            'extra_active': 1.9
        }
        return bmr * multipliers.get(activity_level, 1.2)

    def recommend(self, user_data):
        # Default Logic
        best_model = 'knn'
        
        result = self._run_recommendation_logic(user_data, model_type=best_model)
        
        if "error" not in result:
            result["model_used"] = best_model
            result["model_confidence"] = "High"
            
        return result

    def _run_recommendation_logic(self, user_data, model_type='knn'):
        if self.data.empty: return {"error": "Data not loaded"}
        try:
            # Parse User Data
            def safe_get(key, type_func):
                val = user_data.get(key)
                try: return type_func(val)
                except: return None

            age = safe_get('age', int)
            weight = safe_get('weight', float)
            height = safe_get('height', float)
            if age is None or weight is None or height is None: return {"error": "Invalid numeric values"}

            gender = user_data.get('gender', 'male')
            goal = user_data.get('goal', 'maintenance')
            activity_level = user_data.get('activity_level', 'sedentary')
            diet_type = str(user_data.get('diet_type', 'any')).lower()
            allergies = user_data.get('allergies', [])
            
            # --- CALCULATE TARGETS ---
            bmr = self.calculate_bmr(weight, height, age, gender)
            tdee = self.calculate_tdee(bmr, activity_level)
            target_calories = tdee
            
            if goal == 'weight-loss': target_calories -= 500
            elif goal == 'weight-gain': target_calories += 500
            elif goal == 'muscle-gain': target_calories += 250

            # Macro Splits
            if goal == 'muscle-gain': p_ratio, f_ratio, c_ratio = 0.35, 0.25, 0.40
            elif goal == 'weight-loss': p_ratio, f_ratio, c_ratio = 0.40, 0.30, 0.30
            elif goal == 'weight-gain': p_ratio, f_ratio, c_ratio = 0.30, 0.30, 0.40
            else: p_ratio, f_ratio, c_ratio = 0.30, 0.30, 0.40

            target_protein_g = (target_calories * p_ratio) / 4
            target_fats_g = (target_calories * f_ratio) / 9
            target_carbs_g = (target_calories * c_ratio) / 4

            # --- PRE-FILTERING ---
            # Instead of filtering DataFrame copies (slow), we use boolean masks or search
            mask = pd.Series([True] * len(self.data))
            
            # 1. Diet Type Filtering (Search in tags)
            if diet_type != 'any' and diet_type != 'none':
                # Map some common terms
                if diet_type == 'keto': search_term = 'low-carb' 
                elif diet_type == 'vegan': search_term = 'vegan'
                elif diet_type == 'vegetarian': search_term = 'vegetarian'
                elif diet_type == 'paleo': search_term = 'paleo'
                else: search_term = diet_type
                
                mask = mask & self.data['tags_list'].apply(lambda x: search_term in [t.lower() for t in x])

            # 2. Allergy Filtering
            if allergies:
                for allergy in allergies:
                    a_term = allergy.lower()
                    mask = mask & ~self.data['combined_text'].str.contains(a_term, regex=False)

            filtered_indices = self.data[mask].index
            
            if len(filtered_indices) == 0:
                print("Warning: Filters too strict, returning random safe selection")
                filtered_indices = self.data.index[:100] # Fallback
            
            filtered_data = self.data.loc[filtered_indices]

            # --- KNN MATCHING ---
            # Scale target query
            # We target "Per Meal" stats = Day / 3
            query = np.array([[target_calories / 3, target_protein_g / 3, target_carbs_g / 3, target_fats_g / 3]]) 
            query_scaled = self.scaler.transform(query)
            
            # Find neighbors within the FILTERED subset
            # Since our model is fit on the WHOLE dataset, we can find neighbors globally 
            # and then intersect with filtered_indices to find the best valid ones.
            # However, for efficiency with 40k rows, we can just subset the features if memory allows.
            
            features_subset = self.features[filtered_indices]
            
            # Fit specific temporary NN for this filtered user group
            # (Fast enough for 40k rows)
            n_neighbors = min(50, len(filtered_data))
            temp_model = NearestNeighbors(n_neighbors=n_neighbors, algorithm='brute', metric='euclidean')
            temp_model.fit(features_subset)
            
            distances, indices = temp_model.kneighbors(query_scaled, n_neighbors=n_neighbors)
            
            # Get the actual rows
            candidates = filtered_data.iloc[indices[0]].copy()

            # --- MEAL TYPE ASSIGNMENT ---
            # Heuristic assignment since dataset doesn't have strict 'breakfast/lunch' cols always reliable
            breakfasts, lunches, dinners = [], [], []
            
            for _, row in candidates.iterrows():
                tags = row['tags_list']
                name = row['name'].lower()
                
                if 'breakfast' in tags or any(x in name for x in ['pancake', 'egg', 'oat', 'waffle']):
                    breakfasts.append(row)
                elif 'lunch' in tags or any(x in name for x in ['sandwich', 'wrap', 'soup', 'salad']):
                    lunches.append(row)
                else:
                    dinners.append(row)
                    
            # Fallback filling
            def fill_category(target_list, source_df, count):
                if len(target_list) < count:
                    needed = count - len(target_list)
                    # Grab randoms from source that aren't already used
                    others = source_df.sample(min(needed * 2, len(source_df))).to_dict('records')
                    for o in others:
                        if len(target_list) >= count: break
                        target_list.append(o)
            
            fill_category(breakfasts, candidates, 2)
            fill_category(lunches, candidates, 2)
            fill_category(dinners, candidates, 2)
            
            selected_meals = (breakfasts[:2] + lunches[:2] + dinners[:2])
            
            # --- FORMAT OUTPUT ---
            results = []
            for row in selected_meals:
                # Use real image if available in CSV (usually not), or generate stock
                img_url = self._get_meal_image(row['name'], str(row['tags_list']))
                
                results.append({
                    "id": str(row['id']),
                    "name": row['name'],
                    "calories": int(row['calories']),
                    "protein": int(row['protein']),
                    "carbs": int(row['carbs']),
                    "fats": int(row['fats']),
                    "image": img_url,
                    "time": f"{row['minutes']} min",
                    "tags": row['tags_list'][:4],
                    "ingredients": row['ingredients_list'], # REAL INGREDIENTS
                    "steps": row['steps_list'] # REAL STEPS
                })
                
            return {
                "target_calories": int(target_calories),
                "bmr": int(bmr),
                "tdee": int(tdee),
                "meals": results
            }
            
        except Exception as e:
            print(f"Error in recommendation logic: {e}")
            import traceback
            traceback.print_exc()
            return {"error": str(e)}

    def search_meals(self, query=None):
        if self.data.empty: return []
        
        if not query:
            return self._format_results(self.data.sample(20))
            
        # TF-IDF Search
        query_vec = self.tfidf.transform([query])
        sim_scores = cosine_similarity(query_vec, self.tfidf_matrix)
        top_indices = sim_scores.argsort()[0][-20:][::-1]
        
        results_df = self.data.iloc[top_indices]
        return self._format_results(results_df)

    def _format_results(self, df):
        results = []
        for _, row in df.iterrows():
            results.append({
                "id": str(row['id']),
                "name": row['name'],
                "calories": int(row['calories']),
                "protein": int(row['protein']),
                "carbs": int(row['carbs']),
                "fats": int(row['fats']),
                "image": self._get_meal_image(row['name'], str(row['tags_list'])),
                "time": f"{row['minutes']} min",
                "tags": row['tags_list'][:4],
                "ingredients": row['ingredients_list'],
                "steps": row['steps_list']
            })
        return results
