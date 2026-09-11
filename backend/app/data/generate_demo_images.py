import os
from PIL import Image, ImageDraw, ImageFont

def generate_sample_images(output_dir: str):
    os.makedirs(output_dir, exist_ok=True)

    scenarios = [
        {
            "id": "scenario_1_compliant.png",
            "title": "BRITANNIA GLUCOSE D",
            "subtitle": "Energy Biscuits · Net Qty: 250 g",
            "lines": [
                "MAX RETAIL PRICE: Rs. 25.00 (INCL. ALL TAXES)",
                "MFD BY: BRITANNIA INDUSTRIES LTD, KOLKATA",
                "CONSUMER CARE: 1800-425-4449 / FEEDBACK@BRITANNIA.CO.IN",
                "MFG DATE: 15/08/2026 | BEST BEFORE 6 MONTHS",
                "COUNTRY OF ORIGIN: INDIA"
            ],
            "accent": (16, 185, 129),
            "status_text": "MANDATORY DECLARATIONS VERIFIED"
        },
        {
            "id": "scenario_2_missing_care.png",
            "title": "ROYAL MASALA CHIPS",
            "subtitle": "Crispy Potato Wafers · Net Wt: 80 g",
            "lines": [
                "MRP: Rs. 20 (INCL. ALL TAXES)",
                "MANUFACTURED BY: SUNSHINE FOODS PVT LTD, VAPI, GUJARAT",
                "PKD ON: 01/09/2026",
                "MADE IN INDIA",
                "[CONSUMER CARE HELPLINE: MISSING / NOT PRINTED]"
            ],
            "accent": (244, 63, 94),
            "status_text": "POTENTIAL VIOLATION: CONSUMER CARE ABSENT"
        },
        {
            "id": "scenario_3_low_confidence.png",
            "title": "SHUDDH MUSTARD OIL",
            "subtitle": "Kachi Ghani Mustard Oil · Net Volume: 1 Litre",
            "lines": [
                "MRP: Rs. 165.00 (INCL. OF TAXES)",
                "PACKED BY: AGRO OIL MILLS, KANPUR 208001",
                "CONSUMER CARE: 0512-2345678, CARE@AGROOIL.IN",
                "MFG: **/**/2026 (SMUDGED / PARTIALLY ILLEGIBLE)",
                "PRODUCE OF INDIA"
            ],
            "accent": (245, 158, 11),
            "status_text": "FLAGGED: LOW CONFIDENCE DATE FIELD"
        }
    ]

    for sc in scenarios:
        w, h = 640, 480
        img = Image.new("RGB", (w, h), color=(15, 23, 42))
        draw = ImageDraw.Draw(img)

        # Header banner
        draw.rectangle([(0, 0), (w, 70)], fill=(30, 41, 59))
        draw.text((30, 20), sc["title"], fill=(248, 250, 252))
        draw.text((30, 44), sc["subtitle"], fill=(148, 163, 184))

        # Status strip
        draw.rectangle([(0, 70), (w, 95)], fill=sc["accent"])
        draw.text((30, 75), sc["status_text"], fill=(255, 255, 255))

        # Label lines box
        draw.rectangle([(30, 115), (w - 30, h - 30)], outline=(51, 65, 85), width=2, fill=(20, 29, 47))

        y_offset = 140
        for line in sc["lines"]:
            draw.rectangle([(45, y_offset - 4), (w - 45, y_offset + 28)], outline=(56, 189, 248), width=1, fill=(15, 23, 42))
            draw.text((55, y_offset), line, fill=(226, 232, 240))
            y_offset += 55

        filepath = os.path.join(output_dir, sc["id"])
        img.save(filepath)

if __name__ == "__main__":
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "./storage/uploads"
    generate_sample_images(out)
    print("Sample demo images generated.")
