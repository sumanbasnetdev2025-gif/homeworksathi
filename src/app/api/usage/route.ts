import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data } = await supabase
      .from('profiles')
      .select('daily_usage, plan, last_usage_date')
      .eq('id', user.id)
      .single()

    const today = new Date().toISOString().split('T')[0]
    const dailyUsage = data?.last_usage_date === today ? (data?.daily_usage ?? 0) : 0

    return NextResponse.json({
      dailyUsage,
      plan: data?.plan ?? 'free',
      limit: data?.plan === 'premium' ? null : 5,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}