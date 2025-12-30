import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import os
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
            # 1. Try Loading from Supabase first (via REST API)
            if self.supabase_url and self.supabase_key:
                try:
                    print("Attempting to fetch meals from Supabase REST API...")
                    
                    headers = {
                        "apikey": self.supabase_key,
                        "Authorization": f"Bearer {self.supabase_key}",
                        "Content-Type": "application/json"
                    }
                    
                    # Fetch from 'meals' table
                    api_url = f"{self.supabase_url}/rest/v1/meals?select=*"
                    response = requests.get(api_url, headers=headers, timeout=5)
                    
                    if response.status_code == 200:
                        meals_data = response.json()
                        if meals_data and len(meals_data) > 0:
                            print(f"Successfully loaded {len(meals_data)} meals from Supabase.")
                            self.data = pd.DataFrame(meals_data)
                            
                            # Standardize columns
                            self.data['diet_type'] = '' 
                            self.data['cuisine'] = ''
                            self.data['meal_type'] = ''
                            
                            if 'tags' in self.data.columns:
                                self.data['tags'] = self.data['tags'].apply(lambda x: ",".join(x) if isinstance(x, list) else str(x))

                            if 'image' in self.data.columns:
                                self.data['image_url'] = self.data['image'] 
                            
                            self._prepare_features()
                            return
                        else:
                            print("Supabase 'meals' table is empty. Falling back to CSV.")
                    else:
                        print(f"Supabase request failed: {response.status_code} {response.text}")
                        
                except Exception as db_err:
                    print(f"Supabase REST fetch failed: {db_err}. Falling back to CSV.")

            # 2. Fallback to CSV
            # SWITCH TO NEW DATASET
            data_path = os.path.join(os.path.dirname(__file__), 'data', 'healthy_eating.csv')
            
            # Fallback if file not found
            if not os.path.exists(data_path):
                print(f"Dataset not found at {data_path}. Please check file location.")
                self.data = pd.DataFrame()
                return

            self.data = pd.read_csv(data_path)
            
            # --- MAPPING NEW COLUMNS ---
            # Healthy Eating Dataset has: calories, protein_g, fat_g, carbs_g, diet_type, meal_type
            
            # Map to internal standard names
            self.data['id'] = self.data['meal_id']
            self.data['name'] = self.data['meal_name']
            
            # Ensure numeric types
            self.data['calories'] = pd.to_numeric(self.data['calories'], errors='coerce').fillna(0)
            self.data['protein'] = pd.to_numeric(self.data['protein_g'], errors='coerce').fillna(0)
            self.data['fats'] = pd.to_numeric(self.data['fat_g'], errors='coerce').fillna(0)
            self.data['carbs'] = pd.to_numeric(self.data['carbs_g'], errors='coerce').fillna(0)
            
            # Clean text columns for searching/filtering
            self.data['diet_type'] = self.data['diet_type'].astype(str).str.lower()
            self.data['meal_type'] = self.data['meal_type'].astype(str).str.lower()
            self.data['cuisine'] = self.data['cuisine'].astype(str).str.title()
            
            # --- NAME CLEANING LOGIC ---
            self.data['name'] = self.data.apply(self._clean_meal_name, axis=1)
            
            # Create 'tags' for compatibility with old search logic
            self.data['tags'] = self.data['diet_type'] + "," + self.data['cuisine'] + "," + self.data['meal_type']
            
            # --- IMAGE ASSIGNMENT LOGIC ---
            self.data['image_url'] = self.data.apply(
                lambda row: self._get_meal_image(row['name'], row['tags']), axis=1
            )
            
            # Fill missing text fields
            self.data.fillna('', inplace=True)
            
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
            
            self.model = NearestNeighbors(n_neighbors=20, algorithm='brute', metric='euclidean')
            self.model.fit(self.features)
            
            # Prepare TF-IDF for text-based fallback
            self.tfidf = TfidfVectorizer(stop_words='english')
            # Combine relevant text fields for better matching
            self.data['combined_text'] = self.data['name'] + " " + self.data['diet_type'] + " " + self.data['cuisine']
            self.tfidf_matrix = self.tfidf.fit_transform(self.data['combined_text'])
            
            print(f"Recommendation Engine initialized successfully with {len(self.data)} meals.")
            
        except Exception as e:
            print(f"Error initializing Recommendation Engine: {e}")
            import traceback
            traceback.print_exc()
            self.data = pd.DataFrame()

    def _clean_meal_name(self, row):
        """
        Fixes synthetic names like 'Husband Rice' -> 'Mexican Rice Bowl'
        """
        original_name = str(row['meal_name']).title()
        cuisine = str(row['cuisine']).title()
        
        # Keywords to identify the core dish
        keywords = [
            'Rice', 'Pasta', 'Salad', 'Stew', 'Soup', 'Wrap', 'Burger', 'Pizza', 
            'Taco', 'Curry', 'Steak', 'Fish', 'Pancake', 'Egg', 'Oat', 'Smoothie', 
            'Yogurt', 'Chicken', 'Beef', 'Pork', 'Lamb', 'Tofu', 'Sandwich', 
            'Toast', 'Noodle', 'Bowl', 'Fry', 'Roast', 'Pie'
        ]
        
        core_dish = None
        for word in keywords:
            if word in original_name:
                core_dish = word
                break
        
        if not core_dish:
            return original_name

        # --- Smart Adjective Logic ---
        # User requested to remove "Power", "Hearty" etc. 
        # We will strictly use cuisine adjectives or just the cuisine itself.
        
        adjectives = []
        
        # Cuisine-based adjectives (Randomized deterministically)
        name_hash = sum(ord(c) for c in original_name)
        
        cuisine_adjectives = {
            'Mexican': ['Zesty', 'Spicy', 'Fiesta', 'Lime-Infused'],
            'Indian': ['Spiced', 'Aromatic', 'Golden', 'Creamy'],
            'Italian': ['Rustic', 'Herbed', 'Tuscan', 'Classic'],
            'Asian': ['Savory', 'Umami', 'Fresh', 'Ginger'],
            'American': ['Homestyle', 'Classic', 'Grilled', 'Comfort'],
            'Mediterranean': ['Fresh', 'Lemon-Herb', 'Sunny', 'Olive']
        }
        
        # Pick a cuisine adjective if valid (50% chance)
        if cuisine in cuisine_adjectives:
            options = cuisine_adjectives[cuisine]
            if name_hash % 2 == 0: 
                selected = options[name_hash % len(options)]
                adjectives.insert(0, selected)

        final_adjective = adjectives[0] if adjectives else ""
        
        # Construct final name: "Zesty Mexican Rice" or just "Mexican Rice"
        name_parts = [part for part in [final_adjective, cuisine, core_dish] if part and part not in ['Nan', 'None']]
        
        return " ".join(name_parts)

    def _get_meal_image(self, name, tags):
        """
        Assigns a high-quality stock image based on keywords and cuisine.
        """
        name = str(name).lower()
        tags = str(tags).lower()
        
        # Default fallback
        img = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80"
        
        # Specific Logic
        if 'salad' in name:
            img = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80"
            if 'fruit' in name: img = "https://images.unsplash.com/photo-1519996529931-28324d1a630e?w=800&q=80"
        
        elif 'wrap' in name or 'burrito' in name:
            if 'mexican' in tags or 'mexican' in name:
                img = "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80" # Burrito
            elif 'asian' in tags or 'thai' in tags:
                img = "https://images.unsplash.com/photo-1529693155106-1d113936495d?w=800&q=80" # Asian wrap
            else:
                img = "https://images.unsplash.com/photo-1529042410759-befb72002fef?w=800&q=80" # Generic wrap
                
        elif 'curry' in name:
            if 'indian' in tags:
                img = "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80" # Indian Curry
            elif 'thai' in tags:
                img = "https://images.unsplash.com/photo-1628157774780-60d9d0c2423c?w=800&q=80" # Thai Curry
            else:
                img = "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80"
        
        elif 'pasta' in name or 'noodle' in name:
            img = "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80"
            if 'asian' in tags or 'noodle' in name:
                img = "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80"
            elif 'creamy' in name or 'alfredo' in name:
                img = "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80"
                
        elif 'rice' in name or 'bowl' in name:
            img = "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80"
            if 'mexican' in tags:
                img = "https://images.unsplash.com/photo-1536304993881-ff000997fb50?w=800&q=80"
        
        elif 'stew' in name or 'soup' in name:
            img = "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&q=80"
            if 'beef' in name or 'meat' in name:
                img = "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&q=80"
                
        elif 'steak' in name or 'beef' in name:
            img = "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80"
            
        elif 'chicken' in name:
            img = "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80"
            
        elif 'pancake' in name or 'breakfast' in tags or 'oat' in name:
            img = "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&q=80"

        return img

    def calculate_bmr(self, weight, height, age, gender):
        if gender.lower() == 'male':
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
        # Run tournament: Evaluate all models
        eval_results = self.evaluate_models(user_data)
        
        best_model = 'knn' # Default
        best_score = float('inf')
        
        # Scoring logic: Minimize Calorie Error
        print("--- Model Tournament Results ---")
        for model_name, metrics in eval_results.items():
            if "error" in metrics:
                continue
                
            error = metrics['calorie_error']
            print(f"Model: {model_name}, Error: {error:.2f}, Diversity: {metrics['diversity_score']}")
            
            # Simple logic: Lowest error wins
            if error < best_score:
                best_score = error
                best_model = model_name
                
        print(f"Winner: {best_model}")
        print("--------------------------------")
        
        result = self._run_recommendation_logic(user_data, model_type=best_model)
        
        # Inject model info
        if "error" not in result:
            result["model_used"] = best_model
            result["model_confidence"] = "High" if best_score < 100 else "Medium"
            
        return result

    def _run_recommendation_logic(self, user_data, model_type='knn'):
        if self.data.empty: return {"error": "Data not loaded"}
        try:
            required_fields = ['age', 'weight', 'height', 'gender', 'goal', 'activity_level']
            # Basic validation but allow soft defaults if needed in future
            missing_fields = [field for field in required_fields if not user_data.get(field)]
            if missing_fields: return {"error": f"Missing: {', '.join(missing_fields)}"}

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
            diet_type = user_data.get('diet_type', 'any').lower()
            allergies = user_data.get('allergies', [])
            if diet_type == 'none': diet_type = 'any'

            bmr = self.calculate_bmr(weight, height, age, gender)
            tdee = self.calculate_tdee(bmr, activity_level)
            target_calories = tdee
            
            # Calorie Adjustments
            if goal == 'weight-loss':
                target_calories -= 500
            elif goal == 'weight-gain':
                target_calories += 500
            elif goal == 'muscle-gain':
                target_calories += 250
            # maintenance = no change

            # Macro Distribution (Protein/Fats/Carbs) - GRAMS
            # 1g Protein = 4 kcal, 1g Carb = 4 kcal, 1g Fat = 9 kcal
            if goal == 'muscle-gain':
                p_ratio, f_ratio, c_ratio = 0.35, 0.25, 0.40
            elif goal == 'weight-loss':
                p_ratio, f_ratio, c_ratio = 0.40, 0.30, 0.30
            elif goal == 'weight-gain':
                p_ratio, f_ratio, c_ratio = 0.30, 0.30, 0.40
            else: # maintenance
                p_ratio, f_ratio, c_ratio = 0.30, 0.30, 0.40

            target_protein_g = (target_calories * p_ratio) / 4
            target_fats_g = (target_calories * f_ratio) / 9
            target_carbs_g = (target_calories * c_ratio) / 4
            
            # --- FILTERING ---
            filtered_data = self.data.copy()
            
            # Filter by Diet Type if specified
            if diet_type != 'any':
                # Check strict 'diet_type' value OR tags for flexibility
                filtered_data = filtered_data[
                    filtered_data['diet_type'].str.contains(diet_type, na=False) |
                    filtered_data['tags'].str.contains(diet_type, na=False)
                ]
            
            # Filter by Allergy
            # Note: This dataset doesn't have an 'ingredients' column (unlike the old one).
            # We can fuzzy search the description or name if available, or skip for now to avoid crashes.
            # Assuming 'name' might contain allergen info (e.g. "Peanut Butter Sandwich")
            if allergies:
                for allergy in allergies:
                    filtered_data = filtered_data[~filtered_data['name'].str.contains(allergy.lower(), na=False)]
            
            if filtered_data.empty: 
                # Relax constraints logic could go here, but for now error out
                return {"error": f"No meals found for diet: {diet_type}"}

            candidates = pd.DataFrame()
            
            # --- MODEL SELECTION ---
            if model_type == 'knn':
                features_subset = self.scaler.transform(filtered_data[self.feature_columns])
                n_neighbors = min(50, len(filtered_data))
                temp_model = NearestNeighbors(n_neighbors=n_neighbors, algorithm='brute', metric='euclidean')
                temp_model.fit(features_subset)
                
                # Query: divide by 3 assuming 3 meals/day is the standard "per meal" target
                query = np.array([[target_calories / 3, target_protein_g / 3, target_carbs_g / 3, target_fats_g / 3]]) 
                query_scaled = self.scaler.transform(query)
                distances, indices = temp_model.kneighbors(query_scaled, n_neighbors=n_neighbors)
                candidates = filtered_data.iloc[indices[0]].copy()
                
            elif model_type == 'cosine':
                features_subset = self.scaler.transform(filtered_data[self.feature_columns])
                query = np.array([[target_calories / 3, target_protein_g / 3, target_carbs_g / 3, target_fats_g / 3]]) 
                query_scaled = self.scaler.transform(query)
                sim_scores = cosine_similarity(query_scaled, features_subset)
                top_indices = sim_scores.argsort()[0][-50:][::-1]
                candidates = filtered_data.iloc[top_indices].copy()
                
            elif model_type == 'tfidf':
                # Text-based matching on goal/diet keywords
                query_text = f"{diet_type} {goal}".strip()
                if query_text:
                    query_vec = self.tfidf.transform([query_text])
                    tfidf_subset = self.tfidf_matrix[filtered_data.index]
                    sim_scores = cosine_similarity(query_vec, tfidf_subset)
                    top_indices = sim_scores.argsort()[0][-50:][::-1]
                    candidates = filtered_data.iloc[top_indices].copy()
                else:
                    candidates = filtered_data.sample(min(50, len(filtered_data)))

            # --- SELECTION & BALANCING ---
            breakfasts = []
            lunches = []
            dinners = []
            others = []
            
            for _, row in candidates.iterrows():
                m_type = self._infer_meal_type(row)
                if m_type == 'Breakfast': breakfasts.append(row)
                elif m_type == 'Lunch': lunches.append(row)
                elif m_type == 'Dinner': dinners.append(row)
                else: others.append(row)
            
            final_selection_rows = []
            def add_unique(source_list, count):
                added = 0
                for item in source_list:
                    if added >= count: break
                    # Avoid duplicate meal IDs
                    if not any(x['id'] == item['id'] for x in final_selection_rows):
                        final_selection_rows.append(item)
                        added += 1
                return added

            # Try to get 2 of each
            add_unique(breakfasts, 2)
            l_added = add_unique(lunches, 2)
            if l_added < 2: add_unique(others, 2 - l_added)
            d_added = add_unique(dinners, 2)
            if d_added < 2: add_unique(others, 2 - d_added)
            
            # Fill remaining slots (target = 6 meals)
            remaining_slots = 6 - len(final_selection_rows)
            if remaining_slots > 0:
                rest = others + lunches + dinners + breakfasts
                add_unique(rest, remaining_slots)
            
            # --- FORMAT RESULTS ---
            results = []
            for row in final_selection_rows:
                meal_type = self._infer_meal_type(row)
                
                # Handling tags (string from CSV or constructed)
                tag_list = str(row['tags']).split(',')
                if meal_type.lower() not in [t.lower() for t in tag_list]:
                    tag_list.insert(0, meal_type)
                
                # Generate smart recipe content
                recipe_content = self._generate_smart_recipe(row['name'], row['cuisine'], row['diet_type'])
                
                results.append({
                    "id": str(row['id']),
                    "name": row['name'].title(),
                    "calories": int(row['calories']),
                    "protein": int(row['protein']),
                    "carbs": int(row['carbs']),
                    "fats": int(row['fats']),
                    "image": row['image_url'],
                    "time": "15-30 min", # generic since dataset lacks prep time
                    "tags": tag_list[:4],
                    "ingredients": recipe_content['ingredients'],
                    "steps": recipe_content['steps']
                })
                
            return {
                "target_calories": int(target_calories),
                "bmr": int(bmr),
                "tdee": int(tdee),
                "meals": results
            }
        except Exception as e:
            print(f"Error in {model_type}: {e}")
            import traceback
            traceback.print_exc()
            return {"error": str(e)}

    def _generate_smart_recipe(self, name, cuisine, diet_type):
        """
        Generates plausible ingredients/steps based on cuisine and food type.
        """
        name = str(name).lower()
        cuisine = str(cuisine).lower()
        
        # Defaults
        ingredients = ["Fresh ingredients", "Salt and pepper", "Olive oil"]
        steps = ["Prepare all ingredients.", "Cook over medium heat.", "Serve fresh."]
        
        # 1. Detect Core Base
        if 'rice' in name:
            ingredients = ["1 cup Rice", "2 cups Water", "Seasoning", "Main Protein (Chicken/Beans)", "Vegetable Mix"]
            steps = ["Rinse the rice thoroughly.", "Boil water and add rice.", "Simmer for 18 minutes until fluffy.", "Stir in seasonings and cooked toppings."]
        elif 'pasta' in name or 'noodle' in name:
            ingredients = ["200g Pasta", "Tomato/Cream Sauce", "Garlic", "Onion", "Basil"]
            steps = ["Boil salted water in a large pot.", "Cook pasta until al dente.", "Prepare the sauce in a separate pan.", "Toss pasta with sauce and serve."]
        elif 'salad' in name:
            ingredients = ["Mixed Greens", "Tomato", "Cucumber", "Dressing", "Seeds/Nuts"]
            steps = ["Wash and chop all vegetables.", "Combine in a large bowl.", "Drizzle with dressing.", "Toss well and serve immediately."]
        elif 'soup' in name or 'stew' in name:
            ingredients = ["Broth (Chicken/Veg)", "Carrots", "Celery", "Onion", "Herbs"]
            steps = ["Sauté onions and vegetables in a pot.", "Add broth and bring to a boil.", "Simmer for 20-30 minutes.", "Season to taste and serve hot."]
        elif 'sandwich' in name or 'burger' in name or 'wrap' in name:
            ingredients = ["Bread/Wrap", "Protein Patty/Filling", "Lettuce", "Tomato", "Condiments"]
            steps = ["Toast the bread or warm the wrap.", "Cook the protein filling.", "Assemble with fresh vegetables.", "Add condiments and serve."]
        elif 'oat' in name or 'cereal' in name:
            ingredients = ["Oats", "Milk/Water", "Honey", "Berries", "Nuts"]
            steps = ["Combine oats and liquid in a pot.", "Cook until creamy.", "Top with fruits and nuts.", "Drizzle with honey."]
        elif 'egg' in name or 'omelet' in name:
            ingredients = ["2 Eggs", "Spinach", "Bell Peppers", "Cheese", "Butter"]
            steps = ["Whisk eggs in a bowl.", "Heat butter in a pan.", "Pour eggs and add vegetables.", "Fold and cook until set."]
            
        # 2. Cuisine Adjustments (Flavor Profiling)
        if 'mexican' in cuisine:
            ingredients += ["Salsa", "Cumin", "Black Beans", "Cilantro"]
            if 'rice' in steps[0]: steps.append("Garnish with fresh cilantro and lime.")
        elif 'italian' in cuisine:
            ingredients += ["Parmesan Cheese", "Oregano", "Olive Oil"]
            steps.append("Sprinkle cheese on top before serving.")
        elif 'indian' in cuisine:
            ingredients += ["Turmeric", "Garam Masala", "Ginger", "Garlic"]
            steps.insert(1, "Fry spices in oil to release aroma.")
        elif 'asian' in cuisine or 'chinese' in cuisine or 'japanese' in cuisine:
            ingredients += ["Soy Sauce", "Sesame Oil", "Green Onions", "Ginger"]
            steps.append("Garnish with chopped green onions.")
            
        # 3. Diet Adjustments
        if 'vegan' in str(diet_type):
            ingredients = [i for i in ingredients if "Egg" not in i and "Cheese" not in i and "Chicken" not in i]
            ingredients.append("Plant-based Protein")
        elif 'keto' in str(diet_type):
            ingredients = [i for i in ingredients if "Rice" not in i and "Pasta" not in i and "Bread" not in i]
            ingredients += ["Avocado", "Extra Virgin Olive Oil"]
            
        return {"ingredients": ingredients[:6], "steps": steps}

    def evaluate_models(self, user_data):
        models = ['knn', 'cosine'] # Removed TF-IDF from tourney to speed up, can add back
        evaluation = {}
        
        for m in models:
            result = self._run_recommendation_logic(user_data, model_type=m)
            if "error" in result:
                evaluation[m] = {"error": result["error"]}
                continue
                
            meals = result['meals']
            target_cal = result['target_calories']
            total_cal = sum(m['calories'] for m in meals)
            cal_error = abs(total_cal - target_cal)
            
            # Diversity score = unique ids
            unique_ids = len(set(m['id'] for m in meals))
            
            evaluation[m] = {
                "calorie_error": cal_error,
                "diversity_score": unique_ids,
                "total_calories": total_cal,
                "meal_count": len(meals)
            }
            
        return evaluation

    def search_meals(self, query=None):
        if self.data.empty:
            return []
        
        if not query:
            return self._format_results(self.data.sample(20))
            
        mask = (
            self.data['name'].str.contains(query, case=False, na=False) | 
            self.data['tags'].str.contains(query, case=False, na=False)
        )
        results_df = self.data[mask].head(20)
        return self._format_results(results_df)

    def _infer_meal_type(self, row):
        # 1. Trust the dataset 'meal_type' column first
        val = str(row['meal_type']).lower()
        if 'breakfast' in val: return 'Breakfast'
        if 'lunch' in val: return 'Lunch'
        if 'dinner' in val: return 'Dinner'
        if 'snack' in val: return 'Snack'
        
        # 2. Heuristic fallback based on name
        name = row['name'].lower()
        if any(x in name for x in ['oat', 'egg', 'pancake', 'waffle', 'cereal', 'toast']):
            return 'Breakfast'
        if any(x in name for x in ['sandwich', 'salad', 'soup', 'wrap', 'burger']):
            return 'Lunch'
            
        return 'Dinner' # Default fallback

    def _format_results(self, df):
        results = []
        for _, row in df.iterrows():
            meal_type = self._infer_meal_type(row)
            tag_list = str(row['tags']).split(',')[:3]
            if meal_type not in tag_list:
                tag_list.insert(0, meal_type)
                
            results.append({
                "id": str(row['id']),
                "name": row['name'],
                "calories": int(row['calories']),
                "protein": int(row['protein']),
                "carbs": int(row['carbs']),
                "fats": int(row['fats']),
                "image": row['image_url'],
                "time": "15-30 min",
                "tags": tag_list,
                "ingredients": ["View Online"],
                "steps": ["Simple steps"]
            })
        return results
