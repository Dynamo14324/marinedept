import pandas as pd
import os

def process_excel(file_path, year):
    # Load the Excel file
    xls = pd.ExcelFile(file_path)
    
    # Process Dry Data
    if 'Dry Data' in xls.sheet_names:
        dry_df = pd.read_excel(xls, 'Dry Data', skiprows=1)
        dry_df['Fleet'] = 'Dry'
        dry_df['Year'] = year
    else:
        dry_df = pd.DataFrame()

    # Process Tanker Data
    if 'Tanker Data' in xls.sheet_names:
        tanker_df = pd.read_excel(xls, 'Tanker Data', skiprows=1)
        tanker_df['Fleet'] = 'Tanker'
        tanker_df['Year'] = year
    else:
        tanker_df = pd.DataFrame()

    return pd.concat([dry_df, tanker_df], ignore_index=True)

# List of files to process
files = {
    2023: '/home/ubuntu/Marine_Dept_Data/2023-IAnSISCHEDULE n Performances.xlsx',
    2024: '/home/ubuntu/Marine_Dept_Data/2024-IAnSISCHEDULE n Performances.xlsx',
    2025: '/home/ubuntu/Marine_Dept_Data/2025-IAnSISCHEDULE n Performances.xlsx'
}

all_data = []
for year, path in files.items():
    if os.path.exists(path):
        print(f"Processing {year}...")
        df = process_excel(path, year)
        all_data.append(df)

final_df = pd.concat(all_data, ignore_index=True)

# Basic cleaning
# Rename columns for clarity (based on the first few columns)
column_mapping = {
    'Vessel ': 'Vessel',
    'Auditor Name': 'Auditor',
    'Place                         ': 'Place',
    'Internal Audit date ': 'IA_Date',
    'Report date ': 'IA_Report_Date',
    'Remarks': 'IA_Remarks',
    'NC': 'IA_NC',
    'Obs': 'IA_Obs',
    'Safety Inspection date ': 'SI_Date',
    'Report date .1': 'SI_Report_Date',
    'Remarks.1': 'SI_Remarks',
    'Nc': 'SI_NC',
    'Obs.1': 'SI_Obs'
}
final_df.rename(columns=column_mapping, inplace=True)

# Save to CSV for Power BI
final_df.to_csv('/home/ubuntu/Marine_Audit_Data_Combined.csv', index=False)
print("Combined data saved to /home/ubuntu/Marine_Audit_Data_Combined.csv")
