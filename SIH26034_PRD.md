# SIH26034 — AI-Assisted Compliance Inspection System for Packaged Commodities under Legal Metrology Rules

**Product Requirements Document (PRD)**
**Team size:** 6 members · **Track:** Smart India Hackathon (SIH) · **Domain:** Legal Metrology / Consumer Affairs

> ⚠️ **Legal disclaimer used throughout this document:** Specific field names, thresholds, and rule text referencing the Legal Metrology (Packaged Commodities) Rules are illustrative only and are marked **"to be verified against the current applicable official regulations/notifications."** This system is a decision-support/screening tool for inspectors, not a source of legal truth. Final compliance determinations remain a human/legal responsibility.

---

## 1. Executive Summary

Legal Metrology inspectors currently verify packaged commodity declarations (MRP, net quantity, manufacturer details, etc.) largely through manual, unaided visual inspection. This is slow, inconsistent across inspectors, hard to audit, and does not scale to the volume of packaged goods in the market.

This project proposes an **AI-assisted inspection system**: an inspector photographs or uploads an image of a packaged commodity, the system uses OCR and AI/NLP to extract label declarations, and a **deterministic, configurable rule engine** evaluates those declarations against applicable Legal Metrology requirements. The system produces a transparent compliance score, a list of passed/failed/needs-review checks with evidence, and a downloadable inspection report — all traceable through an audit trail.

The system is explicitly **not** a chatbot and **not** a legal authority. AI/OCR outputs are treated as uncertain evidence; only the deterministic rule engine issues pass/fail verdicts, and low-confidence results are routed to manual verification rather than auto-flagged as violations.

## 2. Problem Statement

- Legal Metrology enforcement relies on manual, subjective checks of package declarations by inspectors in the field.
- There is no scalable, standardized way to quickly screen a package for missing or invalid mandatory declarations.
- Enforcement records (what was checked, what was found) are often not systematically captured, making audits and appeals difficult.
- Regulations and applicable requirements can change; there is no easy way to update "what to check" without re-training staff.

## 3. Proposed Solution

An end-to-end pipeline — **Image → Preprocessing → OCR → AI/NLP Extraction → Structured Data → Deterministic Rule Engine → Compliance Score → Explainable Report** — implemented as a web application with inspector and administrator roles. The rule engine is data-driven (versioned rule configs), so legal/domain experts can update requirements without code changes. Every decision is logged with full evidence for audit.

## 4. Goals

| # | Goal |
|---|------|
| G1 | Automatically extract key label declarations from a package image with visible confidence scores |
| G2 | Evaluate extracted declarations against a configurable, versioned rule engine — not hardcoded logic |
| G3 | Produce a transparent, explainable compliance score and violation report |
| G4 | Maintain a complete audit trail for every inspection (image → decision) |
| G5 | Flag low-confidence extractions for manual human verification instead of auto-failing them |
| G6 | Ship a working, demoable MVP within a hackathon timeframe with a 6-person team |
| G7 | Keep the architecture modular so each of the 6 members can build/test their module independently |

## 5. Non-Goals

- The system does **not** make final legal/enforcement decisions — it produces "potential non-compliance" flags for human review.
- The system does **not** attempt real-time video/live scanning in the MVP (backlog item only).
- The system does **not** cover IoT/hardware scanning devices, IoT IoT IoT-based weighing integration, IoT-based production line integration, or physical net-quantity verification (weighing) — it is image/label based only.
- The system is not a general-purpose chatbot; the LLM/AI component is only used for extraction, normalization and plain-language explanation, never for issuing compliance verdicts.
- The system does not attempt to cover every packaged-commodity category in India in the MVP; it targets a small, representative set of categories (e.g., biscuits, rice, flour, cooking oil, generic packaged food) to keep scope realistic.
- The system does not store or process any commodity/rule data not related to Legal Metrology labeling declarations (e.g., no nutritional/FSSAI-specific health claims engine, unless explicitly extended later).

## 6. Target Users

| User | Description |
|---|---|
| Legal Metrology Inspector / Enforcement Officer | Field or office-based user who inspects packages, uploads images, reviews AI-generated compliance results, and downloads reports |
| Administrator / Domain Expert | Manages rule configurations, rule versions, users, and reviews analytics/inspection trends |

## 7. User Personas

**Persona 1 — Ravi, Field Inspector (Primary user)**
Conducts market-surveillance visits, inspects dozens of packaged products per visit, has limited time per product, needs quick, trustworthy screening with clear evidence he can act on or escalate.

**Persona 2 — Meena, Legal Metrology Officer / Rule Administrator**
Understands the regulatory requirements, needs to update rule definitions when notifications change, and reviews aggregate compliance trends across inspections for enforcement planning.

## 8. User Journey (Inspector)

1. Inspector logs in → lands on Dashboard.
2. Starts "New Inspection," selects/confirms product category (or lets system suggest one).
3. Uploads or captures a package image (front label, and optionally back/side labels).
4. System shows "Analysis in progress" (OCR → extraction → rule evaluation).
5. Inspector reviews extracted fields with confidence indicators, corrects OCR errors if obviously wrong (human-in-the-loop, "Should Have" scope).
6. Inspector views the Compliance Results screen: overall score, per-requirement pass/fail/needs-review, evidence, severity.
7. Inspector opens Violation Details for any flagged item to see the explainability trail (what was checked → detected → expected → why it failed → rule reference).
8. Inspector downloads/generates a PDF Inspection Report.
9. Inspection is saved to Inspection History for later reference/audit.

