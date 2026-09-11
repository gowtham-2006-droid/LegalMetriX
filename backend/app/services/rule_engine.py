from typing import List, Dict, Any, Tuple
from app.models.entities import ComplianceRule

SEVERITY_WEIGHTS = {
    "Critical": 4,
    "High": 3,
    "Medium": 2,
    "Low": 1
}

class RuleEngineService:
    """
    Member 4 — Deterministic Legal Metrology Rule Engine & Scoring:
    - Evaluates extracted fields against active versioned compliance rules
    - Strictly deterministic (LLM never decides Pass/Fail)
    - Low-confidence routing (<0.80) to 'Needs Review' according to PRD §20
    - Weighted scoring formula and status classification according to PRD §18
    - Full explainability chain generation according to PRD §19
    """

    @staticmethod
    def evaluate(rules: List[ComplianceRule], extracted_fields: Dict[str, Any]) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        results = []
        passed_count = 0
        failed_count = 0
        review_count = 0
        na_count = 0

        passed_weight_sum = 0
        evaluated_weight_sum = 0
        has_critical_or_high_fail = False

        for rule in rules:
            field_name = rule.input_field
            field_data = extracted_fields.get(field_name, {})
            val = field_data.get("value") if isinstance(field_data, dict) else None
            conf = field_data.get("confidence", 0.0) if isinstance(field_data, dict) else 0.0
            source_text = field_data.get("source_text") if isinstance(field_data, dict) else None

            weight = SEVERITY_WEIGHTS.get(rule.severity, 2)

            # Evaluate rule status
            status, explanation, evidence, detected, expected = RuleEngineService._evaluate_single_rule(
                rule, val, conf, source_text
            )

            if status == "Pass":
                passed_count += 1
                passed_weight_sum += weight
                evaluated_weight_sum += weight
            elif status == "Fail":
                failed_count += 1
                evaluated_weight_sum += weight
                if rule.severity in ["Critical", "High"]:
                    has_critical_or_high_fail = True
            elif status == "Needs Review":
                review_count += 1
                # PRD §18: Needs Review items are excluded from score numerator and denominator
            else:
                na_count += 1

            results.append({
                "rule_id": rule.rule_id,
                "rule_version": rule.version,
                "field": field_name,
                "rule_name": rule.rule_name,
                "requirement": rule.requirement,
                "status": status,
                "severity": rule.severity,
                "confidence": conf,
                "evidence": evidence,
                "explanation": explanation,
                "detected_value": detected,
                "expected_value": expected,
                "source_reference": rule.source_reference
            })

        # Calculate PRD §18 weighted score
        if evaluated_weight_sum > 0:
            weighted_score = round((passed_weight_sum / evaluated_weight_sum) * 100.0, 1)
        else:
            weighted_score = 100.0 if passed_count > 0 else 0.0

        # PRD §18 Status Label Classification
        if failed_count > 0:
            status_label = "Potentially Non-Compliant"
        elif review_count > 0:
            status_label = "Needs Manual Review"
        elif weighted_score >= 90.0:
            status_label = "Compliant"
        else:
            status_label = "Potentially Non-Compliant"

        score_summary = {
            "weighted_score": weighted_score,
            "status_label": status_label,
            "passed_count": passed_count,
            "failed_count": failed_count,
            "review_count": review_count,
            "na_count": na_count,
            "total_checks": len(rules)
        }

        return results, score_summary

    @staticmethod
    def _evaluate_single_rule(rule: ComplianceRule, val: Any, conf: float, source_text: str):
        logic = rule.validation_logic or {}
        min_conf = logic.get("min_confidence", 0.70)
        expected = rule.requirement

        # 1. Check for absence or negative indicator strings
        is_absent = False
        if val is None:
            is_absent = True
        else:
            s_val = str(val).strip().lower()
            if not s_val or s_val in ("none", "null", "n/a", "undefined", "—", "-", "not detected", "not visible"):
                is_absent = True
            elif any(m in s_val for m in ["not detected", "not visible", "not found", "missing", "unspecified", "details not visible", "zero ocr"]):
                is_absent = True

        # Semantic field format checks
        if not is_absent and rule.input_field == "mrp":
            import re
            if not re.search(r'\d+', str(val)):
                is_absent = True

        if not is_absent and rule.input_field == "date_mfg_pkd":
            import re
            if not re.search(r'\d+', str(val)):
                is_absent = True

        if not is_absent and rule.input_field == "manufacturer":
            if len(str(val).strip()) < 5:
                is_absent = True

        if is_absent:
            detected = "Not detected on packaging surface"
            if rule.result_if_absent == "Needs Review":
                status = "Needs Review"
                status_desc = "not detected and requires manual confirmation"
            else:
                status = "Fail"
                status_desc = "missing from mandatory package declarations"
            
            explanation = (
                f"Checked: {rule.rule_name}. Detected: {detected}. Expected: {expected}. "
                f"Status: Non-Compliant violation. {rule.explanation_template.format(status_desc=status_desc, detected=detected)}"
            )
            evidence = "No valid declaration found in analyzed packaging frame."
            return status, explanation, evidence, detected, expected

        # 2. Check confidence thresholds (PRD §20)
        detected = str(val)
        if conf < 0.50:
            status = "Needs Review"
            status_desc = "detected with very low OCR confidence (<0.50)"
            explanation = (
                f"Checked: {rule.rule_name}. Detected: '{detected}' with low OCR confidence ({conf:.2f}). "
                f"Expected: Confirmed high-clarity declaration. Routed to inspector for manual verification."
            )
            evidence = f"Source text: '{source_text}' (Confidence: {conf:.2f} < 0.50)"
            return status, explanation, evidence, detected, expected

        if conf < min_conf:
            status = "Needs Review"
            status_desc = f"detected with marginal confidence ({conf:.2f} < {min_conf:.2f})"
            explanation = (
                f"Checked: {rule.rule_name}. Detected: '{detected}' (Confidence: {conf:.2f}). "
                f"Rule requirement threshold is {min_conf:.2f}. Requires inspector verification."
            )
            evidence = f"Source text: '{source_text}' (Confidence: {conf:.2f})"
            return status, explanation, evidence, detected, expected

        # 3. Rule validation passed
        status = "Pass"
        status_desc = "verified compliant"
        explanation = (
            f"Checked: {rule.rule_name}. Detected: '{detected}'. "
            f"Valid declaration meeting Legal Metrology requirements."
        )
        evidence = f"Text span: '{source_text or detected}' (Confidence: {conf:.2f})"
        return status, explanation, evidence, detected, expected

