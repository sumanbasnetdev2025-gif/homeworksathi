'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE_MB } from '@/constants/limits'

export function useUpload() {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const validateFile = (file: File): string | null => {
    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      return 'Only JPG, PNG, and PDF files are supported'
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File size must be under ${MAX_FILE_SIZE_MB}MB`
    }
    return null
  }

  const uploadFile = async (file: File): Promise<string | null> => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return null
    }

    setError(null)
    setUploading(true)

    try {
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)
      }

      const ext = file.name.split('.').pop()
      const fileName = `${user?.id}/${Date.now()}.${ext}`

      const { data, error: uploadError } = await supabase.storage
        .from('homework-images')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('homework-images')
        .getPublicUrl(data.path)

      return urlData.publicUrl
    } catch (err: any) {
      setError(err.message ?? 'Upload failed')
      return null
    } finally {
      setUploading(false)
    }
  }

  const clearPreview = () => {
    setPreview(null)
    setError(null)
  }

  return { uploadFile, uploading, preview, error, clearPreview, validateFile }
}