'use client'

import { useRef, useState, useCallback } from 'react'
import { Camera, X, Check, Loader2 } from 'lucide-react'
import { useUpload } from '@/hooks/useUpload'
import { toast } from 'sonner'

interface CameraCaptureProps {
  onQuestionReady: (text: string, imageUrl?: string) => void
  disabled?: boolean
}

export default function CameraCapture({ onQuestionReady, disabled }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [captured, setCaptured] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { uploadFile } = useUpload()

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch {
      toast.error('Camera access denied. Please allow camera permissions.')
    }
  }

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setCaptured(dataUrl)
    stopCamera()
  }

  const useCapture = async () => {
    if (!captured) return
    setProcessing(true)
    try {
      const res = await fetch(captured)
      const blob = await res.blob()
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
      const url = await uploadFile(file)
      if (url) {
        const ocrRes = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: url }),
        })
        const data = await ocrRes.json()
        onQuestionReady(data.text ?? '', url)
        toast.success('Photo captured and processed!')
      }
    } catch {
      toast.error('Failed to process photo')
    } finally {
      setProcessing(false)
    }
  }

  const retake = () => {
    setCaptured(null)
    startCamera()
  }

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />

      {!stream && !captured && (
        <div className="border-2 border-dashed border-[#1e2d47] rounded-2xl p-10 text-center">
          <div className="w-14 h-14 bg-[#1a2235] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera size={24} className="text-slate-400" />
          </div>
          <p className="text-white font-syne font-semibold text-sm mb-2">
            Use your camera
          </p>
          <p className="text-slate-500 text-xs mb-6">
            Take a photo of your homework question
          </p>
          <button
            onClick={startCamera}
            disabled={disabled}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-syne font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
          >
            <Camera size={14} />
            Open Camera
          </button>
        </div>
      )}

      {stream && (
        <div className="relative bg-black rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-h-72 object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={stopCamera}
              className="w-10 h-10 bg-[#0a0f1e]/80 rounded-full flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
            <button
              onClick={capturePhoto}
              className="w-14 h-14 bg-orange-500 hover:bg-orange-400 rounded-full flex items-center justify-center transition-all shadow-lg shadow-orange-500/30"
            >
              <Camera size={20} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {captured && (
        <div className="space-y-3">
          <div className="relative bg-[#111827] border border-[#1e2d47] rounded-2xl overflow-hidden">
            <img src={captured} alt="Captured" className="w-full max-h-64 object-contain p-4" />
          </div>
          <div className="flex gap-3">
            <button
              onClick={retake}
              className="flex-1 flex items-center justify-center gap-2 border border-[#1e2d47] hover:border-slate-500 text-slate-300 hover:text-white font-syne font-semibold py-2.5 rounded-xl transition-all text-sm"
            >
              <Camera size={14} />
              Retake
            </button>
            <button
              onClick={useCapture}
              disabled={processing}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-syne font-semibold py-2.5 rounded-xl transition-all text-sm"
            >
              {processing ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {processing ? 'Processing...' : 'Use Photo'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}