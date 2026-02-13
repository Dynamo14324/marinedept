# Power BI Implementation Guide: Marine Department Dashboard

## 1. Data Preparation
The source Excel files (2023-2025) have been processed and consolidated into two primary CSV files for Power BI:
- `Marine_Audit_Data_Combined.csv`: Contains all audit logs, NCs, and observations.
- `Marine_Categories_Combined.csv`: Contains granular deficiency data by category.

## 2. Power BI Setup Instructions
To finalize the dashboard in Power BI Desktop:

### Step 1: Import Data
1. Open Power BI Desktop.
2. Click **Get Data** -> **Text/CSV**.
3. Import `Marine_Audit_Data_Combined.csv` and `Marine_Categories_Combined.csv`.

### Step 2: Data Modeling
1. Go to the **Model View**.
2. Create a **Dim_Date** table using DAX: `Dim_Date = CALENDARAUTO()`.
3. Link `IA_Date` from `Fact_Audits` to `Dim_Date[Date]`.
4. Link `Vessel` between the two fact tables.

### Step 3: Create DAX Measures
Copy and paste the measures defined in `Marine_Dashboard_DAX_Model.md` into your Power BI report.

### Step 4: Build Visuals
1. **Executive Overview:** Use Card visuals for Total Audits and NC Rate. Use a Clustered Column Chart for Fleet Comparison.
2. **Audit Trends:** Use a Line and Stacked Column Chart for 3-year NC trends (as seen in PDF page 4).
3. **Category Analysis:** Use a Bar Chart for NCs by Category (as seen in PDF page 5).

## 3. Executive Formatting
- Use the **Ishima Blue** (#005596) for primary headers.
- Ensure all charts have clear titles and data labels.
- Add a **Slicer Pane** for Year, Fleet, and Auditor.
