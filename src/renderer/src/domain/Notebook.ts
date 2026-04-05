export interface Notebook {
  id: string
  name: string
  color: string | null
  icon: string | null
  parentId: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateNotebookRequest {
  name: string
  color?: string
  icon?: string
  parentId?: string
}

export interface UpdateNotebookRequest {
  name: string
  color?: string
  icon?: string
}
