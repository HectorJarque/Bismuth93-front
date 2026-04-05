import React, { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Plus, BookOpen, Trash2, ChevronDown, ChevronRight } from 'lucide-react'

const NOTEBOOK_COLORS = ['#7c3aed','#2563eb','#059669','#d97706','#dc2626','#db2777','#0891b2']
const NOTEBOOK_ICONS = ['📓','📔','📒','📕','📗','📘','📙','🗒️','✏️','🔬','💼','🎨','🎵','🏋️']

export function NotebookList() {
  const { notebooks, activeNotebookId, setActiveNotebook, createNotebook, deleteNotebook } = useAppStore()
  const [isOpen, setIsOpen] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState(NOTEBOOK_COLORS[0])
  const [icon, setIcon] = useState(NOTEBOOK_ICONS[0])

  const handleCreate = async () => {
    if (!name.trim()) return
    await createNotebook(name.trim(), color, icon)
    setName(''); setShowModal(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between py-1 px-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hover:text-[var(--text-secondary)] transition-colors"
        >
          {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          Notebooks
        </button>
        <Button size="sm" icon={<Plus size={12} />} onClick={() => setShowModal(true)} title="New notebook" />
      </div>

      {isOpen && (
        <div className="space-y-0.5">
          {notebooks.map((nb) => (
            <div key={nb.id} className="group flex items-center gap-1.5">
              <button
                onClick={() => setActiveNotebook(nb.id)}
                className={`flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs truncate transition-colors
                  ${activeNotebookId === nb.id
                    ? 'bg-purple-600/20 text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)]'}`}
              >
                <span>{nb.icon ?? '📓'}</span>
                <span className="truncate">{nb.name}</span>
                {nb.color && (
                  <span className="ml-auto w-2 h-2 rounded-full flex-shrink-0" style={{ background: nb.color }} />
                )}
              </button>
              <button
                onClick={() => { if (confirm('Delete notebook?')) deleteNotebook(nb.id) }}
                className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--danger)] transition-all p-0.5"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Notebook">
        <div className="space-y-3">
          <Input placeholder="Notebook name…" value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()} autoFocus />
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1.5">Icon</p>
            <div className="flex flex-wrap gap-1.5">
              {NOTEBOOK_ICONS.map((ic) => (
                <button key={ic} onClick={() => setIcon(ic)}
                  className={`w-8 h-8 rounded text-base flex items-center justify-center transition-colors
                    ${icon === ic ? 'bg-purple-600/30 ring-1 ring-purple-500' : 'hover:bg-[var(--bg-overlay)]'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1.5">Color</p>
            <div className="flex gap-2">
              {NOTEBOOK_COLORS.map((c) => (
                <button key={c} onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-[var(--border)] scale-110' : 'hover:scale-105'}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>
          <Button variant="primary" size="md" className="w-full" onClick={handleCreate}>
            Create Notebook
          </Button>
        </div>
      </Modal>
    </div>
  )
}
