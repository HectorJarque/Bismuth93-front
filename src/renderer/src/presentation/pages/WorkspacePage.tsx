import React, { useEffect } from 'react'
import { useAppStore } from '../store/appStore'
import { Sidebar } from '../components/sidebar/Sidebar'
import { NoteEditor } from '../components/editor/NoteEditor'
import { PanelLeftOpen } from 'lucide-react'

export function WorkspacePage() {
  const { loadNotebooks, isSidebarOpen, toggleSidebar, theme } = useAppStore()

  useEffect(() => { loadNotebooks() }, [])

  return (
    <div className={`flex h-full overflow-hidden ${theme}`} style={{ background: 'var(--bg-base)' }}>
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute top-2 left-2 z-10 p-1.5 rounded hover:bg-[var(--bg-overlay)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <PanelLeftOpen size={16} />
        </button>
      )}
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <NoteEditor />
      </main>
    </div>
  )
}
