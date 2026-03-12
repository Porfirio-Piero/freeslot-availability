'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSchedule } from '@/lib/schedule-context'
import { DAYS, DAY_LABELS, DAY_FULL_LABELS, SlotStatus, STATUS_COLORS } from '@/lib/types'
import { cn, formatTimeSlot } from '@/lib/utils'

export function CalendarGrid() {
  const { slots, settings, setSlotStatus, getSlotStatus } = useSchedule()
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<SlotStatus>('available')

  // Generate hours based on working hours
  const hours = useMemo(() => {
    const h = []
    for (let i = settings.workingHoursStart; i < settings.workingHoursEnd; i++) {
      h.push(i)
    }
    return h
  }, [settings.workingHoursStart, settings.workingHoursEnd])

  // Handle cell click
  const handleCellClick = useCallback((day: string, hour: number, minute: number) => {
    const currentStatus = getSlotStatus(day as any, hour, minute)
    const nextStatus: SlotStatus = currentStatus === 'empty' ? selectedStatus :
                                   currentStatus === selectedStatus ? 'empty' :
                                   selectedStatus
    setSlotStatus(day as any, hour, minute, nextStatus)
  }, [getSlotStatus, selectedStatus, setSlotStatus])

  // Get cell status
  const getCellStatus = useCallback((day: string, hour: number, minute: number): SlotStatus => {
    return getSlotStatus(day as any, hour, minute)
  }, [getSlotStatus])

  // Status selector
  const statusButtons: { status: SlotStatus; label: string }[] = [
    { status: 'available', label: 'Available' },
    { status: 'busy', label: 'Busy' },
    { status: 'tentative', label: 'Tentative' },
    { status: 'preferred', label: 'Preferred' }
  ]

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Status Toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Mark as:</span>
        {statusButtons.map(({ status, label }) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedStatus(status)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
              status === 'empty' && 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
              status === 'available' && 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-400',
              status === 'busy' && 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400',
              status === 'tentative' && 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400',
              status === 'preferred' && 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400',
              selectedStatus === status && 'ring-2 ring-offset-1 ring-blue-400'
            )}
          >
            {label}
          </motion.button>
        ))}
        <div className="flex-1" />
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Click cells to mark status. Drag to mark multiple.
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="p-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
            Time
          </div>
          {DAYS.map((day) => (
            <div 
              key={day}
              className="p-3 text-center border-l border-slate-200/60 dark:border-slate-700/60"
            >
              <div className="text-sm font-medium text-slate-900 dark:text-white">
                {DAY_LABELS[day]}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500">
                {DAY_FULL_LABELS[day]}
              </div>
            </div>
          ))}
        </div>

        {/* Time Slots Grid */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-[60px_repeat(5,1fr)]">
              {/* Time Label */}
              <div className="p-2 text-xs text-slate-400 dark:text-slate-500 text-right pr-3 font-mono">
                {formatTimeSlot(hour)}
              </div>

              {/* Day Columns */}
              {DAYS.map((day) => (
                <div 
                  key={`${day}-${hour}`}
                  className="border-l border-slate-100 dark:border-slate-800 p-1"
                >
                  {/* Two 30-min slots per hour */}
                  <div className="space-y-1">
                    {[0, 30].map((minute) => {
                      const status = getCellStatus(day, hour, minute)
                      const isHovered = hoveredSlot === `${day}-${hour}-${minute}`

                      return (
                        <motion.div
                          key={`${day}-${hour}-${minute}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02 }}
                          onMouseEnter={() => setHoveredSlot(`${day}-${hour}-${minute}`)}
                          onMouseLeave={() => setHoveredSlot(null)}
                          onClick={() => handleCellClick(day, hour, minute)}
                          className={cn(
                            'h-7 rounded-md border cursor-pointer transition-all duration-150',
                            'hover:shadow-md',
                            status === 'empty' && 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700',
                            status === 'available' && 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
                            status === 'busy' && 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30',
                            status === 'tentative' && 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30',
                            status === 'preferred' && 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 ring-1 ring-blue-300 dark:ring-blue-600'
                          )}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        {statusButtons.map(({ status, label }) => (
          <div key={status} className="flex items-center gap-2">
            <div className={cn(
              'w-3 h-3 rounded-sm border',
              status === 'empty' && 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
              status === 'available' && 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700',
              status === 'busy' && 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700',
              status === 'tentative' && 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700',
              status === 'preferred' && 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600'
            )} />
            <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}