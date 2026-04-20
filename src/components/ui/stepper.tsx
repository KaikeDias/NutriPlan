import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StepperStep {
  id: number
  label: string
  icon: LucideIcon
}

interface StepperProps {
  steps: StepperStep[]
  currentStep: number
  onStepClick?: (step: number) => void
}

function getStepButtonClass(isActive: boolean, isCompleted: boolean): string {
  if (isCompleted) {
    return "bg-teal-600 text-white"
  }

  if (isActive) {
    return "bg-teal-500 text-white"
  }

  return "bg-gray-700 text-gray-400"
}

function getStepLabelClass(isActive: boolean, isCompleted: boolean): string {
  if (isActive) {
    return "text-teal-500"
  }

  if (isCompleted) {
    return "text-teal-600"
  }

  return "text-gray-500"
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
}: Readonly<StepperProps>) {
  const stepsCount = steps.length
  const edgeInsetPercent = stepsCount > 0 ? 100 / (stepsCount * 2) : 0
  const progressRatio =
    stepsCount > 1 ? (currentStep - 1) / (stepsCount - 1) : 0

  return (
    <div className="mb-10 px-4">
      <div className="relative mx-auto w-full max-w-3xl">
        {/* Track between the center of first and last step */}
        <div
          className="absolute top-6 h-0.5 bg-gray-800"
          style={{
            left: `${edgeInsetPercent}%`,
            right: `${edgeInsetPercent}%`,
          }}
        />
        <div
          className="absolute top-6 h-0.5 bg-teal-500 transition-all duration-300"
          style={{
            left: `${edgeInsetPercent}%`,
            width: `${(100 - edgeInsetPercent * 2) * progressRatio}%`,
          }}
        />

        <div className="relative z-10 flex items-start justify-between">
          {steps.map((step) => {
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            const Icon = step.icon

            return (
              <div key={step.id} className="flex flex-1 flex-col items-center">
                <button
                  onClick={() => onStepClick?.(step.id)}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
                    isActive && "ring-4 ring-teal-500/30",
                    getStepButtonClass(isActive, isCompleted)
                  )}
                >
                  <Icon className="h-5 w-5" />
                </button>

                <p
                  className={cn(
                    "mt-2 text-xs font-medium",
                    getStepLabelClass(isActive, isCompleted)
                  )}
                >
                  {step.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