## 9. Functional Requirements

### 9.1 Image Capture / Upload
- FR1: User can upload an image file (JPEG/PNG) from device storage.
- FR2: User can capture an image via device camera (browser camera API).
- FR3: System validates file type/size before accepting.
- FR4: (Should Have) Support multiple images per inspection (front + back label).

### 9.2 OCR & Preprocessing
- FR5: System preprocesses the image (deskew, contrast normalization, crop-to-label) before OCR.
- FR6: System runs OCR to produce text tokens with bounding boxes and per-token/per-line confidence.

### 9.3 AI/NLP Extraction
- FR7: System extracts structured candidate fields (product name, MRP, net quantity, manufacturer/packer/importer, address, consumer-care, dates, country of origin, unit) from raw OCR text.
- FR8: Each extracted field carries a confidence score and the source OCR span (for traceability).
- FR9: System normalizes formats (e.g., "Rs.50/-", "₹ 50.00", "MRP: 50" → a canonical MRP value).

### 9.4 Rule Engine & Compliance
- FR10: System determines applicable rule set based on product category.
- FR11: System deterministically evaluates each applicable rule against extracted fields (present/absent, format valid/invalid).
- FR12: Each rule evaluation produces: status (Pass / Fail / Needs Review), severity, evidence, and a plain-language explanation.
- FR13: Rules are stored as versioned, admin-editable configuration — not hardcoded in application logic.

### 9.5 Compliance Scoring
- FR14: System computes an overall compliance score and status label (Compliant / Potentially Non-Compliant / Needs Review) using the weighted methodology in §18.

### 9.6 Reporting
- FR15: System generates a human-readable Inspection Report (on-screen + downloadable PDF) containing all fields in §24.
- FR16: Inspector can view past inspections (history), filter/search by date, product, status.

### 9.7 Administration
- FR17: Admin can create/edit/deprecate rules and rule versions.
- FR18: Admin can manage users and roles.
- FR19: Admin can view aggregate analytics (compliance rates by category, common violations, etc.).

### 9.8 Audit Trail
- FR20: Every inspection stores the full evidence chain (image, OCR output, extracted fields, rule version used, results, timestamps, user) immutably.

## 10. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Explainability | Every automated result must show *what/why* in plain language; no unexplained black-box verdicts |
| Reliability | OCR/extraction failures must degrade gracefully to "needs manual review," never a silent wrong verdict |
| Performance | End-to-end analysis (upload → result) should complete in a target of under ~15–20 seconds for a single image on demo hardware |
| Auditability | All compliance decisions must be reconstructable after the fact from stored evidence |
| Modularity | Each of the 6 members' components must be independently testable via defined interfaces/contracts |
| Security | Uploaded images and inspection data must be access-controlled by authentication/role |
| Usability | Inspector-facing UI must be usable by non-technical enforcement staff with minimal training |
| Extensibility | New product categories and rules must be addable via configuration, not code changes |
| Data Integrity | Compliance decisions must reference the specific rule version used, so later rule updates don't retroactively change historical results |

## 11. End-to-End Workflow

```
Product Image
   ↓
Image Preprocessing (deskew, denoise, crop, contrast)
   ↓
OCR (text + bounding boxes + confidence)
   ↓
AI/NLP Information Extraction (field candidates + confidence + source span)
   ↓
Structured Product Information (normalized JSON record)
   ↓
Legal Metrology Rule Engine (deterministic evaluation against applicable rule set)
   ↓
Compliance Checks → Violations / Missing Information / Needs-Review Items
   ↓
Compliance Score (weighted, severity-aware)
   ↓
Inspection Report (on-screen dashboard + downloadable PDF)
```

## 12. System Architecture

```
┌────────────────────┐
│ Frontend (Next.js)  │  Upload/Capture UI, Results Dashboard, Rule Admin UI
└─────────┬───────────┘
          │ REST/HTTPS (JSON)
┌─────────▼───────────┐
│ Backend API (FastAPI)│  Auth, Orchestration, Inspection lifecycle
└──┬───────┬───────┬──┘
   │       │       │
   ▼       ▼       ▼
┌──────┐ ┌───────────┐ ┌──────────────┐
│Image │ │OCR Service│ │AI/NLP Extract│
│Prep  │ │(PaddleOCR)│ │Service       │
│(CV)  │ └───────────┘ └──────────────┘
└──────┘        │              │
                 └──────┬───────┘
                         ▼
              ┌────────────────────┐
              │ Compliance Rule    │
              │ Engine (deterministic)│
              └─────────┬──────────┘
                         ▼
              ┌────────────────────┐
              │ PostgreSQL / Firebase│  Inspections, Rules, Fields, Audit Logs
              └─────────┬──────────┘
                         ▼
              ┌────────────────────┐
              │ Report Generator    │  PDF/HTML report
              └────────────────────┘

Object/Image Storage (local disk / S3-compatible bucket) referenced by URL from DB.
```

**Component responsibilities**

| Component | Responsibility | Owner (member) |
|---|---|---|
| Frontend | Upload/capture, dashboard, results visualization, rule admin UI | Member 6 |
| Backend API | Auth, request orchestration, persistence, API contracts | Member 5 |
| Image Preprocessing / CV | Deskew, crop, contrast, optional label/region detection | Member 2 |
| OCR Service | Text + bounding boxes + confidence | Member 3 |
| AI/NLP Extraction | Structured field extraction & normalization | Member 1 |
| Rule Engine | Deterministic compliance evaluation | Member 4 |
| Report Generator | PDF/inspection report rendering | Member 5 (with Member 6 for layout) |

