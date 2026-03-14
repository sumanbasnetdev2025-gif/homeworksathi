import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    gemini: !!process.env.GEMINI_API_KEY,
    geminiStart: process.env.GEMINI_API_KEY?.substring(0, 8),
    deepseek: !!process.env.DEEPSEEK_API_KEY,
    deepseekStart: process.env.DEEPSEEK_API_KEY?.substring(0, 8),
    openai: !!process.env.OPENAI_API_KEY,
    openaiStart: process.env.OPENAI_API_KEY?.substring(0, 8),
  })
}