import pandas as pd
import os
from collections import Counter
import ast

try:
    data_path = os.path.join(os.path.dirname(__file__), 'data', 'small_data.csv')
    df = pd.read_csv(data_path)
    
    all_tags = []
    for tags_str in df['tags']:
        try:
            tags = ast.literal_eval(tags_str)
            all_tags.extend(tags)
        except:
            pass
            
    tag_counts = Counter(all_tags)
    
    # Common diet keywords to look for
    diet_keywords = [
        'vegan', 'vegetarian', 'keto', 'paleo', 'gluten-free', 'dairy-free', 
        'low-carb', 'low-fat', 'high-protein', 'nut-free', 'egg-free'
    ]
    
    print("Diet Tag Counts:")
    for keyword in diet_keywords:
        count = tag_counts.get(keyword, 0)
        print(f"{keyword}: {count}")
        
    print("\nTop 20 Most Common Tags:")
    for tag, count in tag_counts.most_common(20):
        print(f"{tag}: {count}")

except Exception as e:
    print(f"Error: {e}")
