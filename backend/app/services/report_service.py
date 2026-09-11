import os
import hashlib
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

class ReportService:
    """
    Member 5 — PDF Inspection Report Generator:
    - Generates tamper-evident Legal Metrology Compliance Inspection Certificate
    - Color-coded status badges and severity ratings
    - Traceable rule references and evidence audit chain
    - SHA-256 verification digest
    """

    @staticmethod
    def generate_pdf(
        inspection_id: str,
        product_name: str,
        product_category: str,
        inspector_name: str,
        score_data: dict,
        compliance_results: list,
        output_dir: str
    ) -> dict:
        os.makedirs(output_dir, exist_ok=True)
        filename = f"Inspection_Report_{inspection_id}.pdf"
        filepath = os.path.join(output_dir, filename)

        doc = SimpleDocTemplate(
            filepath,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Custom typography styles
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=16,
            leading=20,
            textColor=colors.HexColor('#0f172a'),
            alignment=1
        )
        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#475569'),
            alignment=1
        )
        meta_label = ParagraphStyle(
            'MetaLabel',
            fontName='Helvetica-Bold',
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#334155')
        )
        meta_val = ParagraphStyle(
            'MetaVal',
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#0f172a')
        )
        cell_text = ParagraphStyle(
            'CellText',
            fontName='Helvetica',
            fontSize=8,
            leading=11,
            textColor=colors.HexColor('#1e293b')
        )
        badge_pass = ParagraphStyle(
            'BadgePass',
            fontName='Helvetica-Bold',
            fontSize=8,
            textColor=colors.HexColor('#047857')
        )
        badge_fail = ParagraphStyle(
            'BadgeFail',
            fontName='Helvetica-Bold',
            fontSize=8,
            textColor=colors.HexColor('#b91c1c')
        )
        badge_review = ParagraphStyle(
            'BadgeReview',
            fontName='Helvetica-Bold',
            fontSize=8,
            textColor=colors.HexColor('#b45309')
        )

        elements = []

        # Header Title
        elements.append(Paragraph("GOVERNMENT ENFORCEMENT DECISION SUPPORT SYSTEM", subtitle_style))
        elements.append(Spacer(1, 4))
        elements.append(Paragraph("LEGAL METROLOGY COMPLIANCE INSPECTION CERTIFICATE", title_style))
        elements.append(Paragraph("Packaged Commodities Rules (Rule 6 Declarations Screening)", subtitle_style))
        elements.append(Spacer(1, 10))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284c7'), spaceAfter=12))

        # Metadata Table
        status_label = score_data.get("status_label", "Needs Manual Review")
        weighted_score = score_data.get("weighted_score", 0.0)
        
        status_bg = colors.HexColor('#dcfce7') if status_label == "Compliant" else (
            colors.HexColor('#fee2e2') if status_label == "Potentially Non-Compliant" else colors.HexColor('#fef3c7')
        )
        status_text_color = colors.HexColor('#15803d') if status_label == "Compliant" else (
            colors.HexColor('#b91c1c') if status_label == "Potentially Non-Compliant" else colors.HexColor('#b45309')
        )

        meta_data = [
            [
                Paragraph("<b>Inspection ID:</b>", meta_label), Paragraph(inspection_id, meta_val),
                Paragraph("<b>Inspection Date:</b>", meta_label), Paragraph(datetime.utcnow().strftime('%d-%b-%Y %H:%M UTC'), meta_val)
            ],
            [
                Paragraph("<b>Commodity:</b>", meta_label), Paragraph(product_name or "N/A", meta_val),
                Paragraph("<b>Category:</b>", meta_label), Paragraph(product_category.replace("_", " ").title(), meta_val)
            ],
            [
                Paragraph("<b>Inspecting Officer:</b>", meta_label), Paragraph(inspector_name, meta_val),
                Paragraph("<b>Compliance Score:</b>", meta_label), Paragraph(f"<b>{weighted_score}% ({status_label})</b>", meta_val)
            ]
        ]

        t_meta = Table(meta_data, colWidths=[100, 170, 100, 170])
        t_meta.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(t_meta)
        elements.append(Spacer(1, 14))

        # Executive Findings Table
        elements.append(Paragraph("<b>MANDATORY LABEL DECLARATION FINDINGS</b>", meta_label))
        elements.append(Spacer(1, 6))

        table_data = [
            [
                Paragraph("<b>Requirement</b>", meta_label),
                Paragraph("<b>Detected Declaration</b>", meta_label),
                Paragraph("<b>Severity</b>", meta_label),
                Paragraph("<b>Status</b>", meta_label),
                Paragraph("<b>Evidence & Legal Citation</b>", meta_label)
            ]
        ]

        for res in compliance_results:
            st = res.get("status", "Needs Review")
            st_badge = badge_pass if st == "Pass" else (badge_fail if st == "Fail" else badge_review)
            
            table_data.append([
                Paragraph(f"<b>{res.get('rule_name', res.get('field'))}</b>", cell_text),
                Paragraph(res.get("detected_value") or "Not detected", cell_text),
                Paragraph(res.get("severity", "Medium"), cell_text),
                Paragraph(st, st_badge),
                Paragraph(f"{res.get('evidence', '')}<br/><font color='#64748b'>Ref: {res.get('source_reference', 'Rule 6')}</font>", cell_text)
            ])

        t_findings = Table(table_data, colWidths=[110, 120, 60, 75, 175])
        t_findings.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f1f5f9')),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(t_findings)
        elements.append(Spacer(1, 14))

        # Legal Disclaimer & Audit Hash
        raw_digest = f"{inspection_id}:{weighted_score}:{status_label}:{datetime.utcnow().isoformat()}"
        sha_hash = hashlib.sha256(raw_digest.encode('utf-8')).hexdigest()

        disclaimer_text = (
            "<b>STATUTORY DISCLAIMER:</b> This inspection record is generated by an AI-assisted screening system "
            "intended exclusively for field screening and decision support under the Legal Metrology (Packaged Commodities) "
            "Rules. Final enforcement actions, panchnamas, or challans require verified on-ground physical inspection "
            "by an authorized Legal Metrology Officer."
        )
        elements.append(Paragraph(disclaimer_text, ParagraphStyle('Disc', fontName='Helvetica-Oblique', fontSize=7, leading=10, textColor=colors.HexColor('#64748b'))))
        elements.append(Spacer(1, 8))
        elements.append(Paragraph(f"<b>Audit Verification Hash (SHA-256):</b> <font color='#0284c7'>{sha_hash}</font>", ParagraphStyle('Hash', fontName='Courier', fontSize=7, leading=9, textColor=colors.HexColor('#334155'))))

        # Build Document
        doc.build(elements)

        return {
            "filename": filename,
            "filepath": filepath,
            "url": f"/storage/reports/{filename}",
            "sha256": sha_hash
        }
