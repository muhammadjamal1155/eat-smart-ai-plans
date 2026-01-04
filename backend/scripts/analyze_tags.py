import pandas as pd
import os
from collections import Counter
import ast

try:
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'small_data.csv')
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
    search_terms = ['health', 'quick', 'fast', 'protein', 'vegan', 'vegetarian', 'low-carb', 'gluten']
    
    print("Tag Search Results:")
    for term in search_terms:
        print(f"\n--- Tags containing '{term}' ---")
        matches = [tag for tag in tag_counts.keys() if term in tag]
        for match in matches:
            print(f"{match}: {tag_counts[match]}")
        
    print("\nTop 20 Most Common Tags:")
    for tag, count in tag_counts.most_common(20):
        print(f"{tag}: {count}")

except Exception as e:
    print(f"Error: {e}")
