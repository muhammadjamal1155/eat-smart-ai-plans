import pandas as pd
import os

try:
    data_path = os.path.join(os.path.dirname(__file__), 'data', 'small_data.csv')
    df = pd.read_csv(data_path)
    
    vegan_meals = df[df['tags'].str.contains('vegan', case=False, na=False)]
    print(f"\nTotal Vegan Meals: {len(vegan_meals)}")
    if not vegan_meals.empty:
        print("\nFirst 5 Vegan Meals:")
        print(vegan_meals[['name', 'calories', 'tags']].head(5))
        print("\nCalorie stats for Vegan Meals:")
        print(vegan_meals['calories'].describe())

except Exception as e:
    print(f"Error: {e}")
