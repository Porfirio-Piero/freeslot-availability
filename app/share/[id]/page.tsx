'use client';

import { useState, useEffect } from 'react';
import { AvailabilityData, AvailabilityStatus } from '../../types';
import { loadFromLocalStorage } from '../../utils';
import { Clock, ExternalLink, Users } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function SharePage() {
  const [data, setData] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);

  useEffect(() => {
    // Get share ID from URL path
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    setShareId(id);

    const loadSharedData = () => {
      try {
        const stored = loadFromLocalStorage();
        
        if (!stored) {
          setError('No availability data found. The link may be invalid or expired.');
          setLoading(false);
          return;
        }

        if (stored.shareId !== id) {
          setError('This availability link is invalid or has been updated.');
          setLoading(false);
          return;
        }

        setData(stored);
        setLoading(false);
      } catch (err) {
        console.error('Error loading shared data:', err);
        setError('Failed to load availability data.');
        setLoading(false);
      }
    };

    loadSharedData();
  }, []);

  const getStatusText = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'tentative': return 'Tentative';
    }
  };

  const getStatusIcon = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available': return '✅';
      case 'busy': return '❌';
      case 'tentative': return '⏳';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading availability...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Create Your Own Availability
          </a>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">📅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Data Found</h1>
          <p className="text-gray-600 mb-4">This availability data is not available.</p>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Go to FreeSlot
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">📅</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Availability Schedule
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Shared via FreeSlot
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Timezone: {data.timezone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Working Hours: {data.workingHours.start} - {data.workingHours.end}</span>
          </div>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex items-center justify-center gap-6 mb-6 bg-white rounded-lg shadow-sm p-4">
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
                  {DAYS.map(day => {
                    const status = data.slots[day][time];
                    return (
                      <td key={`${day}-${time}`} className="p-0 border-r border-gray-200 last:border-r-0">
                        <div
                          className={`availability-cell ${status} w-full h-8 cursor-default`}
                          title={`${day} ${time} - ${getStatusText(status)}`}
                        >
                          <div className="flex items-center justify-center h-full">
                            <span className="text-sm">{getStatusIcon(status)}</span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>Created on {new Date(data.createdAt).toLocaleDateString()}</p>
        <p className="mt-2">
          <span className="inline-flex items-center gap-1">
            <span>Powered by</span>
            <a href="/" className="text-blue-600 hover:underline font-medium">
              FreeSlot
            </a>
            <span>- Simple availability sharing</span>
          </span>
        </p>
      </div>
    </div>
  );
}