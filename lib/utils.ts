import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(hour: number): string {
  const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const ampm = hour < 12 ? 'AM' : 'PM'
  return `${h}:00 ${ampm}`
}

export function formatTimeSlot(hour: number, minute: number = 0): string {
  const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const ampm = hour < 12 ? 'AM' : 'PM'
  return minute === 0 ? `${h} ${ampm}` : `${h}:${minute.toString().padStart(2, '0')} ${ampm}`
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}