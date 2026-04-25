import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMaskito } from "@maskito/react"
import { Label } from "@/components/ui/label"
import { TextField } from "@/components/ui/text-field"
import { Button } from "@/components/ui/button"
import { useWizardContext } from "@/features/wizard/context/wizard-context"
import {
  professionalProfileSchema,
  type ProfessionalProfileData,
} from "@/features/wizard/schemas/wizard-schema"
import { LogoUpload } from "@/features/wizard/components/logo-upload"
import { crnMaskOptions } from "@/lib/masks"

export default function ProfessionalProfileStep() {
  const { data, updateSection, next } = useWizardContext()

  const crnMaskRef = useMaskito({ options: crnMaskOptions })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfessionalProfileData>({
    resolver: zodResolver(professionalProfileSchema),
    defaultValues: data.professional,
  })

  const onSubmit = (values: ProfessionalProfileData) => {
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
        <Controller
          control={control}
          name="crn"
          render={({ field: { ref, ...field } }) => (
            <TextField
              ref={(el) => {
                ref(el)
                crnMaskRef(el)
              }}
              id="crn"
              label="CRN"
              placeholder="CRN-0/00000"
              error={errors.crn?.message}
              {...field}
            />
          )}
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
