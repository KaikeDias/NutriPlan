import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TextField } from "@/components/ui/text-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getPatientGoalLabel,
  PATIENT_GOAL_VALUES,
} from "../types/patient-goal"
import { useWizardContext } from "../context/wizard-context"
import { patientProfileSchema, type PatientProfileData } from "../schemas/wizard-schema"

export function PatientProfileStep() {
  const { data, updateSection, next, prev } = useWizardContext()

  const objectives = PATIENT_GOAL_VALUES.map((goal) => ({
    value: goal,
    label: getPatientGoalLabel(goal),
  }))

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientProfileData>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: data.patient,
  })

  const onSubmit = (values: PatientProfileData) => {
    updateSection("patient", values)
    next()
  }

  return (
    <div>
      <p className="text-gray-400">Insira as informações do paciente para personalizar o plano alimentar.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
        <TextField
          id="name"
          label="Nome completo"
          placeholder="Nome Completo"
          maxLength={100}
          error={errors.name?.message}
          {...register("name")}
        />

        <TextField
          id="age"
          type="number"
          min={1}
          max={100}
          label="Idade"
          placeholder="Ex: 30"
          error={errors.age?.message}
          {...register("age", { valueAsNumber: true })}
        />

        <TextField
          id="weight"
          type="number"
          min={0.1}
          max={400}
          step="0.1"
          label="Peso (kg)"
          placeholder="Ex: 72.5"
          error={errors.weight?.message}
          {...register("weight", { valueAsNumber: true })}
        />

        <div className="flex flex-col gap-2">
          <Label htmlFor="goal">Objetivo</Label>
          <Controller
            control={control}
            name="goal"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="objective"
                  aria-invalid={!!errors.goal}
                  className="h-11 border-gray-700 bg-gray-800/60 text-gray-100 data-[placeholder]:text-gray-400"
                >
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="border border-gray-800 bg-gray-900 text-gray-100"
                >
                  {objectives.map((obj) => (
                    <SelectItem
                      key={obj.value}
                      value={obj.value}
                      className="transition-colors focus:bg-teal-600/20 focus:text-teal-100 data-[state=checked]:bg-teal-600/30 data-[state=checked]:text-teal-100"
                    >
                      {obj.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.goal?.message && (
            <p className="mb-2 text-sm text-destructive">{errors.goal.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="observations">Observações</Label>
          <Textarea
            id="observations"
            placeholder="Ex: alergias, restrições alimentares, rotina"
            {...register("observations")}
            maxLength={1000}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            onClick={prev}
            variant="outline"
            className="border-gray-700"
          >
            Anterior
          </Button>
          <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
            Próximo
          </Button>
        </div>
      </form>
    </div>
  )
}