import type {
  PatientProfileData,
  ProfessionalProfileData,
} from "@/features/wizard/schemas/wizard-schema"

export type Meal = {
  id: string
  name: string
  time: string
  foods: string
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
