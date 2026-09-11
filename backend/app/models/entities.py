import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="inspector")  # 'inspector' or 'admin'
    created_at = Column(DateTime, default=datetime.utcnow)

    inspections = relationship("Inspection", back_populates="user", cascade="all, delete-orphan")


class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    product_name = Column(String(255), nullable=True, default="Unknown Commodity")
    product_category = Column(String(100), default="all_packaged_food")
    status = Column(String(30), default="draft")  # draft, processing, completed, failed
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="inspections")
    images = relationship("Image", back_populates="inspection", cascade="all, delete-orphan")
    ocr_result = relationship("OCRResult", back_populates="inspection", uselist=False, cascade="all, delete-orphan")
    extracted_fields = relationship("ExtractedField", back_populates="inspection", cascade="all, delete-orphan")
    compliance_results = relationship("ComplianceResult", back_populates="inspection", cascade="all, delete-orphan")
    score = relationship("ComplianceScore", back_populates="inspection", uselist=False, cascade="all, delete-orphan")
    report = relationship("Report", back_populates="inspection", uselist=False, cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="inspection", cascade="all, delete-orphan")


class Image(Base):
    __tablename__ = "images"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=False)
    file_path = Column(String(500), nullable=False)
    storage_url = Column(String(500), nullable=False)
    image_type = Column(String(50), default="front")  # front, back, nutrition
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    inspection = relationship("Inspection", back_populates="images")


class OCRResult(Base):
    __tablename__ = "ocr_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=False)
    raw_lines = Column(JSON, nullable=False, default=list)
    overall_confidence = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    inspection = relationship("Inspection", back_populates="ocr_result")


class ExtractedField(Base):
    __tablename__ = "extracted_fields"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=False)
    field_name = Column(String(100), nullable=False)
    raw_value = Column(Text, nullable=True)
    normalized_value = Column(JSON, nullable=True)
    confidence = Column(Float, default=0.0)
    source_text = Column(Text, nullable=True)
    source_bbox = Column(JSON, nullable=True)
    is_edited_by_user = Column(Boolean, default=False)

    inspection = relationship("Inspection", back_populates="extracted_fields")


class ComplianceRule(Base):
    __tablename__ = "compliance_rules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rule_id = Column(String(100), unique=True, index=True, nullable=False)
    rule_name = Column(String(200), nullable=False)
    applicable_category = Column(String(100), default="all_packaged_food")
    requirement = Column(Text, nullable=False)
    input_field = Column(String(100), nullable=False)
    validation_logic = Column(JSON, nullable=False)
    severity = Column(String(50), default="High")  # Critical, High, Medium, Low
    result_if_absent = Column(String(30), default="Fail")
    result_if_low_confidence = Column(String(30), default="Needs Review")
    explanation_template = Column(Text, nullable=False)
    source_reference = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    version = Column(String(20), default="1.0")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class RuleVersion(Base):
    __tablename__ = "rule_versions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rule_id = Column(String(100), nullable=False)
    version = Column(String(20), nullable=False)
    config = Column(JSON, nullable=False)
    effective_from = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String(100), default="admin")


class ComplianceResult(Base):
    __tablename__ = "compliance_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=False)
    rule_id = Column(String(100), nullable=False)
    rule_version = Column(String(20), default="1.0")
    field = Column(String(100), nullable=False)
    status = Column(String(30), nullable=False)  # Pass, Fail, Needs Review, Not Applicable
    severity = Column(String(30), nullable=False)  # Critical, High, Medium, Low
    evidence = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    detected_value = Column(Text, nullable=True)
    expected_value = Column(Text, nullable=True)
    source_reference = Column(Text, nullable=True)

    inspection = relationship("Inspection", back_populates="compliance_results")


class ComplianceScore(Base):
    __tablename__ = "compliance_scores"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=False)
    weighted_score = Column(Float, default=0.0)
    status_label = Column(String(50), default="Needs Manual Review")  # Compliant, Potentially Non-Compliant, Needs Manual Review
    passed_count = Column(Integer, default=0)
    failed_count = Column(Integer, default=0)
    review_count = Column(Integer, default=0)
    na_count = Column(Integer, default=0)
    calculated_at = Column(DateTime, default=datetime.utcnow)

    inspection = relationship("Inspection", back_populates="score")


class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=False)
    pdf_path = Column(String(500), nullable=False)
    pdf_url = Column(String(500), nullable=False)
    report_hash = Column(String(64), nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)

    inspection = relationship("Inspection", back_populates="report")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=True)
    user_id = Column(String(36), nullable=True)
    action = Column(String(100), nullable=False)  # CREATED, ANALYZED, OVERRIDDEN, REPORT_GENERATED
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    inspection = relationship("Inspection", back_populates="audit_logs")
