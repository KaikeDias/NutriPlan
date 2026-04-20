import { Card, CardContent } from "@/components/ui/card"
import { Stepper, type StepperStep } from "@/components/ui/stepper"
import { User, Users, Utensils, FileText } from "lucide-react"
import { WizardProvider, useWizardContext } from "./context/wizard-context"
import { ProfessionalProfileStep } from "./steps/professional-profile-step"
import { Button } from "@/components/ui/button"

const STEPS: StepperStep[] = [
  { id: 1, label: "Perfil Profissional", icon: User },
  { id: 2, label: "Dados do Paciente", icon: Users },
  { id: 3, label: "Elaboração da Dieta", icon: Utensils },
  { id: 4, label: "Exportação", icon: FileText },
]

function WizardContent() {
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

function PlaceholderStep({ label }: { label: string }) {
  return (
    <div className="py-8 text-center text-gray-400">
      Etapa "{label}" — em breve
    </div>
  )
}

export default function Wizard() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  )
}
