'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Keyboard } from 'lucide-react'

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
}

const SHORTCUTS = [
  { key: 'A', description: 'Mark as Available', category: 'Status' },
  { key: 'B', description: 'Mark as Busy', category: 'Status' },
  { key: 'T', description: 'Mark as Tentative', category: 'Status' },
  { key: 'P', description: 'Mark as Preferred', category: 'Status' },
  { key: 'Esc', description: 'Clear selection / Clear all', category: 'Actions' },
  { key: '?', description: 'Show this help', category: 'Actions' },
  { key: 'D', description: 'Toggle dark mode', category: 'View' },
  { key: 'G', description: 'Generate meeting options', category: 'Actions' },
  { key: 'C', description: 'Copy proposal to clipboard', category: 'Actions' },
  { key: 'S', description: 'Share scheduling link', category: 'Actions' },
]

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Group shortcuts by category
  const categories = SHORTCUTS.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) acc[shortcut.category] = []
    acc[shortcut.category].push(shortcut)
    return acc
  }, {} as Record<string, typeof SHORTCUTS>)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Keyboard className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Keyboard Shortcuts
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {Object.entries(categories).map(([category, shortcuts]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {shortcuts.map((shortcut) => (
                      <div
                        key={shortcut.key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {shortcut.description}
                        </span>
                        <kbd className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 text-center">
                Press <kbd className="px-1.5 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 rounded">Esc</kbd> to close
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for keyboard shortcuts
export function useKeyboardShortcuts(onShowHelp: () => void) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger if typing in an input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    // Show help on '?'
    if (event.key === '?') {
      event.preventDefault()
      onShowHelp()
    }
  }, [onShowHelp])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}