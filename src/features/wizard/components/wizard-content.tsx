import { FileText, User, Users, Utensils } from "lucide-react"

import { Stepper, type StepperStep } from "@/components/ui/stepper"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWizardContext } from "@/features/wizard/context/wizard-context"
import ProfessionalProfileStep from "@/features/wizard/steps/professional-profile-step"
import PlaceholderStep from "@/features/wizard/components/place-holder-step"

const STEPS: StepperStep[] = [
  { id: 1, label: "Perfil Profissional", icon: User },
  { id: 2, label: "Dados do Paciente", icon: Users },
  { id: 3, label: "Elaboração da Dieta", icon: Utensils },
  { id: 4, label: "Exportação", icon: FileText },
]

export default function WizardContent() {
  const { step, prev } = useWizardContext()

  function renderStep() {
    switch (step) {
      case 1:
        return <ProfessionalProfileStep />
      case 2:
        return <PlaceholderStep label="Dados do Paciente" />
      case 3:
        return <PlaceholderStep label="Elaboração da Dieta" />
      case 4:
        return <PlaceholderStep label="Exportação" />
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

          {step > 1 && (
            <div className="flex justify-start pt-2">
              <Button
                type="button"
                onClick={prev}
                variant="outline"
                className="border-gray-700"
              >
                Anterior
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
