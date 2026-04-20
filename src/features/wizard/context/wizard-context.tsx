import { createContext, useContext } from "react"
import { useWizard } from "../hooks/useWizard"

export type WizardContextType = ReturnType<typeof useWizard>

export const WizardContext = createContext<WizardContextType | null>(null)

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const wizard = useWizard()

  return (
    <WizardContext.Provider value={wizard}>{children}</WizardContext.Provider>
  )
}

export function useWizardContext() {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error("useWizardContext must be used within a WizardProvider")
  }
  return context
}
