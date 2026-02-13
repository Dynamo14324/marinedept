# Power BI Dashboard Implementation Guide
## Marine Department Audit Dashboard for Executive Management

---

## PART 1: DATA PREPARATION

### Step 1.1: Import Data into Power BI Desktop
1. Open **Power BI Desktop**
2. Click **Get Data** → **Text/CSV**
3. Navigate to and select `Marine_Audit_Data_Combined.csv`
4. Click **Load** (do not transform yet)
5. Repeat for `Marine_Categories_Combined.csv`

### Step 1.2: Data Transformation
1. In the **Home** tab, click **Transform Data** to open Power Query
2. For `Marine_Audit_Data_Combined`:
   - Select column `IA_Date` → **Data Type** → **Date**
   - Select column `SI_Date` → **Data Type** → **Date**
   - Select column `Year` → **Data Type** → **Whole Number**
   - Click **Close & Apply**

---

## PART 2: DATA MODELING

### Step 2.1: Create Dimension Tables

#### Create Dim_Date Table
In Power BI Desktop, go to **Modeling** tab and click **New Table**:

```
Dim_Date = CALENDARAUTO()
```

Then add columns:
```
Year = YEAR([Date])
Month = MONTH([Date])
MonthName = FORMAT([Date], "mmmm")
Quarter = "Q" & ROUNDUP(MONTH([Date])/3, 0)
```

#### Create Dim_Vessels Table
```
Dim_Vessels = DISTINCT(UNION(
  SELECT Vessel, Fleet FROM Fact_Audits,
  SELECT Vessel, Fleet FROM Fact_Categories
))
```

#### Create Dim_Auditors Table
```
Dim_Auditors = DISTINCT(SELECT Auditor FROM Fact_Audits)
```

### Step 2.2: Create Relationships
1. Go to **Model** view
2. Drag `Fact_Audits[Vessel]` to `Dim_Vessels[Vessel]` (Many-to-One)
3. Drag `Fact_Audits[Auditor]` to `Dim_Auditors[Auditor]` (Many-to-One)
4. Drag `Fact_Audits[IA_Date]` to `Dim_Date[Date]` (Many-to-One)

---

## PART 3: CREATE DAX MEASURES

### Step 3.1: Audit Count Measures
In the **Modeling** tab, click **New Measure** and add:

```dax
Total Audits = COUNTROWS(Fact_Audits)
```

```dax
Internal Audits = CALCULATE(
  COUNTROWS(Fact_Audits),
  NOT(ISBLANK(Fact_Audits[IA_Date]))
)
```

```dax
Safety Inspections = CALCULATE(
  COUNTROWS(Fact_Audits),
  NOT(ISBLANK(Fact_Audits[SI_Date]))
)
```

### Step 3.2: Non-Conformity Measures
```dax
Total NCs = 
VAR IANCs = SUM(Fact_Audits[IA_NC])
VAR SINCs = SUM(Fact_Audits[SI_NC])
RETURN IF(ISBLANK(IANCs), 0, IANCs) + IF(ISBLANK(SINCs), 0, SINCs)
```

```dax
Total Observations = 
VAR IAObs = SUM(Fact_Audits[IA_Obs])
VAR SIObs = SUM(Fact_Audits[SI_Obs])
RETURN IF(ISBLANK(IAObs), 0, IAObs) + IF(ISBLANK(SIObs), 0, SIObs)
```

```dax
NC per Audit = DIVIDE([Total NCs], [Total Audits], 0)
```

### Step 3.3: Performance Measures
```dax
NC Rate Target = 0.10
```

```dax
Target Achievement = 
IF([NC per Audit] <= [NC Rate Target], "✓ On Track", "⚠ Needs Attention")
```

```dax
YoY NC Change % = 
VAR PrevYearNC = CALCULATE([NC per Audit], SAMEPERIODLASTYEAR(Dim_Date[Date]))
RETURN DIVIDE([NC per Audit] - PrevYearNC, PrevYearNC, 0)
```

---

## PART 4: BUILD VISUALIZATIONS

### Page 1: Executive Overview