## 13. AI/ML Architecture

The system deliberately separates **probabilistic** components (CV/OCR/NLP) from the **deterministic** compliance decision layer.

| Layer | Technology (recommended) | Role | Deterministic? |
|---|---|---|---|
| Computer Vision | OpenCV (mandatory); YOLO only if a genuine region-detection need exists (e.g., locating the label region on a curved/multi-label package) | Preprocessing, optional label-region detection | No (probabilistic) |
| OCR | PaddleOCR (primary; strong multilingual + bounding boxes + confidence); Tesseract as a lightweight fallback | Text + geometry + confidence extraction | No (probabilistic) |
| NLP/Extraction | Regex + rule-based pattern extraction for well-structured fields (MRP, quantity, dates); LLM/API used for the harder unstructured fields (manufacturer/address parsing, plain-language explanation generation) | Converts raw OCR text into structured, normalized fields | No (probabilistic) |
| Named Entity Recognition | Used where useful for manufacturer/address entity spans, if time permits; otherwise regex + LLM is sufficient for MVP | Field boundary detection | No (probabilistic) |
| Compliance Rule Engine | Plain Python rule evaluator reading a versioned rules config (JSON/YAML or DB table) | Final pass/fail/needs-review verdicts | **Yes (deterministic)** |

**Explicit boundary:** the LLM may *extract* and *explain in plain language*, but it never independently decides compliance status — that is always computed by the rule engine from structured, confidence-scored fields. This boundary should be visibly enforced in code (the LLM extraction service and the rule engine service are separate modules with a typed interface between them).

Avoid unnecessary AI: e.g., MRP and net-quantity detection can often be done reliably with regex over OCR text plus simple normalization, rather than a heavyweight NLP model — reserve LLM calls for genuinely ambiguous text (addresses, free-text declarations, explanation generation).

## 14. OCR Pipeline

1. **Input:** preprocessed image (from CV stage).
2. **Engine:** PaddleOCR (supports multilingual + angle classification + bounding boxes + line/word confidence out of the box).
3. **Output contract** (passed to extraction stage):
```json
{
  "image_id": "string",
  "lines": [
    {
      "text": "MRP Rs.50/-",
      "bbox": [[x1,y1],[x2,y2],[x3,y3],[x4,y4]],
      "confidence": 0.94
    }
  ],
  "overall_confidence": 0.88
}
```
4. **Fallback strategy:** if OCR confidence for a region is below threshold, the region is marked `low_confidence` and surfaced to the inspector for manual verification rather than silently dropped or guessed.

## 15. Computer Vision Pipeline

1. Input validation (file type, resolution minimum, size limits).
2. Deskew / perspective correction (helps OCR accuracy on angled photos).
3. Contrast/brightness normalization, denoising.
4. Crop to package/label region (simple contour-based crop for MVP; YOLO-based label detection as a "Could Have" if the team has bandwidth and a labeled dataset).
5. Output: a cleaned image (and, if applicable, bounding box of the detected label region) passed to OCR.

CV Should **not** attempt product classification or defect detection in MVP unless trivially achievable — keep scope to "make OCR work well."

## 16. Information Extraction Pipeline

| Field | Extraction approach | Notes |
|---|---|---|
| Product name | Heuristic (largest/prominent text block) + LLM disambiguation | Often the biggest text on the OCR result |
| MRP | Regex over currency patterns (₹, Rs., INR) near "MRP" keyword | High regex reliability |
| Net quantity | Regex over numeric + unit (g, kg, ml, l, etc.) near "Net Qty"/"Net Weight" keyword | Normalize to a canonical unit |
| Manufacturer/packer/importer | Keyword-anchored text block ("Mfd by", "Packed by", "Marketed by", "Imported by") + LLM parsing of the following text block | Free text — most LLM-dependent field |
| Address | LLM-assisted parsing of text following manufacturer keyword | Free text |
| Consumer care details | Keyword anchor ("Consumer Care", "Customer Care", helpline/email patterns) | Regex for phone/email, keyword anchor for presence |
| Date of manufacture/packing | Regex over date patterns near "Mfg Date"/"Pkd Date" | Multiple date formats must be normalized |
| Best before / expiry | Regex + keyword anchor, where applicable to category | Conditional field |
| Country of origin | Keyword anchor ("Country of Origin", "Made in") | Conditional field, more relevant for imported goods |
| Unit of quantity | Extracted jointly with net quantity | — |

Each extracted field record:
```json
{
  "field": "net_quantity",
  "value": "500 g",
  "normalized_value": { "amount": 500, "unit": "g" },
  "confidence": 0.91,
  "source_text": "Net Wt. 500 g",
  "source_bbox": [[..]]
}
```

## 17. Legal Metrology Rule Engine

### 17.1 Design Principles
- Rules are **data**, not code — stored as versioned records (DB table or YAML/JSON config loaded into DB) so admins/domain experts can update them without redeploying the app.
- Every evaluation is deterministic given (extracted fields + rule version).
- The engine never "guesses" — if a required input field is missing or low-confidence, the result is `Needs Review`, not `Fail`, unless the rule config explicitly says absence = fail (e.g., a mandatory field genuinely absent from the image at high OCR confidence).

