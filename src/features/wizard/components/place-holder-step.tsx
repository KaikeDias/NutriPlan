import { Button } from "@/components/ui/button"
import { useWizardContext } from "@/features/wizard/context/wizard-context"

type PlaceholderStepProps = Readonly<{
  label: string
  showNext?: boolean
}>

export default function PlaceholderStep({
  label,
  showNext = true,
}: PlaceholderStepProps) {
  const { prev, next } = useWizardContext()

  return (
    <div className="py-8">
      <div className="text-center text-gray-400">Etapa "{label}" — em breve</div>

      <div className="flex justify-between pt-6">
        <Button type="button" onClick={prev} variant="outline" className="border-gray-700">
          Anterior
        </Button>
        {showNext ? (
          <Button type="button" onClick={next} className="bg-teal-600 hover:bg-teal-700">
            Próximo
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
