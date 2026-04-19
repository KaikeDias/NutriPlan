import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepperStep {
  id: number;
  label: string;
  icon: LucideIcon;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="w-full mb-12 px-4">
      {/* Background connecting line */}
      <div className="flex items-center justify-between relative">
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-800 -z-10" />
        <div
          className="absolute top-6 left-0 h-0.5 bg-teal-500 -z-10 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              {/* Step circle */}
              <button
                onClick={() => onStepClick?.(step.id)}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10",
                  isActive && "ring-4 ring-teal-500/30",
                  isCompleted
                    ? "bg-teal-600 text-white"
                    : isActive
                      ? "bg-teal-500 text-white"
                      : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                )}
              >
                <Icon className="w-5 h-5" />
              </button>

              {/* Step label */}
              <div className="mt-3 text-center">
                <p
                  className={cn(
                    "text-xs font-medium transition-colors duration-300",
                    isActive
                      ? "text-teal-500"
                      : isCompleted
                        ? "text-teal-600"
                        : "text-gray-500"
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}