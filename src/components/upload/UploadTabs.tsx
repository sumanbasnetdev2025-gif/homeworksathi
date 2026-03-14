'use client'

import { useState } from 'react'
import { Upload, Type, Camera } from 'lucide-react'
import UploadZone from './UploadZone'
import CameraCapture from './CameraCapture'
import TextInput from './TextInput'

interface UploadTabsProps {
  onQuestionReady: (text: string, imageUrl?: string) => void
  disabled?: boolean
}

const tabs = [
  { id: 'upload', label: 'Upload Image', icon: Upload },
  { id: 'text', label: 'Type Question', icon: Type },
  { id: 'camera', label: 'Camera', icon: Camera },
]

export default function UploadTabs({ onQuestionReady, disabled }: UploadTabsProps) {
  const [activeTab, setActiveTab] = useState('upload')

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex gap-1 bg-[#0d1428] border border-[#1e2d47] rounded-xl p-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={disabled}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-syne font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-[#111827] text-white border border-[#1e2d47]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon size={13} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'upload' && (
        <UploadZone onQuestionReady={onQuestionReady} disabled={disabled} />
      )}
      {activeTab === 'text' && (
        <TextInput onQuestionReady={onQuestionReady} disabled={disabled} />
      )}
      {activeTab === 'camera' && (
        <CameraCapture onQuestionReady={onQuestionReady} disabled={disabled} />
      )}
    </div>
  )
}