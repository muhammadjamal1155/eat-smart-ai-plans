from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from recommendation_engine import RecommendationEngine

app = Flask(__name__)
CORS(app)

# Initialize Recommendation Engine
engine = RecommendationEngine()

@app.route('/')
def home():
    return "Eat Smart AI Plans API is running!"

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    
    # Use the engine to get recommendations
    recommendations = engine.recommend(data)
    
    if "error" in recommendations:
        return jsonify(recommendations), 500

    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)
