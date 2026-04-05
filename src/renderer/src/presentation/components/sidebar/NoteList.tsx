import React from 'react'
import { useAppStore } from '../../store/appStore'
import { Note } from '../../../domain/Note'
import { Button } from '../ui/Button'
import { Pin, Trash2, PinOff } from 'lucide-react'

function NoteCard({ note }: { note: Note }) {
  const { activeNote, setActiveNote, deleteNote, pinNote } = useAppStore()
  const isActive = activeNote?.id === note.id

  const preview = note.content.replace(/<[^>]*>/g, '').slice(0, 60).trim()
  const date = new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

  return (
    <div
      onClick={() => setActiveNote(note)}
      className={`group relative px-2 py-2 rounded-md cursor-pointer transition-colors mb-0.5
        ${isActive ? 'bg-purple-600/20' : 'hover:bg-[var(--bg-overlay)]'}`}
    >
      <div className="flex items-start justify-between gap-1">
        <p className={`text-xs font-medium truncate ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
          {note.isPinned && <span className="mr-1 text-purple-400">📌</span>}
          {note.title || 'Untitled Note'}
        </p>
        <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0">{date}</span>
      </div>
      {preview && (
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">{preview}</p>
      )}
      {note.tags.length > 0 && (
        <div className="flex gap-1 mt-1">
          {note.tags.slice(0, 2).map((t) => (
            <span key={t} className="text-[10px] text-purple-400">#{t}</span>
          ))}
        </div>
      )}

      {/* Hover actions */}
      <div className="absolute right-1 top-1 hidden group-hover:flex gap-0.5">
        <button onClick={(e) => { e.stopPropagation(); pinNote(note.id, !note.isPinned) }}
          className="p-0.5 text-[var(--text-muted)] hover:text-purple-400 transition-colors">
          {note.isPinned ? <PinOff size={11} /> : <Pin size={11} />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); if (confirm('Delete note?')) deleteNote(note.id) }}
          className="p-0.5 text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors">
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  )
}

export function NoteList() {
  const { notes, isLoading, searchQuery } = useAppStore()

  if (isLoading) return (
    <div className="flex items-center justify-center h-20 text-[var(--text-muted)] text-xs">Loading…</div>
  )

  if (notes.length === 0) return (
    <div className="flex flex-col items-center justify-center h-24 text-[var(--text-muted)] text-xs gap-1">
      <span>{searchQuery ? '🔍 No results' : '📭 No notes yet'}</span>
      {!searchQuery && <span>Click "New Note" to start</span>}
    </div>
  )

  return (
    <div className="px-1 pb-2">
      {searchQuery && (
        <p className="text-[10px] text-[var(--text-muted)] px-1 py-1">
          {notes.length} result{notes.length !== 1 ? 's' : ''} for "{searchQuery}"
        </p>
      )}
      {notes.map((note) => <NoteCard key={note.id} note={note} />)}
    </div>
  )
}
