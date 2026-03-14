'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { USAGE_LIMITS } from '@/constants/limits'

export function useUsageLimit() {
  const { user } = useAuth()
  const [dailyUsage, setDailyUsage] = useState(0)
  const [plan, setPlan] = useState<'free' | 'premium'>('free')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const limit = USAGE_LIMITS[plan].dailyQuestions
  const remaining = plan === 'premium' ? Infinity : Math.max(0, limit - dailyUsage)
  const canAsk = plan === 'premium' || dailyUsage < limit

  useEffect(() => {
    if (!user) return
    fetchUsage()
  }, [user])

  const fetchUsage = async () => {
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('daily_usage, plan, last_usage_date')
      .eq('id', user.id)
      .single()

    if (data) {
      const today = new Date().toISOString().split('T')[0]
      if (data.last_usage_date !== today) {
        setDailyUsage(0)
      } else {
        setDailyUsage(data.daily_usage ?? 0)
      }
      setPlan(data.plan ?? 'free')
    }
    setLoading(false)
  }

  const incrementUsage = async () => {
    if (!user) return
    const newUsage = dailyUsage + 1
    setDailyUsage(newUsage)
    await supabase
      .from('profiles')
      .update({
        daily_usage: newUsage,
        last_usage_date: new Date().toISOString().split('T')[0],
      })
      .eq('id', user.id)
  }

  return { dailyUsage, plan, limit, remaining, canAsk, loading, incrementUsage, refetch: fetchUsage }
}