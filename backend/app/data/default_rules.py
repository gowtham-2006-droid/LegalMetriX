DEFAULT_COMPLIANCE_RULES = [
    {
        "rule_id": "LM-MRP-001",
        "rule_name": "Maximum Retail Price (MRP) Declaration",
        "applicable_category": "all_packaged_food",
        "requirement": "Package must clearly declare Maximum Retail Price (MRP) in Indian Rupees, inclusive of all taxes.",
        "input_field": "mrp",
        "validation_logic": {
            "type": "format_and_presence",
            "regex": r"(₹|Rs\.?|INR)\s*[\d,]+(\.\d{2})?",
            "min_confidence": 0.70
        },
        "severity": "Critical",
        "result_if_absent": "Fail",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "MRP declaration was {status_desc}. Detected: '{detected}'. Under Legal Metrology rules, all pre-packaged commodities must declare retail sale price inclusive of all taxes.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, Rule 6(1)(e) - To be verified against applicable official regulations.",
        "version": "1.0"
    },
    {
        "rule_id": "LM-NET-QTY-001",
        "rule_name": "Net Quantity and Standard Unit of Measurement",
        "applicable_category": "all_packaged_food",
        "requirement": "Package must declare net quantity in standard metric units (g, kg, ml, l, piece).",
        "input_field": "net_quantity",
        "validation_logic": {
            "type": "metric_quantity",
            "valid_units": ["g", "kg", "ml", "l", "ltr", "gm", "g.", "kg.", "ml.", "pieces", "units"],
            "min_confidence": 0.70
        },
        "severity": "Critical",
        "result_if_absent": "Fail",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Net quantity was {status_desc}. Detected: '{detected}'. Mandatory declaration of net quantity in terms of standard unit of weight or measure.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, Rule 6(1)(b) & Second Schedule - To be verified against applicable official regulations.",
        "version": "1.0"
    },
    {
        "rule_id": "LM-MFG-ADDR-001",
        "rule_name": "Manufacturer / Packer / Importer Identity & Address",
        "applicable_category": "all_packaged_food",
        "requirement": "Package must state the name and complete physical address of the manufacturer, packer, or importer.",
        "input_field": "manufacturer",
        "validation_logic": {
            "type": "presence_min_length",
            "min_chars": 8,
            "min_confidence": 0.65
        },
        "severity": "High",
        "result_if_absent": "Fail",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Manufacturer / Packer identity was {status_desc}. Detected: '{detected}'. Pre-packaged goods must display name and complete address of the manufacturing or packing unit.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, Rule 6(1)(a) - To be verified against applicable official regulations.",
        "version": "1.0"
    },
    {
        "rule_id": "LM-CONSUMER-CARE-001",
        "rule_name": "Consumer Care & Helpline Declaration",
        "applicable_category": "all_packaged_food",
        "requirement": "Package must display dedicated consumer grievance details (contact number, email, or address).",
        "input_field": "consumer_care",
        "validation_logic": {
            "type": "contact_info",
            "min_confidence": 0.60
        },
        "severity": "High",
        "result_if_absent": "Fail",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Consumer care information was {status_desc}. Detected: '{detected}'. Legal Metrology mandates contact details of consumer grievance officer.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, Rule 6(2) - To be verified against applicable official regulations.",
        "version": "1.0"
    },
    {
        "rule_id": "LM-DATE-MFG-001",
        "rule_name": "Month and Year of Manufacture / Packaging",
        "applicable_category": "all_packaged_food",
        "requirement": "Package must declare month and year of manufacture or packaging (or expiry/best before).",
        "input_field": "date_mfg_pkd",
        "validation_logic": {
            "type": "date_presence",
            "min_confidence": 0.65
        },
        "severity": "Medium",
        "result_if_absent": "Fail",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Manufacturing or packaging date was {status_desc}. Detected: '{detected}'. Commodities must declare month and year in which commodity is manufactured or pre-packed.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, Rule 6(1)(d) - To be verified against applicable official regulations.",
        "version": "1.0"
    },
    {
        "rule_id": "LM-COUNTRY-ORIGIN-001",
        "rule_name": "Country of Origin Declaration",
        "applicable_category": "all_packaged_food",
        "requirement": "Package must state country of origin (e.g. 'Made in India' or 'Country of Origin: India').",
        "input_field": "country_of_origin",
        "validation_logic": {
            "type": "presence",
            "min_confidence": 0.60
        },
        "severity": "Medium",
        "result_if_absent": "Needs Review",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Country of origin declaration was {status_desc}. Detected: '{detected}'. Mandated under Legal Metrology amendments for imported and domestic packaged goods.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, Rule 6(10) - To be verified against applicable official regulations.",
        "version": "1.0"
    },
    {
        "rule_id": "LM-PROD-NAME-001",
        "rule_name": "Generic or Common Product Name",
        "applicable_category": "all_packaged_food",
        "requirement": "Package must clearly state the common or generic name of the commodity.",
        "input_field": "product_name",
        "validation_logic": {
            "type": "presence_min_length",
            "min_chars": 3,
            "min_confidence": 0.60
        },
        "severity": "Critical",
        "result_if_absent": "Fail",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Product generic name declaration was {status_desc}. Detected: '{detected}'. Every package must specify common or generic identity of commodity.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, Rule 6(1)(c) - To be verified against applicable official regulations.",
        "version": "1.0"
    }
]
