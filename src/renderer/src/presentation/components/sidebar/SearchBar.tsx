import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { useDebounce } from '../../hooks/useDebounce'
import { useEffect } from 'react'

export function SearchBar() {
  const { searchNotes, setActiveNotebook, loadNotes, activeNotebookId } = useAppStore()
  const [value, setValue] = useState('')
  const debounced = useDebounce(value, 350)

  useEffect(() => {
    if (debounced.trim()) searchNotes(debounced)
    else if (activeNotebookId) loadNotes(activeNotebookId)
  }, [debounced])

  const clear = () => { setValue('') }

  return (
    <div className="relative flex items-center">
      <Search size={13} className="absolute left-2.5 text-[var(--text-muted)] pointer-events-none" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search notes…"
        className="w-full pl-7 pr-7 py-1.5 text-xs bg-[var(--bg-overlay)] rounded-md
          border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
          focus:outline-none focus:ring-2 focus:ring-purple-500/50"
      />
      {value && (
        <button onClick={clear} className="absolute right-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          <X size={12} />
        </button>
      )}
    </div>
  )
}
