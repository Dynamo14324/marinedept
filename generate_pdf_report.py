from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak, KeepTogether
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from datetime import datetime
import pandas as pd

# Create PDF
pdf_file = '/home/ubuntu/Marine_Department_Audit_Report_2024.pdf'
doc = SimpleDocTemplate(pdf_file, pagesize=letter,
                       rightMargin=0.5*inch, leftMargin=0.5*inch,
                       topMargin=0.5*inch, bottomMargin=0.5*inch)

# Container for PDF elements
elements = []

# Define styles
styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=24,
    textColor=colors.HexColor('#005596'),
    spaceAfter=12,
    alignment=TA_CENTER,
    fontName='Helvetica-Bold'
)

heading_style = ParagraphStyle(
    'CustomHeading',
    parent=styles['Heading2'],
    fontSize=14,
    textColor=colors.HexColor('#003D82'),
    spaceAfter=10,
    spaceBefore=10,
    fontName='Helvetica-Bold'
)

body_style = ParagraphStyle(
    'CustomBody',
    parent=styles['BodyText'],
    fontSize=10,
    textColor=colors.HexColor('#333333'),
    spaceAfter=8,
    alignment=TA_JUSTIFY,
    fontName='Helvetica'
)

# ============================================================================
# COVER PAGE
# ============================================================================
elements.append(Spacer(1, 1.5*inch))

# Company Logo/Header
title = Paragraph("ISHIMA PTE. LTD.", title_style)
elements.append(title)
elements.append(Spacer(1, 0.2*inch))

subtitle = Paragraph("Marine Department Audit Dashboard", 
                    ParagraphStyle('subtitle', parent=styles['Heading2'], 
                                 fontSize=18, textColor=colors.HexColor('#005596'),
                                 alignment=TA_CENTER))
elements.append(subtitle)
elements.append(Spacer(1, 0.3*inch))

report_title = Paragraph("Management Review Meeting Report", 
                        ParagraphStyle('report_title', parent=styles['Heading2'],
                                     fontSize=16, textColor=colors.HexColor('#333333'),
                                     alignment=TA_CENTER))
elements.append(report_title)
elements.append(Spacer(1, 0.2*inch))

year_text = Paragraph("For the Year 2024", 
                     ParagraphStyle('year', parent=styles['Normal'],
                                  fontSize=14, textColor=colors.HexColor('#333333'),
                                  alignment=TA_CENTER))
elements.append(year_text)
elements.append(Spacer(1, 1*inch))

date_text = Paragraph(f"Report Generated: {datetime.now().strftime('%B %d, %Y')}", 
                     ParagraphStyle('date', parent=styles['Normal'],
                                  fontSize=11, textColor=colors.HexColor('#58595B'),
                                  alignment=TA_CENTER))
elements.append(date_text)

elements.append(PageBreak())

# ============================================================================
# EXECUTIVE SUMMARY
# ============================================================================
elements.append(Paragraph("EXECUTIVE SUMMARY", heading_style))
elements.append(Spacer(1, 0.2*inch))

summary_text = """
The Marine Department's audit performance for 2024 demonstrates strong compliance and continuous improvement across the fleet. 
This comprehensive report presents detailed analysis of Internal Audits (IA) and Safety Inspections (SI) conducted throughout the year, 
with comparative analysis against 2022 and 2023 performance metrics. The dashboard provides executive management with real-time visibility 
into audit performance, non-conformity trends, and fleet-specific insights for both Tanker and Dry vessel categories.
"""
elements.append(Paragraph(summary_text, body_style))
elements.append(Spacer(1, 0.3*inch))

# Key Metrics Table
metrics_data = [
    ['Metric', 'Value', 'Status', 'Target'],
    ['Total Audits Conducted', '37', '✓ On Track', '35+'],
    ['Total Non-Conformities', '3', '✓ Excellent', '< 10'],
    ['NC per Audit (ISM)', '0.10', '✓ On Target', '≤ 0.10'],
    ['Fleet Coverage', '100%', '✓ Complete', '100%'],
    ['Tanker Vessels Audited', '26', '✓ Complete', '26'],
    ['Dry Vessels Audited', '11', '✓ Complete', '11'],
]

