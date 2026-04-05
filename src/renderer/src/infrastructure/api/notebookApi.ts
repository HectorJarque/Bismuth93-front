import { httpClient } from './httpClient'
import { Notebook, CreateNotebookRequest, UpdateNotebookRequest } from '../../domain/Notebook'

export const notebookApi = {
  list: (): Promise<Notebook[]> =>
    httpClient.get('/api/notebooks').then((r) => r.data),

  create: (req: CreateNotebookRequest): Promise<Notebook> =>
    httpClient.post('/api/notebooks', req).then((r) => r.data),

  update: (id: string, req: UpdateNotebookRequest): Promise<Notebook> =>
    httpClient.put(`/api/notebooks/${id}`, req).then((r) => r.data),

  delete: (id: string): Promise<void> =>
    httpClient.delete(`/api/notebooks/${id}`).then(() => undefined)
}
