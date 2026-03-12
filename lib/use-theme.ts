'use client'

import { useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'freeslot-theme'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  // Get system preference
  const getSystemTheme = useCallback(() => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [])

  // Apply theme to document
  const applyTheme = useCallback((theme: 'light' | 'dark') => {
    if (typeof document === 'undefined') return
    
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    
    // Update CSS variables for dark mode
    if (theme === 'dark') {
      root.style.setProperty('--background', '222.2 84% 4.9%')
      root.style.setProperty('--foreground', '210 40% 98%')
    } else {
      root.style.setProperty('--background', '0 0% 100%')
      root.style.setProperty('--foreground', '222.2 84% 4.9%')
    }
  }, [])

  // Set theme
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newTheme)
    }
    
    // Apply theme
    const resolved = newTheme === 'system' ? getSystemTheme() : newTheme
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [getSystemTheme, applyTheme])

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }, [resolvedTheme, setTheme])

  // Initialize theme on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    const initialTheme = stored || 'system'
    const resolved = initialTheme === 'system' ? getSystemTheme() : initialTheme as 'light' | 'dark'
    
    setThemeState(initialTheme)
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [getSystemTheme, applyTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const newResolved = e.matches ? 'dark' : 'light'
      setResolvedTheme(newResolved)
      applyTheme(newResolved)
    }
    
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme, applyTheme])

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark'
  }
}