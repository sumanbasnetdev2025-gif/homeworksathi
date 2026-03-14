# python-services/routers/ocr.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ocr_service import extract_text_from_url

router = APIRouter(prefix="/ocr", tags=["OCR"])

class OCRRequest(BaseModel):
    image_url: str

class OCRResponse(BaseModel):
    text: str
    confidence: float = 0.0

@router.post("", response_model=OCRResponse)
async def ocr_image(req: OCRRequest):
    try:
        result = await extract_text_from_url(req.image_url)
        return OCRResponse(text=result["text"], confidence=result.get("confidence", 0.0))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))