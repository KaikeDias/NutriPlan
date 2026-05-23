import type {
  PatientProfileData,
  ProfessionalProfileData,
} from "@/features/wizard/schemas/wizard-schema"

export type FoodItem = {
  name: string
  amount_caseira_value: string
  amount_caseira_unit: string
  amount_tecnica_value: string
  amount_tecnica_unit: string
}

export type Meal = {
  id: string
  name: string
  time: string
  foods: FoodItem[]
}

export type Diet = {
  meals: Meal[]
}

export type WizardStore = {
  professional: ProfessionalProfileData
  patient: PatientProfileData
  diet: Diet
}

export const defaultWizardStore: WizardStore = {
  professional: { name: "", crn: "", logo: "" },
  patient: {
    name: "",
    age: 0,
    weight: 0,
    goal: "OTHER",
    observations: "",
  },
  diet: { meals: [] },
}
