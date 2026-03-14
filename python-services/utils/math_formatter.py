import re

def clean_math_text(text: str) -> str:
    """Clean and format math text from OCR"""
    # Fix common OCR mistakes
    replacements = {
        "×": "*",
        "÷": "/",
        "–": "-",
        "−": "-",
        "²": "^2",
        "³": "^3",
        "√": "sqrt",
        "π": "pi",
        "∞": "oo",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text.strip()

def format_for_display(latex_str: str) -> str:
    """Format LaTeX string for display"""
    if not latex_str:
        return ""
    # Add dollar signs if not present
    if not latex_str.startswith("$"):
        latex_str = f"${latex_str}$"
    return latex_str