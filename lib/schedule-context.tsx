'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { TimeSlot, SlotStatus, Settings, Participant, DAYS, DAY_LABELS, DayOfWeek } from '@/lib/types'
import { generateId, cn } from '@/lib/utils'

interface ScheduleContextType {
  slots: TimeSlot[]
  settings: Settings
  participants: Participant[]
  setSlotStatus: (day: DayOfWeek, hour: number, minute: number, status: SlotStatus) => void
  getSlotStatus: (day: DayOfWeek, hour: number, minute: number) => SlotStatus
  updateSettings: (settings: Partial<Settings>) => void
  addParticipant: (participant: Omit<Participant, 'id'>) => void
  removeParticipant: (id: string) => void
  clearAllSlots: () => void
  getAvailableSlots: () => TimeSlot[]
  getPreferredSlots: () => TimeSlot[]
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined)

const STORAGE_KEY = 'freeslot-schedule'
const SETTINGS_KEY = 'freeslot-settings'
const PARTICIPANTS_KEY = 'freeslot-participants'

function generateInitialSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  DAYS.forEach(day => {
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push({
          id: generateId(),
          day,
          hour,
          minute,
          status: 'empty'
        })
      }
    }
  })
  return slots
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Error loading from storage:', e)
  }
  return defaultValue
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Error saving to storage:', e)
  }
}

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [slots, setSlots] = useState<TimeSlot[]>(() => generateInitialSlots())
  const [settings, setSettings] = useState<Settings>(() => 
    loadFromStorage(SETTINGS_KEY, {
      duration: 30,
      timezone: 'America/New_York',
      workingHoursStart: 8,
      workingHoursEnd: 18
    })
  )
  const [participants, setParticipants] = useState<Participant[]>(() =>
    loadFromStorage(PARTICIPANTS_KEY, [])
  )

  // Load slots from storage on mount
  useEffect(() => {
    const stored = loadFromStorage<Record<string, SlotStatus>>(STORAGE_KEY, {})
    if (Object.keys(stored).length > 0) {
      setSlots(prev => prev.map(slot => ({
        ...slot,
        status: stored[`${slot.day}-${slot.hour}-${slot.minute}`] || slot.status
      })))
    }
  }, [])

  // Save slots to storage when they change
  useEffect(() => {
    const slotMap: Record<string, SlotStatus> = {}
    slots.forEach(slot => {
      if (slot.status !== 'empty') {
        slotMap[`${slot.day}-${slot.hour}-${slot.minute}`] = slot.status
      }
    })
    saveToStorage(STORAGE_KEY, slotMap)
  }, [slots])

  // Save settings
  useEffect(() => {
    saveToStorage(SETTINGS_KEY, settings)
  }, [settings])

  // Save participants
  useEffect(() => {
    saveToStorage(PARTICIPANTS_KEY, participants)
  }, [participants])

  const setSlotStatus = useCallback((day: DayOfWeek, hour: number, minute: number, status: SlotStatus) => {
    setSlots(prev => prev.map(slot => 
      slot.day === day && slot.hour === hour && slot.minute === minute
        ? { ...slot, status }
        : slot
    ))
  }, [])

  const getSlotStatus = useCallback((day: DayOfWeek, hour: number, minute: number): SlotStatus => {
    const slot = slots.find(s => s.day === day && s.hour === hour && s.minute === minute)
    return slot?.status || 'empty'
  }, [slots])

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const addParticipant = useCallback((participant: Omit<Participant, 'id'>) => {
    setParticipants(prev => [...prev, { ...participant, id: generateId() }])
  }, [])

  const removeParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id))
  }, [])

  const clearAllSlots = useCallback(() => {
    setSlots(prev => prev.map(slot => ({ ...slot, status: 'empty' })))
  }, [])

  const getAvailableSlots = useCallback(() => 
    slots.filter(s => s.status === 'available' || s.status === 'preferred'),
    [slots]
  )

  const getPreferredSlots = useCallback(() =>
    slots.filter(s => s.status === 'preferred'),
    [slots]
  )

  return (
    <ScheduleContext.Provider value={{
      slots,
      settings,
      participants,
      setSlotStatus,
      getSlotStatus,
      updateSettings,
      addParticipant,
      removeParticipant,
      clearAllSlots,
      getAvailableSlots,
      getPreferredSlots
    }}>
      {children}
    </ScheduleContext.Provider>
  )
}

export function useSchedule() {
  const context = useContext(ScheduleContext)
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider')
  }
  return context
}