import { create } from 'zustand'
import { Note } from '../../domain/Note'
import { Notebook } from '../../domain/Notebook'
import { Attachment } from '../../domain/Attachment'
import { noteApi } from '../../infrastructure/api/noteApi'
import { notebookApi } from '../../infrastructure/api/notebookApi'
import { attachmentApi } from '../../infrastructure/api/attachmentApi'

interface AppState {
  // Data
  notebooks: Notebook[]
  notes: Note[]
  attachments: Attachment[]
  activeNote: Note | null
  activeNotebookId: string | null
  searchQuery: string
  isLoading: boolean
  error: string | null
  isSidebarOpen: boolean
  theme: 'dark' | 'light'

  // Actions
  loadNotebooks: () => Promise<void>
  loadNotes: (notebookId?: string) => Promise<void>
  loadAttachments: (noteId: string) => Promise<void>
  setActiveNote: (note: Note | null) => void
  setActiveNotebook: (id: string | null) => void
  setSearchQuery: (q: string) => void
  createNote: (notebookId: string) => Promise<Note>
  updateNote: (id: string, title: string, content: string, tags: string[], isPinned: boolean) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  pinNote: (id: string, isPinned: boolean) => Promise<void>
  createNotebook: (name: string, color?: string, icon?: string) => Promise<void>
  deleteNotebook: (id: string) => Promise<void>
  uploadAttachment: (noteId: string, file: File) => Promise<Attachment>
  deleteAttachment: (id: string) => Promise<void>
  toggleSidebar: () => void
  toggleTheme: () => void
  searchNotes: (q: string) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  notebooks: [],
  notes: [],
  attachments: [],
  activeNote: null,
  activeNotebookId: null,
  searchQuery: '',
  isLoading: false,
  error: null,
  isSidebarOpen: true,
  theme: (localStorage.getItem('theme') as 'dark' | 'light') || 'dark',

  loadNotebooks: async () => {
    try {
      const notebooks = await notebookApi.list()
      set({ notebooks })
      if (!get().activeNotebookId && notebooks.length > 0) {
        set({ activeNotebookId: notebooks[0].id })
        get().loadNotes(notebooks[0].id)
      }
    } catch (e) { set({ error: 'Failed to load notebooks' }) }
  },

  loadNotes: async (notebookId?: string) => {
    set({ isLoading: true })
    try {
      const notes = await noteApi.list(notebookId)
      set({ notes, isLoading: false })
    } catch (e) { set({ isLoading: false, error: 'Failed to load notes' }) }
  },

  loadAttachments: async (noteId: string) => {
    try {
      const attachments = await attachmentApi.listForNote(noteId)
      set({ attachments })
    } catch { set({ attachments: [] }) }
  },

  setActiveNote: (note) => {
    set({ activeNote: note })
    if (note) get().loadAttachments(note.id)
  },

  setActiveNotebook: (id) => {
    set({ activeNotebookId: id, activeNote: null, searchQuery: '' })
    if (id) get().loadNotes(id)
  },

  setSearchQuery: (q) => set({ searchQuery: q }),

  searchNotes: async (q: string) => {
    set({ isLoading: true, searchQuery: q })
    try {
      const notes = await noteApi.list(undefined, q)
      set({ notes, isLoading: false, activeNotebookId: null })
    } catch { set({ isLoading: false }) }
  },

  createNote: async (notebookId: string) => {
    const note = await noteApi.create({ notebookId, title: 'Untitled Note', content: '' })
    set((s) => ({ notes: [note, ...s.notes], activeNote: note }))
    return note
  },

  updateNote: async (id, title, content, tags, isPinned) => {
    try {
      const updated = await noteApi.update(id, { title, content, tags, isPinned })
      set((s) => ({
        notes: s.notes.map((n) => (n.id === id ? updated : n)),
        activeNote: s.activeNote?.id === id ? updated : s.activeNote
      }))
    } catch { /* silent — retry on next save */ }
  },

  deleteNote: async (id) => {
    await noteApi.delete(id)
    set((s) => ({
      notes: s.notes.filter((n) => n.id !== id),
      activeNote: s.activeNote?.id === id ? null : s.activeNote
    }))
  },

  pinNote: async (id, isPinned) => {
    const updated = await noteApi.pin(id, isPinned)
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? updated : n)),
      activeNote: s.activeNote?.id === id ? updated : s.activeNote
    }))
  },

  createNotebook: async (name, color, icon) => {
    const nb = await notebookApi.create({ name, color, icon })
    set((s) => ({ notebooks: [...s.notebooks, nb] }))
  },

  deleteNotebook: async (id) => {
    await notebookApi.delete(id)
    set((s) => ({ notebooks: s.notebooks.filter((n) => n.id !== id) }))
  },

  uploadAttachment: async (noteId, file) => {
    const att = await attachmentApi.upload(noteId, file)
    set((s) => ({ attachments: [...s.attachments, att] }))
    return att
  },

  deleteAttachment: async (id) => {
    await attachmentApi.delete(id)
    set((s) => ({ attachments: s.attachments.filter((a) => a.id !== id) }))
  },

  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    set({ theme: next })
  }
}))
