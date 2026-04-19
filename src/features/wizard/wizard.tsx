import { Card, CardContent } from "@/components/ui/card";
import { Stepper, type StepperStep } from "@/components/ui/stepper";
import { useWizard } from "./hooks/useWizard";
import { User, Users, Utensils, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS: StepperStep[] = [
  { id: 1, label: "Perfil Profissional", icon: User },
  { id: 2, label: "Dados do Paciente", icon: Users },
  { id: 3, label: "Elaboração da Dieta", icon: Utensils },
  { id: 4, label: "Exportação", icon: FileText },
];

export default function Wizard() {
  const { step, next, prev } = useWizard();

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Stepper steps={STEPS} currentStep={step} />

      {/* <Card className="bg-gray-900 border-gray-800">
        <CardContent className="space-y-6 p-8">
          <h2 className="text-2xl font-bold text-white">
            {STEPS[step - 1].label}
          </h2>

          <div className="h-40 text-gray-400">
            Conteúdo do passo {step}
          </div>

          <div className="flex justify-between pt-6">
            <Button
              onClick={prev}
              disabled={step === 1}
              variant="outline"
              className="border-gray-700"
            >
              Anterior
            </Button>
            <Button
              onClick={next}
              disabled={step === 4}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Próximo
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}