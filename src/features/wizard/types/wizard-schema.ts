import { z } from "zod"

export const professionalProfileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  crn: z.string().min(1, "CRN é obrigatório"),
  document: z.string().min(1, "Documento é obrigatório"),
  logo: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 2_000_000,
      "Imagem muito grande (máx. ~1.5MB)"
    ),
})

export type ProfessionalProfileData = z.infer<typeof professionalProfileSchema>
