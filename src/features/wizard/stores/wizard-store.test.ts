import { describe, it, expect } from "vitest"
import { defaultWizardStore } from "@/features/wizard/stores/wizard-store"

describe("defaultWizardStore", () => {
  it("has an empty professional section", () => {
    expect(defaultWizardStore.professional).toEqual({
      name: "",
      crn: "",
      document: "",
      logo: "",
    })
  })

  it("has an empty patient section", () => {
    expect(defaultWizardStore.patient).toEqual({
      name: "",
      age: "",
      weight: "",
    })
  })

  it("has an empty diet section with no meals", () => {
    expect(defaultWizardStore.diet).toEqual({ meals: [] })
  })
})
