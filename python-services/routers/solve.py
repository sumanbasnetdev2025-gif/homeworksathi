from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.ai_service import solve_question

router = APIRouter(prefix="/solve", tags=["Solve"])

class SolveRequest(BaseModel):
    question_text: str
    subject: str
    language: str = "en"
    image_url: Optional[str] = None

class SolveResponse(BaseModel):
    steps: list
    final_answer: str

@router.post("", response_model=SolveResponse)
async def solve(req: SolveRequest):
    try:
        result = await solve_question(
            question_text=req.question_text,
            subject=req.subject,
            language=req.language,
            image_url=req.image_url,
        )
        return SolveResponse(steps=result["steps"], final_answer=result["finalAnswer"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))