import pandas as pd
import os

EXCEL_FILE = os.getenv('EXCEL_FILE', '/app/input/base_2025.xlsx')

try:
    df = pd.read_excel(EXCEL_FILE)
    print("Top unique emissors with special chars or issues:")
    for name in df['Emissor'].unique():
        name_str = str(name)
        if any(ord(c) > 127 for c in name_str) or '?' in name_str:
            print(f"RAW: {repr(name_str)}")
except Exception as e:
    print(f"Error: {e}")
