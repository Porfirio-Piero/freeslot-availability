'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TopNavBar } from '@/components/top-nav'
import { LeftSidebar } from '@/components/left-sidebar'
import { CalendarGrid } from '@/components/calendar-grid'
import { RightSidebar } from '@/components/right-sidebar'
import { ScheduleProvider } from '@/lib/schedule-context'
import { KeyboardShortcutsHelp, useKeyboardShortcuts } from '@/components/keyboard-shortcuts-help'

export default function Home() {
  const [showShortcuts, setShowShortcuts] = useState(false)

  useKeyboardShortcuts(() => setShowShortcuts(true))

  return (
    <ScheduleProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30">
        <TopNavBar onShowShortcuts={() => setShowShortcuts(true)} />
        
        <div className="flex h-[calc(100vh-56px)]">
          <LeftSidebar />
          
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex-1 overflow-hidden"
          >
            <CalendarGrid />
          </motion.main>
          
          <RightSidebar />
        </div>

        <KeyboardShortcutsHelp 
          isOpen={showShortcuts} 
          onClose={() => setShowShortcuts(false)} 
        />
      </div>
    </ScheduleProvider>
  )
}