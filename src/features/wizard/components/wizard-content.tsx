import { FileText, User, Users, Utensils } from "lucide-react"

import { Stepper, type StepperStep } from "@/components/ui/stepper"
import { Card, CardContent } from "@/components/ui/card"
import { useWizardContext } from "@/features/wizard/context/wizard-context"
import ProfessionalProfileStep from "@/features/wizard/steps/professional-profile-step"
import PlaceholderStep from "@/features/wizard/components/place-holder-step"
import PatientProfileStep from "../steps/patient-profile-step"
import DietCreationStep from "../steps/diet-creation-step"
import ExportDietStep from "../steps/export-diet-step"

const STEPS: StepperStep[] = [
  { id: 1, label: "Perfil Profissional", icon: User },
  { id: 2, label: "Dados do Paciente", icon: Users },
  { id: 3, label: "Elaboração da Dieta", icon: Utensils },
  { id: 4, label: "Exportação", icon: FileText },
]

export default function WizardContent() {
  const { step } = useWizardContext()

  function renderStep() {
    switch (step) {
      case 1:
        return <ProfessionalProfileStep />
      case 2:
        return <PatientProfileStep />
      case 3:
        return <DietCreationStep />
      case 4:
        return <ExportDietStep />
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4">
      <Stepper steps={STEPS} currentStep={step} />

      <Card className="border-gray-800 bg-gray-900">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-white">
            {STEPS[step - 1].label}
          </h2>

          {renderStep()}
        </CardContent>
      </Card>
    </div>
  )
}
