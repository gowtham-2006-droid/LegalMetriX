from app.models.entities import ComplianceRule
from app.services.rule_engine import RuleEngineService

def test_rule_engine_all_pass():
    rules = [
        ComplianceRule(
            rule_id="LM-MRP-001",
            rule_name="MRP Check",
            applicable_category="all_packaged_food",
            requirement="Must declare MRP",
            input_field="mrp",
            validation_logic={"min_confidence": 0.70},
            severity="Critical",
            result_if_absent="Fail",
            explanation_template="MRP was {status_desc}",
            source_reference="Rule 6(1)(e)",
            version="1.0"
        ),
        ComplianceRule(
            rule_id="LM-QTY-001",
            rule_name="Net Quantity",
            applicable_category="all_packaged_food",
            requirement="Must declare net quantity",
            input_field="net_quantity",
            validation_logic={"min_confidence": 0.70},
            severity="Critical",
            result_if_absent="Fail",
            explanation_template="Net Qty was {status_desc}",
            source_reference="Rule 6(1)(b)",
            version="1.0"
        )
    ]

    extracted = {
        "mrp": {"value": "₹ 50.00", "confidence": 0.95, "source_text": "MRP Rs. 50"},
        "net_quantity": {"value": "500 g", "confidence": 0.92, "source_text": "Net Wt 500 g"}
    }

    results, summary = RuleEngineService.evaluate(rules, extracted)
    assert summary["weighted_score"] == 100.0
    assert summary["status_label"] == "Compliant"
    assert summary["passed_count"] == 2
    assert summary["failed_count"] == 0

def test_rule_engine_missing_critical_declaration():
    rules = [
        ComplianceRule(
            rule_id="LM-CARE-001",
            rule_name="Consumer Care Check",
            applicable_category="all_packaged_food",
            requirement="Must declare helpline/email",
            input_field="consumer_care",
            validation_logic={"min_confidence": 0.60},
            severity="High",
            result_if_absent="Fail",
            explanation_template="Consumer care was {status_desc}",
            source_reference="Rule 6(2)",
            version="1.0"
        )
    ]

    extracted = {
        "consumer_care": {"value": None, "confidence": 0.0, "source_text": None}
    }

    results, summary = RuleEngineService.evaluate(rules, extracted)
    assert summary["weighted_score"] == 0.0
    assert summary["status_label"] == "Potentially Non-Compliant"
    assert summary["failed_count"] == 1
    assert results[0]["status"] == "Fail"

def test_rule_engine_low_confidence_routes_to_review():
    rules = [
        ComplianceRule(
            rule_id="LM-DATE-001",
            rule_name="Date of Mfg Check",
            applicable_category="all_packaged_food",
            requirement="Must declare date of mfg",
            input_field="date_mfg_pkd",
            validation_logic={"min_confidence": 0.70},
            severity="Medium",
            result_if_absent="Fail",
            result_if_low_confidence="Needs Review",
            explanation_template="Date was {status_desc}",
            source_reference="Rule 6(1)(d)",
            version="1.0"
        )
    ]

    # Confidence is 0.48 (<0.50)
    extracted = {
        "date_mfg_pkd": {"value": "**/2026", "confidence": 0.48, "source_text": "MFG: **/**/2026"}
    }

    results, summary = RuleEngineService.evaluate(rules, extracted)
    assert summary["status_label"] == "Needs Manual Review"
    assert summary["review_count"] == 1
    assert results[0]["status"] == "Needs Review"
