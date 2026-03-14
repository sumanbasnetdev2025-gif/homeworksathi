from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ocr, solve, practice
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="HomeworkSathi Python Service",
    description="OCR, Math solving, and Practice generation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://homeworksathi.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr.router)
app.include_router(solve.router)
app.include_router(practice.router)

@app.get("/")
def root():
    return {"status": "HomeworkSathi Python service running"}

@app.get("/health")
def health():
    return {"status": "ok"} 