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
  age: z.number().int().positive("Idade deve ser um número inteiro positivo").max(100, "Idade não pode ser maior que 100"),
  weight: z.number().positive("Peso deve ser um número positivo").max(400, "Peso não pode ser maior que 400"),
  goal: z.enum(PATIENT_GOAL_VALUES),
  observations: z.string().max(1000, "Observações não podem ter mais de 1000 caracteres").optional(),
})

export type PatientProfileData = z.infer<typeof patientProfileSchema>

export const mealSchema = z.object({
  name: z.string().min(1, "Nome da refeição é obrigatório").max(100, "Nome da refeição não pode ter mais de 100 caracteres"),
  time: z.string().min(1, "Horário é obrigatório").regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de horário inválido. Use HH:mm"),
  foods: z.string().min(1, "Alimentos são obrigatórios").max(1000, "Alimentos não podem ter mais de 1000 caracteres"),
})

export type MealData = z.infer<typeof mealSchema>

