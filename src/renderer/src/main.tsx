import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './presentation/styles/globals.css'

// Extend window with electron API
declare global {
  interface Window {
    electronAPI?: {
      openFile: () => Promise<string[]>
      openExternal: (url: string) => Promise<void>
      getVersion: () => Promise<string>
    }
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
