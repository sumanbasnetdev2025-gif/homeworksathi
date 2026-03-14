"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface TextInputProps {
  onQuestionReady: (text: string) => void;
  disabled?: boolean;
}

export default function TextInput({
  onQuestionReady,
  disabled,
}: TextInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onQuestionReady(text.trim());
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder="Type your homework question here...
e.g. If 2x² + 5x - 3 = 0, find the value of x using the quadratic formula."
        rows={6}
        className="w-full bg-[#0d1428] border border-[#1e2d47] rounded-2xl px-5 py-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-orange-500 transition-all resize-none leading-relaxed"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey) handleSubmit();
        }}
      />
      <div className="flex items-center justify-between">
        <span className="text-slate-600 text-xs">
          Press Ctrl+Enter to submit
        </span>
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || disabled}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-syne font-semibold px-4 py-2 rounded-xl transition-all text-sm"
        >
          <Send size={13} />
          Set Question ✓
        </button>
      </div>
    </div>
  );
}
