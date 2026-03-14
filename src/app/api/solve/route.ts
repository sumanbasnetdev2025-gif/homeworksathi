import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { questionText, subject, imageUrl, language } = await request.json()

    if (!questionText && !imageUrl) {
      return NextResponse.json({ error: 'Question or image required' }, { status: 400 })
    }

    const langInstruction = language === 'ne'
      ? 'Respond entirely in Nepali language (Devanagari script).'
      : 'Respond in English.'

    const prompt = `You are HomeworkSathi, an expert homework tutor for Nepali high school students (Grade 8-12).

Subject: ${subject}
Question: ${questionText || 'See the uploaded image'}
${imageUrl ? `Image URL: ${imageUrl}` : ''}

${langInstruction}

Solve this step by step. Respond with ONLY valid JSON in this exact format:
{
  "steps": [
    {
      "stepNumber": 1,
      "title": "Short step title",
      "explanation": "Clear explanation of this step",
      "math": "Mathematical expression if any (optional)"
    }
  ],
  "finalAnswer": "The final answer clearly stated"
}

Rules:
- Use 3-6 steps
- Each step must be clear and educational
- Explain WHY not just WHAT
- Keep language simple for high school students`

    let solutionData: any = null

    // 1. Try Anthropic
    if (!solutionData && process.env.ANTHROPIC_API_KEY) {
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
        console.log('Anthropic status:', res.status)
        if (res.ok) {
          const text = data.content?.[0]?.text ?? ''
          if (text) {
            const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
            try { solutionData = JSON.parse(clean) }
            catch { solutionData = { steps: [{ stepNumber: 1, title: 'Solution', explanation: text, math: '' }], finalAnswer: 'See explanation above' } }
          }
        }
      } catch (err) { console.error('Anthropic error:', err) }
    }

    // 2. Try OpenAI
    if (!solutionData && process.env.OPENAI_API_KEY) {
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
        console.log('OpenAI status:', res.status)
        if (res.ok) {
          const content = data.choices?.[0]?.message?.content ?? ''
          if (content) {
            try { solutionData = JSON.parse(content) }
            catch { solutionData = { steps: [{ stepNumber: 1, title: 'Solution', explanation: content, math: '' }], finalAnswer: 'See explanation above' } }
          }
        }
      } catch (err) { console.error('OpenAI error:', err) }
    }

    // 3. Try DeepSeek
    if (!solutionData && process.env.DEEPSEEK_API_KEY) {
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
              { role: 'system', content: 'You are a helpful homework tutor. Always respond with valid JSON only, no markdown, no extra text.' },
              { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            max_tokens: 2000,
            temperature: 0.7,
          }),
        })
        const data = await res.json()
        console.log('DeepSeek status:', res.status)
        if (res.ok) {
          const content = data.choices?.[0]?.message?.content ?? ''
          if (content) {
            const clean = content.replace(/```json/g, '').replace(/```/g, '').trim()
            try { solutionData = JSON.parse(clean) }
            catch { solutionData = { steps: [{ stepNumber: 1, title: 'Solution', explanation: content, math: '' }], finalAnswer: 'See explanation above' } }
          }
        }
      } catch (err) { console.error('DeepSeek error:', err) }
    }

    // 4. Try Gemini (free)
    if (!solutionData && process.env.GEMINI_API_KEY) {
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
        console.log('Gemini status:', res.status)
        console.log('Gemini response:', JSON.stringify(data).substring(0, 300))
        if (res.ok) {
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
          if (text) {
            const clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
            try { solutionData = JSON.parse(clean) }
            catch { solutionData = { steps: [{ stepNumber: 1, title: 'Solution', explanation: text, math: '' }], finalAnswer: 'See explanation above' } }
          }
        }
      } catch (err) { console.error('Gemini error:', err) }
    }

    // Final fallback
    if (!solutionData) {
      solutionData = {
        steps: [{
          stepNumber: 1,
          title: 'No API Key Working',
          explanation: 'All AI providers failed. Please check: 1) Your API keys in .env.local are correct 2) You have credits 3) You restarted the server after adding keys.',
          math: '',
        }],
        finalAnswer: 'Please check your API keys and try again.',
      }
    }

    // Safety checks
    if (!Array.isArray(solutionData.steps)) solutionData.steps = []
    if (!solutionData.finalAnswer) solutionData.finalAnswer = 'See steps above'

    return NextResponse.json({ solution: solutionData })

  } catch (error: any) {
    console.error('Solve route error:', error)
    return NextResponse.json(
      { error: error.message ?? 'Failed to solve' },
      { status: 500 }
    )
  }
}