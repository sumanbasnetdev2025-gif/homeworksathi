'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useUpload } from '@/hooks/useUpload'
import { Upload, X, FileImage, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface UploadZoneProps {
  onQuestionReady: (text: string, imageUrl?: string) => void
  disabled?: boolean
}

export default function UploadZone({ onQuestionReady, disabled }: UploadZoneProps) {
  const { uploadFile, uploading, preview, error, clearPreview } = useUpload()
  const [extracting, setExtracting] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const processFile = async (file: File) => {
    const url = await uploadFile(file)
    if (!url) return
    setUploadedUrl(url)

    // Extract text via OCR
    setExtracting(true)
    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url }),
      })
      const data = await res.json()
      if (data.text) {
        onQuestionReady(data.text, url)
        toast.success('Text extracted from image!')
      } else {
        // Even without OCR text, pass image url
        onQuestionReady('', url)
        toast.info('Image uploaded. You can also type additional context.')
      }
    } catch {
      onQuestionReady('', url)
    } finally {
      setExtracting(false)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) processFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: disabled || uploading || extracting,
  })

  const isLoading = uploading || extracting

  return (
    <div>
      {!preview ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-orange-500 bg-orange-500/5'
              : 'border-[#1e2d47] hover:border-slate-500 hover:bg-[#111827]/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              isDragActive ? 'bg-orange-500/20' : 'bg-[#1a2235]'
            }`}>
              <Upload size={24} className={isDragActive ? 'text-orange-400' : 'text-slate-400'} />
            </div>
            <div>
              <p className="text-white font-syne font-semibold text-sm">
                {isDragActive ? 'Drop it here!' : 'Drag & drop your homework'}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                or <span className="text-orange-400">browse files</span> · JPG, PNG, PDF up to 10MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-[#111827] border border-[#1e2d47] rounded-2xl overflow-hidden">
          <img
            src={preview}
            alt="Uploaded homework"
            className="w-full max-h-64 object-contain p-4"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-[#0a0f1e]/80 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="text-orange-400 animate-spin" />
                <p className="text-white text-sm font-syne font-semibold">
                  {uploading ? 'Uploading...' : 'Extracting text...'}
                </p>
              </div>
            </div>
          )}
          {!isLoading && (
            <button
              onClick={clearPreview}
              className="absolute top-3 right-3 w-7 h-7 bg-[#0a0f1e]/80 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
          {uploadedUrl && !isLoading && (
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                <FileImage size={14} className="text-emerald-400" />
                <span className="text-emerald-400 text-xs font-medium">
                  Image uploaded and text extracted successfully
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  )
}