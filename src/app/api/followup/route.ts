import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const {
      followUpText,
      originalQuestion,
      subject,
      language,
      history = [],
      isDeepDive = false,
    } = await request.json()

    const langInstruction = language === 'ne'
      ? 'Respond in Nepali language (Devanagari script).'
      : 'Respond in English.'

    const systemPrompt = `You are HomeworkSathi, a friendly and expert tutor for Nepali high school students (Grade 8-12).
${langInstruction}
Subject: ${subject}
Original question: ${originalQuestion}
${isDeepDive ? 'This is a deep-dive explanation request. Be very thorough and educational.' : 'Answer the follow-up question clearly and concisely.'}
Keep your explanation suitable for a high school student. Be encouraging and clear.`

    const messages = [
      ...history.map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user', content: followUpText },
    ]

    let answer = ''

    // 1. Try Anthropic
    if (!answer && process.env.ANTHROPIC_API_KEY) {
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
            max_tokens: 1000,
            system: systemPrompt,
            messages,
          }),
        })
        const data = await res.json()
        if (res.ok) answer = data.content?.[0]?.text ?? ''
      } catch (err) { console.error('Anthropic followup error:', err) }
    }

    // 2. Try OpenAI
    if (!answer && process.env.OPENAI_API_KEY) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            max_tokens: 1000,
          }),
        })
        const data = await res.json()
        if (res.ok) answer = data.choices?.[0]?.message?.content ?? ''
      } catch (err) { console.error('OpenAI followup error:', err) }
    }

    // 3. Try DeepSeek
    if (!answer && process.env.DEEPSEEK_API_KEY) {
      try {
        const res = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        })
        const data = await res.json()
        if (res.ok) answer = data.choices?.[0]?.message?.content ?? ''
      } catch (err) { console.error('DeepSeek followup error:', err) }
    }

    // 4. Try Gemini (free)
    if (!answer && process.env.GEMINI_API_KEY) {
      try {
        const geminiMessages = [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'Understood. I will help as HomeworkSathi tutor.' }] },
          ...history.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          })),
          { role: 'user', parts: [{ text: followUpText }] },
        ]

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: geminiMessages,
              generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
            }),
          }
        )
        const data = await res.json()
        console.log('Gemini followup status:', res.status)
        if (res.ok) {
          answer = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        }
      } catch (err) { console.error('Gemini followup error:', err) }
    }

    if (!answer) {
      answer = 'Sorry, could not generate a response. Please check your API keys and try again.'
    }

    return NextResponse.json({ answer })

  } catch (error: any) {
    console.error('Followup route error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}