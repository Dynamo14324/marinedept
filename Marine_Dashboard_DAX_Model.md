# Power BI Data Model & DAX Measures

## 1. Data Model Relationships
The model follows a **Star Schema** for optimal performance:

- **Fact_Audits:** (from `Marine_Audit_Data_Combined.csv`)
  - `Vessel` -> Dim_Vessels[Vessel]
  - `Auditor` -> Dim_Auditors[Auditor]
  - `IA_Date` -> Dim_Date[Date]
- **Fact_Categories:** (from `Marine_Categories_Combined.csv`)
  - `Vessel` -> Dim_Vessels[Vessel]
  - `Category` -> Dim_Categories[Category]
- **Dim_Date:** Standard calendar table.
- **Dim_Vessels:** Unique list of vessels with Fleet Type (Tanker/Dry).
- **Dim_Auditors:** Unique list of auditors/superintendents.

## 2. Key DAX Measures

### Audit Counts
```dax
Total Audits = COUNTROWS(Fact_Audits)
Internal Audits = CALCULATE([Total Audits], Fact_Audits[Audit_Type] = "Internal")
Safety Inspections = CALCULATE([Total Audits], Fact_Audits[Audit_Type] = "Safety")
```

### Non-Conformities (NC) & Observations
```dax
Total NCs = SUM(Fact_Audits[IA_NC]) + SUM(Fact_Audits[SI_NC])
Total Observations = SUM(Fact_Audits[IA_Obs]) + SUM(Fact_Audits[SI_Obs])
NC per Audit = DIVIDE([Total NCs], [Total Audits], 0)
```

### Performance & Trends
```dax
NC Rate Target = 0.10
Target Achievement = IF([NC per Audit] <= [NC Rate Target], "On Track", "Needs Attention")
YoY NC Change = 
VAR PrevYearNC = CALCULATE([NC per Audit], SAMEPERIODLASTYEAR(Dim_Date[Date]))
RETURN DIVIDE([NC per Audit] - PrevYearNC, PrevYearNC, 0)
```

### Category Analysis
```dax
NCs by Category = SUM(Fact_Categories[Count])
Top Deficiency Category = TOPN(1, VALUES(Dim_Categories[Category]), [NCs by Category])
```

## 3. Visual Formatting Rules
- **Color Palette:** Ishima Blue (#005596), Corporate Grey (#58595B), Success Green (#28A745), Alert Red (#DC3545).
- **Fonts:** Segoe UI (Standard Power BI) or Calibri for a corporate look.
- **Layout:** KPI cards at the top, main charts in the center, slicers on the left/top.
