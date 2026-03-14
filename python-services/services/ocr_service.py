import httpx
import pytesseract
from PIL import Image
import io
import os

async def extract_text_from_url(image_url: str) -> dict:
    """Download image and extract text using Tesseract OCR"""
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(image_url)
            response.raise_for_status()

        image = Image.open(io.BytesIO(response.content))

        # Convert to RGB if needed
        if image.mode not in ('RGB', 'L'):
            image = image.convert('RGB')

        # Improve image for OCR
        image = image.resize(
            (image.width * 2, image.height * 2),
            Image.LANCZOS
        )

        # Run OCR with both English and Nepali support
        custom_config = r'--oem 3 --psm 6'
        try:
            text = pytesseract.image_to_string(
                image,
                lang='eng+nep',
                config=custom_config
            )
        except Exception:
            # Fallback to English only
            text = pytesseract.image_to_string(
                image,
                lang='eng',
                config=custom_config
            )

        text = text.strip()
        confidence = 0.8 if len(text) > 10 else 0.3

        return {"text": text, "confidence": confidence}

    except Exception as e:
        return {"text": "", "confidence": 0.0, "error": str(e)}