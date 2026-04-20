import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@/components/ui/label"
import { TextField } from "@/components/ui/text-field"
import { Button } from "@/components/ui/button"
import { LogoUpload } from "../components/LogoUpload"
import { useWizardContext } from "../context/wizard-context"
import {
  professionalProfileSchema,
  type ProfessionalProfileData,
} from "../types/wizard-schema"

export function ProfessionalProfileStep() {
  const { data, updateSection, next } = useWizardContext()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfessionalProfileData>({
    resolver: zodResolver(professionalProfileSchema),
    defaultValues: data.professional,
  })

  function onSubmit(values: ProfessionalProfileData) {
    updateSection("professional", values)
    next()
  }

  return (
    <div>
      <p className="text-gray-400">Configure seus dados profissionais.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
        <TextField
          id="name"
          label="Nome completo"
          placeholder="Nome Completo"
          error={errors.name?.message}
          {...register("name")}
        />
        <TextField
          id="crn"
          label="CRN"
          placeholder="CRN-0/0000"
          error={errors.crn?.message}
          {...register("crn")}
        />
        <TextField
          id="document"
          label="Documento de identificação"
          placeholder="000.000.000-00"
          error={errors.document?.message}
          {...register("document")}
        />

        <div className="space-y-3">
          <Label>Logo Personalizada</Label>
          <Controller
            control={control}
            name="logo"
            render={({ field }) => (
              <LogoUpload
                value={field.value}
                onChange={field.onChange}
                error={errors.logo?.message}
              />
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
            Próximo
          </Button>
        </div>
      </form>
    </div>
  )
}
