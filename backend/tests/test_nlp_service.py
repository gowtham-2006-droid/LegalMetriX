from app.services.nlp_service import NLPService

def test_regex_extraction_core_fields():
    ocr_lines = [
        {"text": "PARLE-G ORIGINAL GLUCOSE BISCUITS", "confidence": 0.98, "bbox": [[0, 0], [100, 0], [100, 20], [0, 20]]},
        {"text": "NET WEIGHT: 800 g", "confidence": 0.95, "bbox": [[0, 30], [80, 30], [80, 50], [0, 50]]},
        {"text": "MAXIMUM RETAIL PRICE Rs. 85.00 INCL. ALL TAXES", "confidence": 0.97, "bbox": [[0, 60], [120, 60], [120, 80], [0, 80]]},
        {"text": "MFD BY: PARLE PRODUCTS PVT LTD, MUMBAI", "confidence": 0.93, "bbox": [[0, 90], [150, 90], [150, 110], [0, 110]]},
        {"text": "CONSUMER CARE HELPLINE: 1800-22-7799", "confidence": 0.92, "bbox": [[0, 120], [140, 120], [140, 140], [0, 140]]},
        {"text": "MFG DATE: 10/2026", "confidence": 0.91, "bbox": [[0, 150], [90, 150], [90, 170], [0, 170]]}
    ]

    extracted = NLPService._extract_with_regex(ocr_lines, "")

    assert extracted["product_name"]["value"] is not None
    assert "parle-g" in extracted["product_name"]["value"].lower()

    assert extracted["net_quantity"]["value"] is not None
    assert "800" in extracted["net_quantity"]["value"]
    assert extracted["net_quantity"]["normalized"]["amount"] == 800.0

    assert "85.00" in extracted["mrp"]["value"]
    assert extracted["mrp"]["normalized"]["amount"] == 85.0

    assert extracted["manufacturer"]["value"] is not None
    assert "parle products" in extracted["manufacturer"]["value"].lower()

    assert extracted["consumer_care"]["value"] is not None
    assert "1800-22-7799" in extracted["consumer_care"]["value"]