### 17.2 Rule Record Schema

| Attribute | Description |
|---|---|
| `rule_id` | Unique identifier (e.g., `LM-CONSUMER-CARE-001`) |
| `rule_name` | Human-readable name |
| `applicable_category` | Product category or "all" |
| `requirement` | Plain-language statement of the requirement |
| `input_field` | Which extracted field(s) this rule evaluates |
| `validation_logic` | Type: `presence`, `format`, `range`, `conditional` + parameters |
| `severity` | `Critical` / `High` / `Medium` / `Low` |
| `evidence_required` | What evidence must be shown (e.g., matched OCR span) |
| `result` | `Pass` / `Fail` / `Needs Review` / `Not Applicable` |
| `explanation_template` | Template string used to generate the plain-language explanation |
| `source_reference` | Citation to the applicable rule/notification — **marked "to be verified against current applicable official regulations/notifications"** |
| `version` | Rule version number, with effective-from date |

### 17.3 Example Rule (illustrative only)

```json
{
  "rule_id": "LM-CONSUMER-CARE-001",
  "rule_name": "Consumer Care Details Present",
  "applicable_category": "all_packaged_food",
  "requirement": "Package must declare consumer care/contact details.",
  "input_field": "consumer_care",
  "validation_logic": { "type": "presence", "min_confidence": 0.6 },
  "severity": "High",
  "result_if_absent": "Fail",
  "result_if_low_confidence": "Needs Review",
  "explanation_template": "Consumer-care information was not detected in the submitted package image. This field is flagged for review under the applicable declaration requirements.",
  "source_reference": "To be verified against current applicable official Legal Metrology (Packaged Commodities) regulations/notifications.",
  "version": "1.0"
}
```

### 17.4 Worked Example

**Input:** MRP = ₹50, Net Quantity = 500 g, Manufacturer = Present, Consumer Care = Missing

**Output:**
| Field | Status | Evidence |
|---|---|---|
| MRP | ✅ Pass | "MRP Rs.50/-" detected, confidence 0.95 |
| Net Quantity | ✅ Pass | "Net Wt. 500 g" detected, confidence 0.93 |
| Manufacturer | ✅ Pass | Manufacturer block detected |
| Consumer Care | ❌ Fail (High severity) | Not detected — "Potential Non-Compliance" |

## 18. Compliance Scoring

### 18.1 Why a simple percentage is not sufficient

A naive `passed / total_applicable_checks` score treats a missing MRP the same as a missing but non-critical formatting nuance. This is misleading because:
- Not all requirements carry equal legal weight (a missing MRP is far more serious than a minor address-formatting issue).
- Conditional requirements should not penalize a product where they don't apply.
- Low-confidence OCR/extraction should not be scored the same as a confidently-verified failure — a "needs review" item is different from a confirmed violation.
- A single Critical failure can matter more than several minor ones.

### 18.2 Recommended Methodology

1. Determine the **applicable check set** for the product's category (exclude non-applicable conditional checks).
2. Each check resolves to one of: `Pass`, `Fail`, `Needs Review`, `Not Applicable`.
3. Assign a severity weight, e.g.: Critical = 4, High = 3, Medium = 2, Low = 1 (weights configurable by admin).
4. **Weighted score** =
   `(Σ weight of Passed checks) / (Σ weight of all applicable checks) × 100`
5. `Needs Review` checks are excluded from both numerator and denominator of the primary score, but are shown separately as "N items require manual verification" — they must never silently count as either pass or fail.
6. **Status label** (not just a number):
   - **Compliant** — no Critical/High fails, score ≥ configurable threshold (e.g., 90%).
   - **Potentially Non-Compliant** — one or more Fail results (especially Critical/High).
   - **Needs Manual Review** — no confirmed fails, but one or more Needs-Review items exist.
7. Always show the underlying counts (Passed / Failed / Needs Review / Not Applicable) alongside the percentage — never show the score without this breakdown, so the inspector can interpret it correctly.

This keeps the score simple to read ("82%, Potentially Non-Compliant") while being fair to severity and confidence.

## 19. Explainability

For every rule result, the system must render the following chain:

```
What was checked?  →  What was detected?  →  What was expected?  →  Why it failed?  →  Which rule was applied?
```

Example rendering:
> **Checked:** Consumer-care declaration presence
> **Detected:** No consumer-care text found in the image
> **Expected:** A consumer-care contact (phone/email/address) declaration
> **Why flagged:** Consumer-care information was not detected in the submitted package image; this field is required and is therefore flagged for review.
> **Rule applied:** LM-CONSUMER-CARE-001 (v1.0)

Language guidelines (mandatory):
- Use **"Potential non-compliance"**, not "violation confirmed" or "illegal."
- Use **"Not detected"**, not "does not exist on package."
- Use **"Requires manual verification"** for low-confidence results.
- Never render an AI/OCR result as an absolute legal conclusion.

## 20. Confidence & Human Verification

| Confidence source | What it measures | Threshold strategy |
|---|---|---|
| OCR confidence | Per-line/word text recognition confidence | Below threshold (e.g., <0.6) → field marked `low_confidence`, routed to Needs Review |
| Extraction confidence | Confidence that the extracted text was correctly mapped to the right field | Below threshold → Needs Review, even if OCR confidence was high |
| Rule validation confidence | Whether the deterministic check itself had complete/clean inputs | If required input is missing/low-confidence, rule result = Needs Review, not Fail |

