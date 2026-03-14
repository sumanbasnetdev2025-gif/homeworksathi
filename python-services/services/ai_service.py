import os
import json
import httpx
from typing import Optional

ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY")
OPENAI_KEY = os.getenv("OPENAI_API_KEY")

async def call_claude(prompt: str, max_tokens: int = 2000) -> str:
    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-sonnet-4-20250514",
                "max_tokens": max_tokens,
                "messages": [{"role": "user", "content": prompt}],
            },
        )
        data = res.json()
        return data["content"][0]["text"]

async def call_openai(prompt: str, max_tokens: int = 2000) -> str:
    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "gpt-4o",
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"},
                "max_tokens": max_tokens,
            },
        )
        data = res.json()
        return data["choices"][0]["message"]["content"]

async def call_ai(prompt: str, max_tokens: int = 2000) -> dict:
    raw = ""
    try:
        if ANTHROPIC_KEY:
            raw = await call_claude(prompt, max_tokens)
        elif OPENAI_KEY:
            raw = await call_openai(prompt, max_tokens)
        else:
            raise Exception("No AI API key configured")

        clean = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response", "raw": raw}

async def solve_question(
    question_text: str,
    subject: str,
    language: str = "en",
    image_url: Optional[str] = None,
) -> dict:
    lang_instruction = (
        "Respond entirely in Nepali language (Devanagari script)."
        if language == "ne"
        else "Respond in English."
    )

    prompt = f"""You are HomeworkSathi, an expert tutor for Nepali high school students (Grade 8-12).

Subject: {subject}
Question: {question_text}
{f"Image: {image_url}" if image_url else ""}

{lang_instruction}

Solve step by step. Return ONLY valid JSON:
{{
  "steps": [
    {{
      "stepNumber": 1,
      "title": "Step title",
      "explanation": "Clear explanation",
      "math": "Math expression (optional)"
    }}
  ],
  "finalAnswer": "The final answer"
}}"""

    result = await call_ai(prompt)
    return result

async def generate_practice(
    subject: str,
    difficulty: str = "medium",
    language: str = "en",
    count: int = 5,
) -> dict:
    lang_instruction = (
        "Write in Nepali language (Devanagari script)."
        if language == "ne"
        else "Write in English."
    )

    prompt = f"""Generate {count} practice questions for Nepali high school students.

Subject: {subject}
Difficulty: {difficulty}
{lang_instruction}

Return ONLY valid JSON:
{{
  "questions": [
    {{
      "id": "1",
      "question": "Question text",
      "answer": "Detailed answer",
      "difficulty": "{difficulty}",
      "subject": "{subject}"
    }}
  ]
}}"""

    result = await call_ai(prompt)
    return result