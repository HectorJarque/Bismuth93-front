import React from 'react'
import { X } from 'lucide-react'

interface TagProps {
  label: string
  onRemove?: () => void
  color?: string
}

export function Tag({ label, onRemove, color }: TagProps) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: color ? `${color}30` : 'var(--bg-overlay)', color: color ?? 'var(--text-secondary)' }}
    >
      #{label}
      {onRemove && (
        <button onClick={onRemove} className="opacity-60 hover:opacity-100 transition-opacity">
          <X size={10} />
        </button>
      )}
    </span>
  )
}
