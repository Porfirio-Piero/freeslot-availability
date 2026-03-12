export type SlotStatus = 'available' | 'busy' | 'tentative' | 'preferred' | 'empty'

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'

export interface TimeSlot {
  id: string
  day: DayOfWeek
  hour: number
  minute: number
  status: SlotStatus
}

export interface Participant {
  id: string
  name: string
  email?: string
  role: string
  avatar?: string
  availability?: SlotStatus[]
}

export interface MeetingDuration {
  value: number
  label: string
}

export interface SuggestedSlot {
  id: string
  day: DayOfWeek
  dayLabel: string
  time: string
  hour: number
  minute: number
  score: number
  conflicts: string[]
}

export interface Workspace {
  id: string
  name: string
  logo?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  workspace: Workspace
}

export interface Settings {
  duration: number
  timezone: string
  workingHoursStart: number
  workingHoursEnd: number
}

export const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri'
}

export const DAY_FULL_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday'
}

export const DURATIONS: MeetingDuration[] = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '60 min' },
]

export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
  { value: 'UTC', label: 'UTC' },
]

export const STATUS_COLORS: Record<SlotStatus, { bg: string; text: string; border: string; glow?: string }> = {
  available: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    glow: 'shadow-emerald-200/50'
  },
  busy: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    glow: 'shadow-red-200/50'
  },
  tentative: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    glow: 'shadow-amber-200/50'
  },
  preferred: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-300',
    glow: 'shadow-blue-300/50 ring-2 ring-blue-400'
  },
  empty: {
    bg: 'bg-slate-50',
    text: 'text-slate-500',
    border: 'border-slate-200'
  }
}