import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, difficulty, language } = await request.json()

    const langInstruction = language === 'ne'
      ? 'Write all questions and answers in Nepali language (Devanagari script).'
      : 'Write in English.'

    const prompt = `Generate 5 practice questions for Nepali high school students.

Subject: ${subject}
Difficulty: ${difficulty}
${langInstruction}

Return ONLY valid JSON with no extra text or markdown:
{
  "questions": [
    {
      "id": "1",
      "question": "The practice question",
      "answer": "Detailed answer with explanation",
      "difficulty": "${difficulty}",
      "subject": "${subject}"
    }
  ]
}

Rules:
- Make questions appropriate for Grade 8-12 Nepal curriculum
- Difficulty ${difficulty}: ${
  difficulty === 'easy' ? 'basic concepts, straightforward' :
  difficulty === 'medium' ? 'requires some thinking, multi-step' :
  'challenging, complex problems'
}
- Include variety: calculation, conceptual, application
- Answers must be complete with working shown`

    let questionsData: any = null

    // 1. Try Anthropic
    if (!questionsData && process.env.ANTHROPIC_API_KEY) {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }],
          }),
        })
        const data = await res.json()
        if (res.ok) {
          const text = data.content?.[0]?.text ?? ''
          if (text) {
            const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
            try { questionsData = JSON.parse(clean) } catch { }
          }
        }
      } catch (err) { console.error('Anthropic practice error:', err) }
    }

    // 2. Try OpenAI
    if (!questionsData && process.env.OPENAI_API_KEY) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            max_tokens: 2000,
          }),
        })
        const data = await res.json()
        if (res.ok) {
          const content = data.choices?.[0]?.message?.content ?? ''
          if (content) {
            try { questionsData = JSON.parse(content) } catch { }
          }
        }
      } catch (err) { console.error('OpenAI practice error:', err) }
    }

    // 3. Try DeepSeek
    if (!questionsData && process.env.DEEPSEEK_API_KEY) {
      try {
        const res = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: 'You are a homework question generator. Always respond with valid JSON only, no markdown, no extra text.' },
              { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            max_tokens: 2000,
            temperature: 0.7,
          }),
        })
        const data = await res.json()
        if (res.ok) {
          const content = data.choices?.[0]?.message?.content ?? ''
          if (content) {
            const clean = content.replace(/```json/g, '').replace(/```/g, '').trim()
            try { questionsData = JSON.parse(clean) } catch { }
          }
        }
      } catch (err) { console.error('DeepSeek practice error:', err) }
    }

    // 4. Try Gemini (free)
    if (!questionsData && process.env.GEMINI_API_KEY) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2000,
              },
            }),
          }
        )
        const data = await res.json()
        console.log('Gemini practice status:', res.status)
        if (res.ok) {
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
          if (text) {
            const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
            try { questionsData = JSON.parse(clean) } catch { }
          }
        }
      } catch (err) { console.error('Gemini practice error:', err) }
    }

    // Fallback
    if (!questionsData || !Array.isArray(questionsData.questions)) {
      questionsData = {
        questions: [
          {
            id: '1',
            question: 'Could not generate questions. Please check your API keys in .env.local.',
            answer: 'Make sure at least one API key has credits: ANTHROPIC_API_KEY, OPENAI_API_KEY, DEEPSEEK_API_KEY, or GEMINI_API_KEY.',
            difficulty,
            subject,
          },
        ],
      }
    }

    return NextResponse.json(questionsData)

  } catch (error: any) {
    console.error('Practice route error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}