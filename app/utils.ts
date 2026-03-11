import { AvailabilityData, AvailabilityStatus } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'freeslot-availability';

export function generateShareId(): string {
  return uuidv4();
}

export function saveToLocalStorage(data: AvailabilityData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage(): AvailabilityData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
}

export function initializeAvailabilityData(): AvailabilityData {
  const now = new Date().toISOString();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const slots: Record<string, Record<string, AvailabilityStatus>> = {};
  const notes: Record<string, Record<string, string>> = {};

  // Initialize slots for each day with 30-minute intervals
  for (const day of days) {
    slots[day] = {};
    notes[day] = {};
    
    // Generate time slots from 8:00 AM to 6:00 PM (8 AM to 6 PM)
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots[day][time] = 'available';
        notes[day][time] = '';
      }
    }
  }

  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    workingHours: { start: '08:00', end: '18:00' },
    slots,
    notes,
    shareId: generateShareId(),
    createdAt: now,
  };
}

export function getInitialData(): AvailabilityData {
  const existing = loadFromLocalStorage();
  return existing || initializeAvailabilityData();
}