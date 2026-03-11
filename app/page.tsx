'use client';

import { useState, useEffect } from 'react';
import { AvailabilityData, AvailabilityStatus } from './types';
import { getInitialData, saveToLocalStorage, generateShareId } from './utils';
import { Share2, Settings, RefreshCw, Copy, Clock } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago', 
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
];

export default function Home() {
  const [data, setData] = useState<AvailabilityData | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    const initialData = getInitialData();
    setData(initialData);
  }, []);

  const updateSlotStatus = (day: string, time: string, newStatus: AvailabilityStatus) => {
    if (!data) return;

    const updatedSlots = {
      ...data.slots,
      [day]: {
        ...data.slots[day],
        [time]: newStatus
      }
    };

    const updatedData = { ...data, slots: updatedSlots };
    setData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const cycleStatus = (currentStatus: AvailabilityStatus): AvailabilityStatus => {
    const cycle: AvailabilityStatus[] = ['available', 'busy', 'tentative'];
    const currentIndex = cycle.indexOf(currentStatus);
    return cycle[(currentIndex + 1) % cycle.length];
  };

  const handleCellClick = (day: string, time: string) => {
    if (!data) return;
    
    const currentStatus = data.slots[day][time];
    const newStatus = cycleStatus(currentStatus);
    updateSlotStatus(day, time, newStatus);
  };

  const generateShareLink = async () => {
    if (!data) return;
    
    // Ensure we have a share ID
    if (!data.shareId) {
      const newShareId = generateShareId();
      const updatedData = { ...data, shareId: newShareId };
      setData(updatedData);
      saveToLocalStorage(updatedData);
    }

    const shareUrl = `${window.location.origin}/share/${data.shareId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const resetToAvailable = () => {
    if (!data) return;

    const resetSlots: Record<string, Record<string, AvailabilityStatus>> = {};
    DAYS.forEach(day => {
      resetSlots[day] = {};
      Object.keys(data.slots[day]).forEach(time => {
        resetSlots[day][time] = 'available';
      });
    });

    const updatedData = { ...data, slots: resetSlots };
    setData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const updateSettings = (newSettings: Partial<AvailabilityData>) => {
    if (!data) return;

    const updatedData = { ...data, ...newSettings };
    setData(updatedData);
    saveToLocalStorage(updatedData);
  };

  const getStatusColor = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available': return 'bg-available';
      case 'busy': return 'bg-busy';
      case 'tentative': return 'bg-tentative';
    }
  };

  const getStatusText = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'tentative': return 'Tentative';
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          📅 FreeSlot
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Professional Availability Messaging Tool
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Timezone: {data.timezone}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Working Hours: {data.workingHours.start} - {data.workingHours.end}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={generateShareLink}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {copiedShare ? 'Copied!' : 'Share Link'}
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
          
          <button
            onClick={resetToAvailable}
            className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset All
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="status-indicator available"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-indicator busy"></div>
            <span>Busy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-indicator tentative"></div>
            <span>Tentative</span>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={data.timezone}
                onChange={(e) => updateSettings({ timezone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {COMMON_TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Hours Start
              </label>
              <input
                type="time"
                value={data.workingHours.start}
                onChange={(e) => updateSettings({
                  workingHours: { ...data.workingHours, start: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Hours End
              </label>
              <input
                type="time"
                value={data.workingHours.end}
                onChange={(e) => updateSettings({
                  workingHours: { ...data.workingHours, end: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Availability Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="sticky left-0 bg-gray-50 w-20 px-3 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">
                  Time
                </th>
                {DAYS.map(day => (
                  <th key={day} className="px-3 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(data.slots.Monday).map(time => (
                <tr key={time} className="border-t border-gray-200">
                  <td className="sticky left-0 bg-white px-3 py-2 text-sm text-gray-700 border-r border-gray-200 font-medium">
                    {time}
                  </td>
                  {DAYS.map(day => (
                    <td key={`${day}-${time}`} className="p-0 border-r border-gray-200 last:border-r-0">
                      <button
                        onClick={() => handleCellClick(day, time)}
                        className={`availability-cell ${data.slots[day][time]} w-full h-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset`}
                        title={`${day} ${time} - ${getStatusText(data.slots[day][time])}`}
                      >
                        <div className="flex items-center justify-center h-full">
                          <div className={`status-indicator ${data.slots[day][time]} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                        </div>
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>Click any time slot to cycle through: Available → Busy → Tentative → Available</p>
        <p className="mt-1">All data is saved locally in your browser. No server required.</p>
      </div>
    </div>
  );
}