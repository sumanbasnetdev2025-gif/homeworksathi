export type Language = 'en' | 'ne'

export type UserPlan = 'free' | 'premium'

export type SolveStep = {
  stepNumber: number
  title: string
  explanation: string
  math?: string
}

export type Solution = {
  id: string
  question: string
  subject: string
  steps: SolveStep[]
  finalAnswer: string
  language: Language
  createdAt: string
}

export type UploadType = 'image' | 'text' | 'camera' | 'pdf'

export type SolveStep = {
  stepNumber: number
  title: string
  explanation: string
  math?: string
}

export type Solution = {
  id?: string
  question?: string
  subject?: string
  steps: SolveStep[]
  finalAnswer?: string
  final_answer?: string  // from DB
  language?: Language
  createdAt?: string
}