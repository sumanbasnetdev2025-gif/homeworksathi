# HomeworkSathi 📚

AI-powered homework helper for Nepali high school students (Grade 8–12).

## Features
- 📸 Upload homework photos → get step-by-step solutions
- 🧠 AI-powered solving with Claude/GPT-4
- 🇳🇵 English & Nepali language support
- 🎯 Practice question generator
- 💬 Follow-up question chat
- 📊 Progress dashboard

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, shadcn/ui
- **Backend**: Python FastAPI
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude / OpenAI GPT-4
- **OCR**: Mathpix / Tesseract

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Fill in your Supabase and AI API keys
```

### 3. Run database migrations
```bash
npx supabase db push
```

### 4. Start Next.js
```bash
npm run dev
```

### 5. Start Python service
```bash
cd python-services
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Environment Variables
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |
| `OPENAI_API_KEY` | OpenAI API key (fallback) |
| `MATHPIX_APP_ID` | Mathpix OCR app ID |
| `MATHPIX_APP_KEY` | Mathpix OCR app key |