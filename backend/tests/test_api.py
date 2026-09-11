import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_demo_accounts_endpoint():
    response = client.get("/api/auth/demo-accounts")
    assert response.status_code == 200
    accounts = response.json()["accounts"]
    assert len(accounts) >= 2
    roles = [a["role"] for a in accounts]
    assert "inspector" in roles
    assert "admin" in roles

def test_demo_scenarios_endpoint():
    response = client.get("/api/demo-scenarios")
    assert response.status_code == 200
    scenarios = response.json()
    assert len(scenarios) == 3
    ids = [s["id"] for s in scenarios]
    assert "scenario_1_compliant" in ids
    assert "scenario_2_missing_care" in ids
    assert "scenario_3_low_confidence" in ids

def test_full_inspection_lifecycle_scenario_1():
    # 1. Create inspection with Scenario 1
    create_res = client.post(
        "/api/inspection",
        json={
            "product_name": "Britannia Glucose D Biscuits",
            "product_category": "biscuits_bakery",
            "scenario_hint": "scenario_1_compliant"
        }
    )
    assert create_res.status_code == 200
    insp_id = create_res.json()["inspection_id"]

    # 2. Trigger analysis
    analyze_res = client.post(f"/api/inspection/{insp_id}/analyze")
    assert analyze_res.status_code == 200
    data = analyze_res.json()
    
    assert data["status"] == "completed"
    assert data["compliance_score"]["weighted_score"] >= 90.0
    assert data["compliance_score"]["status_label"] == "Compliant"
    assert data["compliance_score"]["failed_count"] == 0

    # 3. Verify compliance endpoint
    comp_res = client.get(f"/api/inspection/{insp_id}/compliance")
    assert comp_res.status_code == 200
    assert len(comp_res.json()["results"]) > 0

    # 4. Verify PDF report exists
    rep_res = client.get(f"/api/inspection/{insp_id}/report")
    assert rep_res.status_code == 200
    assert rep_res.headers["content-type"] == "application/pdf"

def test_full_inspection_lifecycle_scenario_2_missing_care():
    # Scenario 2 omits consumer care -> Expect Potentially Non-Compliant
    create_res = client.post(
        "/api/inspection",
        json={
            "product_name": "Royal Masala Chips",
            "product_category": "packaged_snacks",
            "scenario_hint": "scenario_2_missing_care"
        }
    )
    assert create_res.status_code == 200
    insp_id = create_res.json()["inspection_id"]

    analyze_res = client.post(f"/api/inspection/{insp_id}/analyze")
    assert analyze_res.status_code == 200
    data = analyze_res.json()

    assert data["status"] == "completed"
    assert data["compliance_score"]["failed_count"] >= 1
    assert data["compliance_score"]["status_label"] == "Potentially Non-Compliant"

def test_full_inspection_lifecycle_scenario_3_low_confidence():
    # Scenario 3 has smudged date -> Expect Needs Manual Review
    create_res = client.post(
        "/api/inspection",
        json={
            "product_name": "Shuddh Mustard Oil",
            "product_category": "edible_oils",
            "scenario_hint": "scenario_3_low_confidence"
        }
    )
    assert create_res.status_code == 200
    insp_id = create_res.json()["inspection_id"]

    analyze_res = client.post(f"/api/inspection/{insp_id}/analyze")
    assert analyze_res.status_code == 200
    data = analyze_res.json()

    assert data["status"] == "completed"
    assert data["compliance_score"]["review_count"] >= 1
    assert data["compliance_score"]["status_label"] == "Needs Manual Review"
