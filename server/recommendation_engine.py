import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
import numpy as np
import os
import ast

class RecommendationEngine:
    def __init__(self):
        self.data = None
        self.model = None
        self.scaler = None
        self.feature_columns = ['calories', 'protein', 'carbs', 'fats']
        self.load_data()

    def load_data(self):
        try:
            data_path = os.path.join(os.path.dirname(__file__), 'data', 'small_data.csv')
            self.data = pd.read_csv(data_path)
            
            # Parse nutrition column (format: [cal, fat, sugar, sodium, protein, sat_fat, carbs])
            # Note: The dataset nutrition values are often percentage of daily value or raw values.
            # Based on the notebook, it seems to be: [calories, total fat (PDV), sugar (PDV), sodium (PDV), protein (PDV), saturated fat (PDV), carbohydrates (PDV)]
            # However, for a better recommendation, we ideally need raw grams. 
            # Looking at the notebook output: [173.4, 18.0, 0.0, 17.0, 22.0, 35.0, 1.0]
            # It seems the first element is calories. 
            # Let's extract what we can. 
            # Mapping based on common Food.com dataset structure:
            # 0: Calories
            # 1: Total Fat (PDV)
            # 2: Sugar (PDV)
            # 3: Sodium (PDV)
            # 4: Protein (PDV)
            # 5: Saturated Fat (PDV)
            # 6: Carbohydrates (PDV)
            
            # We need to convert PDV to grams if possible, or just use the values as relative features.
            # For simplicity and robustness given the unknown exact conversion factors without more metadata,
            # we will use these values as features for similarity matching.
            
            def parse_nutrition(x):
                try:
                    return ast.literal_eval(x)
                except:
                    return [0]*7

            self.data['nutrition_parsed'] = self.data['nutrition'].apply(parse_nutrition)
            
            self.data['calories'] = self.data['nutrition_parsed'].apply(lambda x: x[0])
            self.data['fats'] = self.data['nutrition_parsed'].apply(lambda x: x[1]) # PDV
            self.data['sugar'] = self.data['nutrition_parsed'].apply(lambda x: x[2]) # PDV
            self.data['sodium'] = self.data['nutrition_parsed'].apply(lambda x: x[3]) # PDV
            self.data['protein'] = self.data['nutrition_parsed'].apply(lambda x: x[4]) # PDV
            self.data['sat_fat'] = self.data['nutrition_parsed'].apply(lambda x: x[5]) # PDV
            self.data['carbs'] = self.data['nutrition_parsed'].apply(lambda x: x[6]) # PDV
            
            # Fill missing values if any (though cleaning should have handled this)
            self.data.fillna('', inplace=True)
            
            # Prepare features for NN
            self.scaler = StandardScaler()
            self.features = self.scaler.fit_transform(self.data[self.feature_columns])
            
            self.model = NearestNeighbors(n_neighbors=20, algorithm='brute', metric='euclidean')
            self.model.fit(self.features)
            
            print("Recommendation Engine initialized successfully.")
            
        except Exception as e:
            print(f"Error initializing Recommendation Engine: {e}")
            self.data = pd.DataFrame()

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
            print(f"Model: {model_name}, Error: {error}, Diversity: {metrics['diversity_score']}")
            
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
    def _get_common_data(self, user_data):
        pass

    def recommend_knn(self, user_data):
        return self._run_recommendation_logic(user_data, model_type='knn')

    def recommend_cosine(self, user_data):
        return self._run_recommendation_logic(user_data, model_type='cosine')

    def recommend_tfidf(self, user_data):
        return self._run_recommendation_logic(user_data, model_type='tfidf')

    def _run_recommendation_logic(self, user_data, model_type='knn'):
        if self.data.empty: return {"error": "Data not loaded"}
        try:
            required_fields = ['age', 'weight', 'height', 'gender', 'goal', 'activity_level']
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
            diet_type = user_data.get('diet_type', 'any')
            allergies = user_data.get('allergies', [])
            if diet_type == 'none': diet_type = 'any'

            bmr = self.calculate_bmr(weight, height, age, gender)
            tdee = self.calculate_tdee(bmr, activity_level)
            target_calories = tdee
            if goal == 'weight-loss': target_calories -= 500
            elif goal == 'weight-gain': target_calories += 500
            elif goal == 'muscle-gain': target_calories += 250

            target_protein_g = (target_calories * 0.3) / 4
            target_fats_g = (target_calories * 0.3) / 9
            target_carbs_g = (target_calories * 0.4) / 4
            target_protein_pdv = (target_protein_g / 50) * 100
            target_fats_pdv = (target_fats_g / 65) * 100
            target_carbs_pdv = (target_carbs_g / 300) * 100

            filtered_data = self.data.copy()
            if diet_type != 'any':
                filtered_data = filtered_data[filtered_data['tags'].str.contains(diet_type.lower(), na=False)]
            if allergies:
                for allergy in allergies:
                    filtered_data = filtered_data[~filtered_data['ingredients'].str.contains(allergy.lower(), na=False)]
            
            if filtered_data.empty: return {"error": "No meals found"}

            candidates = pd.DataFrame()
            
            if model_type == 'knn':
                features_subset = self.scaler.transform(filtered_data[self.feature_columns])
                n_neighbors = min(50, len(filtered_data))
                temp_model = NearestNeighbors(n_neighbors=n_neighbors, algorithm='brute', metric='euclidean')
                temp_model.fit(features_subset)
                query = np.array([[target_calories / 3, target_protein_pdv / 3, target_carbs_pdv / 3, target_fats_pdv / 3]]) 
                query_scaled = self.scaler.transform(query)
                distances, indices = temp_model.kneighbors(query_scaled, n_neighbors=n_neighbors)
                candidates = filtered_data.iloc[indices[0]].copy()
                
            elif model_type == 'cosine':
                features_subset = self.scaler.transform(filtered_data[self.feature_columns])
                query = np.array([[target_calories / 3, target_protein_pdv / 3, target_carbs_pdv / 3, target_fats_pdv / 3]]) 
                query_scaled = self.scaler.transform(query)
                sim_scores = cosine_similarity(query_scaled, features_subset)
                top_indices = sim_scores.argsort()[0][-50:][::-1]
                candidates = filtered_data.iloc[top_indices].copy()
                
            elif model_type == 'tfidf':
                query_text = f"{diet_type} {goal}".strip()
                if query_text:
                    query_vec = self.tfidf.transform([query_text])
                    tfidf_subset = self.tfidf_matrix[filtered_data.index]
                    sim_scores = cosine_similarity(query_vec, tfidf_subset)
                    top_indices = sim_scores.argsort()[0][-50:][::-1]
                    candidates = filtered_data.iloc[top_indices].copy()
                else:
                    candidates = filtered_data.sample(min(50, len(filtered_data)))

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
            def add_rows(source, count):
                added = 0
                for item in source:
                    if added >= count: break
                    if not any(x['id'] == item['id'] for x in final_selection_rows):
                        final_selection_rows.append(item)
                        added += 1
                return added

            add_rows(breakfasts, 2)
            l_added = add_rows(lunches, 2)
            if l_added < 2: add_rows(others, 2 - l_added)
            d_added = add_rows(dinners, 2)
            if d_added < 2: add_rows(others, 2 - d_added)
            
            remaining_slots = 6 - len(final_selection_rows)
            if remaining_slots > 0:
                rest = others + lunches + dinners + breakfasts
                add_rows(rest, remaining_slots)
            
            results = []
            for row in final_selection_rows:
                meal_type = self._infer_meal_type(row)
                tags = eval(row['tags'])[:3] if isinstance(row['tags'], str) else []
                if meal_type not in tags: tags.insert(0, meal_type)
                results.append({
                    "id": int(row['id']),
                    "name": row['name'].title(),
                    "calories": int(row['calories']),
                    "protein": int(row['protein']),
                    "carbs": int(row['carbs']),
                    "fats": int(row['fats']),
                    "image": row['image_url'] if pd.notna(row['image_url']) else "https://via.placeholder.com/300",
                    "time": f"{int(row['minutes'])} min",
                    "tags": tags,
                    "ingredients": eval(row['ingredients']) if isinstance(row['ingredients'], str) else [],
                    "steps": eval(row['steps']) if isinstance(row['steps'], str) else []
                })
                
            return {
                "target_calories": int(target_calories),
                "bmr": int(bmr),
                "tdee": int(tdee),
                "meals": results
            }
        except Exception as e:
            print(f"Error in {model_type}: {e}")
            return {"error": str(e)}

    def evaluate_models(self, user_data):
        models = ['knn', 'cosine', 'tfidf']
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
            
            all_ingredients = set()
            for meal in meals:
                for ing in meal['ingredients']:
                    all_ingredients.add(ing)
            diversity_score = len(all_ingredients)
            
            evaluation[m] = {
                "calorie_error": cal_error,
                "diversity_score": diversity_score,
                "total_calories": total_cal,
                "meal_count": len(meals)
            }
            
        return evaluation

    def search_meals(self, query=None):
        if self.data.empty:
            return []
        
        if not query:
            # Return random sample if no query
            return self._format_results(self.data.sample(20))
            
        # Search by name or tags
        mask = (
            self.data['name'].str.contains(query, case=False, na=False) | 
            self.data['tags'].str.contains(query, case=False, na=False)
        )
        results_df = self.data[mask].head(20)
        return self._format_results(results_df)

    def _infer_meal_type(self, row):
        name = row['name'].lower()
        tags = str(row['tags']).lower()
        
        if any(x in name or x in tags for x in ['breakfast', 'morning', 'oat', 'egg', 'pancake', 'waffle', 'cereal', 'toast', 'yogurt', 'muffin', 'bread']):
            return 'Breakfast'
        elif any(x in name or x in tags for x in ['lunch', 'sandwich', 'salad', 'soup', 'wrap', 'burger']):
            return 'Lunch'
        elif any(x in name or x in tags for x in ['dinner', 'supper', 'steak', 'roast', 'pasta', 'curry', 'stew', 'casserole', 'lasagna']):
            return 'Dinner'
        
        return 'Lunch/Dinner'

    def _format_results(self, df):
        results = []
        for _, row in df.iterrows():
            meal_type = self._infer_meal_type(row)
            tags = eval(row['tags'])[:3] if isinstance(row['tags'], str) else []
            if meal_type not in tags:
                tags.insert(0, meal_type)
                
            results.append({
                "id": str(row['id']),
                "name": row['name'],
                "calories": int(row['calories']),
                "protein": int(row['protein']),
                "carbs": int(row['carbs']),
                "fats": int(row['fats']),
                "image": row['image_url'] if pd.notna(row['image_url']) else "https://via.placeholder.com/300",
                "time": f"{int(row['minutes'])} min",
                "tags": tags,
                "ingredients": eval(row['ingredients']) if isinstance(row['ingredients'], str) else [],
                "steps": eval(row['steps']) if isinstance(row['steps'], str) else []
            })
        return results
