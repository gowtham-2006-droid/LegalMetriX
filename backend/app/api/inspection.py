import os
import shutil
import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.core.config import settings
from app.models.entities import (
    User, Inspection, Image, OCRResult, ExtractedField,
    ComplianceRule, ComplianceResult, ComplianceScore, Report, AuditLog
)
from app.api.auth import get_current_user
from app.services.cv_service import ComputerVisionService
from app.services.ocr_service import OCRService
from app.services.nlp_service import NLPService
from app.services.rule_engine import RuleEngineService
from app.services.report_service import ReportService
from app.data.sample_scenarios import DEMO_SCENARIOS

router = APIRouter(tags=["Inspections"])

class CreateInspectionRequest(BaseModel):
    product_name: Optional[str] = "Packaged Commodity"
    product_category: str = "all_packaged_food"
    scenario_hint: Optional[str] = None
    notes: Optional[str] = None

@router.get("/demo-scenarios")
def list_demo_scenarios():
    return [
        {
            "id": s["id"],
            "title": s["title"],
            "category": s["category"],
            "badge": s["badge"],
            "badge_color": s["badge_color"],
            "description": s["description"]
        }
        for s in DEMO_SCENARIOS.values()
    ]

@router.post("/inspection")
def create_inspection(
    req: CreateInspectionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    insp = Inspection(
        user_id=current_user.id,
        product_name=req.product_name,
        product_category=req.product_category,
        notes=req.notes or (f"Scenario: {req.scenario_hint}" if req.scenario_hint else None),
        status="draft"
    )
    db.add(insp)
    
    # Audit log
    audit = AuditLog(
        inspection_id=insp.id,
        user_id=current_user.id,
        action="INSPECTION_CREATED",
        details={"product_name": req.product_name, "category": req.product_category}
    )
    db.add(audit)
    db.commit()
    db.refresh(insp)

    # If a scenario_hint was specified, attach mock image
    if req.scenario_hint and req.scenario_hint in DEMO_SCENARIOS:
        sample_path = os.path.join(settings.UPLOAD_DIR, f"{req.scenario_hint}.png")
        # Ensure dummy file exists
        if not os.path.exists(sample_path):
            from PIL import Image as PImg, ImageDraw
            img = PImg.new("RGB", (600, 500), color=(245, 247, 250))
            d = ImageDraw.Draw(img)
            d.text((40, 40), f"Sample: {req.scenario_hint}", fill=(15, 23, 42))
            img.save(sample_path)

        img_record = Image(
            inspection_id=insp.id,
            file_path=sample_path,
            storage_url=f"/storage/uploads/{req.scenario_hint}.png",
            image_type="front",
            width=600,
            height=500
        )
        db.add(img_record)
        db.commit()

    return {
        "inspection_id": insp.id,
        "product_name": insp.product_name,
        "product_category": insp.product_category,
        "status": insp.status,
        "created_at": insp.created_at
    }

@router.post("/inspection/{id}/image")
async def upload_inspection_image(
    id: str,
    file: Optional[UploadFile] = File(None),
    scenario_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    insp = db.query(Inspection).filter(Inspection.id == id).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found")

    if scenario_id and scenario_id in DEMO_SCENARIOS:
        # Preloaded scenario selected
        filename = f"{scenario_id}.png"
        dest_path = os.path.join(settings.UPLOAD_DIR, filename)
        if not os.path.exists(dest_path):
            from PIL import Image as PImg, ImageDraw
            img = PImg.new("RGB", (600, 500), color=(241, 245, 249))
            d = ImageDraw.Draw(img)
            d.text((40, 40), f"Scenario: {scenario_id}", fill=(15, 23, 42))
            img.save(dest_path)
        
        insp.notes = f"Scenario: {scenario_id}"
        img_record = Image(
            inspection_id=insp.id,
            file_path=dest_path,
            storage_url=f"/storage/uploads/{filename}",
            image_type="front"
        )
        db.add(img_record)
        db.commit()
        return {"status": "success", "image_id": img_record.id, "url": img_record.storage_url}

    if not file:
        raise HTTPException(status_code=400, detail="No file or scenario provided")

    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload JPG or PNG.")

    unique_filename = f"{id}_{uuid.uuid4().hex[:8]}{ext}"
    dest_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    img_record = Image(
        inspection_id=insp.id,
        file_path=dest_path,
        storage_url=f"/storage/uploads/{unique_filename}",
        image_type="front"
    )
    db.add(img_record)
    db.commit()
    db.refresh(img_record)

    return {"status": "success", "image_id": img_record.id, "url": img_record.storage_url}

@router.post("/inspection/{id}/analyze")
def analyze_inspection(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    insp = db.query(Inspection).filter(Inspection.id == id).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found")

    image = db.query(Image).filter(Image.inspection_id == id).order_by(Image.uploaded_at.desc()).first()
    if not image:
        raise HTTPException(status_code=400, detail="No package image uploaded for this inspection")

    scenario_hint = None
    if insp.notes and "Scenario: " in insp.notes:
        scenario_hint = insp.notes.split("Scenario: ")[1].strip()

    insp.status = "processing"
    db.commit()

    # Step 1: CV Preprocessing
    cv_info = ComputerVisionService.preprocess_image(image.file_path, settings.UPLOAD_DIR)

    # Step 2: OCR Extraction
    ocr_data = OCRService.extract_text(cv_info["processed_path"], scenario_hint=scenario_hint)
    
    # Save OCR Results
    existing_ocr = db.query(OCRResult).filter_by(inspection_id=id).first()
    if existing_ocr:
        db.delete(existing_ocr)
    
    ocr_record = OCRResult(
        inspection_id=id,
        raw_lines=ocr_data["lines"],
        overall_confidence=ocr_data["overall_confidence"]
    )
    db.add(ocr_record)

    # Step 3: AI / NLP Field Extraction & Normalization
    # Check if scenario has pre-annotated fields
    if scenario_hint and scenario_hint in DEMO_SCENARIOS:
        extracted = DEMO_SCENARIOS[scenario_hint]["fields"]
    else:
        extracted = NLPService.extract_fields(ocr_data["lines"], insp.product_category)

    # Save Extracted Fields
    db.query(ExtractedField).filter_by(inspection_id=id).delete()
    for field_name, f_info in extracted.items():
        if isinstance(f_info, dict):
            field_rec = ExtractedField(
                inspection_id=id,
                field_name=field_name,
                raw_value=str(f_info.get("value")) if f_info.get("value") is not None else None,
                normalized_value=f_info.get("normalized"),
                confidence=float(f_info.get("confidence", 0.0)),
                source_text=f_info.get("source_text"),
                source_bbox=f_info.get("source_bbox")
            )
            db.add(field_rec)

    # Update product name if detected
    if extracted.get("product_name") and extracted["product_name"].get("value"):
        insp.product_name = extracted["product_name"]["value"]

    # Step 4: Deterministic Compliance Rule Evaluation
    active_rules = db.query(ComplianceRule).filter_by(is_active=True).all()
    compliance_results, score_summary = RuleEngineService.evaluate(active_rules, extracted)

    # Save Compliance Results
    db.query(ComplianceResult).filter_by(inspection_id=id).delete()
    for res in compliance_results:
        res_rec = ComplianceResult(
            inspection_id=id,
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
        db.add(res_rec)

    # Save Compliance Score
    existing_score = db.query(ComplianceScore).filter_by(inspection_id=id).first()
    if existing_score:
        db.delete(existing_score)

    score_rec = ComplianceScore(
        inspection_id=id,
        weighted_score=score_summary["weighted_score"],
        status_label=score_summary["status_label"],
        passed_count=score_summary["passed_count"],
        failed_count=score_summary["failed_count"],
        review_count=score_summary["review_count"],
        na_count=score_summary["na_count"]
    )
    db.add(score_rec)

    # Step 5: Generate PDF Certificate
    report_data = ReportService.generate_pdf(
        inspection_id=id,
        product_name=insp.product_name,
        product_category=insp.product_category,
        inspector_name=current_user.name,
        score_data=score_summary,
        compliance_results=compliance_results,
        output_dir=settings.REPORT_DIR
    )

    existing_report = db.query(Report).filter_by(inspection_id=id).first()
    if existing_report:
        db.delete(existing_report)

    report_rec = Report(
        inspection_id=id,
        pdf_path=report_data["filepath"],
        pdf_url=report_data["url"],
        report_hash=report_data["sha256"]
    )
    db.add(report_rec)

    # Audit Trail Entry
    audit = AuditLog(
        inspection_id=id,
        user_id=current_user.id,
        action="INSPECTION_ANALYZED",
        details={
            "score": score_summary["weighted_score"],
            "status": score_summary["status_label"],
            "hash": report_data["sha256"]
        }
    )
    db.add(audit)

    insp.status = "completed"
    db.commit()

    return {
        "inspection_id": id,
        "status": "completed",
        "compliance_score": score_summary,
        "results": compliance_results,
        "pdf_url": report_data["url"]
    }

@router.get("/inspection/{id}")
def get_inspection(id: str, db: Session = Depends(get_db)):
    insp = db.query(Inspection).filter(Inspection.id == id).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found")

    image = db.query(Image).filter(Image.inspection_id == id).order_by(Image.uploaded_at.desc()).first()
    score = db.query(ComplianceScore).filter(ComplianceScore.inspection_id == id).first()
    report = db.query(Report).filter(Report.inspection_id == id).first()

    return {
        "id": insp.id,
        "product_name": insp.product_name,
        "product_category": insp.product_category,
        "status": insp.status,
        "notes": insp.notes,
        "created_at": insp.created_at,
        "image_url": image.storage_url if image else None,
        "pdf_url": report.pdf_url if report else None,
        "compliance_score": {
            "weighted_score": score.weighted_score,
            "status_label": score.status_label,
            "passed_count": score.passed_count,
            "failed_count": score.failed_count,
            "review_count": score.review_count,
            "na_count": score.na_count
        } if score else None
    }

@router.get("/inspection/{id}/ocr")
def get_inspection_ocr(id: str, db: Session = Depends(get_db)):
    ocr = db.query(OCRResult).filter(OCRResult.inspection_id == id).first()
    if not ocr:
        raise HTTPException(status_code=404, detail="OCR results not found for this inspection")
    return {
        "inspection_id": id,
        "overall_confidence": ocr.overall_confidence,
        "lines": ocr.raw_lines
    }

@router.get("/inspection/{id}/extracted-data")
def get_inspection_extracted_data(id: str, db: Session = Depends(get_db)):
    fields = db.query(ExtractedField).filter(ExtractedField.inspection_id == id).all()
    return {
        "inspection_id": id,
        "fields": [
            {
                "field_name": f.field_name,
                "value": f.raw_value,
                "normalized_value": f.normalized_value,
                "confidence": f.confidence,
                "source_text": f.source_text,
                "source_bbox": f.source_bbox,
                "is_edited_by_user": f.is_edited_by_user
            }
            for f in fields
        ]
    }

@router.get("/inspection/{id}/compliance")
def get_inspection_compliance(id: str, db: Session = Depends(get_db)):
    score = db.query(ComplianceScore).filter(ComplianceScore.inspection_id == id).first()
    results = db.query(ComplianceResult).filter(ComplianceResult.inspection_id == id).all()
    
    if not score:
        raise HTTPException(status_code=404, detail="Compliance evaluation not yet completed")

    return {
        "inspection_id": id,
        "compliance_score": {
            "weighted_score": score.weighted_score,
            "status_label": score.status_label,
            "passed_count": score.passed_count,
            "failed_count": score.failed_count,
            "review_count": score.review_count,
            "na_count": score.na_count
        },
        "results": [
            {
                "rule_id": r.rule_id,
                "rule_version": r.rule_version,
                "field": r.field,
                "status": r.status,
                "severity": r.severity,
                "evidence": r.evidence,
                "explanation": r.explanation,
                "detected_value": r.detected_value,
                "expected_value": r.expected_value,
                "source_reference": r.source_reference
            }
            for r in results
        ]
    }

@router.get("/inspection/{id}/report")
def download_inspection_report(id: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.inspection_id == id).first()
    if not report or not os.path.exists(report.pdf_path):
        raise HTTPException(status_code=404, detail="PDF Report not found")
    
    return FileResponse(
        report.pdf_path,
        media_type="application/pdf",
        filename=os.path.basename(report.pdf_path)
    )

@router.get("/inspections")
def list_inspections(
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Inspection)
    if status and status != "all":
        query = query.filter(Inspection.status == status)
    if search:
        query = query.filter(Inspection.product_name.ilike(f"%{search}%"))
    
    inspections = query.order_by(Inspection.created_at.desc()).limit(limit).all()
    
    output = []
    for insp in inspections:
        score = db.query(ComplianceScore).filter_by(inspection_id=insp.id).first()
        image = db.query(Image).filter_by(inspection_id=insp.id).first()
        output.append({
            "id": insp.id,
            "product_name": insp.product_name,
            "product_category": insp.product_category,
            "status": insp.status,
            "created_at": insp.created_at,
            "image_url": image.storage_url if image else None,
            "score": score.weighted_score if score else None,
            "status_label": score.status_label if score else None
        })
    return output
