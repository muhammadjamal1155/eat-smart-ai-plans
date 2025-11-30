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
        if self.data.empty:
            return {"error": "Data not loaded"}

        try:
            # Check for required fields
            required_fields = ['age', 'weight', 'height', 'gender', 'goal', 'activity_level']
            missing_fields = [field for field in required_fields if not user_data.get(field)]
            
            if missing_fields:
                formatted_fields = ", ".join(missing_fields).replace("_", " ")
                return {"error": f"We need your {formatted_fields} to create your perfect meal plan! 🥗"}

            # Helper to safely parse numbers
            def safe_get(key, type_func):
                val = user_data.get(key)
                try:
                    return type_func(val)
                except (ValueError, TypeError):
                    return None

            age = safe_get('age', int)
            weight = safe_get('weight', float)
            height = safe_get('height', float)
            
            if age is None or weight is None or height is None:
                 return {"error": "Invalid numeric values for age, weight, or height"}

            gender = user_data.get('gender', 'male')
            goal = user_data.get('goal', 'maintenance')
            activity_level = user_data.get('activity_level', 'sedentary')
            diet_type = user_data.get('diet_type', 'any')
            allergies = user_data.get('allergies', [])
            
            # Handle case where diet_type is "none" (frontend option)
            if diet_type == 'none':
                diet_type = 'any'

            # Calculate Nutritional Needs
            bmr = self.calculate_bmr(weight, height, age, gender)
            tdee = self.calculate_tdee(bmr, activity_level)
            
            target_calories = tdee
            if goal == 'weight-loss':
                target_calories -= 500
            elif goal == 'weight-gain':
                target_calories += 500
            elif goal == 'muscle-gain':
                target_calories += 250
            
            # Approximate macro breakdown (standard balanced diet)
            # Protein: 30%, Fats: 30%, Carbs: 40%
            # Note: Our dataset has PDV for macros, not grams. 
            # We need to map target grams to PDV or just use calories primarily.
            # For this iteration, we will focus on matching Calories and finding balanced meals.
            # We can try to map target macros to PDV if we assume standard reference values (e.g. 50g protein = 100% DV)
            # But that's risky. Let's rely on the model finding meals with similar calorie profiles.
            
            # Construct a query vector. 
            # Since we trained on [calories, protein(PDV), carbs(PDV), fats(PDV)], we need to provide these.
            # We can estimate target PDV. 
            # Standard reference: Protein 50g, Fat 65g, Carbs 300g (approx 2000 cal diet)
            
            target_protein_g = (target_calories * 0.3) / 4
            target_fats_g = (target_calories * 0.3) / 9
            target_carbs_g = (target_calories * 0.4) / 4
            
            target_protein_pdv = (target_protein_g / 50) * 100
            target_fats_pdv = (target_fats_g / 65) * 100
            target_carbs_pdv = (target_carbs_g / 300) * 100
            
            # Filter by diet type FIRST
            filtered_data = self.data.copy()
            if diet_type != 'any':
                filtered_data = filtered_data[filtered_data['tags'].str.contains(diet_type.lower(), na=False)]
            
            if filtered_data.empty:
                return {"error": f"No meals found for diet type: {diet_type}"}

            # Filter by allergies
            if allergies:
                for allergy in allergies:
                    filtered_data = filtered_data[~filtered_data['ingredients'].str.contains(allergy.lower(), na=False)]
            
            if filtered_data.empty:
                return {"error": "No meals found after filtering allergies"}

            # Prepare features for the filtered dataset
            features_subset = self.scaler.transform(filtered_data[self.feature_columns])
            
            # Fit a temporary model on the filtered data
            # n_neighbors cannot be larger than the dataset
            n_neighbors = min(20, len(filtered_data))
            temp_model = NearestNeighbors(n_neighbors=n_neighbors, algorithm='brute', metric='euclidean')
            temp_model.fit(features_subset)
            
            # Scale the query
            query = np.array([[target_calories / 3, target_protein_pdv / 3, target_carbs_pdv / 3, target_fats_pdv / 3]]) 
            query_scaled = self.scaler.transform(query)
            
            # Fetch more candidates to ensure variety
            n_candidates = min(50, len(filtered_data))
            distances, indices = temp_model.kneighbors(query_scaled, n_neighbors=n_candidates)
            
            candidates = filtered_data.iloc[indices[0]].copy()
            
            if allergies:
                for allergy in allergies:
                    candidates = candidates[~candidates['ingredients'].str.contains(allergy.lower(), na=False)]
            
            # Categorize candidates
            breakfasts = []
            lunches = []
            dinners = []
            others = []
            
            for _, row in candidates.iterrows():
                m_type = self._infer_meal_type(row)
                if m_type == 'Breakfast':
                    breakfasts.append(row)
                elif m_type == 'Lunch':
                    lunches.append(row)
                elif m_type == 'Dinner':
                    dinners.append(row)
                else:
                    others.append(row)
            
            # Select balanced meals (2 Breakfast, 2 Lunch, 2 Dinner)
            final_selection_rows = []
            
            def add_rows(source, count):
                added = 0
                for item in source:
                    if added >= count: break
                    # Check for duplicates based on ID
                    if not any(x['id'] == item['id'] for x in final_selection_rows):
                        final_selection_rows.append(item)
                        added += 1
                return added

            # 1. Fill Breakfasts (Target 2)
            add_rows(breakfasts, 2)
            
            # 2. Fill Lunches (Target 2)
            # First try explicit lunches
            l_added = add_rows(lunches, 2)
            # If needed, fill with 'others' (Lunch/Dinner items)
            if l_added < 2:
                add_rows(others, 2 - l_added)
            
            # 3. Fill Dinners (Target 2)
            # First try explicit dinners
            d_added = add_rows(dinners, 2)
            # If needed, fill with 'others' (Lunch/Dinner items)
            if d_added < 2:
                add_rows(others, 2 - d_added)
            
            # 4. Fill any remaining slots (to reach 6)
            remaining_slots = 6 - len(final_selection_rows)
            if remaining_slots > 0:
                # Pool remaining items: unused breakfasts, lunches, dinners, others
                # We prioritize others (main dishes) over extra breakfasts for lunch/dinner slots
                rest = others + lunches + dinners + breakfasts
                add_rows(rest, remaining_slots)
            
            # Format output
            results = []
            for row in final_selection_rows:
                meal_type = self._infer_meal_type(row)
                tags = eval(row['tags'])[:3] if isinstance(row['tags'], str) else []
                
                # Ensure the tag matches the slot we intended? 
                # Actually _infer_meal_type might return 'Lunch/Dinner' for items in 'others'.
                # We should probably force the tag to be 'Lunch' or 'Dinner' based on position?
                # But that might be misleading. Better to show 'Lunch/Dinner' or let the user decide.
                # However, the user wants to see "Lunch" and "Dinner".
                # If it's 'Lunch/Dinner', maybe we can just show that.
                
                if meal_type not in tags:
                    tags.insert(0, meal_type)

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
            print(f"Error generating recommendations: {e}")
            return {"error": str(e)}

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
