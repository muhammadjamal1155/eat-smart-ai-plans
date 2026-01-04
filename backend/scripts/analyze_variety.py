import pandas as pd
import os

try:
    # Updated path for backend/scripts/ location
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'small_data.csv')
    df = pd.read_csv(data_path)
    # Extract the last word as the likely "dish type" (e.g. "Rice" from "Husband Rice")
    df['type'] = df['meal_name'].apply(lambda x: x.split()[-1] if isinstance(x, str) else '')
    print(df['type'].value_counts().head(20))
except Exception as e:
    print(e)
