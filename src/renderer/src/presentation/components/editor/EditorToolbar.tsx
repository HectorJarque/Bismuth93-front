import React, { useState } from 'react'
import { Editor } from '@tiptap/react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare,
  Quote, Minus, Link as LinkIcon, Image as ImageIcon, Table,
  Highlighter, AlignLeft, Youtube, Undo, Redo, Type
} from 'lucide-react'

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  title: string
  children: React.ReactNode
  disabled?: boolean
}

function ToolbarButton({ onClick, isActive, title, children, disabled }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded text-xs transition-colors
        ${isActive ? 'bg-purple-600/30 text-purple-400' : 'text-[var(--text-muted)] hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)]'}
        disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-4 bg-[var(--border)] mx-0.5" />
}

interface EditorToolbarProps {
  editor: Editor | null
  onImageInsert: () => void
}

export function EditorToolbar({ editor, onImageInsert }: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)

  if (!editor) return null

  const setLink = () => {
    if (!showLinkInput) { setShowLinkInput(true); return }
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl, target: '_blank' }).run()
    }
    setLinkUrl(''); setShowLinkInput(false)
  }

  const insertYoutube = () => {
    if (!showYoutubeInput) { setShowYoutubeInput(true); return }
    if (youtubeUrl) editor.commands.setYoutubeVideo({ src: youtubeUrl })
    setYoutubeUrl(''); setShowYoutubeInput(false)
  }

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-1.5 border-b border-[var(--border)] bg-[var(--bg-surface)]">
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo (Ctrl+Z)" disabled={!editor.can().undo()}>
        <Undo size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo (Ctrl+Y)" disabled={!editor.can().redo()}>
        <Redo size={13} />
      </ToolbarButton>
      <Divider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
        <Heading1 size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
        <Heading2 size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
        <Heading3 size={13} />
      </ToolbarButton>
      <Divider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold (Ctrl+B)">
        <Bold size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic (Ctrl+I)">
        <Italic size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline (Ctrl+U)">
        <UnderlineIcon size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
        <Strikethrough size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Highlight">
        <Highlighter size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Inline Code">
        <Code size={13} />
      </ToolbarButton>
      <Divider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
        <List size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
        <ListOrdered size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} title="Task List">
        <CheckSquare size={13} />
      </ToolbarButton>
      <Divider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
        <Quote size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
        <Type size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
        <Minus size={13} />
      </ToolbarButton>
      <Divider />

      <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Insert Link">
        <LinkIcon size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={onImageInsert} title="Insert Image">
        <ImageIcon size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={insertTable} title="Insert Table">
        <Table size={13} />
      </ToolbarButton>
      <ToolbarButton onClick={insertYoutube} title="Embed YouTube">
        <Youtube size={13} />
      </ToolbarButton>

      {showLinkInput && (
        <input
          autoFocus
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') setLink(); if (e.key === 'Escape') setShowLinkInput(false) }}
          placeholder="https://…  then Enter"
          className="text-xs px-2 py-1 rounded bg-[var(--bg-overlay)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-purple-500"
          style={{ width: 200 }}
        />
      )}
      {showYoutubeInput && (
        <input
          autoFocus
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') insertYoutube(); if (e.key === 'Escape') setShowYoutubeInput(false) }}
          placeholder="YouTube URL… then Enter"
          className="text-xs px-2 py-1 rounded bg-[var(--bg-overlay)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-purple-500"
          style={{ width: 200 }}
        />
      )}
    </div>
  )
}
