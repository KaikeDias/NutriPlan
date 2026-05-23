import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  WizardContext,
  type WizardContextType,
} from "@/features/wizard/context/wizard-context"
import PatientProfileStep from "@/features/wizard/steps/patient-profile-step"
import { defaultWizardStore } from "@/features/wizard/stores/wizard-store"
import type { WizardStore } from "@/features/wizard/stores/wizard-store"

function makeContext(overrides: Partial<WizardContextType> = {}): WizardContextType {
  return {
    step: 2,
    data: defaultWizardStore,
    next: vi.fn(),
    prev: vi.fn(),
    goToStep: vi.fn(),
    updateSection: vi.fn(),
    ...overrides,
  }
}

function renderStep(ctx: WizardContextType) {
  return render(
    <WizardContext.Provider value={ctx}>
      <PatientProfileStep />
    </WizardContext.Provider>
  )
}

describe("PatientProfileStep", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders all form fields", () => {
    renderStep(makeContext())

    expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Idade/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Peso/i)).toBeInTheDocument()
    // Label htmlFor="goal" mismatches SelectTrigger id="objective"; query by text instead
    expect(screen.getByText("Objetivo")).toBeInTheDocument()
    expect(screen.getByLabelText(/Observações/i)).toBeInTheDocument()
  })

  it("renders Anterior and Próximo buttons", () => {
    renderStep(makeContext())

    expect(screen.getByRole("button", { name: /Anterior/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Próximo/i })).toBeInTheDocument()
  })

  it("calls prev() when Anterior is clicked", async () => {
    const user = userEvent.setup()
    const ctx = makeContext()
    renderStep(ctx)

    await user.click(screen.getByRole("button", { name: /Anterior/i }))

    expect(ctx.prev).toHaveBeenCalledOnce()
  })

  it("shows validation errors when submitted with empty fields", async () => {
    const user = userEvent.setup()
    renderStep(makeContext())

    await user.click(screen.getByRole("button", { name: /Próximo/i }))

    await waitFor(() => {
      expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument()
    })
  })

  it("does not call next() or updateSection() when form is invalid", async () => {
    const user = userEvent.setup()
    const ctx = makeContext()
    renderStep(ctx)

    await user.click(screen.getByRole("button", { name: /Próximo/i }))

    await waitFor(() => screen.getByText("Nome é obrigatório"))

    expect(ctx.next).not.toHaveBeenCalled()
    expect(ctx.updateSection).not.toHaveBeenCalled()
  })

  it("calls updateSection('patient', ...) and next() on valid submit", async () => {
    const user = userEvent.setup()
    // Pre-fill context with a valid goal so we don't need to interact with Radix Select
    const ctx = makeContext({
      data: {
        ...defaultWizardStore,
        patient: { ...defaultWizardStore.patient, goal: "LEAN_MASS_GAIN" },
      },
    })
    renderStep(ctx)

    await user.type(screen.getByLabelText(/Nome completo/i), "João Silva")
    await user.type(screen.getByLabelText(/Idade/i), "30")
    await user.type(screen.getByLabelText(/Peso/i), "75")

    await user.click(screen.getByRole("button", { name: /Próximo/i }))

    await waitFor(() => expect(ctx.next).toHaveBeenCalledOnce())
    expect(ctx.updateSection).toHaveBeenCalledWith(
      "patient",
      expect.objectContaining({
        name: "João Silva",
        age: 30,
        weight: 75,
        goal: "LEAN_MASS_GAIN",
      })
    )
  })

  it("pre-fills form with non-zero age and weight from store (ternary true branch)", () => {
    const storedData: WizardStore = {
      ...defaultWizardStore,
      patient: {
        name: "Maria",
        age: 28,
        weight: 65.5,
        goal: "WEIGHT_LOSS",
        observations: "Sem glúten",
      },
    }

    renderStep(makeContext({ data: storedData }))

    expect(screen.getByLabelText<HTMLInputElement>(/Nome completo/i).value).toBe("Maria")
    expect(screen.getByLabelText<HTMLInputElement>(/Idade/i).value).toBe("28")
    expect(screen.getByLabelText<HTMLInputElement>(/Peso/i).value).toBe("65.5")
  })

  it("pre-fills form with zero age/weight as empty (ternary false branch)", () => {
    // defaultWizardStore has age=0 and weight=0
    renderStep(makeContext())

    expect(screen.getByLabelText<HTMLInputElement>(/Idade/i).value).toBe("")
    expect(screen.getByLabelText<HTMLInputElement>(/Peso/i).value).toBe("")
  })

  it("triggers onInput handler on age field", async () => {
    const user = userEvent.setup()
    renderStep(makeContext())

    const ageInput = screen.getByLabelText(/Idade/i)
    await user.type(ageInput, "25")

    // onInput callback (limitIntegerDigits) was invoked without throwing
    expect(ageInput).toHaveValue(25)
  })

  it("triggers onInput handler on weight field", async () => {
    const user = userEvent.setup()
    renderStep(makeContext())

    const weightInput = screen.getByLabelText(/Peso/i)
    await user.type(weightInput, "70")

    // onInput callback (limitIntegerDigits) was invoked without throwing
    expect(weightInput).toHaveValue(70)
  })
})
