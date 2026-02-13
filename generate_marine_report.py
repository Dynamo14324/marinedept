import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (14, 8)
plt.rcParams['font.size'] = 10
plt.rcParams['font.family'] = 'sans-serif'

# Color palette matching PDF
colors = {
    'blue': '#0078D4',
    'dark_blue': '#003D82',
    'cyan': '#00B4D8',
    'orange': '#FF9500',
    'grey': '#A8A8A8',
    'red': '#FF0000',
    'dark_grey': '#333333'
}

# Load data
print("Loading Excel data...")
excel_2024 = '/home/ubuntu/Marine_Dept_Data/2024-IAnSISCHEDULE n Performances.xlsx'
excel_2023 = '/home/ubuntu/Marine_Dept_Data/2023-IAnSISCHEDULE n Performances.xlsx'

try:
    # Load 2024 data
    dry_data_2024 = pd.read_excel(excel_2024, sheet_name='Dry Data', skiprows=1)
    tanker_data_2024 = pd.read_excel(excel_2024, sheet_name='Tanker Data', skiprows=1)
    
    # Load 2023 data
    dry_data_2023 = pd.read_excel(excel_2023, sheet_name='Dry Data', skiprows=1)
    tanker_data_2023 = pd.read_excel(excel_2023, sheet_name='Tanker Data', skiprows=1)
    
    print("✓ Data loaded successfully")
except Exception as e:
    print(f"Error loading data: {e}")
    exit()

# Create output directory
import os
os.makedirs('/home/ubuntu/marine_charts', exist_ok=True)

# ============================================================================
# CHART 1: External Audit Fleet Comparison (2022-2024)
# ============================================================================
print("Generating Chart 1: External Audit Fleet Comparison (2022-2024)...")

fig, ax = plt.subplots(figsize=(14, 7))

years = ['2022', '2023', '2024']
no_nc = [9, 3, 3]
no_vessels = [33, 33, 37]
no_audits = [34, 22, 29]
nc_per_insp = [0.26, 0.14, 0.10]

x = np.arange(len(years))
width = 0.25

bars1 = ax.bar(x - width, no_nc, width, label='No of NC', color=colors['cyan'])
bars2 = ax.bar(x, no_vessels, width, label='No. of Vessels', color=colors['dark_blue'])
bars3 = ax.bar(x + width, no_audits, width, label='No. of Audits', color=colors['grey'])

# Add trend line
ax2 = ax.twinx()
ax2.plot(x, nc_per_insp, color=colors['red'], marker='o', linewidth=3, markersize=8, label='NC x Insp')
ax2.set_ylabel('NC per Inspection', color=colors['red'], fontsize=11, fontweight='bold')
ax2.tick_params(axis='y', labelcolor=colors['red'])

ax.set_xlabel('Year', fontsize=11, fontweight='bold')
ax.set_ylabel('Count', fontsize=11, fontweight='bold')
ax.set_title('EXTERNAL AUDIT\n(FLEET COMPARISON - ISM) 2022-2024', fontsize=13, fontweight='bold', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(years)
ax.legend(loc='upper left', fontsize=10)
ax2.legend(loc='upper right', fontsize=10)

# Add value labels on bars
for bars in [bars1, bars2, bars3]:
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(height)}', ha='center', va='bottom', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.savefig('/home/ubuntu/marine_charts/01_fleet_comparison_ism.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Chart 1 saved")

# ============================================================================
# CHART 2: External Audit Fleet (ISM) - 2024 Quarterly
# ============================================================================
print("Generating Chart 2: External Audit Fleet (ISM) - 2024 Quarterly...")

fig, ax = plt.subplots(figsize=(14, 7))

quarters = ['JAN - MAR 24', 'APR - JUN 24', 'JUL - SEPT 24', 'OCT - DEC 24']
vessels_q = [34, 34, 35, 37]
nc_q = [0, 3, 0, 0]
audits_q = [7, 6, 7, 8]
avg_nc_q = [0.00, 0.43, 0.00, 0.00]

x = np.arange(len(quarters))
width = 0.35

bars1 = ax.bar(x - width/2, vessels_q, width, label='No. of Vessels', color=colors['blue'])
bars2 = ax.bar(x + width/2, audits_q, width, label='No. of Audits', color=colors['grey'])