metrics_table = Table(metrics_data, colWidths=[2.2*inch, 1.2*inch, 1.2*inch, 1.2*inch])
metrics_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#005596')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 11),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#58595B')),
    ('FONTSIZE', (0, 1), (-1, -1), 10),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F5F5')]),
]))
elements.append(metrics_table)
elements.append(PageBreak())

# ============================================================================
# SECTION 1: FLEET OVERVIEW
# ============================================================================
elements.append(Paragraph("1. FLEET AUDIT PERFORMANCE OVERVIEW", heading_style))
elements.append(Spacer(1, 0.2*inch))

section1_text = """
The comprehensive audit program for 2024 covered the entire fleet with a focus on maintaining high standards of compliance 
across all vessels. The data demonstrates consistent performance improvement with zero non-conformities recorded in the 
ISM audit program for the final quarter of 2024.
"""
elements.append(Paragraph(section1_text, body_style))
elements.append(Spacer(1, 0.3*inch))

# Chart 1
elements.append(Paragraph("Chart 1: External Audit Fleet Comparison (2022-2024)", 
                         ParagraphStyle('chart_title', parent=styles['Normal'],
                                      fontSize=11, textColor=colors.HexColor('#003D82'),
                                      fontName='Helvetica-Bold')))
img1 = Image('/home/ubuntu/marine_charts/01_fleet_comparison_ism.png', width=6.5*inch, height=3.5*inch)
elements.append(img1)
elements.append(Spacer(1, 0.2*inch))

chart1_desc = """
<b>Key Findings:</b> The fleet comparison shows a positive trend with NC per Inspection declining from 0.26 (2022) to 0.10 (2024). 
Total audits increased from 34 (2022) to 37 (2024) while maintaining lower non-conformity rates, indicating improved audit effectiveness 
and better vessel compliance.
"""
elements.append(Paragraph(chart1_desc, body_style))
elements.append(PageBreak())

# ============================================================================
# SECTION 2: QUARTERLY ANALYSIS
# ============================================================================
elements.append(Paragraph("2. QUARTERLY AUDIT DISTRIBUTION - 2024", heading_style))
elements.append(Spacer(1, 0.2*inch))

section2_text = """
The quarterly breakdown of 2024 audits demonstrates consistent audit scheduling throughout the year with strategic distribution 
across all four quarters. The data shows increasing vessel coverage in Q4 with 37 vessels audited, reflecting the year-end audit push.
"""
elements.append(Paragraph(section2_text, body_style))
elements.append(Spacer(1, 0.3*inch))

# Chart 2
elements.append(Paragraph("Chart 2: External Audit Fleet (ISM) - 2024 Quarterly", 
                         ParagraphStyle('chart_title', parent=styles['Normal'],
                                      fontSize=11, textColor=colors.HexColor('#003D82'),
                                      fontName='Helvetica-Bold')))
img2 = Image('/home/ubuntu/marine_charts/02_fleet_quarterly_ism.png', width=6.5*inch, height=3.5*inch)
elements.append(img2)
elements.append(Spacer(1, 0.2*inch))

chart2_desc = """
<b>Key Findings:</b> Q2 recorded 3 non-conformities (average 0.43 per audit), while Q1, Q3, and Q4 maintained zero non-conformities. 
The audit frequency remained consistent with 6-8 audits per quarter, ensuring comprehensive fleet coverage.
"""
elements.append(Paragraph(chart2_desc, body_style))
elements.append(PageBreak())

# ============================================================================
# SECTION 3: DEFICIENCY CATEGORIES
# ============================================================================
elements.append(Paragraph("3. DEFICIENCY ANALYSIS BY CATEGORY", heading_style))
elements.append(Spacer(1, 0.2*inch))

