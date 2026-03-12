'use client'

import { motion } from 'framer-motion'
import { TopNavBar } from '@/components/top-nav'
import { LeftSidebar } from '@/components/left-sidebar'
import { CalendarGrid } from '@/components/calendar-grid'
import { RightSidebar } from '@/components/right-sidebar'
import { ScheduleProvider } from '@/lib/schedule-context'

export default function Home() {
  return (
    <ScheduleProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <TopNavBar />
        
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
      </div>
    </ScheduleProvider>
  )
}