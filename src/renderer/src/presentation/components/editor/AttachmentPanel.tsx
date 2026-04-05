import React, { useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import { Attachment } from '../../../domain/Attachment'
import { Button } from '../ui/Button'
import { Trash2, ExternalLink, FileText, Image, Film, Music, X } from 'lucide-react'

function fileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return <Image size={14} />
  if (mimeType.startsWith('video/')) return <Film size={14} />
  if (mimeType.startsWith('audio/')) return <Music size={14} />
  return <FileText size={14} />
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface AttachmentPanelProps { noteId: string; onClose: () => void }

export function AttachmentPanel({ noteId, onClose }: AttachmentPanelProps) {
  const { attachments, loadAttachments, deleteAttachment } = useAppStore()

  useEffect(() => { loadAttachments(noteId) }, [noteId])

  const open = (url: string) => {
    window.electronAPI?.openExternal(url) ?? window.open(url, '_blank')
  }

  return (
    <div className="border-t border-[var(--border)] bg-[var(--bg-surface)]" style={{ maxHeight: 200, overflowY: 'auto' }}>
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs font-semibold text-[var(--text-secondary)]">
          Attachments ({attachments.length})
        </span>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          <X size={13} />
        </button>
      </div>
      {attachments.length === 0 ? (
        <p className="px-4 pb-3 text-xs text-[var(--text-muted)]">No attachments yet. Drag & drop or paste files.</p>
      ) : (
        <div className="px-3 pb-2 space-y-1">
          {attachments.map((att) => (
            <div key={att.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--bg-overlay)] group">
              <span className="text-[var(--text-muted)]">{fileIcon(att.mimeType)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--text-primary)] truncate">{att.fileName}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{formatSize(att.fileSize)}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => open(att.url)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5" title="Open">
                  <ExternalLink size={12} />
                </button>
                <button onClick={() => deleteAttachment(att.id)} className="text-[var(--text-muted)] hover:text-[var(--danger)] p-0.5" title="Delete">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
