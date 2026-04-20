import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  WizardContext,
  type WizardContextType,
} from "@/features/wizard/context/wizard-context"
import ProfessionalProfileStep from "@/features/wizard/steps/professional-profile-step"
import { defaultWizardStore } from "@/features/wizard/stores/wizard-store"
import type { WizardStore } from "@/features/wizard/stores/wizard-store"

function makeContext(
  overrides: Partial<WizardContextType> = {}
): WizardContextType {
  return {
    step: 1,
    data: defaultWizardStore,
    next: vi.fn(),
    prev: vi.fn(),
    updateSection: vi.fn(),
    ...overrides,
  }
}

function renderStep(ctx: WizardContextType) {
  return render(
    <WizardContext.Provider value={ctx}>
      <ProfessionalProfileStep />
    </WizardContext.Provider>
  )
}

describe("ProfessionalProfileStep", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders all three required fields", () => {
    renderStep(makeContext())
    expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/CRN/i)).toBeInTheDocument()
    expect(
      screen.getByLabelText(/Documento de identificação/i)
    ).toBeInTheDocument()
  })

  it("renders the submit button", () => {
    renderStep(makeContext())
    expect(screen.getByRole("button", { name: /Próximo/i })).toBeInTheDocument()
  })

  it("shows validation errors when submitted with empty fields", async () => {
    const user = userEvent.setup()
    renderStep(makeContext())
    await user.click(screen.getByRole("button", { name: /Próximo/i }))
    await waitFor(() => {
      expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument()
      expect(screen.getByText("CRN é obrigatório")).toBeInTheDocument()
      expect(screen.getByText("Documento é obrigatório")).toBeInTheDocument()
    })
  })

  it("does NOT call next() or updateSection() when form is invalid", async () => {
    const user = userEvent.setup()
    const ctx = makeContext()
    renderStep(ctx)
    await user.click(screen.getByRole("button", { name: /Próximo/i }))
    await waitFor(() => screen.getByText("Nome é obrigatório"))
    expect(ctx.next).not.toHaveBeenCalled()
    expect(ctx.updateSection).not.toHaveBeenCalled()
  })

  it("calls updateSection('professional', ...) and next() on valid submit", async () => {
    const user = userEvent.setup()
    const ctx = makeContext()
    renderStep(ctx)

    await user.type(screen.getByLabelText(/Nome completo/i), "Ana Lima")
    await user.type(screen.getByLabelText(/CRN/i), "CRN-3/12345")
    await user.type(
      screen.getByLabelText(/Documento de identificação/i),
      "123.456.789-00"
    )
    await user.click(screen.getByRole("button", { name: /Próximo/i }))

    await waitFor(() => expect(ctx.next).toHaveBeenCalledOnce())
    expect(ctx.updateSection).toHaveBeenCalledWith(
      "professional",
      expect.objectContaining({
        name: "Ana Lima",
        crn: "CRN-3/12345",
        document: "123.456.789-00",
      })
    )
  })

  it("pre-fills fields with data from the store", () => {
    const storedData: WizardStore = {
      ...defaultWizardStore,
      professional: {
        name: "João Silva",
        crn: "CRN-1/99",
        document: "987.654.321-00",
        logo: "",
      },
    }
    renderStep(makeContext({ data: storedData }))
    expect(
      screen.getByLabelText<HTMLInputElement>(/Nome completo/i).value
    ).toBe("João Silva")
    expect(screen.getByLabelText<HTMLInputElement>(/CRN/i).value).toBe(
      "CRN-1/99"
    )
    expect(
      screen.getByLabelText<HTMLInputElement>(/Documento de identificação/i)
        .value
    ).toBe("987.654.321-00")
  })
})
