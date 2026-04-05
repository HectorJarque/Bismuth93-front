import { httpClient } from './httpClient'
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../../domain/Note'

export const noteApi = {
  list: (notebookId?: string, search?: string): Promise<Note[]> => {
    const params: Record<string, string> = {}
    if (notebookId) params.notebookId = notebookId
    if (search) params.search = search
    return httpClient.get('/api/notes', { params }).then((r) => r.data)
  },

  getById: (id: string): Promise<Note> =>
    httpClient.get(`/api/notes/${id}`).then((r) => r.data),

  create: (req: CreateNoteRequest): Promise<Note> =>
    httpClient.post('/api/notes', req).then((r) => r.data),

  update: (id: string, req: UpdateNoteRequest): Promise<Note> =>
    httpClient.put(`/api/notes/${id}`, req).then((r) => r.data),

  delete: (id: string): Promise<void> =>
    httpClient.delete(`/api/notes/${id}`).then(() => undefined),

  pin: (id: string, isPinned: boolean): Promise<Note> =>
    httpClient.patch(`/api/notes/${id}/pin`, { isPinned }).then((r) => r.data)
}
