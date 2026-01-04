from flask import Blueprint, request, jsonify
from core.supabase_client import get_supabase_client
import datetime

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics/log', methods=['POST'])
def log_analytics():
    supabase = get_supabase_client()
    if not supabase:
        return jsonify({"error": "Database not configured"}), 503

    try:
        data = request.json
        user_id = data.get('user_id')
        
        # We expect data to contain 'weight', 'calories', 'protein', 'carbs', 'fats', 'date'
        # Adjust table name 'user_analytics' or 'daily_logs' as per your schema preference
        # For now, let's assume a 'daily_logs' table
        
        entry = {
            "user_id": user_id,
            "date": data.get('date', datetime.date.today().isoformat()),
            "weight": data.get('weight'),
            "calories": data.get('calories'),
            "protein": data.get('protein'),
            "carbs": data.get('carbs'),
            "fats": data.get('fats'),
            "water_intake": data.get('water_intake')
        }
        
        # UPSERT logic: if date+user_id exists, update it
        response = supabase.table('daily_logs').upsert(entry).execute()
        
        return jsonify({"message": "Log saved", "data": response.data})

    except Exception as e:
        print(f"Error logging analytics: {e}")
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/analytics/history', methods=['GET'])
def get_history():
    supabase = get_supabase_client()
    if not supabase:
        return jsonify({"error": "Database not configured"}), 503

    try:
        user_id = request.args.get('user_id')
        days = int(request.args.get('days', 30))
        
        if not user_id:
            return jsonify({"error": "User ID required"}), 400

        # Calculate start date
        start_date = (datetime.date.today() - datetime.timedelta(days=days)).isoformat()

        response = supabase.table('daily_logs')\
            .select('*')\
            .eq('user_id', user_id)\
            .gte('date', start_date)\
            .order('date')\
            .execute()
            
        if response.error:
             print(f"Supabase Error: {response.error}")
             return jsonify({"error": str(response.error)}), 500

        data = response.data if response.data is not None else []
        return jsonify(data)

    except Exception as e:
        print(f"Error fetching history: {e}")
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/goals', methods=['POST'])
def update_goals():
    supabase = get_supabase_client()
    if not supabase:
        return jsonify({"error": "Database not configured"}), 503

    try:
        data = request.json
        # Expecting a single goal object or list? Let's assume single create/update for now
        # OR sync bulk. Let's do single create/update to be safe.
        
        # Actually, the frontend sends a full list often. But let's support singular updates for efficiency if possible
        # For this MVP, let's accept a 'goal' object to upsert
        
        goal = data.get('goal')
        if not goal:
            return jsonify({"error": "Goal data required"}), 400
            
        # Ensure user_id is set
        user_id = data.get('user_id')
        if user_id:
            goal['user_id'] = user_id
            
        response = supabase.table('user_goals').upsert(goal).execute()
        
        return jsonify(response.data)

    except Exception as e:
        print(f"Error saving goal: {e}")
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/goals', methods=['GET'])
def get_goals():
    supabase = get_supabase_client()
    if not supabase:
        return jsonify({"error": "Database not configured"}), 503

    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID required"}), 400

        response = supabase.table('user_goals')\
            .select('*')\
            .eq('user_id', user_id)\
            .execute()
            
        return jsonify(response.data)

    except Exception as e:
        print(f"Error fetching goals: {e}")
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/analytics/summary', methods=['GET'])
def get_analytics_summary():
    supabase = get_supabase_client()
    if not supabase:
        return jsonify({"error": "Database not configured"}), 503

    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID required"}), 400

        # Fetch all date entries (optimize by selecting only date field)
        # Limiting to last 365 days for consistency calculation
        start_date = (datetime.date.today() - datetime.timedelta(days=365)).isoformat()
        
        response = supabase.table('daily_logs')\
            .select('date')\
            .eq('user_id', user_id)\
            .gte('date', start_date)\
            .order('date', desc=True)\
            .execute()
            
        logs = response.data if response.data else []
        
        if not logs:
            return jsonify({
                "current_streak": 0,
                "longest_streak": 0,
                "consistency_score": 0,
                "total_logs": 0
            })

        # Process Streaks
        dates = sorted([datetime.date.fromisoformat(l['date']) for l in logs], reverse=True)
        unique_dates = sorted(list(set(dates)), reverse=True)
        
        today = datetime.date.today()
        current_streak = 0
        
        # Check if streak is active (logged today or yesterday)
        if unique_dates and (unique_dates[0] == today or unique_dates[0] == today - datetime.timedelta(days=1)):
            current_streak = 1
            algo_date = unique_dates[0]
            
            for i in range(1, len(unique_dates)):
                prev_date = unique_dates[i]
                if algo_date - prev_date == datetime.timedelta(days=1):
                    current_streak += 1
                    algo_date = prev_date
                else:
                    break
        
        # Longest Streak (simple O(N) pass)
        longest_streak = 0
        temp_streak = 0
        if unique_dates:
            temp_streak = 1
            longest_streak = 1
            for i in range(1, len(unique_dates)):
                # Note: unique_dates is reversed (descending), so we compare current (newer) to next (older)
                # wait, logic above was comparing desc. 
                # Let's sort ascending for longest streak logic ease
                pass

        # Re-sort ascending for longest streak
        asc_dates = sorted(unique_dates)
        if asc_dates:
            temp = 1
            longest = 1
            for i in range(1, len(asc_dates)):
                if asc_dates[i] - asc_dates[i-1] == datetime.timedelta(days=1):
                    temp += 1
                else:
                    temp = 1
                longest = max(longest, temp)
            longest_streak = longest

        # Consistency (Logs in last 30 days)
        thirty_days_ago = today - datetime.timedelta(days=30)
        logs_last_30 = sum(1 for d in dates if d >= thirty_days_ago)
        consistency_score = int((logs_last_30 / 30) * 100) if logs_last_30 <= 30 else 100

        return jsonify({
            "current_streak": current_streak,
            "longest_streak": longest_streak,
            "consistency_score": consistency_score,
            "total_logs": len(logs)
        })

    except Exception as e:
        print(f"Error calculating summary: {e}")
        return jsonify({"error": str(e)}), 500
