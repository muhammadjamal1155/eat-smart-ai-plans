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
