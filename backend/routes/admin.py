from flask import Blueprint, jsonify, request
from services.recommendation_service import RecommendationService
import pandas as pd
import numpy as np

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/stats', methods=['GET'])
def get_stats():
    try:
        service = RecommendationService.get_instance()
        engine = service.get_engine()
        df = engine.data
        
        if df is None or df.empty:
            return jsonify({
                "total_meals": 0,
                "avg_calories": 0,
                "cuisine_stats": [],
                "diet_stats": {}
            })

        # Basic Stats
        total_meals = int(len(df))
        avg_calories = int(df['calories'].mean()) if not df.empty else 0
        
        # Tag Analysis for "Cuisines" / Categories
        # We'll flatten the tags_list and count
        all_tags = []
        for tags in df['tags_list']:
            all_tags.extend(tags)
            
        tag_series = pd.Series(all_tags)
        top_tags = tag_series.value_counts().head(10).to_dict()
        
        # Simple Diet Stats (based on keyword presence)
        diet_keywords = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'keto', 'low-carb']
        diet_stats = {}
        for diet in diet_keywords:
            count = df['tags_list'].apply(lambda x: diet in x).sum()
            diet_stats[diet] = int(count)

        return jsonify({
            "total_meals": total_meals,
            "avg_calories": avg_calories,
            "top_tags": top_tags,
            "diet_stats": diet_stats
        })
        
    except Exception as e:
        print(f"Error in admin stats: {e}")
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/admin/meals', methods=['GET'])
def get_meals_list():
    try:
        service = RecommendationService.get_instance()
        engine = service.get_engine()
        df = engine.data
        
        if df is None or df.empty:
            return jsonify({"meals": [], "total": 0, "page": 1, "pages": 0})

        # Pagination
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        search = request.args.get('search', '').lower()
        
        # Filter
        filtered_df = df
        if search:
            mask = df['combined_text'].astype(str).str.contains(search, case=False, na=False)
            filtered_df = df[mask]
            
        total_items = len(filtered_df)
        total_pages = (total_items + per_page - 1) // per_page
        
        # Slice
        start = (page - 1) * per_page
        end = start + per_page
        sliced_df = filtered_df.iloc[start:end]
        
        # Format
        meals = []
        for _, row in sliced_df.iterrows():
            meals.append({
                "id": str(row['id']),
                "name": row['name'],
                "calories": int(row['calories']),
                "protein": int(row['protein']),
                "carbs": int(row['carbs']),
                "fats": int(row['fats']),
                "tags": row['tags_list'][:3] # Limit tags for table view
            })
            
        return jsonify({
            "meals": meals,
            "total": total_items,
            "page": page,
            "pages": total_pages
        })

    except Exception as e:
        print(f"Error in admin meals list: {e}")
        return jsonify({"error": str(e)}), 500
