import { z } from "zod"
import { PATIENT_GOAL_VALUES } from "../types/patient-goal"

export const professionalProfileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  crn: z
    .string()
    .min(1, "CRN é obrigatório")
    .regex(/^CRN-\d{1,2}\/\d{4,5}$/, "Formato inválido. Ex: CRN-11/12345"),
  logo: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 2_000_000,
      "Imagem muito grande (máx. ~1.5MB)"
    ),
})

export type ProfessionalProfileData = z.infer<typeof professionalProfileSchema>

export const patientProfileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome não pode ter mais de 100 caracteres"),
  age: z.number().int().positive("Idade deve ser um número inteiro positivo"),
  weight: z.number().positive("Peso deve ser um número positivo"),
  goal: z.enum(PATIENT_GOAL_VALUES),
  observations: z.string().optional(),
})

export type PatientProfileData = z.infer<typeof patientProfileSchema>