#### Visual 1.1: Total Audits (Card)
1. Click **Card** visual
2. Drag `[Total Audits]` to the **Fields** area
3. Format: Set font size to 28pt, color to Ishima Blue (#005596)
4. Add title: "Total Audits 2024"

#### Visual 1.2: NC Rate (Card)
1. Add another **Card** visual
2. Drag `[NC per Audit]` to the **Fields** area
3. Format: Number format "0.00", font size 28pt
4. Add title: "NC Rate (Target: 0.10)"

#### Visual 1.3: Total Non-Conformities (Card)
1. Add another **Card** visual
2. Drag `[Total NCs]` to the **Fields** area
3. Format: Font size 28pt, color to Alert Red (#DC3545)
4. Add title: "Total Non-Conformities"

#### Visual 1.4: Fleet Comparison (Clustered Column Chart)
1. Click **Clustered Column Chart**
2. Drag `Fact_Audits[Fleet]` to **Axis**
3. Drag `[Total NCs]` to **Values**
4. Add a second measure: Drag `[Total Audits]` to **Values**
5. Format: Set colors (Tanker: Blue, Dry: Grey)
6. Title: "Fleet Performance: Tanker vs. Dry"

#### Visual 1.5: 3-Year NC Trend (Line and Stacked Column Chart)
1. Click **Line and Stacked Column Chart**
2. Drag `Dim_Date[Year]` to **Shared Axis**
3. Drag `[Total NCs]` to **Column Values**
4. Drag `[NC per Audit]` to **Line Values**
5. Format: Add data labels
6. Title: "NC Trend Analysis (2022-2024)"

### Page 2: Audit Performance

#### Visual 2.1: Quarterly Audit Distribution (Stacked Column Chart)
1. Click **Stacked Column Chart**
2. Drag `Dim_Date[Quarter]` to **Axis**
3. Drag `[Internal Audits]` to **Values**
4. Drag `[Safety Inspections]` to **Values**
5. Format: Add data labels, legend at bottom
6. Title: "Quarterly Audit Distribution 2024"

#### Visual 2.2: Auditor Performance (Horizontal Bar Chart)
1. Click **Horizontal Bar Chart**
2. Drag `Dim_Auditors[Auditor]` to **Axis**
3. Drag `[Total Audits]` to **Values**
4. Sort by **Total Audits** descending
5. Title: "Auditor Performance Ranking"

#### Visual 2.3: Audit Summary Table
1. Click **Table** visual
2. Drag the following fields:
   - `Dim_Vessels[Vessel]`
   - `[Total Audits]`
   - `[Total NCs]`
   - `[NC per Audit]`
3. Format: Conditional formatting on NC per Audit (Green < 0.10, Red > 0.10)
4. Title: "Audit Summary by Vessel"

### Page 3: Deficiency Analysis

#### Visual 3.1: NCs by Category (Horizontal Bar Chart)
1. Click **Horizontal Bar Chart**
2. Drag `Fact_Categories[Category]` to **Axis**
3. Drag `[NCs by Category]` to **Values**
4. Sort descending, show top 15 categories
5. Title: "Top 15 Deficiency Categories"

#### Visual 3.2: Category Trends (Clustered Column Chart)
1. Click **Clustered Column Chart**
2. Drag `Dim_Date[Year]` to **Axis**
3. Drag `[NCs by Category]` to **Values**
4. Add legend by `Fact_Categories[Category]` (top 5)
5. Title: "Deficiency Trends by Category (2022-2024)"

### Page 4: Compliance & Schedule

#### Visual 4.1: Audit Schedule Matrix
1. Click **Matrix** visual
2. Drag `Dim_Vessels[Vessel]` to **Rows**
3. Drag `Dim_Date[MonthName]` to **Columns**
4. Drag `[Total Audits]` to **Values**
5. Format: Conditional formatting (Green for audits scheduled)
6. Title: "Annual Audit Schedule 2024"

---

## PART 5: ADD INTERACTIVE SLICERS

### Slicer 1: Year Filter
1. Click **Slicer** visual
2. Drag `Dim_Date[Year]` to the **Field**
3. Format: Style as **Dropdown**
4. Position: Top-left of the page

### Slicer 2: Fleet Filter
1. Click **Slicer** visual
2. Drag `Fact_Audits[Fleet]` to the **Field**
3. Format: Style as **Buttons**
4. Position: Top-center

### Slicer 3: Auditor Filter
1. Click **Slicer** visual
2. Drag `Dim_Auditors[Auditor]` to the **Field**
3. Format: Style as **Dropdown**
4. Position: Top-right

---

## PART 6: APPLY EXECUTIVE FORMATTING

### Color Scheme
- **Primary (Headers):** #005596 (Ishima Blue)
- **Secondary (Borders):** #58595B (Corporate Grey)
- **Success (On Track):** #28A745 (Green)
- **Alert (Needs Attention):** #DC3545 (Red)
- **Background:** #F5F5F5 (Light Grey)

### Fonts
- **Page Titles:** Segoe UI, 24pt, Bold, Ishima Blue
- **Visual Titles:** Segoe UI, 14pt, Bold, Dark Grey
- **Labels:** Segoe UI, 11pt, Regular

### Page Layout
1. Go to **View** → **Page Size** → **16:9 (Standard)**
2. Set **Margins** to 10px all around
3. Add a **Header** with company logo and report title
4. Add a **Footer** with date and version number

---

## PART 7: PUBLISH TO POWER BI SERVICE

### Step 7.1: Save the Report
1. Click **File** → **Save As**
2. Name: `Marine_Department_Audit_Dashboard_v1.0.pbix`
3. Save to a secure location

### Step 7.2: Publish to Power BI Service
1. Click **Publish** button in the ribbon
2. Select your workspace
3. Click **Select**
4. Once published, open the report in Power BI Service

### Step 7.3: Configure Data Refresh
1. In Power BI Service, go to **Settings** → **Datasets**
2. Select your dataset
3. Click **Scheduled Refresh**
4. Set refresh frequency (e.g., Daily at 6:00 AM)

---

## PART 8: EXECUTIVE SUMMARY NOTES

This dashboard provides:
- **Real-time KPI monitoring** for audit performance
- **Trend analysis** across 3 years of data
- **Fleet comparison** (Tanker vs. Dry)
- **Category-level deficiency tracking**
- **Interactive filtering** for detailed analysis
- **Professional formatting** suitable for C-suite presentations

All visualizations are fully interactive and drill-through capable, allowing executives to explore data at multiple levels of detail.

---

## TROUBLESHOOTING

| Issue | Solution |
| :--- | :--- |
| Data not loading | Verify CSV file paths and ensure files are in the correct directory |
| Measures showing errors | Check DAX syntax and ensure all referenced columns exist |
| Slicers not filtering | Verify relationships are correctly established in Model view |
| Charts appear blank | Ensure data types are correct (dates should be Date, not Text) |

---

**Dashboard Version:** 1.0  
**Created by:** Senior Power BI Developer  
**Last Updated:** February 2025  
**For:** Executive Management - Ishima Pte. Ltd.
