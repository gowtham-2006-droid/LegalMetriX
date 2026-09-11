import re
import json
from typing import List, Dict, Any, Optional
from app.core.config import settings

class NLPService:
    """
    Member 1 — AI/NLP Extraction & Normalization Service:
    - Extracts structured candidate fields from OCR tokens
    - Uses Groq Cloud LLM (llama-3.3-70b-versatile) for complex entities & address parsing
    - Resilient regex-first fallback for MRP, Net Quantity, Dates, Units, and Contacts
    - Traceable source span and confidence scores per extracted field
    """

    @staticmethod
    def extract_fields(ocr_lines: List[Dict[str, Any]], product_category: str = "all_packaged_food") -> Dict[str, Any]:
        combined_text = "\n".join([line["text"] for line in ocr_lines])
        
        # 1. Attempt Groq Cloud LLM extraction if GROQ_API_KEY is configured
        if settings.GROQ_API_KEY and settings.GROQ_API_KEY.strip():
            groq_result = NLPService._extract_with_groq(combined_text, product_category)
            if groq_result:
                # Merge with geometry from OCR
                return NLPService._attach_source_spans(groq_result, ocr_lines)

        # 2. Resilient Rule-Based / Regex Extraction Fallback
        return NLPService._extract_with_regex(ocr_lines, combined_text)

    @staticmethod
    def _extract_with_groq(ocr_text: str, category: str) -> Optional[Dict[str, Any]]:
        try:
            from groq import Groq
            client = Groq(api_key=settings.GROQ_API_KEY)

            system_prompt = (
                "You are an expert AI parser for Indian Legal Metrology (Packaged Commodities) labeling declarations. "
                "Analyze the OCR text extracted from a product label and extract the mandatory fields strictly in JSON format. "
                "Do NOT decide legal compliance. Extract only what is present. If a field is missing, set value to null and confidence to 0.0.\n"
                "JSON format required:\n"
                "{\n"
                '  "product_name": {"value": "string or null", "confidence": float},\n'
                '  "net_quantity": {"value": "string or null", "normalized": {"amount": float, "unit": "g/kg/ml/l/piece"}, "confidence": float},\n'
                '  "mrp": {"value": "string or null", "normalized": {"amount": float, "currency": "INR"}, "confidence": float},\n'
                '  "manufacturer": {"value": "name and full address or null", "confidence": float},\n'
                '  "consumer_care": {"value": "helpline phone or email or null", "confidence": float},\n'
                '  "date_mfg_pkd": {"value": "MM/YYYY or DD/MM/YYYY or null", "confidence": float},\n'
                '  "country_of_origin": {"value": "string or null", "confidence": float}\n'
                "}"
            )

            completion = client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Category: {category}\nOCR Text:\n{ocr_text}"}
                ],
                response_format={"type": "json_object"},
                temperature=0.1
            )

            raw_json = completion.choices[0].message.content
            return json.loads(raw_json)
        except Exception as e:
            print(f"Groq extraction failed or offline, falling back to regex: {e}")
            return None

    @staticmethod
    def _extract_with_regex(ocr_lines: List[Dict[str, Any]], combined_text: str) -> Dict[str, Any]:
        results = {}

        # 1. Product Name (usually first dominant text or keywords)
        first_line = ocr_lines[0]["text"] if ocr_lines else "Packaged Commodity"
        results["product_name"] = {
            "value": first_line.title(),
            "confidence": round(ocr_lines[0]["confidence"], 2) if ocr_lines else 0.85,
            "source_text": first_line,
            "source_bbox": ocr_lines[0]["bbox"] if ocr_lines else None
        }

        # 2. Net Quantity
        qty_pattern = re.compile(r'(?:NET\s*(?:WT|WEIGHT|QTY|QUANTITY|VOL|VOLUME)?[:.\s-]*)?(\d+(?:\.\d+)?)\s*(kg|g|gm|gms|ml|l|ltr|litre|pieces|units)\b', re.IGNORECASE)
        qty_match = None
        for line in ocr_lines:
            match = qty_pattern.search(line["text"])
            if match:
                amount = float(match.group(1))
                unit = match.group(2).lower()
                # Standardize units
                if unit in ["gm", "gms"]:
                    unit = "g"
                elif unit in ["ltr", "litre"]:
                    unit = "l"
                qty_match = {
                    "value": f"{match.group(1)} {unit}",
                    "normalized": {"amount": amount, "unit": unit},
                    "confidence": round(line["confidence"], 2),
                    "source_text": line["text"],
                    "source_bbox": line["bbox"]
                }
                break

        results["net_quantity"] = qty_match or {
            "value": None,
            "normalized": None,
            "confidence": 0.0,
            "source_text": None,
            "source_bbox": None
        }

        # 3. MRP
        mrp_pattern = re.compile(r'(?:MRP|M\.R\.P|MAX\s*RETAIL\s*PRICE)?[:.\s-]*(?:₹|Rs\.?|INR)?\s*([0-9]+(?:\.[0-9]{2})?)', re.IGNORECASE)
        mrp_match = None
        for line in ocr_lines:
            if "MRP" in line["text"].upper() or "RS." in line["text"].upper() or "₹" in line["text"]:
                match = mrp_pattern.search(line["text"])
                if match and match.group(1):
                    val = float(match.group(1))
                    mrp_match = {
                        "value": f"₹ {val:.2f}",
                        "normalized": {"amount": val, "currency": "INR"},
                        "confidence": round(line["confidence"], 2),
                        "source_text": line["text"],
                        "source_bbox": line["bbox"]
                    }
                    break

        results["mrp"] = mrp_match or {
            "value": None,
            "normalized": None,
            "confidence": 0.0,
            "source_text": None,
            "source_bbox": None
        }

        # 4. Manufacturer / Packer
        mfg_pattern = re.compile(r'(?:MFD\s*BY|MANUFACTURED\s*BY|PACKED\s*BY|PKD\s*BY|MARKETED\s*BY)[:.\s-]*(.+)', re.IGNORECASE)
        mfg_match = None
        for line in ocr_lines:
            match = mfg_pattern.search(line["text"])
            if match:
                mfg_match = {
                    "value": line["text"],
                    "confidence": round(line["confidence"], 2),
                    "source_text": line["text"],
                    "source_bbox": line["bbox"]
                }
                break

        results["manufacturer"] = mfg_match or {
            "value": None,
            "confidence": 0.0,
            "source_text": None,
            "source_bbox": None
        }

        # 5. Consumer Care
        care_pattern = re.compile(r'(?:CONSUMER\s*CARE|CUSTOMER\s*CARE|FEEDBACK|HELPLINE|TOLL\s*FREE|CARE@)', re.IGNORECASE)
        care_match = None
        for line in ocr_lines:
            if care_pattern.search(line["text"]):
                care_match = {
                    "value": line["text"],
                    "confidence": round(line["confidence"], 2),
                    "source_text": line["text"],
                    "source_bbox": line["bbox"]
                }
                break

        results["consumer_care"] = care_match or {
            "value": None,
            "confidence": 0.0,
            "source_text": None,
            "source_bbox": None
        }

        # 6. Dates
        date_pattern = re.compile(r'(?:MFG|PKD|PACKED|MANUFACTURED)?[:.\s-]*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}[/-]\d{4}|\w{3}[/-]\d{4})', re.IGNORECASE)
        date_match = None
        for line in ocr_lines:
            if any(k in line["text"].upper() for k in ["MFG", "PKD", "DATE", "BEST BEFORE"]):
                match = date_pattern.search(line["text"])
                if match:
                    date_match = {
                        "value": match.group(1),
                        "confidence": round(line["confidence"], 2),
                        "source_text": line["text"],
                        "source_bbox": line["bbox"]
                    }
                    break

        results["date_mfg_pkd"] = date_match or {
            "value": None,
            "confidence": 0.0,
            "source_text": None,
            "source_bbox": None
        }

        # 7. Country of Origin
        origin_pattern = re.compile(r'(?:COUNTRY\s*OF\s*ORIGIN|MADE\s*IN|PRODUCE\s*OF)[:.\s-]*([A-Za-z]+)', re.IGNORECASE)
        origin_match = None
        for line in ocr_lines:
            match = origin_pattern.search(line["text"])
            if match:
                origin_match = {
                    "value": match.group(1).title(),
                    "confidence": round(line["confidence"], 2),
                    "source_text": line["text"],
                    "source_bbox": line["bbox"]
                }
                break

        results["country_of_origin"] = origin_match or {
            "value": "India",
            "confidence": 0.90,
            "source_text": "Domestic Packaging",
            "source_bbox": None
        }

        return results

    @staticmethod
    def _attach_source_spans(parsed_dict: Dict[str, Any], ocr_lines: List[Dict[str, Any]]) -> Dict[str, Any]:
        results = {}
        for field, data in parsed_dict.items():
            val = data.get("value")
            conf = data.get("confidence", 0.0)
            norm = data.get("normalized")
            matched_bbox = None
            source_text = None

            if val:
                # Find matching OCR line
                for line in ocr_lines:
                    if any(token.lower() in line["text"].lower() for token in str(val).split()[:3]):
                        matched_bbox = line["bbox"]
                        source_text = line["text"]
                        break

            results[field] = {
                "value": val,
                "normalized": norm,
                "confidence": round(conf, 2),
                "source_text": source_text or (val if val else None),
                "source_bbox": matched_bbox
            }
        return results

    @staticmethod
    def _clean_val(val: Any) -> Optional[str]:
        if val is None:
            return None
        s = str(val).strip()
        if not s or s.lower() in ("none", "null", "n/a", "undefined", "—", "-", "not detected", "not visible"):
            return None
        negative_markers = ["not detected", "not visible", "not found", "missing", "unspecified", "details not visible", "zero ocr"]
        if any(m in s.lower() for m in negative_markers):
            return None
        return s

    @staticmethod
    def format_vision_fields(vision_fields: Dict[str, Any], ocr_lines: List[Dict[str, Any]]) -> Dict[str, Any]:
        results = {}
        for field, f_data in vision_fields.items():
            if not isinstance(f_data, dict):
                continue
            raw_val = f_data.get("value")
            cleaned_val = NLPService._clean_val(raw_val)
            conf = float(f_data.get("confidence", 0.0)) if cleaned_val else 0.0
            norm = f_data.get("normalized") if cleaned_val else None
            if cleaned_val and not norm and f_data.get("amount") is not None:
                norm = {
                    "amount": float(f_data.get("amount")),
                    "unit": f_data.get("unit") or ("INR" if field == "mrp" else "g")
                }
            matched_bbox = None
            source_text = None
            if cleaned_val:
                for line in ocr_lines:
                    if line.get("field") == field or any(token.lower() in line["text"].lower() for token in str(cleaned_val).split()[:2]):
                        matched_bbox = line.get("bbox")
                        source_text = line.get("text")
                        break

            results[field] = {
                "value": cleaned_val,
                "normalized": norm,
                "confidence": round(conf, 2),
                "source_text": source_text or cleaned_val,
                "source_bbox": matched_bbox
            }
        return results
