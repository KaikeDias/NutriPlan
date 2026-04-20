import { describe, it, expect } from "vitest"
import { professionalProfileSchema } from "@/features/wizard/types/wizard-schema"

describe("professionalProfileSchema", () => {
  const valid = {
    name: "Ana Lima",
    crn: "CRN-3/12345",
    document: "123.456.789-00",
  }

  it("accepts valid data without a logo", () => {
    const result = professionalProfileSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it("accepts valid data with a logo within size limit", () => {
    const logo = "a".repeat(1_000_000)
    const result = professionalProfileSchema.safeParse({ ...valid, logo })
    expect(result.success).toBe(true)
  })

  it("rejects when name is empty", () => {
    const result = professionalProfileSchema.safeParse({ ...valid, name: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain(
        "Nome é obrigatório"
      )
    }
  })

  it("rejects when crn is empty", () => {
    const result = professionalProfileSchema.safeParse({ ...valid, crn: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.crn).toContain(
        "CRN é obrigatório"
      )
    }
  })

  it("rejects when document is empty", () => {
    const result = professionalProfileSchema.safeParse({
      ...valid,
      document: "",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.document).toContain(
        "Documento é obrigatório"
      )
    }
  })

  it("rejects a logo that exceeds 2_000_000 characters", () => {
    const logo = "a".repeat(2_000_001)
    const result = professionalProfileSchema.safeParse({ ...valid, logo })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.logo).toContain(
        "Imagem muito grande (máx. ~1.5MB)"
      )
    }
  })

  it("treats an undefined logo as valid", () => {
    const result = professionalProfileSchema.safeParse({
      ...valid,
      logo: undefined,
    })
    expect(result.success).toBe(true)
  })
})
