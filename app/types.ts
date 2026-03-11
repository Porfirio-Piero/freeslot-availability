export type AvailabilityStatus = 'available' | 'busy' | 'tentative';

export interface AvailabilityData {
  timezone: string;
  workingHours: { start: string; end: string };
  slots: Record<string, Record<string, AvailabilityStatus>>;
  notes: Record<string, Record<string, string>>;
  shareId: string;
  createdAt: string;
}

export interface TimeSlot {
  day: string;
  time: string;
  status: AvailabilityStatus;
  note?: string;
}

export interface Settings {
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
}