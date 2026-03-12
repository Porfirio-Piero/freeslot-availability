'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Copy,
  Check,
  Calendar,
  Clock,
  Users,
  Zap,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { useSchedule } from '@/lib/schedule-context'
import { DAYS, DAY_FULL_LABELS, SuggestedSlot, DayOfWeek } from '@/lib/types'
import { cn, copyToClipboard, formatTimeSlot } from '@/lib/utils'

export function RightSidebar() {
  const { slots, settings, getAvailableSlots, getPreferredSlots } = useSchedule()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Smart suggestions based on availability
  const suggestions = useMemo(() => {
    const available = getAvailableSlots()
    const preferred = getPreferredSlots()
    
    // Group slots by day
    const daySlots: Record<string, typeof available> = {}
    available.forEach(slot => {
      if (!daySlots[slot.day]) daySlots[slot.day] = []
      daySlots[slot.day].push(slot)
    })

    // Score each potential meeting time
    const scored: SuggestedSlot[] = []
    
    Object.entries(daySlots).forEach(([day, slots]) => {
      const dayKey = day as DayOfWeek
      // Sort by hour and minute
      slots.sort((a, b) => a.hour - b.hour || a.minute - b.minute)
      
      // Find consecutive slots that fit the meeting duration
      const durationSlots = Math.ceil(settings.duration / 30) // Number of 30-min slots needed
      
      for (let i = 0; i <= slots.length - durationSlots; i++) {
        const startSlot = slots[i]
        const consecutive = true
        
        // Check if we have enough consecutive slots
        let validWindow = true
        for (let j = 1; j < durationSlots; j++) {
          const nextSlot = slots[i + j]
          if (!nextSlot || nextSlot.hour !== startSlot.hour + Math.floor((startSlot.minute + j * 30) / 60)) {
            validWindow = false
            break
          }
        }
        
        if (validWindow) {
          const isPreferred = preferred.some(p => 
            p.day === dayKey && p.hour === startSlot.hour && p.minute === startSlot.minute
          )
          
          // Score: prefer morning times, preferred slots, and earlier in week
          let score = 100
          score -= startSlot.hour * 2 // Earlier times score higher
          score -= DAYS.indexOf(dayKey) * 5 // Earlier days score higher
          if (isPreferred) score += 30
          if (startSlot.hour >= 10 && startSlot.hour <= 14) score += 10 // Prime meeting hours
          
          scored.push({
            id: `${day}-${startSlot.hour}-${startSlot.minute}`,
            day: dayKey,
            dayLabel: DAY_FULL_LABELS[dayKey],
            time: formatTimeSlot(startSlot.hour, startSlot.minute),
            hour: startSlot.hour,
            minute: startSlot.minute,
            score,
            conflicts: []
          })
        }
      }
    })

    // Return top 5 suggestions
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  }, [getAvailableSlots, getPreferredSlots, settings.duration])

  // Generate meeting proposal text
  const generateProposalText = (): string => {
    if (suggestions.length === 0) {
      return "Hi,\n\nI'd like to schedule a meeting with you. Please let me know your availability.\n\nBest regards"
    }

    const times = suggestions
      .slice(0, 3)
      .map(s => `• ${s.dayLabel} ${s.time}`)
      .join('\n')

    return `Hi,

Here are a few times that work for our ${settings.duration}-minute meeting:

${times}

Please let me know what works best for you, or feel free to suggest another time.

Best regards`
  }

  const handleCopyProposal = async () => {
    await copyToClipboard(generateProposalText())
    setCopiedId('proposal')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCopyTimes = async () => {
    const times = suggestions.map(s => `${s.dayLabel} ${s.time}`).join('\n')
    await copyToClipboard(times)
    setCopiedId('times')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleGenerateNew = () => {
    setIsGenerating(true)
    setTimeout(() => setIsGenerating(false), 500)
  }

  return (
    <motion.aside
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-80 bg-slate-50/50 border-l border-slate-200/60 flex flex-col h-[calc(100vh-56px)] overflow-hidden"
    >
      {/* Smart Suggestions */}
      <div className="p-4 border-b border-slate-200/60">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Smart Suggestions
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleGenerateNew}
            className="p-1 rounded hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-slate-400", isGenerating && "animate-spin")} />
          </motion.button>
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {suggestions.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Mark available times to see suggestions</p>
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/60 cursor-pointer group hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 text-sm">
                      {suggestion.dayLabel}
                    </div>
                    <div className="text-slate-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {suggestion.time}
                    </div>
                  </div>
                  {suggestion.score > 100 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                      <Zap className="w-3 h-3" />
                      Best
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Meeting Proposal Generator */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Users className="w-3.5 h-3.5" />
          Meeting Proposal
        </h3>

        <div className="bg-white rounded-xl border border-slate-200/60 p-4 mb-3">
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
            {generateProposalText()}
          </pre>
        </div>

        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyProposal}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
          >
            {copiedId === 'proposal' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Message</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyTimes}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            {copiedId === 'times' ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                <span>Copy Time Options</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Share via Link</span>
          </motion.button>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="p-4 border-t border-slate-200/60">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Shortcuts
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">A</kbd>
            <span className="text-slate-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">B</kbd>
            <span className="text-slate-600">Busy</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">T</kbd>
            <span className="text-slate-600">Tentative</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">P</kbd>
            <span className="text-slate-600">Preferred</span>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}