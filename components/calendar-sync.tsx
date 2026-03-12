'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Check, 
  ExternalLink,
  X,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarSyncProps {
  provider: 'google' | 'microsoft' | 'apple'
  connected?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
}

const PROVIDER_CONFIG = {
  google: {
    name: 'Google Calendar',
    icon: '📅',
    color: 'from-red-500 to-yellow-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700'
  },
  microsoft: {
    name: 'Microsoft 365',
    icon: '📆',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  },
  apple: {
    name: 'Apple Calendar',
    icon: '🗓️',
    color: 'from-gray-600 to-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700'
  }
}

export function CalendarSync({ provider, connected = false, onConnect, onDisconnect }: CalendarSyncProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const config = PROVIDER_CONFIG[provider]

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))
      onConnect?.()
      setShowModal(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    onDisconnect?.()
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => connected ? handleDisconnect() : setShowModal(true)}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-all',
          connected
            ? `${config.bgColor} ${config.borderColor} ${config.textColor}`
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        )}
      >
        <span className="text-lg">{config.icon}</span>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium">{config.name}</p>
          <p className="text-xs opacity-75">
            {connected ? 'Connected' : 'Not connected'}
          </p>
        </div>
        {connected ? (
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4" />
          </div>
        ) : (
          <ExternalLink className="w-4 h-4 opacity-50" />
        )}
      </motion.button>

      {/* OAuth Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden"
            >
              <div className={cn(
                'p-6 text-center',
                `bg-gradient-to-br ${config.color}`
              )}>
                <span className="text-4xl">{config.icon}</span>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Connect {config.name}
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  This will allow FreeSlot to:
                </p>
                <ul className="text-sm text-slate-600 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Read your calendar events</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Check your availability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Create new events</span>
                  </li>
                </ul>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className={cn(
                      'flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all',
                      `bg-gradient-to-r ${config.color}`,
                      'hover:opacity-90',
                      isLoading && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </span>
                    ) : (
                      'Connect'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}