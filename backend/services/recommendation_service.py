import sys
import os
# Add parent directory to path to find core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.recommendation_engine import RecommendationEngine

class RecommendationService:
    _instance = None

    @staticmethod
    def get_instance():
        if RecommendationService._instance is None:
            RecommendationService._instance = RecommendationService()
        return RecommendationService._instance

    def __init__(self):
        if RecommendationService._instance is not None:
            raise Exception("This class is a singleton!")
        self.engine = RecommendationEngine()

    def get_recommendations(self, user_data):
        """
        Get recommendations based on user data.
        """
        # Here we could add additional validation or logging before calling the engine
        return self.engine.recommend(user_data)

    def search_meals(self, query, tag=None):
        """
        Search for meals by query string and optional tag.
        """
        return self.engine.search_meals(query, tag)

    def get_engine(self):
        return self.engine
