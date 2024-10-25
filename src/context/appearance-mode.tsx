'use client'
import { createContext, ReactNode, useContext, useState } from 'react'

interface AppearanceModeContextProps {
  mode: "simple" | "complete"
  onModeAppearance: (appearance: "simple" | "complete") => void
}

const AppearanceModeContext = createContext<AppearanceModeContextProps | undefined>(undefined)

export function AppearanceModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"simple" | "complete">("complete")

  function onModeAppearance(appearance: "simple" | "complete") {
    setMode(appearance)
  }

  return (
    <AppearanceModeContext.Provider
      value={{ mode, onModeAppearance }}
    >
      {children}
    </AppearanceModeContext.Provider>
  )
}

export const useModeAppearance = (): AppearanceModeContextProps => {
  const context = useContext(AppearanceModeContext)

  if (!context) {
    throw new Error('error using context with useModeAppearance')
  }
  return context
}
