import { describe, it, expect } from "vitest"
import {
  professionalProfileSchema,
  patientProfileSchema,
  mealSchema,
} from "@/features/wizard/schemas/wizard-schema"
import { PATIENT_GOAL_VALUES } from "@/features/wizard/types/patient-goal"

describe("professionalProfileSchema", () => {
  const valid = {
    name: "Ana Lima",
    crn: "CRN-3/12345",
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

  // ─── CRN validation ────────────────────────────────────────────────────────

  it("accepts a 2-digit region CRN", () => {
    const result = professionalProfileSchema.safeParse({
      ...valid,
      crn: "CRN-11/12345",
    })
    expect(result.success).toBe(true)
  })

  it("rejects a CRN without the standard format", () => {
    const result = professionalProfileSchema.safeParse({
      ...valid,
      crn: "12345",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.crn).toContain(
        "Formato inválido. Ex: CRN-11/12345"
      )
    }
  })

  it("rejects a CRN missing the dash", () => {
    const result = professionalProfileSchema.safeParse({
      ...valid,
      crn: "CRN3/12345",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.crn).toContain(
        "Formato inválido. Ex: CRN-11/12345"
      )
    }
  })
})

describe("patientProfileSchema", () => {
  const validData = {
    name: "João Silva",
    age: 30,
    weight: 75.5,
    goal: PATIENT_GOAL_VALUES[0],
  }

  // ─── Name field validation ─────────────────────────────────────────────────

  it("accepts a valid patient name", () => {
    const result = patientProfileSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects when name is empty", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      name: "",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain(
        "Nome é obrigatório"
      )
    }
  })

  it("rejects when name exceeds 100 characters", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      name: "A".repeat(101),
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain(
        "Nome não pode ter mais de 100 caracteres"
      )
    }
  })

  it("accepts exactly 100 characters in name", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      name: "A".repeat(100),
    })
    expect(result.success).toBe(true)
  })

  // ─── Age field validation ──────────────────────────────────────────────────

  it("accepts a valid positive integer age", () => {
    const result = patientProfileSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects age of 0", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      age: 0,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.age).toContain(
        "Idade deve ser um número inteiro positivo"
      )
    }
  })

  it("rejects negative age", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      age: -5,
    })
    expect(result.success).toBe(false)
  })

  it("rejects age exceeding 100", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      age: 101,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.age).toContain(
        "Idade não pode ser maior que 100"
      )
    }
  })

  it("accepts exactly 100 as age", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      age: 100,
    })
    expect(result.success).toBe(true)
  })

  it("rejects decimal age values", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      age: 30.5,
    })
    expect(result.success).toBe(false)
  })

  // ─── Weight field validation ───────────────────────────────────────────────

  it("accepts a valid positive weight", () => {
    const result = patientProfileSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects zero weight", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      weight: 0,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.weight).toContain(
        "Peso deve ser um número positivo"
      )
    }
  })

  it("rejects negative weight", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      weight: -10,
    })
    expect(result.success).toBe(false)
  })

  it("rejects weight exceeding 400kg", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      weight: 400.1,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.weight).toContain(
        "Peso não pode ser maior que 400"
      )
    }
  })

  it("accepts exactly 400kg as weight", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      weight: 400,
    })
    expect(result.success).toBe(true)
  })

  it("accepts decimal weight values", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      weight: 72.3,
    })
    expect(result.success).toBe(true)
  })

  // ─── Goal field validation ────────────────────────────────────────────────

  it("accepts a valid goal from the enum", () => {
    const result = patientProfileSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects an invalid goal value", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      goal: "invalid-goal" as any,
    })
    expect(result.success).toBe(false)
  })

  // ─── Observations field validation ────────────────────────────────────────

  it("accepts missing observations (optional)", () => {
    const result = patientProfileSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("accepts valid observations", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      observations: "Alérgico a glúten",
    })
    expect(result.success).toBe(true)
  })

  it("rejects observations exceeding 1000 characters", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      observations: "A".repeat(1001),
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.observations).toContain(
        "Observações não podem ter mais de 1000 caracteres"
      )
    }
  })

  it("accepts exactly 1000 characters in observations", () => {
    const result = patientProfileSchema.safeParse({
      ...validData,
      observations: "A".repeat(1000),
    })
    expect(result.success).toBe(true)
  })

  // ─── Complete validation ──────────────────────────────────────────────────

  it("accepts a complete valid patient profile", () => {
    const completeData = {
      name: "Maria Santos",
      age: 28,
      weight: 68.5,
      goal: PATIENT_GOAL_VALUES[0],
      observations: "Pratica exercícios 3x por semana",
    }
    const result = patientProfileSchema.safeParse(completeData)
    expect(result.success).toBe(true)
  })

  it("returns multiple validation errors when multiple fields are invalid", () => {
    const invalidData = {
      name: "A".repeat(101),
      age: 150,
      weight: 450,
      goal: "invalid" as any,
      observations: "A".repeat(1001),
    }
    const result = patientProfileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      expect(Object.keys(errors).length).toBeGreaterThan(1)
    }
  })
})

describe("mealSchema", () => {
  const validData = {
    name: "Cafe da manha",
    time: "08:00",
    foods: "Pao integral e ovos",
  }

  it("accepts a valid meal", () => {
    const result = mealSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("rejects when meal name is empty", () => {
    const result = mealSchema.safeParse({ ...validData, name: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain(
        "Nome da refeição é obrigatório"
      )
    }
  })

  it("rejects when time is empty", () => {
    const result = mealSchema.safeParse({ ...validData, time: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.time).toContain(
        "Horário é obrigatório"
      )
    }
  })

  it("rejects invalid time format", () => {
    const result = mealSchema.safeParse({ ...validData, time: "25:90" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.time).toContain(
        "Formato de horário inválido. Use HH:mm"
      )
    }
  })

  it("rejects when foods is empty", () => {
    const result = mealSchema.safeParse({ ...validData, foods: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.foods).toContain(
        "Alimentos são obrigatórios"
      )
    }
  })

  it("rejects name with more than 100 characters", () => {
    const result = mealSchema.safeParse({ ...validData, name: "A".repeat(101) })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toContain(
        "Nome da refeição não pode ter mais de 100 caracteres"
      )
    }
  })

  it("rejects foods with more than 1000 characters", () => {
    const result = mealSchema.safeParse({ ...validData, foods: "A".repeat(1001) })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.foods).toContain(
        "Alimentos não podem ter mais de 1000 caracteres"
      )
    }
  })
})
