import React, { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { NotebookList } from './NotebookList'
import { NoteList } from './NoteList'
import { SearchBar } from './SearchBar'
import { Button } from '../ui/Button'
import { PenLine, Settings, Sun, Moon, PanelLeftClose } from 'lucide-react'

export function Sidebar() {
  const { createNote, activeNotebookId, isSidebarOpen, toggleSidebar, theme, toggleTheme } = useAppStore()

  const handleNewNote = async () => {
    if (!activeNotebookId) return
    await createNote(activeNotebookId)
  }

  if (!isSidebarOpen) return null

  return (
    <aside
      className="flex flex-col border-r border-[var(--border)] select-none"
      style={{ width: 260, minWidth: 180, background: 'var(--bg-surface)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1" style={{ WebkitAppRegion: 'drag' } as any}>
        <span className="font-bold text-sm text-[var(--text-primary)] tracking-wide flex items-center gap-1.5">
          <span className="text-base">📝</span> NoteFlow
        </span>
        <div className="flex items-center gap-0.5" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <Button size="sm" icon={theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />} onClick={toggleTheme} title="Toggle theme" />
          <Button size="sm" icon={<PanelLeftClose size={13} />} onClick={toggleSidebar} title="Collapse sidebar" />
        </div>
      </div>

      {/* Search */}
      <div className="px-2 py-1.5">
        <SearchBar />
      </div>

      {/* New Note */}
      <div className="px-2 pb-1">
        <Button
          variant="primary"
          size="sm"
          icon={<PenLine size={13} />}
          className="w-full justify-start"
          onClick={handleNewNote}
          disabled={!activeNotebookId}
        >
          New Note
        </Button>
      </div>

      {/* Notebooks */}
      <div className="px-2 pb-1">
        <NotebookList />
      </div>

      {/* Notes for active notebook */}
      <div className="flex-1 overflow-y-auto px-1">
        <NoteList />
      </div>
    </aside>
  )
}
