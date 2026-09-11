from app.core.database import engine, Base, SessionLocal
from app.models.entities import User, ComplianceRule, RuleVersion
from app.core.security import get_password_hash
from app.data.default_rules import DEFAULT_COMPLIANCE_RULES

def init_database():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # 1. Seed demo users if not present
        if not db.query(User).filter_by(email="inspector@sih.gov.in").first():
            inspector = User(
                name="Ravi Kumar (Inspector)",
                email="inspector@sih.gov.in",
                password_hash=get_password_hash("inspector123"),
                role="inspector"
            )
            db.add(inspector)

        if not db.query(User).filter_by(email="inspector01@gov.in").first():
            inspector2 = User(
                name="R. Kumar",
                email="inspector01@gov.in",
                password_hash=get_password_hash("inspector123"),
                role="inspector"
            )
            db.add(inspector2)

        if not db.query(User).filter_by(email="admin@sih.gov.in").first():
            admin = User(
                name="Meena Sharma (Legal Metrology Officer)",
                email="admin@sih.gov.in",
                password_hash=get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin)

        if not db.query(User).filter_by(email="admin01@gov.in").first():
            admin2 = User(
                name="Admin Officer",
                email="admin01@gov.in",
                password_hash=get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin2)


        # 2. Seed default compliance rules if not present
        for rule_dict in DEFAULT_COMPLIANCE_RULES:
            existing = db.query(ComplianceRule).filter_by(rule_id=rule_dict["rule_id"]).first()
            if not existing:
                rule = ComplianceRule(
                    rule_id=rule_dict["rule_id"],
                    rule_name=rule_dict["rule_name"],
                    applicable_category=rule_dict["applicable_category"],
                    requirement=rule_dict["requirement"],
                    input_field=rule_dict["input_field"],
                    validation_logic=rule_dict["validation_logic"],
                    severity=rule_dict["severity"],
                    result_if_absent=rule_dict["result_if_absent"],
                    result_if_low_confidence=rule_dict["result_if_low_confidence"],
                    explanation_template=rule_dict["explanation_template"],
                    source_reference=rule_dict["source_reference"],
                    version=rule_dict["version"],
                    is_active=True
                )
                db.add(rule)
                # Seed rule version
                ver = RuleVersion(
                    rule_id=rule_dict["rule_id"],
                    version=rule_dict["version"],
                    config=rule_dict,
                    created_by="system_init"
                )
                db.add(ver)

        db.commit()

        # 3. Seed initial demo inspections if none exist
        if db.query(ComplianceScore).count() == 0:
            import os
            from app.core.config import settings
            from app.services.rule_engine import RuleEngineService
            from app.services.report_service import ReportService
            from app.models.entities import (
                Inspection, Image, OCRResult, ExtractedField, ComplianceResult, ComplianceScore, Report
            )

            inspector = db.query(User).filter_by(role="inspector").first()
            user_id = inspector.id if inspector else None
            active_rules = db.query(ComplianceRule).filter_by(is_active=True).all()

            os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
            os.makedirs(settings.REPORT_DIR, exist_ok=True)

            sample_items = [
                {
                    "id": "INS-2025-0012",
                    "product_name": "Parle-G Biscuits",
                    "product_category": "all_packaged_food",
                    "notes": "Scenario: scenario_2_missing_care",
                    "fields": {
                        "product_name": {"value": "Parle-G Biscuits", "confidence": 0.98, "source_text": "PARLE-G ORIGINAL GLUCO BISCUITS"},
                        "net_quantity": {"value": "800 g", "normalized": {"amount": 800, "unit": "g"}, "confidence": 0.97, "source_text": "NET WT. 800 g"},
                        "mrp": {"value": "₹ 50.00", "normalized": {"amount": 50.0, "currency": "INR"}, "confidence": 0.99, "source_text": "MRP Rs. 50/- (INCL. ALL TAXES)"},
                        "manufacturer": {"value": "Parle Products Pvt. Ltd. Vile Parle, Mumbai - 400057", "confidence": 0.94, "source_text": "MFD BY: PARLE PRODUCTS PVT LTD..."},
                        "consumer_care": {"value": None, "confidence": 0.0, "source_text": None},
                        "date_mfg_pkd": {"value": "08/2026", "confidence": 0.91, "source_text": "MFD. 08/2026"},
                        "country_of_origin": {"value": "India", "confidence": 0.95, "source_text": "MADE IN INDIA"}
                    },
                    "ocr_lines": [
                        "PARLE-G ORIGINAL GLUCO BISCUITS",
                        "NET WT. 800 g",
                        "MFD. 08/2026",
                        "MRP Rs. 50/- (INCL. ALL TAXES)",
                        "MFD BY: PARLE PRODUCTS PVT LTD, VILE PARLE, MUMBAI - 400057",
                        "MADE IN INDIA"
                    ]
                },
                {
                    "id": "INS-2025-0011",
                    "product_name": "Britannia Glucose D Biscuits",
                    "product_category": "all_packaged_food",
                    "notes": "Scenario: scenario_1_compliant",
                    "fields": {
                        "product_name": {"value": "Britannia Glucose D Biscuits", "confidence": 0.98, "source_text": "BRITANNIA GLUCOSE D BISCUITS"},
                        "net_quantity": {"value": "250 g", "normalized": {"amount": 250, "unit": "g"}, "confidence": 0.96, "source_text": "NET QUANTITY: 250 g"},
                        "mrp": {"value": "₹ 25.00", "normalized": {"amount": 25.0, "currency": "INR"}, "confidence": 0.97, "source_text": "MRP Rs. 25.00"},
                        "manufacturer": {"value": "Britannia Industries Ltd, Kolkata 700017", "confidence": 0.94, "source_text": "MFD BY: BRITANNIA INDUSTRIES LTD"},
                        "consumer_care": {"value": "1800-425-4449 / feedback@britannia.co.in", "confidence": 0.93, "source_text": "CONSUMER CARE: 1800-425-4449"},
                        "date_mfg_pkd": {"value": "15/08/2026", "confidence": 0.92, "source_text": "MFG DATE: 15/08/2026"},
                        "country_of_origin": {"value": "India", "confidence": 0.95, "source_text": "COUNTRY OF ORIGIN: INDIA"}
                    },
                    "ocr_lines": [
                        "BRITANNIA GLUCOSE D BISCUITS",
                        "NET QUANTITY: 250 g",
                        "MRP Rs. 25.00",
                        "MFD BY: BRITANNIA INDUSTRIES LTD",
                        "CONSUMER CARE: 1800-425-4449 / feedback@britannia.co.in",
                        "MFG DATE: 15/08/2026",
                        "COUNTRY OF ORIGIN: INDIA"
                    ]
                },
                {
                    "id": "INS-2025-0010",
                    "product_name": "Fortune Sunflower Oil",
                    "product_category": "all_packaged_food",
                    "notes": "Scenario: scenario_3_low_confidence",
                    "fields": {
                        "product_name": {"value": "Fortune Sunflower Oil", "confidence": 0.96, "source_text": "FORTUNE SUNFLOWER OIL"},
                        "net_quantity": {"value": "1 Litre", "normalized": {"amount": 1, "unit": "l"}, "confidence": 0.94, "source_text": "NET VOLUME: 1 Litre"},
                        "mrp": {"value": "₹ 165.00", "normalized": {"amount": 165.0, "currency": "INR"}, "confidence": 0.95, "source_text": "MRP: Rs. 165.00"},
                        "manufacturer": {"value": "Adani Wilmar Ltd, Ahmedabad", "confidence": 0.91, "source_text": "PACKED BY: ADANI WILMAR LTD"},
                        "consumer_care": {"value": "1800-233-9999, care@adaniwilmar.in", "confidence": 0.92, "source_text": "CONSUMER CARE: 1800-233-9999"},
                        "date_mfg_pkd": {"value": "**/2026", "confidence": 0.48, "source_text": "MFG: **/**/2026 (SMUDGED)"},
                        "country_of_origin": {"value": "India", "confidence": 0.93, "source_text": "PRODUCE OF INDIA"}
                    },
                    "ocr_lines": [
                        "FORTUNE SUNFLOWER OIL",
                        "NET VOLUME: 1 Litre",
                        "MRP: Rs. 165.00",
                        "PACKED BY: ADANI WILMAR LTD",
                        "CONSUMER CARE: 1800-233-9999",
                        "MFG: **/**/2026 (SMUDGED)",
                        "PRODUCE OF INDIA"
                    ]
                }
            ]

            for item in sample_items:
                insp = db.query(Inspection).filter_by(id=item["id"]).first()
                if not insp:
                    insp = Inspection(
                        id=item["id"],
                        user_id=user_id,
                        product_name=item["product_name"],
                        product_category=item["product_category"],
                        status="completed",
                        notes=item["notes"]
                    )
                    db.add(insp)
                    db.commit()

                sample_img_path = os.path.join(settings.UPLOAD_DIR, f"{item['id']}.png")
                if not os.path.exists(sample_img_path):
                    from PIL import Image as PImg, ImageDraw
                    img = PImg.new("RGB", (600, 450), color=(254, 240, 138) if "Parle" in item["product_name"] else (241, 245, 249))
                    d = ImageDraw.Draw(img)
                    d.text((40, 40), f"Sample: {item['product_name']}", fill=(15, 23, 42))
                    img.save(sample_img_path)

                if not db.query(Image).filter_by(inspection_id=insp.id).first():
                    img_rec = Image(
                        inspection_id=insp.id,
                        file_path=sample_img_path,
                        storage_url=f"/storage/uploads/{item['id']}.png",
                        image_type="front"
                    )
                    db.add(img_rec)

                if not db.query(OCRResult).filter_by(inspection_id=insp.id).first():
                    ocr_rec = OCRResult(
                        inspection_id=insp.id,
                        raw_lines=item["ocr_lines"],
                        overall_confidence=0.94
                    )
                    db.add(ocr_rec)

                if db.query(ExtractedField).filter_by(inspection_id=insp.id).count() == 0:
                    for fname, finfo in item["fields"].items():
                        frec = ExtractedField(
                            inspection_id=insp.id,
                            field_name=fname,
                            raw_value=str(finfo.get("value")) if finfo.get("value") is not None else None,
                            normalized_value=finfo.get("normalized"),
                            confidence=float(finfo.get("confidence", 0.0)),
                            source_text=finfo.get("source_text")
                        )
                        db.add(frec)

                compliance_results, score_summary = RuleEngineService.evaluate(active_rules, item["fields"])
                
                if db.query(ComplianceResult).filter_by(inspection_id=insp.id).count() == 0:
                    for res in compliance_results:
                        c_rec = ComplianceResult(
                            inspection_id=insp.id,
                            rule_id=res["rule_id"],
                            rule_version=res["rule_version"],
                            field=res["field"],
                            status=res["status"],
                            severity=res["severity"],
                            evidence=res["evidence"],
                            explanation=res["explanation"],
                            detected_value=res["detected_value"],
                            expected_value=res["expected_value"],
                            source_reference=res["source_reference"]
                        )
                        db.add(c_rec)

                if not db.query(ComplianceScore).filter_by(inspection_id=insp.id).first():
                    score_rec = ComplianceScore(
                        inspection_id=insp.id,
                        weighted_score=score_summary["weighted_score"],
                        status_label=score_summary["status_label"],
                        passed_count=score_summary["passed_count"],
                        failed_count=score_summary["failed_count"],
                        review_count=score_summary["review_count"],
                        na_count=score_summary["na_count"]
                    )
                    db.add(score_rec)

                if not db.query(Report).filter_by(inspection_id=insp.id).first():
                    report_data = ReportService.generate_pdf(
                        inspection_id=insp.id,
                        product_name=insp.product_name,
                        product_category=insp.product_category,
                        inspector_name=inspector.name if inspector else "Inspector-01",
                        score_data=score_summary,
                        compliance_results=compliance_results,
                        output_dir=settings.REPORT_DIR
                    )
                    rep_rec = Report(
                        inspection_id=insp.id,
                        pdf_path=report_data["filepath"],
                        pdf_url=report_data["url"],
                        report_hash=report_data["sha256"]
                    )
                    db.add(rep_rec)

            db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
    print("Database initialized and seeded successfully.")