**Threshold strategy (illustrative, tune during testing):**
- `≥ 0.80` → treated as reliable, rule engine evaluates normally.
- `0.5 – 0.79` → flagged as "Low-confidence extraction," rule result forced to `Needs Review` regardless of pass/fail outcome.
- `< 0.5` → field treated as effectively "not extracted"; if the field is mandatory, result is `Needs Review` (not `Fail`) with a prompt for manual entry/re-capture.

This guarantees the system never auto-declares non-compliance purely because OCR failed to read a clearly-present label — it always routes uncertainty to a human.

## 21. Database Design

### 21.1 Core Entities & Relationships

```
Users (1)───(N) Inspections
Inspections (1)───(N) Images
Inspections (1)───(1) OCRResults  (aggregated per inspection, or 1-N if multi-image)
Inspections (1)───(N) ExtractedFields
Inspections (1)───(N) ComplianceResults
ComplianceResults (N)───(1) ComplianceRules (via rule_id + rule_version)
Inspections (1)───(1) ComplianceScore
Inspections (1)───(N) AuditLogs
Inspections (1)───(1) Reports
ComplianceRules (1)───(N) RuleVersions
```

### 21.2 Schema Summary

| Table | Key Columns |
|---|---|
| `users` | id, name, email, password_hash, role (`inspector`/`admin`), created_at |
| `products` (optional lightweight lookup) | id, category, description |
| `inspections` | id, user_id, product_category, status, created_at, updated_at |
| `images` | id, inspection_id, storage_url, image_type (front/back), uploaded_at |
| `ocr_results` | id, inspection_id, image_id, raw_output(JSON), overall_confidence |
| `extracted_fields` | id, inspection_id, field_name, value, normalized_value(JSON), confidence, source_bbox(JSON) |
| `compliance_rules` | id, rule_id, rule_name, applicable_category, requirement, input_field, validation_logic(JSON), severity, explanation_template, source_reference, current_version |
| `rule_versions` | id, rule_id, version, config(JSON), effective_from, created_by |
| `compliance_results` | id, inspection_id, rule_id, rule_version, status(Pass/Fail/NeedsReview/NA), evidence(JSON), explanation |
| `compliance_scores` | id, inspection_id, weighted_score, status_label, passed_count, failed_count, review_count, na_count |
| `reports` | id, inspection_id, pdf_url, generated_at |
| `audit_logs` | id, inspection_id, user_id, action, details(JSON), timestamp |

## 22. API Specification

Base path: `/api`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/inspection` | Create a new inspection (returns `inspection_id`) |
| POST | `/inspection/{id}/image` | Upload image(s) for an inspection |
| POST | `/inspection/{id}/analyze` | Trigger the OCR → extraction → rule engine pipeline |
| GET | `/inspection/{id}` | Get inspection summary/status |
| GET | `/inspection/{id}/ocr` | Get raw OCR output |
| GET | `/inspection/{id}/extracted-data` | Get structured extracted fields |
| GET | `/inspection/{id}/compliance` | Get compliance results + score |
| GET | `/inspection/{id}/report` | Get/generate the PDF report |
| GET | `/inspections` | List inspections (paginated, filterable) |
| GET | `/rules` | List active compliance rules |
| POST | `/rules` (admin) | Create a new rule |
| PUT | `/rules/{rule_id}` (admin) | Update/version a rule |
| GET | `/analytics` (admin) | Aggregate compliance analytics |

**Example: `POST /api/inspection/{id}/analyze` response**
```json
{
  "inspection_id": "insp_123",
  "status": "completed",
  "compliance_score": {
    "weighted_score": 82.0,
    "status_label": "Potentially Non-Compliant",
    "passed_count": 4,
    "failed_count": 1,
    "review_count": 1,
    "na_count": 0
  },
  "results": [
    {
      "rule_id": "LM-CONSUMER-CARE-001",
      "field": "consumer_care",
      "status": "Fail",
      "severity": "High",
      "evidence": "Not detected in OCR output",
      "explanation": "Consumer-care information was not detected in the submitted package image."
    }
  ]
}
```

## 23. UI/UX Requirements

For each screen: Purpose, Main components, User actions, Data displayed, API dependencies, Empty/Loading/Error states.

| Screen | Purpose | Key components | Main API(s) |
|---|---|---|---|
| Login | Authenticate user | Email/password form, role-based redirect | Auth endpoint |
| Dashboard | Overview of recent activity | Recent inspections, quick-start button, summary stats | `GET /inspections` |
| New Inspection | Start an inspection, select category | Category selector, "start" button | `POST /inspection` |
| Image Upload/Capture | Get the package image | File picker, camera capture widget, preview | `POST /inspection/{id}/image` |
| Analysis Progress | Show pipeline progress | Stepper (Preprocessing → OCR → Extraction → Rules), loading state | `POST /inspection/{id}/analyze` |
| Extracted Information | Show what was read from the label | Field list with confidence badges, source-image highlight | `GET /inspection/{id}/extracted-data` |
| Compliance Results | Show verdicts | Score card, status label, results table (Pass/Fail/Review) | `GET /inspection/{id}/compliance` |
| Violation Details | Explainability drill-down | What/Detected/Expected/Why/Rule reference panel | `GET /inspection/{id}/compliance` |
| Image with Highlights | Visual evidence | Image with bounding boxes overlaid, color-coded by status | `GET /inspection/{id}/ocr` |
| Inspection Report | Final formatted report | Printable/downloadable summary | `GET /inspection/{id}/report` |
| Inspection History | Browse past inspections | Table/list, filters (date, category, status), search | `GET /inspections` |
| Analytics (admin) | Trends across inspections | Charts: compliance rate by category, common violations | `GET /analytics` |
| Rule Management (admin) | Edit rule configs | Rule list, edit form, version history | `GET/POST/PUT /rules` |
| Settings | Account/app settings | Profile, password change, (admin) thresholds config | User endpoints |

**Common states (every data screen must define):**
- *Empty:* "No inspections yet — start your first inspection."
- *Loading:* Skeleton loaders / progress stepper.
- *Error:* Clear message + retry action (e.g., "OCR failed — please retry or upload a clearer image").

## 24. Inspection Report

**Contents (on-screen and PDF):**
- Product name/category, inspection date/time, inspector name
- Overall status label + compliance score (with breakdown: passed/failed/needs-review/N-A counts)
- Full results table: Requirement | Status | Evidence | Severity | OCR Confidence
- Recommended action per failed/needs-review item
- Rule/source reference per item (marked "to be verified" where applicable)
- Original and/or annotated package image
- Audit metadata: rule versions used, timestamp, system version

Example rendering:

```
PRODUCT: XYZ Biscuit          Compliance Score: 82%
STATUS: ⚠️ POTENTIALLY NON-COMPLIANT

