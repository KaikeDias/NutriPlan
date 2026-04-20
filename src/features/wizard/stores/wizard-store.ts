import type { ProfessionalProfileData } from "../types/wizard-schema"

export type WizardStore = {
  professional: ProfessionalProfileData
  patient: {
    name: string
    age: string
    weight: string
  }
  diet: {
    meals: {
      name: string
      foods: { name: string; quantity: string }[]
    }[]
  }
}

export const defaultWizardStore: WizardStore = {
  professional: { name: "", crn: "", document: "", logo: "" },
  patient: { name: "", age: "", weight: "" },
  diet: { meals: [] },
}
