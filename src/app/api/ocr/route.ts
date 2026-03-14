import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL required' }, { status: 400 })
    }

    // Try Mathpix first if credentials available
    const mathpixAppId = process.env.MATHPIX_APP_ID
    const mathpixAppKey = process.env.MATHPIX_APP_KEY

    if (mathpixAppId && mathpixAppKey) {
      try {
        const res = await fetch('https://api.mathpix.com/v3/text', {
          method: 'POST',
          headers: {
            'app_id': mathpixAppId,
            'app_key': mathpixAppKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            src: imageUrl,
            formats: ['text', 'latex_simplified'],
            data_options: { include_asciimath: true },
          }),
        })
        const data = await res.json()
        if (data.text) {
          return NextResponse.json({ text: data.text, latex: data.latex_simplified })
        }
      } catch {
        // Fall through to Python service
      }
    }

    // Fallback to Python OCR service
    const pythonUrl = process.env.PYTHON_SERVICE_URL ?? 'http://localhost:8000'
    try {
      const res = await fetch(`${pythonUrl}/ocr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl }),
      })
      const data = await res.json()
      return NextResponse.json({ text: data.text ?? '' })
    } catch {
      // Python service not running, return empty
      return NextResponse.json({ text: '' })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}