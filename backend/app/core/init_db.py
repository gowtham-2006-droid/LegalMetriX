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
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
    print("Database initialized and seeded successfully.")
