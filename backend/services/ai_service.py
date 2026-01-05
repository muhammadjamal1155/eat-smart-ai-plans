import os
import openai
from concurrent.futures import ThreadPoolExecutor

class AIService:
    _instance = None

    @staticmethod
    def get_instance():
        if AIService._instance is None:
            AIService._instance = AIService()
        return AIService._instance

    def __init__(self):
        # Allow override via args or env
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            print("WARNING: OPENAI_API_KEY not found in environment.")
            self.client = None
        else:
            self.client = openai.OpenAI(api_key=api_key)

    def generate_plan_metadata(self, user_profile):
        """
        Generates both insight and strategy tip in parallel to save time.
        """
        if not self.client:
            return {
                "ai_insight": "Welcome to your personalized plan! We've selected meals that align with your goals.",
                "strategy_tip": "Consistency is key. Try to stick to your meal times!"
            }

        with ThreadPoolExecutor() as executor:
            future_insight = executor.submit(self._generate_insight, user_profile)
            future_tip = executor.submit(self._generate_tip, user_profile)
            
            return {
                "ai_insight": future_insight.result(),
                "strategy_tip": future_tip.result()
            }

    def _generate_insight(self, profile):
        try:
            prompt = f"""
            You are a hyped, high-energy AI Personal Trainer & Nutritionist.
            
            User Profile:
            - Goal: {profile.get('goal')}
            - Feeling: {profile.get('feeling')} (Make sure to specifically mention/validate this feeling!)
            - Motivation: {profile.get('motivation')}
            - Experience: {profile.get('experience')}
            
            Write a SHORT, energetic, and encouraging insight (max 2 sentences) welcoming them to their new plan.
            RULES:
            1. Use 2-3 relevant emojis (like 💪, 🥗, ✨, 🚀).
            2. Be specific to their motivation.
            3. Do NOT match the template "Welcome to your...". Be creative and varied!
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo", # or gpt-4o-mini if available and preferred for speed/cost
                messages=[{"role": "user", "content": prompt}],
                max_tokens=80,
                temperature=0.9
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating insight: {e}")
            return "Get ready to crush your goals! 🚀 We've crafted this plan just for you. 💪"

    def _generate_tip(self, profile):
        try:
            challenges = profile.get('challenges', [])
            strategies = profile.get('strategies', [])
            
            challenge_str = ", ".join(challenges) if challenges else "staying consistent"
            
            prompt = f"""
            User Challenges: {challenge_str}
            User Strategies: {", ".join(strategies)}
            
            Provide ONE punchy, fun, and actionable "Strategy Tip" (max 15 words) to help them overcome their specific challenges.
            Use 1 emoji at the start or end!
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=40,
                temperature=0.9
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating tip: {e}")
            return "Drink plenty of water and get enough sleep."

    def refine_meal_selection(self, user_profile, candidates):
        """
        Uses LLM to select the best 3 meals (Breakfast, Lunch, Dinner) from candidates
        based on user's feeling and goals.
        """
        if not self.client:
            return None # Fallback to heuristic

        try:
            # Format candidates for the prompt
            # candidates_list = [{"id": row['id'], "name": row['name'], "tags": row['tags_list']} for _, row in candidates.iterrows()]
            # We take a sample to avoid token limits
            sample_candidates = candidates.head(30)
            candidates_str = ""
            for _, row in sample_candidates.iterrows():
                candidates_str += f"- ID {row['id']}: {row['name']} (Tags: {', '.join(row['tags_list'][:5])})\n"

            prompt = f"""
            You are an expert Personal Chef. I have a list of healthy, valid meal options.
            Select exactly 3 meals: ONE Breakfast, ONE Lunch, and ONE Dinner.
            
            User Profile:
            - Goal: {user_profile.get('goal')}
            - Current Vibe/Feeling: {user_profile.get('feeling')}
            - Diet Type: {user_profile.get('diet_type')}
            
            Task:
            1. Select meals that fit the user's "Vibe" (e.g. if 'Sad', pick comfort food; if 'Energetic', pick fresh/light).
            2. ensure the day is culinarily diverse.
            
            Available Options:
            {candidates_str}
            
            Return ONLY a valid JSON object with restricted keys: "breakfast_id", "lunch_id", "dinner_id", "reasoning".
            Example: {{"breakfast_id": "123", "lunch_id": "456", "dinner_id": "789", "reasoning": "Selected warm oatmeal for comfort..."}}
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.7,
                response_format={ "type": "json_object" }
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            return result
        except Exception as e:
            print(f"Error in refine_meal_selection: {e}")
            return None # Fallback to heuristic

    def generate_weekly_plan(self, user_profile, candidates):
        """
        Uses LLM to generate a FULL 7-day meal plan (21 meals) from candidates.
        """
        if not self.client:
            return None 

        try:
            # Format candidates (we need more options now)
            # Take top 80 candidates
            sample_candidates = candidates.head(80)
            candidates_str = ""
            for _, row in sample_candidates.iterrows():
                candidates_str += f"- ID {row['id']}: {row['name']} (Tags: {', '.join(row['tags_list'][:3])})\n"

            prompt = f"""
            You are an expert Personal Chef. 
            Create a diverse 7-DAY MEAL PLAN (Mon-Sun) for this user.
            
            User Profile:
            - Goal: {user_profile.get('goal')}
            - Vibe: {user_profile.get('feeling')}
            - Diet: {user_profile.get('diet_type')}
            
            Instructions:
            1. Select distinctive meals for each day. Avoid repeating the same meal more than twice in the week.
            2. "Breakfast" items should be suitable for morning (e.g., eggs, oats, pancakes, smoothies) if possible, but you can be creative.
            3. Ensure nutritional alignment with the goal.
            
            Available Option IDs:
            {candidates_str}
            
            Return ONLY a valid JSON object with days as keys:
            {{
                "Monday": {{ "breakfast_id": "...", "lunch_id": "...", "dinner_id": "..." }},
                "Tuesday": {{ ... }},
                ...
                "Sunday": {{ ... }},
                "reasoning": "Brief explanation of the weekly variety..."
            }}
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.7,
                response_format={ "type": "json_object" }
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            return result
        except Exception as e:
            print(f"Error in generate_weekly_plan: {e}")
            return None

    def generate_grocery_list(self, ingredients_list):
        """
        Uses LLM to consolidate and categorize a raw list of ingredients into a shopping list.
        """
        if not self.client:
            return None 

        try:
            # Join top 200 ingredients (token limit safety)
            # In a real app, we'd batch this or summarize.
            raw_text = ", ".join(ingredients_list[:300]) 

            prompt = f"""
            You are a smart Personal Assistant.
            I have a raw list of ingredients from a meal plan.
            
            Task:
            1. Consolidate duplicates (e.g., "2 onions" + "1 onion" = "3 onions").
            2. Categorize them into standard grocery sections (Produce, Dairy, Meat, Pantry, Bakery, Frozen, Other).
            3. Return a clean JSON list.
            
            Raw Ingredients:
            {raw_text}
            
            Return ONLY valid JSON format:
            {{
                "items": [
                    {{ "name": "Greek Yogurt", "category": "Dairy", "quantity": "2 containers" }},
                    {{ "name": "Chicken Breast", "category": "Meat", "quantity": "500g" }}
                ]
            }}
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=600,
                temperature=0.3,
                response_format={ "type": "json_object" }
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            return result.get("items", [])
        except Exception as e:
            print(f"Error generating grocery list: {e}")
            # Fallback: Simple deduplication and return
            try:
                unique = list(set(ingredients_list))
                return [{"name": item, "category": self._categorize_item_heuristic(item), "quantity": "1"} for item in unique]
            except:
                return []

    def _categorize_item_heuristic(self, item_name):
        name = item_name.lower()
        if any(x in name for x in ['chicken', 'beef', 'fish', 'salmon', 'steak', 'pork', 'meat', 'egg', 'turkey', 'lamb', 'shrimp', 'tuna']): return 'Meat & Fish'
        if any(x in name for x in ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'ghee', 'whey', 'mozzarella', 'cheddar']): return 'Dairy'
        if any(x in name for x in ['bread', 'bun', 'tortilla', 'bagel', 'pita', 'muffin', 'toast']): return 'Bakery'
        if any(x in name for x in ['apple', 'banana', 'berry', 'spinach', 'lettuce', 'tomato', 'potato', 'onion', 'garlic', 'carrot', 'vegetable', 'fruit', 'pepper', 'cucumber', 'broccoli', 'avocado', 'lemon', 'lime', 'herb', 'cilantro', 'parsley', 'basil']): return 'Produce'
        if any(x in name for x in ['rice', 'pasta', 'quinoa', 'oat', 'grain', 'flour', 'noodle', 'couscous', 'cereal']): return 'Grains'
        if any(x in name for x in ['coffee', 'tea', 'juice', 'soda', 'water', 'drink']): return 'Beverages'
        if any(x in name for x in ['frozen', 'ice cream']): return 'Frozen'
        if any(x in name for x in ['oil', 'sauce', 'spice', 'salt', 'sugar', 'honey', 'syrup', 'can', 'jar', 'nut', 'seed', 'bean', 'lentil', 'chickpea', 'stock', 'broth']): return 'Pantry'
        return 'Other'