section3_text = """
Analysis of non-conformities by category reveals that Safety Management remains the primary area of focus, with 0.10 NC rate in 2024. 
This represents the highest deficiency category, followed by Certification and Documentation. The trend analysis shows significant 
improvement from 2022 levels, indicating effective corrective actions.
"""
elements.append(Paragraph(section3_text, body_style))
elements.append(Spacer(1, 0.3*inch))

# Chart 3
elements.append(Paragraph("Chart 3: External (ISM) Audit by Categories - Fleet Comparison (2022-2024)", 
                         ParagraphStyle('chart_title', parent=styles['Normal'],
                                      fontSize=11, textColor=colors.HexColor('#003D82'),
                                      fontName='Helvetica-Bold')))
img3 = Image('/home/ubuntu/marine_charts/03_categories_comparison.png', width=6.5*inch, height=3.5*inch)
elements.append(img3)
elements.append(Spacer(1, 0.2*inch))

chart3_desc = """
<b>Key Findings:</b> Safety Management showed the highest deficiency rate at 0.10 in 2024, consistent with 2023 levels. 
All other categories maintained zero non-conformity rates, demonstrating excellent performance in Crew Management, Navigation, 
Pollution Prevention, and Maritime Security.
"""
elements.append(Paragraph(chart3_desc, body_style))
elements.append(PageBreak())

# ============================================================================
# SECTION 4: TANKER FLEET ANALYSIS
# ============================================================================
elements.append(Paragraph("4. TANKER FLEET AUDIT PERFORMANCE", heading_style))
elements.append(Spacer(1, 0.2*inch))

section4_text = """
The Tanker fleet comprises 26 vessels and represents the majority of the audit portfolio. 2024 performance shows continued 
improvement with only 3 non-conformities recorded across 20 audits, resulting in a 0.15 NC per audit rate.
"""
elements.append(Paragraph(section4_text, body_style))
elements.append(Spacer(1, 0.3*inch))

# Chart 4
elements.append(Paragraph("Chart 4: External Audit (Tanker Comparison - ISM) 2022-2024", 
                         ParagraphStyle('chart_title', parent=styles['Normal'],
                                      fontSize=11, textColor=colors.HexColor('#003D82'),
                                      fontName='Helvetica-Bold')))
img4 = Image('/home/ubuntu/marine_charts/04_tanker_comparison_ism.png', width=6.5*inch, height=3.5*inch)
elements.append(img4)
elements.append(Spacer(1, 0.2*inch))

chart4_desc = """
<b>Key Findings:</b> Tanker fleet shows positive trend with NC per Inspection improving from 0.29 (2022) to 0.15 (2024). 
The number of vessels audited increased from 21 to 26, indicating expanded audit coverage.
"""
elements.append(Paragraph(chart4_desc, body_style))
elements.append(PageBreak())

# Chart 5
elements.append(Paragraph("Chart 5: External Audit Tanker (ISM) - 2024 Quarterly", 
                         ParagraphStyle('chart_title', parent=styles['Normal'],
                                      fontSize=11, textColor=colors.HexColor('#003D82'),
                                      fontName='Helvetica-Bold')))
img5 = Image('/home/ubuntu/marine_charts/05_tanker_quarterly_ism.png', width=6.5*inch, height=3.5*inch)
elements.append(img5)
elements.append(Spacer(1, 0.2*inch))

chart5_desc = """
<b>Key Findings:</b> Tanker quarterly analysis shows all 3 non-conformities concentrated in Q2 (1.00 NC per audit). 
Q1, Q3, and Q4 maintained zero non-conformity rates, demonstrating excellent performance in three quarters.
"""
elements.append(Paragraph(chart5_desc, body_style))
elements.append(PageBreak())

# ============================================================================
# SECTION 5: DRY FLEET ANALYSIS
# ============================================================================
elements.append(Paragraph("5. DRY FLEET AUDIT PERFORMANCE", heading_style))
elements.append(Spacer(1, 0.2*inch))

