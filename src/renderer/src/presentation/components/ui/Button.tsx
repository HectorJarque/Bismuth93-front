import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
}

const variantStyles: Record<string, string> = {
  primary: 'bg-purple-600 hover:bg-purple-700 text-white',
  ghost: 'bg-transparent hover:bg-[var(--bg-overlay)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  danger: 'bg-transparent hover:bg-red-500/20 text-[var(--danger)]',
  secondary: 'bg-[var(--bg-overlay)] hover:bg-[var(--border)] text-[var(--text-primary)]'
}

const sizeStyles: Record<string, string> = {
  sm: 'h-7 px-2 text-xs gap-1',
  md: 'h-8 px-3 text-sm gap-1.5',
  lg: 'h-10 px-4 text-sm gap-2'
}

export function Button({ variant = 'ghost', size = 'md', icon, children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-purple-500/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  )
}
