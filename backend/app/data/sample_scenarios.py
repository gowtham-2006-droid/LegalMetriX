DEMO_SCENARIOS = {
    "scenario_1_compliant": {
        "id": "scenario_1_compliant",
        "title": "Scenario 1: Fully Compliant Biscuit Pack",
        "category": "biscuits_bakery",
        "badge": "100% Compliant",
        "badge_color": "emerald",
        "description": "Clear label with all mandatory declarations present (MRP, Net Qty, Mfg Address, Consumer Care, Dates).",
        "mock_ocr": [
            {"text": "BRITANNIA GLUCOSE D BISCUITS", "confidence": 0.98, "bbox": [[50, 40], [450, 40], [450, 90], [50, 90]]},
            {"text": "NET QUANTITY: 250 g", "confidence": 0.96, "bbox": [[50, 110], [280, 110], [280, 150], [50, 150]]},
            {"text": "MAX RETAIL PRICE (MRP): Rs. 25.00 (INCL. OF ALL TAXES)", "confidence": 0.97, "bbox": [[50, 170], [480, 170], [480, 210], [50, 210]]},
            {"text": "MFD BY: BRITANNIA INDUSTRIES LTD, 5/1A HUNGERFORD ST, KOLKATA 700017", "confidence": 0.94, "bbox": [[50, 230], [550, 230], [550, 280], [50, 280]]},
            {"text": "CONSUMER CARE CELL: 1800-425-4449 / FEEDBACK@BRITANNIA.CO.IN", "confidence": 0.93, "bbox": [[50, 300], [530, 300], [530, 340], [50, 340]]},
            {"text": "MFG DATE: 15/08/2026 | BEST BEFORE 6 MONTHS", "confidence": 0.92, "bbox": [[50, 360], [420, 360], [420, 400], [50, 400]]},
            {"text": "COUNTRY OF ORIGIN: INDIA", "confidence": 0.95, "bbox": [[50, 420], [310, 420], [310, 450], [50, 450]]}
        ],
        "fields": {
            "product_name": {"value": "Britannia Glucose D Biscuits", "confidence": 0.98, "source_text": "BRITANNIA GLUCOSE D BISCUITS"},
            "net_quantity": {"value": "250 g", "normalized": {"amount": 250, "unit": "g"}, "confidence": 0.96, "source_text": "NET QUANTITY: 250 g"},
            "mrp": {"value": "₹ 25.00", "normalized": {"amount": 25.00, "currency": "INR"}, "confidence": 0.97, "source_text": "MAX RETAIL PRICE (MRP): Rs. 25.00 (INCL. OF ALL TAXES)"},
            "manufacturer": {"value": "Britannia Industries Ltd, 5/1A Hungerford St, Kolkata 700017", "confidence": 0.94, "source_text": "MFD BY: BRITANNIA INDUSTRIES LTD..."},
            "consumer_care": {"value": "1800-425-4449 / feedback@britannia.co.in", "confidence": 0.93, "source_text": "CONSUMER CARE CELL: 1800-425-4449..."},
            "date_mfg_pkd": {"value": "15/08/2026", "confidence": 0.92, "source_text": "MFG DATE: 15/08/2026"},
            "country_of_origin": {"value": "India", "confidence": 0.95, "source_text": "COUNTRY OF ORIGIN: INDIA"}
        }
    },
    "scenario_2_missing_care": {
        "id": "scenario_2_missing_care",
        "title": "Scenario 2: Missing Consumer Care Declaration",
        "category": "packaged_snacks",
        "badge": "Potentially Non-Compliant",
        "badge_color": "rose",
        "description": "Packaging contains MRP, Quantity, and Manufacturer details, but omits mandatory consumer grievance contact.",
        "mock_ocr": [
            {"text": "ROYAL MASALA CHIPS", "confidence": 0.97, "bbox": [[50, 40], [380, 40], [380, 90], [50, 90]]},
            {"text": "NET WEIGHT: 80 g", "confidence": 0.95, "bbox": [[50, 110], [240, 110], [240, 150], [50, 150]]},
            {"text": "MRP Rs. 20 (INCL. ALL TAXES)", "confidence": 0.96, "bbox": [[50, 170], [350, 170], [350, 210], [50, 210]]},
            {"text": "MANUFACTURED BY: SUNSHINE FOODS PVT LTD, PLOT 12, GIDC, VAPI, GUJARAT", "confidence": 0.92, "bbox": [[50, 230], [560, 230], [560, 280], [50, 280]]},
            {"text": "PKD ON: 01/09/2026", "confidence": 0.90, "bbox": [[50, 300], [260, 300], [260, 340], [50, 340]]},
            {"text": "MADE IN INDIA", "confidence": 0.94, "bbox": [[50, 360], [210, 360], [210, 390], [50, 390]]}
        ],
        "fields": {
            "product_name": {"value": "Royal Masala Chips", "confidence": 0.97, "source_text": "ROYAL MASALA CHIPS"},
            "net_quantity": {"value": "80 g", "normalized": {"amount": 80, "unit": "g"}, "confidence": 0.95, "source_text": "NET WEIGHT: 80 g"},
            "mrp": {"value": "₹ 20.00", "normalized": {"amount": 20.00, "currency": "INR"}, "confidence": 0.96, "source_text": "MRP Rs. 20 (INCL. ALL TAXES)"},
            "manufacturer": {"value": "Sunshine Foods Pvt Ltd, Plot 12, GIDC, Vapi, Gujarat", "confidence": 0.92, "source_text": "MANUFACTURED BY: SUNSHINE FOODS..."},
            "consumer_care": {"value": None, "confidence": 0.0, "source_text": None},
            "date_mfg_pkd": {"value": "01/09/2026", "confidence": 0.90, "source_text": "PKD ON: 01/09/2026"},
            "country_of_origin": {"value": "India", "confidence": 0.94, "source_text": "MADE IN INDIA"}
        }
    },
    "scenario_3_low_confidence": {
        "id": "scenario_3_low_confidence",
        "title": "Scenario 3: Low Confidence / Smudged Date",
        "category": "edible_oils",
        "badge": "Needs Manual Review",
        "badge_color": "amber",
        "description": "Packaging has a smudged manufacturing stamp, producing low OCR confidence (<0.60) routed to human review.",
        "mock_ocr": [
            {"text": "SHUDDH MUSTARD OIL", "confidence": 0.96, "bbox": [[50, 40], [390, 40], [390, 90], [50, 90]]},
            {"text": "NET VOLUME: 1 Litre", "confidence": 0.94, "bbox": [[50, 110], [280, 110], [280, 150], [50, 150]]},
            {"text": "MRP: Rs. 165.00 (INCL OF TAXES)", "confidence": 0.95, "bbox": [[50, 170], [410, 170], [410, 210], [50, 210]]},
            {"text": "PACKED BY: AGRO OIL MILLS, INDUSTRIAL AREA, KANPUR 208001", "confidence": 0.91, "bbox": [[50, 230], [540, 230], [540, 280], [50, 280]]},
            {"text": "CONSUMER CARE: 0512-2345678, CARE@AGROOIL.IN", "confidence": 0.92, "bbox": [[50, 300], [510, 300], [510, 340], [50, 340]]},
            {"text": "MFG: **/**/2026 (SMUDGED)", "confidence": 0.48, "bbox": [[50, 360], [340, 360], [340, 400], [50, 400]]},
            {"text": "PRODUCE OF INDIA", "confidence": 0.93, "bbox": [[50, 420], [250, 420], [250, 450], [50, 450]]}
        ],
        "fields": {
            "product_name": {"value": "Shuddh Mustard Oil", "confidence": 0.96, "source_text": "SHUDDH MUSTARD OIL"},
            "net_quantity": {"value": "1 Litre", "normalized": {"amount": 1, "unit": "l"}, "confidence": 0.94, "source_text": "NET VOLUME: 1 Litre"},
            "mrp": {"value": "₹ 165.00", "normalized": {"amount": 165.00, "currency": "INR"}, "confidence": 0.95, "source_text": "MRP: Rs. 165.00 (INCL OF TAXES)"},
            "manufacturer": {"value": "Agro Oil Mills, Industrial Area, Kanpur 208001", "confidence": 0.91, "source_text": "PACKED BY: AGRO OIL MILLS..."},
            "consumer_care": {"value": "0512-2345678, care@agrooil.in", "confidence": 0.92, "source_text": "CONSUMER CARE: 0512-2345678..."},
            "date_mfg_pkd": {"value": "**/2026", "confidence": 0.48, "source_text": "MFG: **/**/2026 (SMUDGED)"},
            "country_of_origin": {"value": "India", "confidence": 0.93, "source_text": "PRODUCE OF INDIA"}
        }
    }
}
