'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Copy,
  FileText,
  Link2,
  Clock,
  Globe,
  Users,
  Plus,
  X,
  ChevronDown,
  Check,
  Zap,
  Mail,
  Share,
  Calendar
} from 'lucide-react'
import { useSchedule } from '@/lib/schedule-context'
import { DURATIONS, TIMEZONES, DAYS, DAY_LABELS, Participant } from '@/lib/types'
import { cn, copyToClipboard } from '@/lib/utils'
import { CalendarSync } from '@/components/calendar-sync'

const QUICK_ACTIONS = [
  { id: 'generate', label: 'Generate Meeting Options', icon: Sparkles, shortcut: 'G' },
  { id: 'copy-email', label: 'Copy Email Proposal', icon: Mail, shortcut: 'E' },
  { id: 'template', label: 'Create Meeting Template', icon: FileText, shortcut: 'M' },
  { id: 'share', label: 'Share Scheduling Link', icon: Share, shortcut: 'S' }
]

const DEFAULT_PARTICIPANTS: Participant[] = [
  { id: '1', name: 'CEO', role: 'Executive', avatar: '' },
  { id: '2', name: 'CFO', role: 'Finance', avatar: '' },
  { id: '3', name: 'Marketing Director', role: 'Marketing', avatar: '' }
]

export function LeftSidebar() {
  const { settings, updateSettings, participants, addParticipant, removeParticipant } = useSchedule()
  const [showDurationMenu, setShowDurationMenu] = useState(false)
  const [showTimezoneMenu, setShowTimezoneMenu] = useState(false)
  const [showAddParticipant, setShowAddParticipant] = useState(false)
  const [newParticipantName, setNewParticipantName] = useState('')
  const [googleConnected, setGoogleConnected] = useState(false)
  const [microsoftConnected, setMicrosoftConnected] = useState(false)

  const handleCopyLink = async () => {
    await copyToClipboard('https://freeslot.app/share/demo')
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="w-72 bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-200/60 dark:border-slate-700/60 flex flex-col h-[calc(100vh-56px)] overflow-hidden"
    >
      {/* Quick Actions Section */}
      <div className="p-4 border-b border-slate-200/60 dark:border-slate-700/60">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="space-y-1">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <motion.button
                key={action.id}
                whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.8)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center group-hover:border-blue-200 dark:group-hover:border-blue-500 shadow-sm transition-all">
                  <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-500" />
                </div>
                <span className="flex-1 text-left">{action.label}</span>
                <kbd className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded hidden group-hover:block">
                  {action.shortcut}
                </kbd>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Calendar Sync Section */}
      <div className="p-4 border-b border-slate-200/60 dark:border-slate-700/60">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          Calendar Sync
        </h3>
        <div className="space-y-2">
          <CalendarSync 
            provider="google" 
            connected={googleConnected}
            onConnect={() => setGoogleConnected(true)}
            onDisconnect={() => setGoogleConnected(false)}
          />
          <CalendarSync 
            provider="microsoft" 
            connected={microsoftConnected}
            onConnect={() => setMicrosoftConnected(true)}
            onDisconnect={() => setMicrosoftConnected(false)}
          />
        </div>
      </div>

      {/* Meeting Settings Section */}
      <div className="p-4 border-b border-slate-200/60 dark:border-slate-700/60">
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Meeting Settings
        </h3>
        
        {/* Duration Selector */}
        <div className="mb-3">
          <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Duration</label>
          <div className="relative">
            <button
              onClick={() => setShowDurationMenu(!showDurationMenu)}
              className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{settings.duration} minutes</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            <AnimatePresence>
              {showDurationMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-10"
                >
                  {DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => {
                        updateSettings({ duration: d.value })
                        setShowDurationMenu(false)
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700",
                        settings.duration === d.value && "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      <span>{d.label}</span>
                      {settings.duration === d.value && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Timezone Selector */}
        <div className="mb-3">
          <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Timezone</label>
          <div className="relative">
            <button
              onClick={() => setShowTimezoneMenu(!showTimezoneMenu)}
              className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="truncate">{TIMEZONES.find(t => t.value === settings.timezone)?.label}</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            <AnimatePresence>
              {showTimezoneMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-10 max-h-48 overflow-y-auto"
                >
                  {TIMEZONES.map((tz) => (
                    <button
                      key={tz.value}
                      onClick={() => {
                        updateSettings({ timezone: tz.value })
                        setShowTimezoneMenu(false)
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700",
                        settings.timezone === tz.value && "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      )}
                    >
                      <span>{tz.label}</span>
                      {settings.timezone === tz.value && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Working Hours */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Start</label>
            <select 
              value={settings.workingHoursStart}
              onChange={(e) => updateSettings({ workingHoursStart: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
            >
              {Array.from({ length: 12 }, (_, i) => i + 6).map((h) => (
                <option key={h} value={h}>{h > 12 ? h - 12 : h}:00 {h >= 12 ? 'PM' : 'AM'}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">End</label>
            <select 
              value={settings.workingHoursEnd}
              onChange={(e) => updateSettings({ workingHoursEnd: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
            >
              {Array.from({ length: 12 }, (_, i) => i + 12).map((h) => (
                <option key={h} value={h}>{h > 12 ? h - 12 : h}:00 PM</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Participants Section */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Participants
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddParticipant(true)}
            className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="space-y-2">
          {DEFAULT_PARTICIPANTS.map((participant) => (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {participant.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{participant.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{participant.role}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500" title="Available" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Participant Modal */}
      <AnimatePresence>
        {showAddParticipant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center z-50"
            onClick={() => setShowAddParticipant(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 w-64"
            >
              <h4 className="font-medium text-slate-900 dark:text-white mb-3">Add Participant</h4>
              <input
                type="text"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                placeholder="Enter name..."
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm mb-3 dark:bg-slate-900 dark:text-white"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddParticipant(false)}
                  className="flex-1 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newParticipantName.trim()) {
                      addParticipant({ name: newParticipantName, role: 'Guest' })
                      setNewParticipantName('')
                      setShowAddParticipant(false)
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  )
}