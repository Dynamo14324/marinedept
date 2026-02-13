import pandas as pd
import os

def extract_categories(file_path, sheet_name, year, fleet_type):
    xls = pd.ExcelFile(file_path)
    if sheet_name in xls.sheet_names:
        df = pd.read_excel(xls, sheet_name, skiprows=1)
        # The structure is likely: Category names in columns, Vessels in rows
        # We need to melt this to get: Year, Fleet, Category, Value
        # Let's assume the first few columns are Vessel info
        # and the rest are categories.
        
        # Identify category columns (usually after the first few)
        # Based on the view, it has many columns (65)
        # We'll take a subset or try to identify them
        df_melted = df.melt(id_vars=df.columns[0:2], var_name='Category', value_name='Count')
        df_melted['Year'] = year
        df_melted['Fleet'] = fleet_type
        return df_melted
    return pd.DataFrame()

files = {
    2023: '/home/ubuntu/Marine_Dept_Data/2023-IAnSISCHEDULE n Performances.xlsx',
    2024: '/home/ubuntu/Marine_Dept_Data/2024-IAnSISCHEDULE n Performances.xlsx'
}

all_categories = []
for year, path in files.items():
    if os.path.exists(path):
        # Internal Audit Categories
        ia_cat = extract_categories(path, 'Int.Aud. Category', year, 'All')
        all_categories.append(ia_cat)
        # Safety Inspection Categories
        si_cat = extract_categories(path, 'Saf.Insp.category', year, 'All')
        all_categories.append(si_cat)

final_cat_df = pd.concat(all_categories, ignore_index=True)
final_cat_df.to_csv('/home/ubuntu/Marine_Categories_Combined.csv', index=False)
print("Category data saved to /home/ubuntu/Marine_Categories_Combined.csv")