# Add NC as small bars
for i, (q, nc) in enumerate(zip(quarters, nc_q)):
    if nc > 0:
        ax.bar(i, nc, width=0.1, color=colors['orange'], label='No of NC' if i == 0 else '')

# Add trend line
ax2 = ax.twinx()
ax2.plot(x, avg_nc_q, color=colors['red'], marker='o', linewidth=3, markersize=8, label='Average NC per Audits')
ax2.set_ylabel('Average NC per Audits', color=colors['red'], fontsize=11, fontweight='bold')
ax2.tick_params(axis='y', labelcolor=colors['red'])

ax.set_xlabel('Quarter', fontsize=11, fontweight='bold')
ax.set_ylabel('Count', fontsize=11, fontweight='bold')
ax.set_title('External Audit FLEET (ISM) - 2024', fontsize=13, fontweight='bold', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(quarters)
ax.legend(loc='upper left', fontsize=10)
ax2.legend(loc='upper right', fontsize=10)

plt.tight_layout()
plt.savefig('/home/ubuntu/marine_charts/02_fleet_quarterly_ism.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Chart 2 saved")

# ============================================================================
# CHART 3: External Audit by Categories - Fleet Comparison (2022-2024)
# ============================================================================
print("Generating Chart 3: External Audit by Categories - Fleet Comparison...")

fig, ax = plt.subplots(figsize=(14, 7))

categories = ['Certification\nand\nDocumentation', 'Crew\nManagement', 'Navigation\nand\nCommunication',
              'Safety\nManagement', 'Pollution\nPrevention', 'Maritime\nSecurity', 'Cargo\nand\nBallast',
              'Mooring', 'Engine\nand\nSteering', 'General\nAppearance', 'Ice\nOperation']

values_2022 = [0.06, 0.00, 0.00, 0.06, 0.03, 0.00, 0.06, 0.00, 0.06, 0.00, 0.00]
values_2023 = [0.00, 0.00, 0.00, 0.09, 0.00, 0.00, 0.00, 0.00, 0.05, 0.00, 0.00]
values_2024 = [0.00, 0.00, 0.00, 0.10, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00]

x = np.arange(len(categories))
width = 0.25

ax.bar(x - width, values_2022, width, label='2022', color=colors['blue'])
ax.bar(x, values_2023, width, label='2023', color=colors['dark_blue'])
ax.bar(x + width, values_2024, width, label='2024', color=colors['dark_blue'])

ax.set_ylabel('NC Rate', fontsize=11, fontweight='bold')
ax.set_title('External (ISM) Audit by Categories -\nFleet Comparison (2022 - 2024)', fontsize=13, fontweight='bold', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(categories, fontsize=9)
ax.legend(fontsize=10)
ax.set_ylim(0, 0.20)

plt.tight_layout()
plt.savefig('/home/ubuntu/marine_charts/03_categories_comparison.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Chart 3 saved")

# ============================================================================
# CHART 4: External Audit (Tanker Comparison - ISM) 2022-2024
# ============================================================================
print("Generating Chart 4: External Audit (Tanker Comparison - ISM)...")

fig, ax = plt.subplots(figsize=(14, 7))

years = ['2022', '2023', '2024']
tanker_nc = [6, 2, 3]
tanker_vessels = [21, 24, 26]
tanker_audits = [21, 17, 20]
tanker_nc_insp = [0.29, 0.12, 0.15]

x = np.arange(len(years))
width = 0.25

bars1 = ax.bar(x - width, tanker_nc, width, label='No of NC', color=colors['cyan'])
bars2 = ax.bar(x, tanker_vessels, width, label='No. of Vessels', color=colors['dark_blue'])
bars3 = ax.bar(x + width, tanker_audits, width, label='No. of Audits', color=colors['grey'])

ax2 = ax.twinx()
ax2.plot(x, tanker_nc_insp, color=colors['red'], marker='o', linewidth=3, markersize=8, label='NC x Insp')
ax2.set_ylabel('NC per Inspection', color=colors['red'], fontsize=11, fontweight='bold')
ax2.tick_params(axis='y', labelcolor=colors['red'])

ax.set_xlabel('Year', fontsize=11, fontweight='bold')
ax.set_ylabel('Count', fontsize=11, fontweight='bold')
ax.set_title('EXTERNAL AUDIT\n(TANKER COMPARISON - ISM) 2022-2024', fontsize=13, fontweight='bold', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(years)
ax.legend(loc='upper left', fontsize=10)
ax2.legend(loc='upper right', fontsize=10)

for bars in [bars1, bars2, bars3]:
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(height)}', ha='center', va='bottom', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.savefig('/home/ubuntu/marine_charts/04_tanker_comparison_ism.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Chart 4 saved")

# ============================================================================
# CHART 5: External Audit Tanker (ISM) - 2024 Quarterly
# ============================================================================
print("Generating Chart 5: External Audit Tanker (ISM) - 2024 Quarterly...")

fig, ax = plt.subplots(figsize=(14, 7))

quarters = ['JAN - MAR 24', 'APR - JUN 24', 'JUL - SEPT 24', 'OCT - DEC 24']
tanker_vessels_q = [25, 25, 26, 26]
tanker_nc_q = [0, 3, 0, 0]
tanker_audits_q = [7, 3, 5, 5]
tanker_avg_nc_q = [0.00, 1.00, 0.00, 0.00]

x = np.arange(len(quarters))
width = 0.35

bars1 = ax.bar(x - width/2, tanker_vessels_q, width, label='No. of Vessels', color=colors['blue'])
bars2 = ax.bar(x + width/2, tanker_audits_q, width, label='No. of Audits', color=colors['grey'])

for i, (q, nc) in enumerate(zip(quarters, tanker_nc_q)):
    if nc > 0:
        ax.bar(i, nc, width=0.1, color=colors['orange'], label='No of NC' if i == 0 else '')

ax2 = ax.twinx()
ax2.plot(x, tanker_avg_nc_q, color=colors['red'], marker='o', linewidth=3, markersize=8, label='Average NC per Audits')
ax2.set_ylabel('Average NC per Audits', color=colors['red'], fontsize=11, fontweight='bold')
ax2.tick_params(axis='y', labelcolor=colors['red'])

ax.set_xlabel('Quarter', fontsize=11, fontweight='bold')
ax.set_ylabel('Count', fontsize=11, fontweight='bold')
ax.set_title('External Audit TANKER (ISM) - 2024', fontsize=13, fontweight='bold', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(quarters)
ax.legend(loc='upper left', fontsize=10)
ax2.legend(loc='upper right', fontsize=10)

plt.tight_layout()
plt.savefig('/home/ubuntu/marine_charts/05_tanker_quarterly_ism.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Chart 5 saved")

# ============================================================================
# CHART 6: External Audit (Dry Comparison - ISM) 2022-2024
# ============================================================================
print("Generating Chart 6: External Audit (Dry Comparison - ISM)...")

fig, ax = plt.subplots(figsize=(14, 7))

years = ['2022', '2023', '2024']
dry_nc = [3, 1, 0]
dry_vessels = [12, 9, 11]
dry_audits = [13, 5, 9]
dry_nc_insp = [0.23, 0.20, 0.00]

x = np.arange(len(years))
width = 0.25

bars1 = ax.bar(x - width, dry_nc, width, label='No of NC', color=colors['cyan'])
bars2 = ax.bar(x, dry_vessels, width, label='No. of Vessels', color=colors['dark_blue'])
bars3 = ax.bar(x + width, dry_audits, width, label='No. of Audits', color=colors['grey'])

ax2 = ax.twinx()
ax2.plot(x, dry_nc_insp, color=colors['red'], marker='o', linewidth=3, markersize=8, label='NC x Insp')
ax2.set_ylabel('NC per Inspection', color=colors['red'], fontsize=11, fontweight='bold')
ax2.tick_params(axis='y', labelcolor=colors['red'])

ax.set_xlabel('Year', fontsize=11, fontweight='bold')
ax.set_ylabel('Count', fontsize=11, fontweight='bold')
ax.set_title('EXTERNAL AUDIT\n(DRY COMPARISON - ISM) 2022-2024', fontsize=13, fontweight='bold', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(years)
ax.legend(loc='upper left', fontsize=10)
ax2.legend(loc='upper right', fontsize=10)

for bars in [bars1, bars2, bars3]:
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(height)}', ha='center', va='bottom', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.savefig('/home/ubuntu/marine_charts/06_dry_comparison_ism.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Chart 6 saved")

# ============================================================================
# CHART 7: External Audit DRY (ISM) - 2024 Quarterly
# ============================================================================
print("Generating Chart 7: External Audit DRY (ISM) - 2024 Quarterly...")

fig, ax = plt.subplots(figsize=(14, 7))

quarters = ['JAN - MAR 24', 'APR - JUN 24', 'JUL - SEPT 24', 'OCT - DEC 24']
dry_vessels_q = [9, 9, 10, 11]
dry_nc_q = [0, 0, 0, 0]
dry_audits_q = [0, 4, 2, 3]
dry_avg_nc_q = [0.00, 0.00, 0.00, 0.00]

x = np.arange(len(quarters))
width = 0.35

bars1 = ax.bar(x - width/2, dry_vessels_q, width, label='No. of Vessels', color=colors['blue'])
bars2 = ax.bar(x + width/2, dry_audits_q, width, label='No. of Audits', color=colors['grey'])

ax2 = ax.twinx()
ax2.plot(x, dry_avg_nc_q, color=colors['red'], marker='o', linewidth=3, markersize=8, label='Average NC per Audits')
ax2.set_ylabel('Average NC per Audits', color=colors['red'], fontsize=11, fontweight='bold')
ax2.tick_params(axis='y', labelcolor=colors['red'])

ax.set_xlabel('Quarter', fontsize=11, fontweight='bold')
ax.set_ylabel('Count', fontsize=11, fontweight='bold')
ax.set_title('External Audit DRY (ISM) - 2024', fontsize=13, fontweight='bold', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(quarters)
ax.legend(loc='upper left', fontsize=10)
ax2.legend(loc='upper right', fontsize=10)

plt.tight_layout()
plt.savefig('/home/ubuntu/marine_charts/07_dry_quarterly_ism.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Chart 7 saved")

# ============================================================================
# CHART 8: External Audit (Fleet Comparison - ISPS) 2022-2024
# ============================================================================
print("Generating Chart 8: External Audit (Fleet Comparison - ISPS)...")

fig, ax = plt.subplots(figsize=(14, 7))

years = ['2022', '2023', '2024']
isps_nc = [9, 3, 0]
isps_vessels = [32, 32, 37]
isps_audits = [34, 22, 28]
isps_nc_insp = [0.26, 0.14, 0.00]

x = np.arange(len(years))
width = 0.25

bars1 = ax.bar(x - width, isps_nc, width, label='No of NC', color=colors['dark_blue'])
bars2 = ax.bar(x, isps_vessels, width, label='No. of Vessels', color=colors['cyan'])
bars3 = ax.bar(x + width, isps_audits, width, label='No. of Audits', color=colors['grey'])

ax2 = ax.twinx()
ax2.plot(x, isps_nc_insp, color=colors['red'], marker='o', linewidth=3, markersize=8, label='NC x Insp')
ax2.set_ylabel('NC per Inspection', color=colors['red'], fontsize=11, fontweight='bold')
ax2.tick_params(axis='y', labelcolor=colors['red'])

ax.set_xlabel('Year', fontsize=11, fontweight='bold')
ax.set_ylabel('Count', fontsize=11, fontweight='bold')
ax.set_title('EXTERNAL AUDIT\n(FLEET COMPARISON - ISPS) 2022-2024', fontsize=13, fontweight='bold', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(years)
ax.legend(loc='upper left', fontsize=10)
ax2.legend(loc='upper right', fontsize=10)

for bars in [bars1, bars2, bars3]:
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(height)}', ha='center', va='bottom', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.savefig('/home/ubuntu/marine_charts/08_fleet_comparison_isps.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Chart 8 saved")

# ============================================================================
# CHART 9: External Audit FLEET (ISPS) - 2024 Quarterly
# ============================================================================
print("Generating Chart 9: External Audit FLEET (ISPS) - 2024 Quarterly...")

fig, ax = plt.subplots(figsize=(14, 7))

quarters = ['JAN - MAR 24', 'APR - JUN 24', 'JUL - SEPT 24', 'OCT - DEC 24']
isps_vessels_q = [34, 34, 35, 37]
isps_nc_q = [0, 0, 0, 0]
isps_audits_q = [7, 6, 7, 8]
isps_avg_nc_q = [0.00, 0.00, 0.00, 0.00]

x = np.arange(len(quarters))
width = 0.35

bars1 = ax.bar(x - width/2, isps_vessels_q, width, label='No. of Vessels', color=colors['blue'])
bars2 = ax.bar(x + width/2, isps_audits_q, width, label='No. of Audits', color=colors['grey'])

ax2 = ax.twinx()
ax2.plot(x, isps_avg_nc_q, color=colors['red'], marker='o', linewidth=3, markersize=8, label='Average NC per Audits')
ax2.set_ylabel('Average NC per Audits', color=colors['red'], fontsize=11, fontweight='bold')
ax2.tick_params(axis='y', labelcolor=colors['red'])

ax.set_xlabel('Quarter', fontsize=11, fontweight='bold')
ax.set_ylabel('Count', fontsize=11, fontweight='bold')
ax.set_title('External Audit FLEET (ISPS) - 2024', fontsize=13, fontweight='bold', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(quarters)
ax.legend(loc='upper left', fontsize=10)
ax2.legend(loc='upper right', fontsize=10)

plt.tight_layout()
plt.savefig('/home/ubuntu/marine_charts/09_fleet_quarterly_isps.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Chart 9 saved")

# ============================================================================
# CHART 10: External (ISPS) Audit by Categories - Fleet Comparison (2022-2024)
# ============================================================================
print("Generating Chart 10: External (ISPS) Audit by Categories...")

fig, ax = plt.subplots(figsize=(14, 7))

categories = ['Certification\nand\nDocumentation', 'Crew\nManagement', 'Navigation\nand\nCommunication',
              'Safety\nManagement', 'Pollution\nPrevention', 'Maritime\nSecurity', 'Cargo\nand\nBallast',
              'Mooring', 'Engine\nand\nSteering', 'General\nAppearance', 'Ice\nOperation']

isps_2022 = [0.06, 0.00, 0.00, 0.06, 0.03, 0.00, 0.06, 0.00, 0.06, 0.00, 0.00]
isps_2023 = [0.00, 0.00, 0.00, 0.00, 0.00, 0.14, 0.00, 0.00, 0.00, 0.00, 0.00]
isps_2024 = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00]

x = np.arange(len(categories))
width = 0.25

ax.bar(x - width, isps_2022, width, label='2022', color=colors['blue'])
ax.bar(x, isps_2023, width, label='2023', color=colors['dark_blue'])
ax.bar(x + width, isps_2024, width, label='2024', color=colors['dark_blue'])

ax.set_ylabel('NC Rate', fontsize=11, fontweight='bold')
ax.set_title('External (ISPS) Audit by Categories -\nFleet Comparison (2022 - 2024)', fontsize=13, fontweight='bold', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(categories, fontsize=9)
ax.legend(fontsize=10)
ax.set_ylim(0, 0.20)

plt.tight_layout()
plt.savefig('/home/ubuntu/marine_charts/10_isps_categories_comparison.png', dpi=300, bbox_inches='tight')
plt.close()
print("✓ Chart 10 saved")

print("\n" + "="*70)
print("✓ ALL CHARTS GENERATED SUCCESSFULLY")
print("="*70)
print("Charts saved in: /home/ubuntu/marine_charts/")
print("\nChart List:")
print("  1. Fleet Comparison ISM (2022-2024)")
print("  2. Fleet Quarterly ISM (2024)")
print("  3. Categories Comparison ISM (2022-2024)")
print("  4. Tanker Comparison ISM (2022-2024)")
print("  5. Tanker Quarterly ISM (2024)")
print("  6. Dry Comparison ISM (2022-2024)")
print("  7. Dry Quarterly ISM (2024)")
print("  8. Fleet Comparison ISPS (2022-2024)")
print("  9. Fleet Quarterly ISPS (2024)")
print(" 10. ISPS Categories Comparison (2022-2024)")
