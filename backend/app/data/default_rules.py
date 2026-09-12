DEFAULT_COMPLIANCE_RULES = [
    {
        "rule_id": "LM-01-MFG-ADDR",
        "rule_name": "Manufacturer, Packer & Importer Identity",
        "applicable_category": "all_packaged_food",
        "requirement": "Name and complete address of the manufacturer. If manufacturer and packer are different, mention both. For imported products, mention the importer's name and address.",
        "input_field": "manufacturer",
        "validation_logic": {
            "type": "presence_min_length",
            "min_chars": 8,
            "min_confidence": 0.65
        },
        "severity": "Critical",
        "result_if_absent": "Fail",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Manufacturer/Packer/Importer details were {status_desc}. Detected: '{detected}'. Under Rule 6(1)(a), complete name and address of the manufacturing or packing unit or importer must be declared.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(a)",
        "version": "1.0"
    },
    {
        "rule_id": "LM-02-MFG-RESP",
        "rule_name": "Manufacturer Responsibility (Deemed Manufacturer)",
        "applicable_category": "all_packaged_food",
        "requirement": "If only a company name and address is given without words like \"Manufactured by\" or \"Packed by\", that company may be treated as the manufacturer.",
        "input_field": "manufacturer",
        "validation_logic": {
            "type": "qualifying_prefix",
            "min_confidence": 0.60
        },
        "severity": "High",
        "result_if_absent": "Needs Review",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Manufacturer qualifying words were {status_desc}. Detected: '{detected}'. If qualifying words like 'Manufactured by' or 'Packed by' are absent, the declared company is legally treated as the manufacturer.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(a) Explanation I",
        "version": "1.0"
    },
    {
        "rule_id": "LM-03-BRAND-RESP",
        "rule_name": "Brand Owner & Marketer Liability",
        "applicable_category": "all_packaged_food",
        "requirement": "If the brand owner is shown as the marketer, the brand owner can be held responsible for violations. If multiple manufacturer details are given, action is taken against the manufacturer mentioned first on the label.",
        "input_field": "manufacturer",
        "validation_logic": {
            "type": "brand_marketer_check",
            "min_confidence": 0.60
        },
        "severity": "High",
        "result_if_absent": "Needs Review",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Brand owner and marketer responsibility check was {status_desc}. Detected: '{detected}'. Under Legal Metrology enforcement, liability extends to the brand owner/marketer or first-mentioned manufacturer.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(a) Explanation II & III",
        "version": "1.0"
    },
    {
        "rule_id": "LM-04-GENERIC-NAME",
        "rule_name": "Common or Generic Name of Product",
        "applicable_category": "all_packaged_food",
        "requirement": "Mention the common or generic name of the commodity. If more than one product, mention the name and quantity/number of each product.",
        "input_field": "product_name",
        "validation_logic": {
            "type": "presence_min_length",
            "min_chars": 3,
            "min_confidence": 0.65
        },
        "severity": "Critical",
        "result_if_absent": "Fail",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Common or generic product name declaration was {status_desc}. Detected: '{detected}'. Every retail package must clearly declare the generic or common identity of the commodity.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(b)",
        "version": "1.0"
    },
    {
        "rule_id": "LM-05-NET-QTY",
        "rule_name": "Net Quantity & Standard Metric Units",
        "applicable_category": "all_packaged_food",
        "requirement": "Mention the net quantity using the proper unit of weight or measure. If sold by number, mention the number of items in the package.",
        "input_field": "net_quantity",
        "validation_logic": {
            "type": "metric_quantity",
            "valid_units": ["g", "kg", "ml", "l", "ltr", "gm", "pieces", "units", "count", "n", "pcs", "packets"],
            "min_confidence": 0.70
        },
        "severity": "Critical",
        "result_if_absent": "Fail",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Net quantity declaration was {status_desc}. Detected: '{detected}'. Net quantity must be declared in standard metric units of weight or measure, or by count if sold by number.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(c) & Second Schedule",
        "version": "1.0"
    },
    {
        "rule_id": "LM-06-MONTH-YEAR",
        "rule_name": "Month and Year of Manufacture / Packing / Import",
        "applicable_category": "all_packaged_food",
        "requirement": "Mention the month and year when the product was manufactured, pre-packed or imported. It can be written in words, numbers or both.",
        "input_field": "date_mfg_pkd",
        "validation_logic": {
            "type": "month_year_presence",
            "min_confidence": 0.65
        },
        "severity": "High",
        "result_if_absent": "Fail",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Month and year of manufacture or packaging was {status_desc}. Detected: '{detected}'. Mandatory declaration of the month and year in which commodity is manufactured, pre-packed, or imported.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(d)",
        "version": "1.0"
    },
    {
        "rule_id": "LM-07-SPECIAL-EXCEPTIONS",
        "rule_name": "Special Exceptions (Food, Seeds, Cosmetics)",
        "applicable_category": "all_packaged_food",
        "requirement": "Food products follow the applicable food-labelling requirements in the rules. Certified seed packages have a specific exception. For cosmetics, the Drugs and Cosmetics Rules apply. Month/year may be printed using a rubber stamp, without overwriting.",
        "input_field": "special_exceptions",
        "validation_logic": {
            "type": "special_category_compliance",
            "min_confidence": 0.60
        },
        "severity": "Medium",
        "result_if_absent": "Needs Review",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Special labelling exceptions check was {status_desc}. Detected: '{detected}'. Verification of applicable statutory exemptions and special category labelling guidelines.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6 Provisos",
        "version": "1.0"
    },
    {
        "rule_id": "LM-08-MRP",
        "rule_name": "Retail Sale Price / Maximum Retail Price (MRP)",
        "applicable_category": "all_packaged_food",
        "requirement": "Mention the retail sale price / MRP wherever required. Certain bidi and specified domestic LPG packages are exempt from this declaration.",
        "input_field": "mrp",
        "validation_logic": {
            "type": "format_and_presence",
            "regex": r"(₹|Rs\.?|INR)\s*[\d,]+(\.\d{2})?",
            "min_confidence": 0.70
        },
        "severity": "Critical",
        "result_if_absent": "Fail",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Retail sale price / MRP declaration was {status_desc}. Detected: '{detected}'. Package must state maximum retail price inclusive of all taxes unless specifically exempted.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(e)",
        "version": "1.0"
    },
    {
        "rule_id": "LM-09-ALCOHOLIC-BEV",
        "rule_name": "Alcoholic Beverages & State Excise Compliance",
        "applicable_category": "all_packaged_food",
        "requirement": "Applicable State Excise Laws and Rules apply to alcoholic beverages / spirituous liquor. If those laws do not provide for retail sale price declaration, these rules apply.",
        "input_field": "alcoholic_beverages",
        "validation_logic": {
            "type": "excise_or_lm_mrp",
            "min_confidence": 0.60
        },
        "severity": "Medium",
        "result_if_absent": "Needs Review",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Alcoholic beverages excise compliance check was {status_desc}. Detected: '{detected}'. Governed by State Excise Laws or standard Legal Metrology retail sale price rules.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(e) Proviso III",
        "version": "1.0"
    },
    {
        "rule_id": "LM-10-DIMENSIONS",
        "rule_name": "Dimensions of Commodity",
        "applicable_category": "all_packaged_food",
        "requirement": "If the size/dimensions of the commodity are relevant, the dimensions must be mentioned. If different pieces have different dimensions, the dimensions of each type must be given.",
        "input_field": "dimensions",
        "validation_logic": {
            "type": "dimension_declaration",
            "min_confidence": 0.60
        },
        "severity": "Medium",
        "result_if_absent": "Needs Review",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Commodity dimensions declaration was {status_desc}. Detected: '{detected}'. Where dimensions are relevant to the purchase, length, breadth, height, or piece dimensions must be stated.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(f)",
        "version": "1.0"
    },
    {
        "rule_id": "LM-11-OTHER-INFO",
        "rule_name": "Other Statutorily Required Information",
        "applicable_category": "all_packaged_food",
        "requirement": "Any other information specifically required under the Legal Metrology Rules must also be declared (including Country of Origin on imported and domestic goods).",
        "input_field": "country_of_origin",
        "validation_logic": {
            "type": "statutory_information",
            "min_confidence": 0.60
        },
        "severity": "Medium",
        "result_if_absent": "Needs Review",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Statutory supplementary information was {status_desc}. Detected: '{detected}'. Verification of additional mandatory disclosures including Country of Origin under Rule 6(10).",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(1)(g) & Rule 6(10)",
        "version": "1.0"
    },
    {
        "rule_id": "LM-12-CONSUMER-CARE",
        "rule_name": "Consumer Complaint & Contact Details",
        "applicable_category": "all_packaged_food",
        "requirement": "Provide details of the person / office that consumers can contact for complaints: Name, Address, Telephone number, E-mail address (if available).",
        "input_field": "consumer_care",
        "validation_logic": {
            "type": "contact_info",
            "min_confidence": 0.60
        },
        "severity": "High",
        "result_if_absent": "Fail",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Consumer complaint details were {status_desc}. Detected: '{detected}'. Rule 6(2) mandates name, complete address, phone number, and email for consumer grievance redressal.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(2)",
        "version": "1.0"
    },
    {
        "rule_id": "LM-13-USE-OF-STICKERS",
        "rule_name": "Use of Stickers & Price Alteration Prohibition",
        "applicable_category": "all_packaged_food",
        "requirement": "Stickers generally cannot be used to alter or make mandatory declarations required under the rules. A sticker showing a reduced MRP including all taxes is allowed. The reduced-MRP sticker must not cover the original MRP.",
        "input_field": "use_of_stickers",
        "validation_logic": {
            "type": "sticker_alteration_check",
            "min_confidence": 0.60
        },
        "severity": "High",
        "result_if_absent": "Needs Review",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Sticker alteration compliance was {status_desc}. Detected: '{detected}'. Stickers cannot overwrite declarations; any reduced-MRP sticker must leave the original price legible.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(3) & Regulatory Guidelines",
        "version": "1.0"
    },
    {
        "rule_id": "LM-14-MULTI-COMPONENT",
        "rule_name": "Multiple-Component Packages",
        "applicable_category": "all_packaged_food",
        "requirement": "If one commodity has multiple components packed separately, required declarations should be on the main package. Information about accompanying packages should also be provided. If components are sold separately as spare parts, each package must carry the required declarations.",
        "input_field": "multi_component",
        "validation_logic": {
            "type": "multi_component_check",
            "min_confidence": 0.60
        },
        "severity": "Medium",
        "result_if_absent": "Needs Review",
        "result_if_low_confidence": "Needs Review",
        "explanation_template": "Multiple-component package compliance was {status_desc}. Detected: '{detected}'. Individual packages and spare components must carry required declarations on main package.",
        "source_reference": "Legal Metrology (Packaged Commodities) Rules, 2011, Rule 6(4) & Rule 12",
        "version": "1.0"
    }
]
