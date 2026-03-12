'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSchedule } from '@/lib/schedule-context'
import { DAYS, DAY_LABELS, DAY_FULL_LABELS, SlotStatus, STATUS_COLORS } from '@/lib/types'
import { cn, formatTimeSlot } from '@/lib/utils'
import { 
  Calendar, 
  Clock, 
  Share2, 
  Check, 
  ArrowLeft,
  ExternalLink
} from 'lucide-react'

export default function SharePage({ params }: { params: { id: string } }) {
  const { slots, settings } = useSchedule()
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  // Get available slots
  const availableSlots = slots.filter(s => s.status === 'available' || s.status === 'preferred')

  // Group by day
  const groupedSlots = DAYS.reduce((acc, day) => {
    acc[day] = availableSlots.filter(s => s.day === day)
    return acc
  }, {} as Record<string, typeof availableSlots>)

  // Format duration for display
  const durationLabel = settings.duration === 60 ? '1 hour' : `${settings.duration} min`
  const timezoneLabel = Intl.DateTimeFormat().resolvedOptions().timeZone

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Time Selected!</h1>
          <p className="text-slate-600 mb-6">
            Your meeting request has been received. You&apos;ll receive a confirmation email shortly.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setConfirmed(false)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Select another time
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">FreeSlot</h1>
              <p className="text-sm text-slate-500">Schedule a meeting</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{durationLabel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4" />
              <span>{timezoneLabel}</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Select an Available Time
          </h2>
          <p className="text-slate-600">
            Click on a time slot that works for you
          </p>
        </motion.div>

        {/* Available Times */}
        <div className="grid gap-4">
          {DAYS.map((day, dayIndex) => {
            const daySlots = groupedSlots[day]
            if (daySlots.length === 0) return null

            return (
              <motion.div
                key={day}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + dayIndex * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden"
              >
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/60">
                  <h3 className="font-semibold text-slate-900">
                    {DAY_FULL_LABELS[day]}
                  </h3>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {daySlots
                    .sort((a, b) => a.hour - b.hour || a.minute - b.minute)
                    .map((slot) => {
                      const slotId = `${day}-${slot.hour}-${slot.minute}`
                      const isSelected = selectedSlot === slotId
                      const isPreferred = slot.status === 'preferred'

                      return (
                        <motion.button
                          key={slotId}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSlot(isSelected ? null : slotId)}
                          className={cn(
                            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                            'border-2',
                            isSelected
                              ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                              : isPreferred
                              ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          )}
                        >
                          {formatTimeSlot(slot.hour, slot.minute)}
                          {isPreferred && !isSelected && (
                            <span className="ml-2 text-xs">★</span>
                          )}
                        </motion.button>
                      )
                    })}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* No Slots Available */}
        {availableSlots.length === 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No Times Available
            </h3>
            <p className="text-slate-600">
              The organizer hasn&apos;t set any available times yet. Please check back later.
            </p>
          </motion.div>
        )}

        {/* Confirm Button */}
        {selectedSlot && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 p-4"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Selected time:</p>
                <p className="font-semibold text-slate-900">
                  {selectedSlot.replace('-', ' at ').replace('-', ':')}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setConfirmed(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
              >
                Confirm Meeting
              </motion.button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}