export type Language = 'en' | 'ne'

export type UserPlan = 'free' | 'premium'

export type SolveStep = {
  stepNumber: number
  title: string
  explanation: string
  content?: string
  math?: string
}

export type Solution = {
  id?: string
  question?: string
  subject?: string
  steps: SolveStep[]
  finalAnswer?: string
  final_answer?: string
  language?: Language
  createdAt?: string
}

export type UploadType = 'image' | 'camera' | 'text'

export type QuestionHistory = {
  id: string
  question_text: string
  subject: string
  image_url?: string
  language: Language
  created_at: string
  solutions?: {
    id: string
    steps: SolveStep[]
    final_answer: string
  }[]
}

export type User = {
  id: string
  email: string
  name?: string
  plan: UserPlan
  daily_usage: number
  last_usage_date?: string
  created_at: string
}