| Requirement       | Status     | Evidence            | Severity |
|--------------------|-----------|----------------------|----------|
| MRP                | ✅ Pass    | ₹50                  | Critical |
| Net Quantity       | ✅ Pass    | 500 g                | Critical |
| Manufacturer       | ✅ Pass    | ABC Foods            | High     |
| Consumer Care      | ❌ Missing | Not detected         | High     |
| Date Information   | ⚠️ Review  | Low OCR confidence   | Medium   |
```

## 25. Security & Privacy

- Authentication required for all API routes; role-based authorization (inspector vs admin) enforced server-side.
- Uploaded images stored in access-controlled object storage; signed/expiring URLs rather than public links.
- Input validation on all uploads (file type allow-list, max size, basic image-format verification) to prevent malicious file uploads.
- Standard API security practices: HTTPS only, rate limiting on analyze endpoint, parameterized queries (no SQL injection surface), JWT or session-based auth.
- Data retention: define a retention policy for images/inspection data appropriate to enforcement recordkeeping needs (kept realistic/simple for MVP — e.g., retain indefinitely with admin-only deletion, logged).
- Audit logging on all admin actions (rule edits, user management) in addition to inspection audit trail.

## 26. Audit Trail

Every inspection immutably stores:
- Original image, processed image
- Raw OCR output (text, bounding boxes, confidence)
- Extracted fields (with confidence and source spans)
- Rule version(s) executed and their configuration at time of evaluation
- Compliance results and final score
- Timestamp and inspecting user
- Final generated report

Rule updates create a **new rule version**; historical inspections always reference the version active at inspection time, so results remain reproducible even after rules change later — essential for a government-oriented, defensible audit trail.

## 27. Testing Strategy

| Test type | Focus | Example metric |
|---|---|---|
| Unit testing | Individual functions (regex extractors, scoring formula, rule evaluator) | Code coverage on rule engine |
| OCR testing | Text recognition accuracy across sample images | OCR word/line accuracy % |
| Extraction accuracy | Field-level extraction correctness vs. ground truth | Field extraction accuracy % (precision/recall per field) |
| Rule-engine testing | Correct verdicts given known structured inputs | Rule accuracy % (unit tests per rule with synthetic inputs) |
| API testing | Endpoint contracts, error handling | Pass/fail per endpoint test suite |
| Frontend testing | Component rendering, user flows | Manual + basic component tests |
| End-to-end testing | Full pipeline on real sample images | False positive rate, false negative rate, avg. processing time |

**Test dataset strategy:** collect/curate a small labeled set (~30–50 images) spanning: biscuit packets, rice packets, flour packets, cooking oil bottles, and one generic packaged food category; include varied conditions — good lighting, low lighting, slight blur, angled/perspective shots, curved packaging — with manually annotated ground-truth field values for accuracy scoring.

## 28. Dataset Strategy

- Source images: team-captured photos of real retail packages (with permission/own purchases) across the target categories, supplemented by publicly available product images where licensing allows.
- Ground truth: manually transcribe the actual label values for each sample image into a small spreadsheet/JSON ground-truth file, used to compute OCR/extraction/rule accuracy metrics.
- Diversity: vary lighting, angle, and image quality intentionally so the "needs review / low confidence" pathway can be demonstrated, not just the happy path.
- No synthetic/generated label images should be used as if they were real regulatory evidence in the demo — keep demo images real or clearly-labeled as illustrative mockups.

## 29. MVP Scope

**Must Have (MVP)**
- Single-image upload
- Basic image preprocessing (deskew/contrast)
- OCR via PaddleOCR
- Extraction of core fields (MRP, net quantity, manufacturer, consumer care, dates)
- Deterministic rule engine (configurable rules for a small set of categories)
- Compliance score + status label
- Results dashboard (Pass/Fail/Needs Review table)
- PDF report generation
- Inspection history list
- Basic auth (inspector/admin roles)

**Should Have**
- Multi-image per inspection (front + back)
- Bounding-box visualization on the image
- Visible confidence scores throughout the UI
- Improved product-category classification
- Multi-language OCR support
- Basic analytics dashboard

**Could Have**
- Live camera scanning (continuous frame analysis)
- Advanced YOLO-based label/region detection
- Automatic product categorization via ML classifier
- Advanced multilingual NLP extraction
- Structured human-in-the-loop correction workflow (edit-and-resubmit)
- Advanced analytics/trend detection

**Won't Have (MVP)**
- IoT/hardware weighing integration
- Physical net-quantity verification
- Full national coverage of all packaged-commodity categories
- Legally binding enforcement/e-challan issuance workflows
- Offline/mobile native app (web-responsive only for MVP)
- Automated regulation-change detection (rule updates remain manual/admin-driven)

## 30. Future Scope

- Expand category coverage and rule library with legal domain expert review.
- Mobile-native app for field inspectors with offline capture and later sync.
- Integration with an official Legal Metrology case-management/enforcement system.
- Human-in-the-loop correction feeding back into extraction model improvement.
- Multi-language OCR/NLP for regional-language packaging.
- Batch/bulk inspection mode for warehouse-level surveillance.

## 31. Six-Member Task Division

| Member | Focus | Responsibilities | Deliverables | Depends on (input) | Must expose (output) |
|---|---|---|---|---|---|
| **1 — AI/NLP** | Field extraction & normalization | Build extraction service converting OCR text → structured fields with confidence; format normalization (currency, dates, units) | Extraction service + API contract, normalization utilities, LLM-explanation helper | OCR output (Member 3) | Structured field JSON (to Member 4 & 5) |
| **2 — Computer Vision** | Image preprocessing | Deskew, contrast/denoise, crop-to-label, optional YOLO label-region detection | Preprocessing service/module | Raw uploaded image (Member 5) | Cleaned image (to Member 3) |
| **3 — OCR** | Text recognition | Integrate PaddleOCR, tune preprocessing handoff, expose bounding boxes + confidence | OCR service + API contract | Preprocessed image (Member 2) | OCR JSON (to Member 1) |
| **4 — Legal Metrology / Rule Engine** | Regulatory logic | Research applicable requirements (flagged "to be verified"), model rules, build deterministic evaluator + scoring | Rule config schema, rule set (JSON/DB), rule engine module, scoring function | Structured fields (Member 1) | Compliance results + score (to Member 5) |
| **5 — Backend** | Integration & APIs | FastAPI app, auth, DB schema, orchestrate pipeline calls, report generation | Backend service, all REST endpoints (§22), PDF report generator | All service modules | REST API (to Member 6) |
| **6 — Frontend** | UI/UX | Next.js dashboard: upload flow, results visualization, rule admin UI, history | Full frontend app | Backend API (Member 5) | — |

Each member owns: responsibilities, deliverables, testing responsibilities (unit tests for their module), and clearly documents their API/interface contract so others can build against a mock before integration.

## 32. 7-Day MVP Development Plan (parallel tracks)

| Day | Member 1 (AI/NLP) | Member 2 (CV) | Member 3 (OCR) | Member 4 (Rule Engine) | Member 5 (Backend) | Member 6 (Frontend) |
|---|---|---|---|---|---|---|
| 1 | Define field schema | Set up OpenCV pipeline skeleton | Integrate PaddleOCR, test on samples | Research requirements, draft rule schema | Set up FastAPI skeleton, DB schema | Set up Next.js project, wireframes |
| 2 | Build regex extractors (MRP, qty, dates) | Deskew + contrast normalization | Tune OCR params, output bbox+confidence | Model 8–10 rules for 2 categories | Auth + inspection CRUD endpoints | Login + Dashboard screens |
| 3 | Build manufacturer/address extraction (LLM-assisted) | Crop-to-label logic | Confidence thresholding, fallback logic | Build deterministic evaluator | Image upload endpoint + storage | Upload/capture screen |
| 4 | Normalization (units, currency, dates) | Integration testing with OCR | Integration testing with CV | Build scoring formula (§18) | `/analyze` orchestration endpoint | Analysis progress + extracted-info screens |
| 5 | Integrate extraction service into backend | Polish + edge-case handling | Polish + edge-case handling | Integrate rule engine into backend | Wire full pipeline end-to-end | Compliance results + violation detail screens |
| 6 | Bug fixing, accuracy tuning on test set | Bug fixing | Bug fixing | Rule tuning against test set | Report generator (PDF), history endpoint | Report view, history screen, image-highlight view |
| 7 | Final integration testing | Final integration testing | Final integration testing | Final integration testing | Final integration, deploy | Final polish, demo rehearsal, admin rule screen (if time) |

**Dependency chain:** CV → OCR → NLP Extraction → Rule Engine → Backend orchestration → Frontend, with each pair (e.g., Member 2↔3, Member 3↔1, Member 1↔4) agreeing on a JSON contract on Day 1 so they can build against mocks in parallel rather than waiting on each other.

## 33. Risks & Mitigation

| Risk | Mitigation |
|---|---|
| Poor image quality / blurry text | Preprocessing pipeline (denoise/deskew); low-confidence routing to manual review instead of failing outright |
| Curved packaging distorting text | Perspective-correction step in CV pipeline; accept as a known limitation for MVP, flag as needs-review |
| Multiple languages on label | Use PaddleOCR's multilingual support where feasible; scope MVP to English/primary-language labels, note regional-language support as future scope |
| OCR errors (misread characters) | Confidence thresholds + human verification workflow; regex validation of expected formats (e.g., currency patterns) catches obviously wrong reads |
| Incorrect AI extraction (wrong field mapping) | Keyword-anchored extraction reduces ambiguity; confidence score + source span shown to inspector for quick visual verification |
| Ambiguous declarations | Route to "Needs Review" rather than forcing a Pass/Fail guess |
| Changing regulations | Rule engine is versioned/configurable data, not hardcoded logic — admin can update without redeploying |
| Incorrect rule interpretation (during modeling) | All rule source references marked "to be verified against current applicable official regulations/notifications"; recommend legal/domain expert review before any real-world use |
| False compliance decisions | Deterministic rule engine (not LLM) makes final verdicts; conservative confidence thresholds bias toward "needs review" over false Pass/Fail |
| Lack of sufficient training/test data | Curate a small but diverse real-image test set (§28) rather than relying on synthetic data for validation |
| Team integration risk (6 parallel workstreams) | Agree JSON contracts on Day 1; each member builds against mocked interfaces before final integration |

## 34. SIH Demo Scenarios

**Scenario 1 — Fully Compliant Product**
Inspector uploads a clear, well-lit image of a packaged biscuit product with all mandatory declarations clearly visible. System extracts all fields with high confidence, rule engine passes all applicable checks, score shows ~100%, status "Compliant."

**Scenario 2 — Missing Declaration**
Inspector uploads an image where the consumer-care details are absent from the label (e.g., an older/non-compliant package or a cropped image). System correctly extracts other fields, flags consumer-care as Fail (High severity), score drops accordingly, status "Potentially Non-Compliant," with full explainability trail shown.

**Scenario 3 — Invalid/Ambiguous Declaration**
Inspector uploads an image where the MRP is present but in an invalid/inconsistent format (e.g., illegible, contradictory values, or oddly formatted), or a date field has genuinely low OCR confidence due to a smudge. System flags this as "Needs Review" (not auto-fail), demonstrating the confidence-and-human-verification pathway.

**Demo flow for judges:** run Scenario 1 → Scenario 2 → Scenario 3 back-to-back on the live dashboard, showing the same clean UI producing three meaningfully different, correctly-explained outcomes — this best demonstrates both the AI pipeline and the deterministic/explainable rule engine.

## 35. SIH Judging / Innovation Points

- Addresses a **real, underserved government enforcement problem** (Legal Metrology screening at scale).
- Combines **Computer Vision + OCR + AI/NLP + a deterministic rule engine** — a genuinely multi-disciplinary technical stack, not AI for its own sake.
- **Explainable AI**: every automated result is traceable to specific evidence and a specific rule.
- **Human-in-the-loop design**: low-confidence results are routed to inspectors, not silently auto-decided — appropriate for a legally sensitive domain.
- **Auditability**: full evidence chain stored per inspection, with versioned rules — suitable for a government/enforcement context where decisions may be challenged or reviewed later.
- **Scalable, modular architecture**: rule engine is configuration-driven, so the system can be extended to new product categories/regulatory changes without redevelopment.
- **Realistic scope**: acknowledges what the system does *not* decide (final legal enforcement), which shows regulatory-domain maturity rather than overclaiming AI capability.

## 36. Success Metrics

| Metric | Target (hackathon demo context) |
|---|---|
| OCR line/word accuracy on test set | ≥ 85% on clear images |
| Field extraction accuracy (per mandatory field) | ≥ 80% on test set |
| Rule engine correctness (unit-tested against synthetic inputs) | 100% on defined test cases (deterministic logic) |
| End-to-end processing time per image | ≤ ~15–20 seconds on demo hardware |
| False "Fail" rate on clearly-compliant test images | As close to 0% as possible (bias toward Needs Review over false Fail) |
| Demo reliability | 3/3 demo scenarios run successfully without manual intervention |

## 37. Final Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React) + Tailwind CSS |
| Backend | Python + FastAPI |
| Computer Vision | OpenCV (+ optional YOLO if a labeled dataset and time permit) |
| OCR | PaddleOCR (primary), Tesseract (fallback) |
| NLP/Extraction | Regex + rule-based extraction + LLM API (for unstructured fields & explanation text) |
| Rule Engine | Custom Python deterministic evaluator, rules stored as versioned config |
| Database | PostgreSQL (preferred) or Firebase (faster hackathon setup) |
| Image/Object Storage | Local disk (demo) / S3-compatible bucket (if deployed) |
| Report Generation | PDF generation library (e.g., a Python PDF/HTML-to-PDF toolchain) |
| Auth | JWT-based session auth with role-based access control |
| Hosting (demo) | Vercel (frontend) + a Python-compatible host for backend (e.g., Render/Railway) or a single VM |

---

### Appendix — Key Implementation Reminders for the Team

1. Never let the LLM output a Pass/Fail/compliance verdict directly — only the rule engine does that.
2. Every UI surface showing a violation must show evidence + rule reference, not just a red "Fail."
3. Low OCR/extraction confidence always routes to "Needs Review," never an automatic "Fail."
4. All specific Legal Metrology field/requirement text must be validated by a team member against the current official regulations/notifications before the final demo — this PRD's rule content is a structural starting point, not verified legal text.
5. Keep the MVP scope disciplined — a working, explainable, 3-scenario-demoable pipeline beats a partially-working system with more features.
