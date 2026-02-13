# Power BI Dashboard - Exact Chart Specifications from PDF

## Chart 1: External Audit by Categories - Fleet Comparison (2022-2024)
- **Type:** Grouped Column Chart
- **X-Axis:** Categories (Certification, Crew Management, Navigation, Safety Management, Pollution Prevention, Maritime Security, Cargo & Ballast, Mooring, Engine & Steering, General Appearance, Ice Operation)
- **Y-Axis:** NC Rate (0.00 to 0.20)
- **Series:** 2022 (Blue #0078D4), 2023 (Dark Blue #004B87), 2024 (Dark Blue #004B87)
- **Data Labels:** Yes, on top of bars
- **Legend:** Bottom
- **Grid Lines:** Horizontal only

---

## Chart 2: External Audit (Tanker Comparison - ISM) 2022-2024
- **Type:** Clustered Column Chart with Trend Line
- **X-Axis:** Years (2022, 2023, 2024)
- **Y-Axis:** Count (0 to 30)
- **Series:**
  - No of NC (Cyan #00B4D8)
  - No. of Vessels (Dark Blue #003D82)
  - No. of Audits (Grey #A8A8A8)
  - NC x Insp (Red Trend Line #FF0000)
- **Data Labels:** Yes, on bars and line
- **Legend:** Bottom
- **Table Below:** Shows exact values

---

## Chart 3: External Audit Tanker (ISM) - 2024 Quarterly
- **Type:** Stacked Column Chart with Trend Line
- **X-Axis:** Quarters (JAN-MAR 24, APR-JUN 24, JUL-SEPT 24, OCT-DEC 24)
- **Y-Axis:** Count (0 to 30)
- **Series:**
  - No. of Vessels (Blue #0078D4)
  - No of NC (Orange #FF9500)
  - No. of Audits (Grey #A8A8A8)
  - Average NC per Audits (Red Line #FF0000)
- **Data Labels:** Yes
- **Table Below:** Shows detailed breakdown

---

## Chart 4: External Audit (Dry Comparison - ISM) 2022-2024
- **Type:** Clustered Column Chart with Trend Line
- **X-Axis:** Years (2022, 2023, 2024)
- **Y-Axis:** Count (0 to 14)
- **Series:**
  - No of NC (Cyan #00B4D8)
  - No. of Vessels (Dark Blue #003D82)
  - No. of Audits (Grey #A8A8A8)
  - NC x Insp (Red Trend Line #FF0000)
- **Data Labels:** Yes
- **Legend:** Bottom
- **Table Below:** Shows exact values

---

## Chart 5: External Audit DRY (ISM) - 2024 Quarterly
- **Type:** Stacked Column Chart with Trend Line
- **X-Axis:** Quarters (JAN-MAR 24, APR-JUN 24, JUL-SEPT 24, OCT-DEC 24)
- **Y-Axis:** Count (0 to 20)
- **Series:**
  - No. of Vessels (Blue #0078D4)
  - No of NC (Orange #FF9500)
  - No. of Audits (Grey #A8A8A8)
  - Average NC per Audits (Red Line #FF0000)
- **Data Labels:** Yes
- **Table Below:** Shows detailed breakdown

---

## Chart 6: External Audit (Fleet Comparison - ISPS) 2022-2024
- **Type:** Clustered Column Chart with Trend Line
- **X-Axis:** Years (2022, 2023, 2024)
- **Y-Axis:** Count (0 to 40)
- **Series:**
  - No of NC (Dark Blue #003D82)
  - No. of Vessels (Cyan #00B4D8)
  - No. of Audits (Grey #A8A8A8)
  - NC x Insp (Red Trend Line #FF0000)
- **Data Labels:** Yes
- **Legend:** Bottom
- **Table Below:** Shows exact values

---

## Chart 7: External Audit FLEET (ISPS) - 2024 Quarterly
- **Type:** Stacked Column Chart with Trend Line
- **X-Axis:** Quarters (JAN-MAR 24, APR-JUN 24, JUL-SEPT 24, OCT-DEC 24)
- **Y-Axis:** Count (0 to 40)
- **Series:**
  - No. of Vessels (Blue #0078D4)
  - No of NC (Orange #FF9500)
  - No. of Audits (Grey #A8A8A8)
  - Average NC per Audits (Red Line #FF0000)
- **Data Labels:** Yes
- **Table Below:** Shows detailed breakdown

---

## Chart 8: External (ISPS) Audit by Categories - Fleet Comparison (2022-2024)
- **Type:** Grouped Column Chart
- **X-Axis:** Categories (same as Chart 1)
- **Y-Axis:** NC Rate (0.00 to 0.20)
- **Series:** 2022 (Blue #0078D4), 2023 (Dark Blue #004B87), 2024 (Dark Blue #004B87)
- **Data Labels:** Yes
- **Legend:** Bottom
- **Grid Lines:** Horizontal only

---

## Color Palette Summary
| Element | Color | Hex Code |
| :--- | :--- | :--- |
| Primary Blue (Vessels) | Bright Blue | #0078D4 |
| Dark Blue (Vessels Alt) | Dark Blue | #003D82 |
| Cyan (NC Count) | Cyan | #00B4D8 |
| Orange (NC) | Orange | #FF9500 |
| Grey (Audits) | Light Grey | #A8A8A8 |
| Red (Trend Line) | Red | #FF0000 |
| Header Background | Dark Blue | #1F4E78 |
| Text | Dark Grey | #333333 |

---

## Font Specifications
- **Chart Titles:** Segoe UI, 14pt, Bold, Dark Grey
- **Axis Labels:** Segoe UI, 11pt, Regular, Dark Grey
- **Data Labels:** Segoe UI, 10pt, Bold, Black
- **Legend:** Segoe UI, 10pt, Regular, Dark Grey

---

## Interactive Features Required
1. **Slicers:** Year, Fleet Type (Tanker/Dry/All), Auditor
2. **Drill-through:** Click on a category to see vessel-level details
3. **Tooltips:** Show exact values on hover
4. **Filters:** Cross-chart filtering when selecting data points
