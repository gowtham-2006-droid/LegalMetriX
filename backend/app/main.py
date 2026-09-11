from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.core.init_db import init_database
from app.api.auth import router as auth_router
from app.api.inspection import router as inspection_router
from app.api.rules import router as rules_router
from app.api.analytics import router as analytics_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed rules/users on startup
    init_database()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Assisted Compliance Inspection System for Packaged Commodities under Legal Metrology Rules",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local storage for uploaded package images and PDF certificates
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.REPORT_DIR, exist_ok=True)

app.mount("/storage/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")
app.mount("/storage/reports", StaticFiles(directory=settings.REPORT_DIR), name="reports")

# Include API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(inspection_router, prefix=settings.API_V1_STR)
app.include_router(rules_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Legal Metrology Compliance Inspection API",
        "version": "1.0.0"
    }