section5_text = """
The Dry fleet comprises 11 vessels and shows exceptional performance with zero non-conformities recorded in 2024. 
This represents a significant improvement from previous years and demonstrates excellent compliance across all dry bulk carriers.
"""
elements.append(Paragraph(section5_text, body_style))
elements.append(Spacer(1, 0.3*inch))

# Chart 6
elements.append(Paragraph("Chart 6: External Audit (Dry Comparison - ISM) 2022-2024", 
                         ParagraphStyle('chart_title', parent=styles['Normal'],
                                      fontSize=11, textColor=colors.HexColor('#003D82'),
                                      fontName='Helvetica-Bold')))
img6 = Image('/home/ubuntu/marine_charts/06_dry_comparison_ism.png', width=6.5*inch, height=3.5*inch)
elements.append(img6)
elements.append(Spacer(1, 0.2*inch))

chart6_desc = """
<b>Key Findings:</b> Dry fleet demonstrates excellent improvement with NC per Inspection declining from 0.23 (2022) to 0.00 (2024). 
This represents zero non-conformities across all 9 audits conducted in 2024.
"""
elements.append(Paragraph(chart6_desc, body_style))
elements.append(PageBreak())

# Chart 7
elements.append(Paragraph("Chart 7: External Audit DRY (ISM) - 2024 Quarterly", 
                         ParagraphStyle('chart_title', parent=styles['Normal'],
                                      fontSize=11, textColor=colors.HexColor('#003D82'),
                                      fontName='Helvetica-Bold')))
img7 = Image('/home/ubuntu/marine_charts/07_dry_quarterly_ism.png', width=6.5*inch, height=3.5*inch)
elements.append(img7)
elements.append(Spacer(1, 0.2*inch))

chart7_desc = """
<b>Key Findings:</b> Dry fleet quarterly distribution shows consistent audit scheduling with 0 NCs throughout all quarters. 
Q4 had the highest audit count with 3 audits, reflecting year-end compliance verification.
"""
elements.append(Paragraph(chart7_desc, body_style))
elements.append(PageBreak())

# ============================================================================
# SECTION 6: ISPS AUDIT ANALYSIS
# ============================================================================
elements.append(Paragraph("6. ISPS AUDIT PERFORMANCE", heading_style))
elements.append(Spacer(1, 0.2*inch))

section6_text = """
The ISPS (International Ship and Port Facility Security) audit program covers security compliance across the fleet. 
2024 results show zero non-conformities, indicating full compliance with international security standards.
"""
elements.append(Paragraph(section6_text, body_style))
elements.append(Spacer(1, 0.3*inch))

# Chart 8
elements.append(Paragraph("Chart 8: External Audit (Fleet Comparison - ISPS) 2022-2024", 
                         ParagraphStyle('chart_title', parent=styles['Normal'],
                                      fontSize=11, textColor=colors.HexColor('#003D82'),
                                      fontName='Helvetica-Bold')))
img8 = Image('/home/ubuntu/marine_charts/08_fleet_comparison_isps.png', width=6.5*inch, height=3.5*inch)
elements.append(img8)
elements.append(Spacer(1, 0.2*inch))

chart8_desc = """
<b>Key Findings:</b> ISPS fleet comparison shows zero non-conformities in 2024, maintaining the excellent security posture 
achieved in 2023. Total audits increased to 28, providing comprehensive security coverage.
"""
elements.append(Paragraph(chart8_desc, body_style))
elements.append(PageBreak())

# Chart 9
elements.append(Paragraph("Chart 9: External Audit FLEET (ISPS) - 2024 Quarterly", 
                         ParagraphStyle('chart_title', parent=styles['Normal'],
                                      fontSize=11, textColor=colors.HexColor('#003D82'),
                                      fontName='Helvetica-Bold')))
img9 = Image('/home/ubuntu/marine_charts/09_fleet_quarterly_isps.png', width=6.5*inch, height=3.5*inch)
elements.append(img9)
elements.append(Spacer(1, 0.2*inch))

