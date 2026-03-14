export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          plan: 'free' | 'premium'
          daily_usage: number
          last_usage_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          plan?: 'free' | 'premium'
          daily_usage?: number
          last_usage_date?: string | null
        }
        Update: {
          name?: string | null
          plan?: 'free' | 'premium'
          daily_usage?: number
          last_usage_date?: string | null
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          user_id: string
          question_text: string
          subject: string
          image_url: string | null
          language: 'en' | 'ne'
          created_at: string
        }
        Insert: {
          user_id: string
          question_text: string
          subject: string
          image_url?: string | null
          language?: 'en' | 'ne'
        }
        Update: {
          question_text?: string
          subject?: string
        }
      }
      solutions: {
        Row: {
          id: string
          question_id: string
          steps: Json
          final_answer: string
          created_at: string
        }
        Insert: {
          question_id: string
          steps: Json
          final_answer: string
        }
        Update: {
          steps?: Json
          final_answer?: string
        }
      }
      followups: {
        Row: {
          id: string
          question_id: string
          user_id: string
          followup_text: string
          response: string
          created_at: string
        }
        Insert: {
          question_id: string
          user_id: string
          followup_text: string
          response: string
        }
        Update: never
      }
      practice_questions: {
        Row: {
          id: string
          user_id: string
          subject: string
          question_text: string
          answer: string
          difficulty: 'easy' | 'medium' | 'hard'
          created_at: string
        }
        Insert: {
          user_id: string
          subject: string
          question_text: string
          answer: string
          difficulty?: 'easy' | 'medium' | 'hard'
        }
        Update: never
      }
    }
  }
}