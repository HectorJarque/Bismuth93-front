import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/appStore'

export function useAutoSave(
  noteId: string | undefined,
  title: string,
  content: string,
  tags: string[],
  isPinned: boolean,
  delay = 1200
) {
  const updateNote = useAppStore((s) => s.updateNote)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!noteId) return
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      updateNote(noteId, title, content, tags, isPinned)
    }, delay)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [noteId, title, content, tags, isPinned])
}
