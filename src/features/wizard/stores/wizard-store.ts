import type {
  PatientProfileData,
  ProfessionalProfileData,
} from "@/features/wizard/schemas/wizard-schema"

export type WizardStore = {
  professional: ProfessionalProfileData
  patient: PatientProfileData
  diet: {
    meals: {
      name: string
      foods: { name: string; quantity: string }[]
    }[]
  }
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
