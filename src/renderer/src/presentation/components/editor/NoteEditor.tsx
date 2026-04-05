import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Typography from '@tiptap/extension-typography'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Youtube from '@tiptap/extension-youtube'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'

import { useAppStore } from '../../store/appStore'
import { useAutoSave } from '../../hooks/useAutoSave'
import { EditorToolbar } from './EditorToolbar'
import { AttachmentPanel } from './AttachmentPanel'
import { NoteMetaBar } from './NoteMetaBar'
import { Tag } from '../ui/Tag'
import { Input } from '../ui/Input'
import { Paperclip, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'

const lowlight = createLowlight(common)

export function NoteEditor() {
  const { activeNote, updateNote, uploadAttachment, toggleSidebar, isSidebarOpen } = useAppStore()
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [showAttachments, setShowAttachments] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder: 'Start writing your note…' }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
      Image.configure({ inline: false }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Typography,
      TextStyle,
      Color,
      Youtube.configure({ width: 640, height: 360 }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({ lowlight })
    ],
    content: '',
    editorProps: {
      handleClick: (view, pos, event) => {
        const target = event.target as HTMLElement
        const anchor = target.closest('a')
        if (anchor) {
          event.preventDefault()
          const href = anchor.getAttribute('href')
          if (href) window.electronAPI?.openExternal(href) ?? window.open(href, '_blank')
        }
        return false
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files
        if (files && files.length > 0 && activeNote) {
          event.preventDefault()
          Array.from(files).forEach(async (file) => {
            if (file.type.startsWith('image/')) {
              const att = await uploadAttachment(activeNote.id, file)
              editor?.chain().focus().setImage({ src: att.url }).run()
            } else {
              await uploadAttachment(activeNote.id, file)
              setShowAttachments(true)
            }
          })
          return true
        }
        return false
      },
      handlePaste: (view, event) => {
        const files = event.clipboardData?.files
        if (files && files.length > 0 && activeNote) {
          Array.from(files).forEach(async (file) => {
            if (file.type.startsWith('image/')) {
              const att = await uploadAttachment(activeNote.id, file)
              editor?.chain().focus().setImage({ src: att.url }).run()
            }
          })
          if (files.length > 0) return true
        }
        return false
      }
    }
  })

  // Sync active note into editor
  useEffect(() => {
    if (!activeNote) {
      setTitle('')
      setTags([])
      editor?.commands.setContent('')
      return
    }
    setTitle(activeNote.title)
    setTags(activeNote.tags)
    if (editor && editor.getHTML() !== activeNote.content) {
      editor.commands.setContent(activeNote.content, false)
    }
  }, [activeNote?.id])

  const content = editor?.getHTML() ?? ''
  useAutoSave(activeNote?.id, title, content, tags, activeNote?.isPinned ?? false)

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed])
    setTagInput('')
  }

  const handleImageInsert = async () => {
    if (!activeNote) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const att = await uploadAttachment(activeNote.id, file)
        editor?.chain().focus().setImage({ src: att.url }).run()
      }
    }
    input.click()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeNote || !e.target.files) return
    for (const file of Array.from(e.target.files)) {
      if (file.type.startsWith('image/')) {
        const att = await uploadAttachment(activeNote.id, file)
        editor?.chain().focus().setImage({ src: att.url }).run()
      } else {
        await uploadAttachment(activeNote.id, file)
      }
    }
    setShowAttachments(true)
    e.target.value = ''
  }

  if (!activeNote) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[var(--text-muted)]">
        {!isSidebarOpen && (
          <button onClick={toggleSidebar} className="absolute top-3 left-3 p-1.5 rounded hover:bg-[var(--bg-overlay)] transition-colors">
            <ChevronRight size={16} className="text-[var(--text-muted)]" />
          </button>
        )}
        <span className="text-5xl">📝</span>
        <p className="text-sm">Select or create a note to start writing</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top meta bar */}
      <NoteMetaBar note={activeNote} />

      {/* Toolbar */}
      <EditorToolbar editor={editor} onImageInsert={handleImageInsert} />

      {/* Title */}
      <div className="px-8 pt-5 pb-1">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title…"
          className="w-full text-2xl font-bold bg-transparent text-[var(--text-primary)]
            placeholder:text-[var(--text-muted)] border-none outline-none"
        />
      </div>

      {/* Tags */}
      <div className="px-8 pb-2 flex items-center flex-wrap gap-1.5">
        {tags.map((t) => (
          <Tag key={t} label={t} onRemove={() => setTags(tags.filter((x) => x !== t))} color="#7c3aed" />
        ))}
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() } }}
          placeholder="+ tag"
          className="text-xs bg-transparent text-[var(--text-muted)] border-none outline-none w-16 placeholder:text-[var(--text-muted)]"
        />
      </div>

      {/* Editor body */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <EditorContent editor={editor} className="min-h-full" />
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-[var(--border)] bg-[var(--bg-surface)]">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            icon={<Paperclip size={12} />}
            onClick={() => setShowAttachments(!showAttachments)}
            isActive={showAttachments}
          >
            Attachments
          </Button>
          <Button size="sm" onClick={() => fileInputRef.current?.click()}>
            + Upload
          </Button>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileUpload} />
        </div>
        <span className="text-[10px] text-[var(--text-muted)]">
          Saved automatically · {new Date(activeNote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {showAttachments && (
        <AttachmentPanel noteId={activeNote.id} onClose={() => setShowAttachments(false)} />
      )}
    </div>
  )
}
