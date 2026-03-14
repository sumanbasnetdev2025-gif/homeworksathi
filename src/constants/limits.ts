export const USAGE_LIMITS = {
  free: {
    dailyQuestions: 5,
    followUps: 0,
    practiceQuestions: false,
    history: false,
  },
  premium: {
    dailyQuestions: Infinity,
    followUps: Infinity,
    practiceQuestions: true,
    history: true,
  },
}

export const SUPPORTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
]

export const MAX_FILE_SIZE_MB = 10