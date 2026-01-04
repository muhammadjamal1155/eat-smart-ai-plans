import pandas as pd
import os

try:
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'small_data.csv')
    df = pd.read_csv(data_path)
    
    print("\nFirst 10 rows of 'image_url':")
    print(df[['name', 'image_url']].head(10))
    
    # Check how many are null
    print(f"\nNull image_url count: {df['image_url'].isnull().sum()}")
    print(f"Total rows: {len(df)}")

except Exception as e:
    print(f"Error: {e}")
