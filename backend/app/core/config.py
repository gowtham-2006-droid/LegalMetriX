import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Legal Metrology Compliance Inspection System (SIH26034)"
    API_V1_STR: str = "/api"
    
    # DB URL - defaults to sqlite if unset or empty
    DATABASE_URL: str = "sqlite:///./compliance.db"
    
    # Groq API for Qwen Vision model & NLP extraction
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_VISION_MODEL: str = "qwen/qwen3.6-27b"
    GROQ_MODEL: str = "qwen/qwen3.6-27b"
    
    # JWT Auth
    JWT_SECRET_KEY: str = "sih-hackathon-super-secret-key-2026-compliance-metrology"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Storage paths
    UPLOAD_DIR: str = "./storage/uploads"
    REPORT_DIR: str = "./storage/reports"
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

# Ensure storage directories exist
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
Path(settings.REPORT_DIR).mkdir(parents=True, exist_ok=True)
