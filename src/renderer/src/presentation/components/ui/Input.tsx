import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

export function Input({ icon, className = '', ...props }: InputProps) {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-2.5 text-[var(--text-muted)] pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={`w-full bg-[var(--bg-overlay)] text-[var(--text-primary)] rounded-md
          border border-[var(--border)] placeholder:text-[var(--text-muted)]
          focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent
          ${icon ? 'pl-8' : 'pl-3'} pr-3 py-1.5 text-sm transition-colors ${className}`}
        {...props}
      />
    </div>
  )
}
