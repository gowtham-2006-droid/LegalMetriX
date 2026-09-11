# SIH26034 — AI-Assisted Compliance Inspection System for Packaged Commodities

> **Domain:** Legal Metrology / Consumer Affairs  
> **Track:** Smart India Hackathon (SIH) · Problem Statement ID: SIH26034  
> **Target Regulations:** Legal Metrology (Packaged Commodities) Rules — Mandatory Label Declarations (Rule 6)

### 🌐 Live Cloud Deployments
- **Frontend (Vercel):** [https://legalmetrix-kappa.vercel.app](https://legalmetrix-kappa.vercel.app)
- **Backend (Render):** [https://render.com/deploy?repo=https://github.com/gowtham-2006-droid/LegalMetriX](https://render.com/deploy?repo=https://github.com/gowtham-2006-droid/LegalMetriX)
- **GitHub Repository:** [https://github.com/gowtham-2006-droid/LegalMetriX](https://github.com/gowtham-2006-droid/LegalMetriX)


---

## 📌 Executive Summary

Legal Metrology enforcement currently relies on manual, unaided visual inspection of packaged commodities (MRP, net quantity, manufacturer address, consumer care helpline, dates). This system provides an **AI-assisted decision-support screening platform**:
- **Field Inspector Interface:** Upload package images or capture live photos via camera.
- **Computer Vision & OCR:** Automated contrast enhancement (CLAHE), deskew orientation correction, and token-level geometry extraction.
- **AI/NLP Extraction:** Cloud LLM (Groq `llama-3.3-70b-versatile`) + resilient regex extractors for structured attributes.
- **Deterministic Rule Engine:** 100% data-driven, versioned rules evaluating compliance (LLM never decides pass/fail).
- **PRD §18 Severity-Weighted Scoring:** Transparent score and categorical status (`Compliant`, `Potentially Non-Compliant`, `Needs Manual Review`).
- **Explainability Audit Trail:** Traceable evidence chain (`Checked → Detected → Expected → Why Flagged → Legal Citation`).
- **Official PDF Inspection Certificate:** Tamper-evident, cryptographically hashed (SHA-256) downloadable report.

---

## 👥 6-Member Team Modular Architecture

| Member | Focus Area | Module | Implementation File(s) |
|---|---|---|---|
| **Member 1** | AI/NLP | Extraction & Normalization | [`backend/app/services/nlp_service.py`](file:///c:/Users/gowth/OneDrive/Desktop/SIH%20hackathon%20project/backend/app/services/nlp_service.py) |
| **Member 2** | Computer Vision | Image Preprocessing & Deskew | [`backend/app/services/cv_service.py`](file:///c:/Users/gowth/OneDrive/Desktop/SIH%20hackathon%20project/backend/app/services/cv_service.py) |
| **Member 3** | OCR Service | Text & Bounding Box Recognition | [`backend/app/services/ocr_service.py`](file:///c:/Users/gowth/OneDrive/Desktop/SIH%20hackathon%20project/backend/app/services/ocr_service.py) |
| **Member 4** | Rule Engine | Deterministic Logic & Scoring | [`backend/app/services/rule_engine.py`](file:///c:/Users/gowth/OneDrive/Desktop/SIH%20hackathon%20project/backend/app/services/rule_engine.py) |
| **Member 5** | Backend & Reporting | REST APIs, DB & PDF Generator | [`backend/app/api/`](file:///c:/Users/gowth/OneDrive/Desktop/SIH%20hackathon%20project/backend/app/api/), [`report_service.py`](file:///c:/Users/gowth/OneDrive/Desktop/SIH%20hackathon%20project/backend/app/services/report_service.py) |
| **Member 6** | Frontend UI/UX | Next.js Inspector Dashboard | [`frontend/app/`](file:///c:/Users/gowth/OneDrive/Desktop/SIH%20hackathon%20project/frontend/app/) |

---

## 🚀 Quick Start (Local Setup on Windows)

### 1. Run Backend Service (FastAPI)
Double-click `run_backend.bat` or run:
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Docs will be available at: **http://127.0.0.1:8000/docs**

### 2. Run Inspector Frontend (Next.js)
Double-click `run_frontend.bat` or run:
```bash
cd frontend
npm.cmd run dev
```
Open your browser at: **http://localhost:3000**

---

## ⚡ 1-Click SIH Judge Demo Scenarios

On the application dashboard, evaluators can click any of the 3 pre-calibrated test cases:

1. **Scenario 1 — Fully Compliant Biscuit Packet:**
   - *Product:* Britannia Glucose D Biscuits
   - *Verdicts:* MRP (₹25.00), Net Qty (250 g), Manufacturer, Helpline & Email, Mfg Date all verified.
   - *Result:* **100% Score — Compliant**

2. **Scenario 2 — Missing Consumer Care Declaration:**
   - *Product:* Royal Masala Chips
   - *Verdicts:* Mandatory customer grievance helpline/email is absent from label declarations.
   - *Result:* **Potentially Non-Compliant (High Severity Failure)**

3. **Scenario 3 — Ambiguous / Low Confidence OCR Date:**
   - *Product:* Shuddh Mustard Oil
   - *Verdicts:* Smudged manufacturing date stamp produces low OCR confidence (<0.50).
   - *Result:* **Needs Manual Review** (Demonstrates human-in-the-loop safety; system never falsely auto-penalizes blurred text).

---

## 🧪 Automated Test Suite

Run unit and integration tests covering the rule engine, regex extractors, and end-to-end API lifecycle:
```bash
cd backend
python -m pytest tests
```
*Result: 10 passed across all modules in ~1.1s.*

---

## ⚙️ Configuration (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | SQLite or Supabase/PostgreSQL connection string | `sqlite:///./compliance.db` |
| `GROQ_API_KEY` | Optional Groq API Key for cloud LLM extraction | *(Uses regex fallback if empty)* |
| `JWT_SECRET_KEY` | Secret key for inspector auth tokens | Pre-configured |
| `GROQ_MODEL` | Groq LLM model name | `llama-3.3-70b-versatile` |

---

## 📜 Statutory Legal Disclaimer
*Specific field names, thresholds, and rule text referencing the Legal Metrology (Packaged Commodities) Rules are decision-support screening heuristics and are to be verified against current applicable official notifications. Final enforcement determinations remain a human/legal responsibility.*
