from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.entities import Inspection, ComplianceScore, ComplianceResult

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("")
def get_analytics(db: Session = Depends(get_db)):
    total_inspections = db.query(Inspection).count()
    
    # Scores
    scores = db.query(ComplianceScore).all()
    compliant_count = sum(1 for s in scores if s.status_label == "Compliant")
    non_compliant_count = sum(1 for s in scores if s.status_label == "Potentially Non-Compliant")
    review_count = sum(1 for s in scores if s.status_label == "Needs Manual Review")

    avg_score = round(sum(s.weighted_score for s in scores) / max(len(scores), 1), 1) if scores else 0.0

    # Common violations (Failed items in compliance_results)
    violations_query = (
        db.query(ComplianceResult.field, func.count(ComplianceResult.id))
        .filter(ComplianceResult.status == "Fail")
        .group_by(ComplianceResult.field)
        .all()
    )
    common_violations = [
        {"field": row[0], "count": row[1]}
        for row in violations_query
    ]

    # Category breakdown
    categories_query = (
        db.query(Inspection.product_category, func.count(Inspection.id))
        .group_by(Inspection.product_category)
        .all()
    )
    categories = [
        {"category": row[0], "count": row[1]}
        for row in categories_query
    ]

    return {
        "summary": {
            "total_inspections": total_inspections,
            "compliant_count": compliant_count,
            "non_compliant_count": non_compliant_count,
            "review_count": review_count,
            "compliance_rate": round((compliant_count / max(total_inspections, 1)) * 100, 1),
            "average_weighted_score": avg_score
        },
        "common_violations": common_violations,
        "categories": categories
    }
