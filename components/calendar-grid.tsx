'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSchedule } from '@/lib/schedule-context'
import { DAYS, DAY_LABELS, DAY_FULL_LABELS, SlotStatus, STATUS_COLORS } from '@/lib/types'
import { cn, formatTimeSlot } from '@/lib/utils'

interface DragState {
  isDragging: boolean
  startDay: string | null
  startHour: number | null
  startMinute: number | null
  currentStatus: SlotStatus
}

export function CalendarGrid() {
  const { slots, settings, setSlotStatus, getSlotStatus } = useSchedule()
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startDay: null,
    startHour: null,
    startMinute: null,
    currentStatus: 'available'
  })
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

  // Handle drag start
  const handleDragStart = useCallback((day: string, hour: number, minute: number) => {
    const currentStatus = getSlotStatus(day as any, hour, minute)
    setDragState({
      isDragging: true,
      startDay: day,
      startHour: hour,
      startMinute: minute,
      currentStatus: currentStatus === 'empty' ? selectedStatus : 'empty'
    })
  }, [getSlotStatus, selectedStatus])

  // Handle drag over
  const handleDragOver = useCallback((day: string, hour: number, minute: number) => {
    if (dragState.isDragging && dragState.startDay) {
      setSlotStatus(day as any, hour, minute, dragState.currentStatus)
    }
  }, [dragState, setSlotStatus])

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      startDay: null,
      startHour: null,
      startMinute: null,
      currentStatus: 'available'
    })
  }, [])

  // Get slot status
  const getCellStatus = useCallback((day: string, hour: number, minute: number): SlotStatus => {
    return getSlotStatus(day as any, hour, minute)
  }, [getSlotStatus])

  // Get cell classes
  const getCellClasses = useCallback((status: SlotStatus, isHovered: boolean) => {
    const colors = STATUS_COLORS[status]
    return cn(
      'w-full h-8 rounded-md border cursor-pointer transition-all duration-200 flex items-center justify-center',
      colors.bg,
      colors.border,
      colors.text,
      isHovered && 'scale-105 shadow-md',
      status === 'preferred' && 'animate-glow',
      'hover:shadow-lg'
    )
  }, [])

  // Status selector
  const statusButtons: { status: SlotStatus; label: string }[] = [
    { status: 'available', label: 'Available' },
    { status: 'busy', label: 'Busy' },
    { status: 'tentative', label: 'Tentative' },
    { status: 'preferred', label: 'Preferred' }
  ]

  return (
    <div 
      className="flex-1 overflow-auto p-6"
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* Status Toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-slate-500 font-medium">Mark as:</span>
        {statusButtons.map(({ status, label }) => {
          const colors = STATUS_COLORS[status]
          return (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedStatus(status)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                colors.bg,
                colors.border,
                colors.text,
                selectedStatus === status && 'ring-2 ring-offset-1 ring-blue-400'
              )}
            >
              {label}
            </motion.button>
          )
        })}
        <div className="flex-1" />
        <span className="text-xs text-slate-400">
          Click cells to mark status. Drag to mark multiple.
        </span>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-slate-200/60 bg-slate-50/50">
          <div className="p-3 text-xs text-slate-400 font-medium">
            Time
          </div>
          {DAYS.map((day) => (
            <div 
              key={day}
              className="p-3 text-center border-l border-slate-200/60"
            >
              <div className="text-sm font-medium text-slate-900">
                {DAY_LABELS[day]}
              </div>
              <div className="text-xs text-slate-400">
                {DAY_FULL_LABELS[day]}
              </div>
            </div>
          ))}
        </div>

        {/* Time Slots Grid */}
        <div className="divide-y divide-slate-100">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-[60px_repeat(5,1fr)]">
              {/* Time Label */}
              <div className="p-2 text-xs text-slate-400 text-right pr-3 font-mono">
                {formatTimeSlot(hour)}
              </div>

              {/* Day Columns */}
              {DAYS.map((day) => (
                <div 
                  key={`${day}-${hour}`}
                  className="border-l border-slate-100 p-1"
                >
                  {/* Two 30-min slots per hour */}
                  <div className="space-y-1">
                    {[0, 30].map((minute) => {
                      const status = getCellStatus(day, hour, minute)
                      const isHovered = hoveredSlot === `${day}-${hour}-${minute}`
                      const colors = STATUS_COLORS[status]

                      return (
                        <motion.div
                          key={`${day}-${hour}-${minute}`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.02 }}
                          onMouseEnter={() => setHoveredSlot(`${day}-${hour}-${minute}`)}
                          onMouseLeave={() => setHoveredSlot(null)}
                          onMouseDown={() => handleDragStart(day, hour, minute)}
                          onMouseOver={() => handleDragOver(day, hour, minute)}
                          onClick={() => handleCellClick(day, hour, minute)}
                          className={cn(
                            'h-7 rounded-md border cursor-pointer transition-all duration-150',
                            'hover:shadow-md',
                            status === 'empty' && 'bg-slate-50 border-slate-200 hover:bg-slate-100',
                            status === 'available' && 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
                            status === 'busy' && 'bg-red-50 border-red-200 hover:bg-red-100',
                            status === 'tentative' && 'bg-amber-50 border-amber-200 hover:bg-amber-100',
                            status === 'preferred' && 'bg-blue-50 border-blue-300 hover:bg-blue-100 ring-1 ring-blue-300'
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
        {statusButtons.map(({ status, label }) => {
          const colors = STATUS_COLORS[status]
          return (
            <div key={status} className="flex items-center gap-2">
              <div className={cn(
                'w-3 h-3 rounded-sm border',
                status === 'empty' && 'bg-slate-50 border-slate-200',
                status === 'available' && 'bg-emerald-50 border-emerald-200',
                status === 'busy' && 'bg-red-50 border-red-200',
                status === 'tentative' && 'bg-amber-50 border-amber-200',
                status === 'preferred' && 'bg-blue-50 border-blue-300'
              )} />
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}