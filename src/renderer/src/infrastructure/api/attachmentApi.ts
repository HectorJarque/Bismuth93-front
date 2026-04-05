import { httpClient } from './httpClient'
import { Attachment } from '../../domain/Attachment'

export const attachmentApi = {
  listForNote: (noteId: string): Promise<Attachment[]> =>
    httpClient.get(`/api/attachments/note/${noteId}`).then((r) => r.data),

  upload: (noteId: string, file: File): Promise<Attachment> => {
    const form = new FormData()
    form.append('file', file)
    return httpClient
      .post(`/api/attachments/note/${noteId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((r) => r.data)
  },

  delete: (id: string): Promise<void> =>
    httpClient.delete(`/api/attachments/${id}`).then(() => undefined)
}
