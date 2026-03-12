'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Share2, 
  User, 
  ChevronDown,
  Settings,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'
import { useSchedule } from '@/lib/schedule-context'
import { useTheme } from '@/lib/use-theme'
import { DURATIONS, TIMEZONES } from '@/lib/types'
import { cn, copyToClipboard } from '@/lib/utils'

interface TopNavBarProps {
  onShowShortcuts: () => void
}

export function TopNavBar({ onShowShortcuts }: TopNavBarProps) {
  const { settings, updateSettings } = useSchedule()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [showDurationMenu, setShowDurationMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = `https://freeslot.app/share/${generateShareId()}`
    await copyToClipboard(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateShareId = () => {
    return Math.random().toString(36).substring(2, 10)
  }

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 px-4 flex items-center justify-between sticky top-0 z-50"
    >
      {/* Left Section: Logo & Workspace */}
      <div className="flex items-center gap-4">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-white text-lg tracking-tight">FreeSlot</span>
        </motion.div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

        <motion.button 
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <span className="font-medium">My Workspace</span>
          <ChevronDown className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Center Section: Duration Selector */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <motion.button
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowDurationMenu(!showDurationMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700"
          >
            <Clock className="w-4 h-4" />
            <span>{settings.duration} min</span>
            <ChevronDown className="w-3 h-3" />
          </motion.button>

          <AnimatePresence>
            {showDurationMenu && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200/60 dark:border-slate-700 py-1 min-w-[120px] z-50"
              >
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => {
                      updateSettings({ duration: d.value })
                      setShowDurationMenu(false)
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
                      settings.duration === d.value && "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span>{TIMEZONES.find(t => t.value === settings.timezone)?.label?.split(' ')[0] || 'ET'}</span>
          </motion.button>
        </div>
      </div>

      {/* Right Section: Share & Profile */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            ) : (
              <Sun className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            )}
          </motion.button>

          <AnimatePresence>
            {showThemeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-700 py-2 min-w-[160px] z-50"
              >
                <button
                  onClick={() => { setTheme('light'); setShowThemeMenu(false) }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700",
                    theme === 'light' && "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                  )}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => { setTheme('dark'); setShowThemeMenu(false) }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700",
                    theme === 'dark' && "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                  )}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => { setTheme('system'); setShowThemeMenu(false) }}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700",
                    theme === 'system' && "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                  )}
                >
                  <Monitor className="w-4 h-4" />
                  <span>System</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Help Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShowShortcuts}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </motion.button>

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
        >
          <Share2 className="w-4 h-4" />
          <span>{copied ? 'Copied!' : 'Share Link'}</span>
        </motion.button>

        {/* User Menu */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm"
          >
            <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-700 py-2 min-w-[200px] z-50"
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="font-medium text-slate-900 dark:text-white">Executive Assistant</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">assistant@company.com</p>
                </div>
                <button className="w-full px-4 py-2 text-left text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button 
                  onClick={onShowShortcuts}
                  className="w-full px-4 py-2 text-left text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Keyboard Shortcuts</span>
                </button>
                <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  )
}