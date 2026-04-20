import WizardContent from "@/features/wizard/components/wizard-content"
import { WizardProvider } from "@/features/wizard/context/wizard-context"

export default function Wizard() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  )
}
