export interface Note {
  id: string
  title: string
  content: string
  notebookId: string
  tags: string[]
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateNoteRequest {
  title?: string
  content?: string
  notebookId: string
  tags?: string[]
}

export interface UpdateNoteRequest {
  title: string
  content: string
  tags: string[]
  isPinned: boolean
}
