import React from 'react'
import { Note } from '../../../domain/Note'
import { useAppStore } from '../../store/appStore'
import { Button } from '../ui/Button'
import { Pin, PinOff, Trash2, PanelLeftOpen } from 'lucide-react'

interface NoteMetaBarProps { note: Note }

export function NoteMetaBar({ note }: NoteMetaBarProps) {
  const { deleteNote, pinNote, toggleSidebar, isSidebarOpen, notebooks } = useAppStore()
  const notebook = notebooks.find((n) => n.id === note.notebookId)

  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border)] bg-[var(--bg-surface)]" style={{ WebkitAppRegion: 'drag' } as any}>
      <div className="flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
        {!isSidebarOpen && (
          <Button size="sm" icon={<PanelLeftOpen size={13} />} onClick={toggleSidebar} title="Show sidebar" />
        )}
        {notebook && (
          <span className="text-xs text-[var(--text-muted)]">
            {notebook.icon} {notebook.name}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <Button
          size="sm"
          icon={note.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
          onClick={() => pinNote(note.id, !note.isPinned)}
          title={note.isPinned ? 'Unpin' : 'Pin note'}
        />
        <Button
          size="sm"
          variant="danger"
          icon={<Trash2 size={13} />}
          onClick={() => { if (confirm('Delete this note?')) deleteNote(note.id) }}
          title="Delete note"
        />
      </div>
    </div>
  )
}
