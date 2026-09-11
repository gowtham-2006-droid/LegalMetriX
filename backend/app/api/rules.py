from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

from app.core.database import get_db
from app.models.entities import ComplianceRule, RuleVersion, User
from app.api.auth import get_current_user

router = APIRouter(prefix="/rules", tags=["Rule Engine Administration"])

class CreateRuleRequest(BaseModel):
    rule_id: str
    rule_name: str
    applicable_category: str = "all_packaged_food"
    requirement: str
    input_field: str
    validation_logic: Dict[str, Any]
    severity: str = "High"  # Critical, High, Medium, Low
    result_if_absent: str = "Fail"
    result_if_low_confidence: str = "Needs Review"
    explanation_template: str
    source_reference: str
    version: str = "1.0"

class UpdateRuleRequest(BaseModel):
    rule_name: Optional[str] = None
    applicable_category: Optional[str] = None
    requirement: Optional[str] = None
    validation_logic: Optional[Dict[str, Any]] = None
    severity: Optional[str] = None
    result_if_absent: Optional[str] = None
    result_if_low_confidence: Optional[str] = None
    explanation_template: Optional[str] = None
    source_reference: Optional[str] = None
    is_active: Optional[bool] = None

@router.get("")
def list_rules(db: Session = Depends(get_db)):
    rules = db.query(ComplianceRule).order_by(ComplianceRule.rule_id.asc()).all()
    return [
        {
            "id": r.id,
            "rule_id": r.rule_id,
            "rule_name": r.rule_name,
            "applicable_category": r.applicable_category,
            "requirement": r.requirement,
            "input_field": r.input_field,
            "validation_logic": r.validation_logic,
            "severity": r.severity,
            "result_if_absent": r.result_if_absent,
            "result_if_low_confidence": r.result_if_low_confidence,
            "explanation_template": r.explanation_template,
            "source_reference": r.source_reference,
            "is_active": r.is_active,
            "version": r.version
        }
        for r in rules
    ]

@router.post("", status_code=status.HTTP_201_CREATED)
def create_rule(
    req: CreateRuleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only administrative users can create compliance rules")

    existing = db.query(ComplianceRule).filter_by(rule_id=req.rule_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Rule ID already exists")

    rule = ComplianceRule(
        rule_id=req.rule_id,
        rule_name=req.rule_name,
        applicable_category=req.applicable_category,
        requirement=req.requirement,
        input_field=req.input_field,
        validation_logic=req.validation_logic,
        severity=req.severity,
        result_if_absent=req.result_if_absent,
        result_if_low_confidence=req.result_if_low_confidence,
        explanation_template=req.explanation_template,
        source_reference=req.source_reference,
        version=req.version,
        is_active=True
    )
    db.add(rule)

    version_log = RuleVersion(
        rule_id=req.rule_id,
        version=req.version,
        config=req.dict(),
        created_by=current_user.email
    )
    db.add(version_log)
    db.commit()
    db.refresh(rule)

    return {"status": "created", "rule_id": rule.rule_id, "version": rule.version}

@router.put("/{rule_id}")
def update_rule(
    rule_id: str,
    req: UpdateRuleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only administrative users can modify compliance rules")

    rule = db.query(ComplianceRule).filter_by(rule_id=rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    update_data = req.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(rule, key, value)

    # Increment minor version on update (e.g. 1.0 -> 1.1)
    try:
        parts = rule.version.split(".")
        new_version = f"{parts[0]}.{int(parts[1]) + 1}"
    except Exception:
        new_version = "1.1"
    
    rule.version = new_version
    rule.updated_at = datetime.utcnow()

    version_log = RuleVersion(
        rule_id=rule.rule_id,
        version=new_version,
        config={
            "rule_name": rule.rule_name,
            "requirement": rule.requirement,
            "validation_logic": rule.validation_logic,
            "severity": rule.severity
        },
        created_by=current_user.email
    )
    db.add(version_log)
    db.commit()

    return {"status": "updated", "rule_id": rule.rule_id, "version": new_version}

@router.get("/{rule_id}/history")
def get_rule_history(rule_id: str, db: Session = Depends(get_db)):
    versions = db.query(RuleVersion).filter_by(rule_id=rule_id).order_by(RuleVersion.created_at.desc()).all()
    return [
        {
            "id": v.id,
            "version": v.version,
            "created_by": v.created_by,
            "created_at": v.created_at.strftime("%d %b %Y, %I:%M %p") if v.created_at else "Recent",
            "config": v.config
        }
        for v in versions
    ]

@router.patch("/{rule_id}/toggle")
def toggle_rule(
    rule_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rule = db.query(ComplianceRule).filter_by(rule_id=rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    rule.is_active = not rule.is_active
    db.commit()
    return {"status": "ok", "rule_id": rule.rule_id, "is_active": rule.is_active}

