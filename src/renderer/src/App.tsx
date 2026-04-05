import React, { useState, useEffect } from 'react'
import { WorkspacePage } from './presentation/pages/WorkspacePage'
import { BackendErrorPage } from './presentation/pages/BackendErrorPage'
import { httpClient } from './infrastructure/api/httpClient'

type ConnectionState = 'checking' | 'ok' | 'error'

export function App() {
  const [state, setState] = useState<ConnectionState>('checking')

  const check = async () => {
    setState('checking')
    try {
      await httpClient.get('/api/notebooks', { timeout: 4000 })
      setState('ok')
    } catch {
      setState('error')
    }
  }

  useEffect(() => { check() }, [])

  if (state === 'checking') {
    return (
      <div className="h-full flex items-center justify-center bg-[#1e1e2e]">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl animate-pulse">📝</span>
          <p className="text-sm text-[#a6adc8]">Starting bismuth93…</p>
        </div>
      </div>
    )
  }

  if (state === 'error') return <BackendErrorPage onRetry={check} />
  return <WorkspacePage />
}
