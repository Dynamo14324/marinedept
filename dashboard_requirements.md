# Marine Department Dashboard Requirements Analysis

## 1. Executive Management Goals
- Provide a high-level overview of the Integrated Management System (HSQE).
- Monitor KPIs for Vetting, PSC, and External Audits.
- Track audit schedules and performance across the fleet (Tanker vs. Dry).
- Identify trends in non-conformities (NCs) and observations.

## 2. Key Visualizations (from PDF)
- **External Audit Fleet Comparison (2022-2024):** Bar chart showing No. of NCs, No. of Vessels, No. of Audits, and NC per Inspection trend line.
- **External Audit Fleet (ISM) - 2024 Quarterly:** Bar chart showing No. of Vessels, NCs, Audits, and Average NC per Audit.
- **External Audit by Categories:** Grouped bar chart comparing NC rates across categories (Certification, Crew Management, Safety Management, etc.) for 2022, 2023, and 2024.
- **Tanker vs. Dry Comparison:** Separate charts for Tanker and Dry fleet performance.
- **PSC and Vetting KPI Tracking:** Comparison of actual deficiencies vs. targets.

## 3. Data Sources (Excel Worksheets)
- **IA Planner:** Monthly schedule of visits per vessel.
- **IA-SI DRY / TANKER:** Status and dates of Internal Audits, Safety Inspections, and Technical Inspections.
- **Dry Data / Tanker Data:** Detailed logs of audits (Internal, Safety, Navigational, Environmental, Cargo, ISPS, Mooring) including dates, auditors, NCs, and observations.
- **Int.Aud. Category / Saf.Insp.category:** Categorized deficiency data for trend analysis.

## 4. Dashboard Architecture
- **Overview Page:** High-level KPIs (Total Audits, Total NCs, Fleet Performance).
- **Audit Performance Page:** Detailed breakdown of Internal and External audits.
- **Deficiency Analysis Page:** Analysis by category and vessel type.
- **Schedule & Compliance Page:** Monitoring the IA Planner and expiring audit dates.

## 5. Technical Requirements
- **DAX Measures:** NC per Audit, Compliance Rate, Year-over-Year growth, Target vs. Actual.
- **Interactivity:** Slicers for Year, Fleet Type (Tanker/Dry), Auditor, and Vessel.
- **Formatting:** Corporate theme (Ishima branding), clear alignments, and executive-level summary tables.
