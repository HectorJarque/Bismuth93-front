import React from 'react'

interface Props { onRetry: () => void }

export function BackendErrorPage({ onRetry }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-[var(--text-primary)] bg-[var(--bg-base)]">
      <span className="text-5xl">⚠️</span>
      <h2 className="text-lg font-semibold">Cannot connect to backend</h2>
      <p className="text-sm text-[var(--text-muted)] text-center max-w-xs">
        Bismuth93 needs a local Java backend running on port 8765.
        Make sure Java 17+ is installed and the backend started.
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
      >
        Retry
      </button>
    </div>
  )
}
