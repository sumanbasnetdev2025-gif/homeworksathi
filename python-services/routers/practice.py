from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import generate_practice

router = APIRouter(prefix="/practice", tags=["Practice"])

class PracticeRequest(BaseModel):
    subject: str
    difficulty: str = "medium"
    language: str = "en"
    count: int = 5

class PracticeResponse(BaseModel):
    questions: list

@router.post("", response_model=PracticeResponse)
async def practice(req: PracticeRequest):
    try:
        result = await generate_practice(
            subject=req.subject,
            difficulty=req.difficulty,
            language=req.language,
            count=req.count,
        )
        return PracticeResponse(questions=result["questions"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))