chart9_desc = """
<b>Key Findings:</b> ISPS quarterly distribution shows consistent security audits throughout 2024 with zero non-conformities 
in all quarters. This demonstrates sustained security compliance across the entire fleet.
"""
elements.append(Paragraph(chart9_desc, body_style))
elements.append(PageBreak())

# Chart 10
elements.append(Paragraph("Chart 10: External (ISPS) Audit by Categories - Fleet Comparison (2022-2024)", 
                         ParagraphStyle('chart_title', parent=styles['Normal'],
                                      fontSize=11, textColor=colors.HexColor('#003D82'),
                                      fontName='Helvetica-Bold')))
img10 = Image('/home/ubuntu/marine_charts/10_isps_categories_comparison.png', width=6.5*inch, height=3.5*inch)
elements.append(img10)
elements.append(Spacer(1, 0.2*inch))

chart10_desc = """
<b>Key Findings:</b> ISPS category analysis shows zero non-conformities across all security categories in 2024. 
Maritime Security was the only category with findings in 2023 (0.14 rate), which has been fully resolved.
"""
elements.append(Paragraph(chart10_desc, body_style))
elements.append(PageBreak())

# ============================================================================
# SECTION 7: CONCLUSIONS & RECOMMENDATIONS
# ============================================================================
elements.append(Paragraph("7. CONCLUSIONS & RECOMMENDATIONS", heading_style))
elements.append(Spacer(1, 0.2*inch))

conclusion_text = """
<b>Overall Assessment:</b><br/>
The Marine Department's 2024 audit performance demonstrates excellent compliance and continuous improvement. 
Key achievements include zero non-conformities in the Dry fleet and ISPS programs, and significant reduction in NC rates 
across all audit categories compared to 2022 levels.<br/><br/>

<b>Strengths:</b><br/>
• Dry fleet achieved zero non-conformities (0.00 NC per audit)<br/>
• ISPS program maintained zero non-conformities across all quarters<br/>
• Fleet-wide NC per audit rate of 0.10, meeting KPI targets<br/>
• Comprehensive audit coverage with 37 vessels audited<br/>
• Consistent improvement trend from 2022 to 2024<br/><br/>

<b>Areas for Continued Focus:</b><br/>
• Safety Management remains the primary deficiency category (0.10 rate)<br/>
• Tanker fleet Q2 performance requires monitoring for root cause analysis<br/>
• Maintain audit frequency to sustain compliance levels<br/><br/>

<b>Recommendations:</b><br/>
• Continue quarterly audit scheduling to maintain consistent coverage<br/>
• Conduct targeted training on Safety Management procedures<br/>
• Implement preventive measures to address Q2 deficiency spike in tanker fleet<br/>
• Expand audit scope to include emerging compliance areas<br/>
• Maintain current audit standards and best practices
"""
elements.append(Paragraph(conclusion_text, body_style))
elements.append(PageBreak())

# ============================================================================
# FOOTER PAGE
# ============================================================================
elements.append(Spacer(1, 2*inch))

footer_text = """
<b>Report Information</b><br/>
Report Title: Marine Department Audit Dashboard - Management Review Meeting Report<br/>
Report Period: January 1, 2024 - December 31, 2024<br/>
Report Generated: """ + datetime.now().strftime('%B %d, %Y at %H:%M:%S') + """<br/>
Company: Ishima Pte. Ltd.<br/>
Department: Marine Operations<br/><br/>

<b>Document Classification:</b> Executive Management<br/>
<b>Confidentiality:</b> Internal Use Only<br/><br/>

For questions or clarifications regarding this report, please contact the Marine Department Management.
"""
elements.append(Paragraph(footer_text, body_style))

# Build PDF
doc.build(elements)
print(f"✓ PDF Report generated successfully: {pdf_file}")
print(f"✓ File size: {os.path.getsize(pdf_file) / 1024:.2f} KB")

import os
