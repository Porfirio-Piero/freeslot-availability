'use client'

import { useEffect, useCallback } from 'react'
import { SlotStatus, DayOfWeek } from '@/lib/types'
import { useSchedule } from './schedule-context'

interface KeyboardShortcut {
  key: string
  action: () => void
  description: string
}

export function useKeyboardShortcuts() {
  const { setSlotStatus, clearAllSlots } = useSchedule()

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'a',
      action: () => console.log('Mark as available'),
      description: 'Mark selected cells as Available'
    },
    {
      key: 'b',
      action: () => console.log('Mark as busy'),
      description: 'Mark selected cells as Busy'
    },
    {
      key: 't',
      action: () => console.log('Mark as tentative'),
      description: 'Mark selected cells as Tentative'
    },
    {
      key: 'p',
      action: () => console.log('Mark as preferred'),
      description: 'Mark selected cells as Preferred'
    },
    {
      key: 'Escape',
      action: () => clearAllSlots(),
      description: 'Clear selection'
    }
  ]

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger if user is typing in an input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }

    // This is a placeholder - in real implementation, we'd track selected cells
    // and apply the status to them
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return { shortcuts }
}

export function getShortcutHelp(): { key: string; description: string }[] {
  return [
    { key: 'A', description: 'Mark as Available' },
    { key: 'B', description: 'Mark as Busy' },
    { key: 'T', description: 'Mark as Tentative' },
    { key: 'P', description: 'Mark as Preferred' },
    { key: 'Esc', description: 'Clear selection' },
    { key: 'Drag', description: 'Select multiple cells' },
    { key: '?', description: 'Show shortcuts' }
  ]
}