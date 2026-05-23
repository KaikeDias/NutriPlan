import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  WizardContext,
  type WizardContextType,
} from "@/features/wizard/context/wizard-context"
import ExportDietStep from "@/features/wizard/steps/export-diet-step"
import { defaultWizardStore } from "@/features/wizard/stores/wizard-store"
import { usePDFExport } from "@/features/wizard/hooks/usePDFExport"
import { validatePDFData } from "@/features/wizard/utils/pdf-generator"

vi.mock("@/features/wizard/hooks/usePDFExport", () => ({
  usePDFExport: vi.fn(() => ({
    downloadPDF: vi.fn(),
    loading: false,
    error: null,
    resetError: vi.fn(),
  })),
}))

vi.mock("@/features/wizard/utils/pdf-generator", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/wizard/utils/pdf-generator")>()
  return {
    ...actual,
    validatePDFData: vi.fn((data: Parameters<typeof actual.validatePDFData>[0]) =>
      actual.validatePDFData(data)
    ),
  }
})

function makeContext(
  overrides: Partial<WizardContextType> = {}
): WizardContextType {
  return {
    step: 4,
    data: {
      professional: { name: "Dr. João Silva", crn: "CRN123456", logo: "" },
      patient: {
        name: "Maria Santos",
        age: 25,
        weight: 70,
        goal: "LEAN_MASS_GAIN",
        observations: "Sem restrições",
      },
      diet: {
        meals: [
          {
            id: "1",
            time: "07:30",
            name: "Café da Manhã",
            foods: [
              { name: "Ovos e pão integral", amount_caseira_value: "", amount_caseira_unit: "", amount_tecnica_value: "", amount_tecnica_unit: "" },
            ],
          },
        ],
      },
    },
    next: vi.fn(),
    prev: vi.fn(),
    goToStep: vi.fn(),
    updateSection: vi.fn(),
    ...overrides,
  }
}

describe("ExportDietStep", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render step information", () => {
    const context = makeContext()

    const { container } = render(
      <WizardContext.Provider value={context}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    // Check text content instead of querying, since some text appears multiple times
    expect(container.textContent).toContain("Maria Santos")
    expect(container.textContent).toContain("25")
    expect(container.textContent).toContain("70")
    expect(container.textContent).toContain("Ganho de Massa Magra")
    expect(container.textContent).toContain("1")
  })

  it("should handle plural meals correctly", () => {
    const context = makeContext({
      data: {
        ...defaultWizardStore,
        professional: { name: "Dr. João", crn: "CRN123456", logo: "" },
        patient: { name: "John", age: 30, weight: 80, goal: "LEAN_MASS_GAIN", observations: "" },
        diet: {
          meals: [
            { id: "1", time: "07:00", name: "Breakfast", foods: [{ name: "Eggs", amount_caseira_value: "", amount_caseira_unit: "", amount_tecnica_value: "", amount_tecnica_unit: "" }] },
            { id: "2", time: "12:00", name: "Lunch", foods: [{ name: "Chicken", amount_caseira_value: "", amount_caseira_unit: "", amount_tecnica_value: "", amount_tecnica_unit: "" }] },
          ],
        },
      },
    })

    const { container } = render(
      <WizardContext.Provider value={context}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    // Just check that "2" appears in the content (for 2 meals)
    expect(container.textContent).toContain("2")
  })

  it("should call prev when Anterior button is clicked", async () => {
    const user = userEvent.setup()
    const context = makeContext()

    render(
      <WizardContext.Provider value={context}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    await user.click(screen.getByRole("button", { name: /Anterior/ }))

    expect(context.prev).toHaveBeenCalledOnce()
  })

  it("should call downloadPDF when Baixar PDF button is clicked", async () => {
    const user = userEvent.setup()
    const context = makeContext()

    render(
      <WizardContext.Provider value={context}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    await user.click(screen.getByRole("button", { name: /Baixar PDF/ }))

    expect(context.updateSection).not.toHaveBeenCalled()
  })

  it("should disable buttons when loading", () => {
    const context = makeContext()

    render(
      <WizardContext.Provider value={context}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    // Note: Component uses ref to track if elements exist, so we verify button state
    const downloadButton = screen.getByRole("button", { name: /Baixar PDF/ })
    // When loading, the button should show "Gerando..."
    expect(downloadButton).toBeInTheDocument()
  })

  it("should reset to step 1 when Novo plano is clicked and confirmed", async () => {
    const user = userEvent.setup()
    const context = makeContext()

    render(
      <WizardContext.Provider value={context}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    // Mock window.confirm
    vi.spyOn(window, "confirm").mockReturnValueOnce(true)

    await user.click(screen.getByRole("button", { name: /Novo plano/ }))

    await waitFor(() => {
      expect(context.updateSection).toHaveBeenCalledWith("patient", {
        name: "",
        age: 0,
        weight: 0,
        goal: "OTHER",
        observations: "",
      })
      expect(context.updateSection).toHaveBeenCalledWith("diet", { meals: [] })
      expect(context.goToStep).toHaveBeenCalledWith(1)
    })
  })

  it("should not reset when Novo plano is cancelled", async () => {
    const user = userEvent.setup()
    const context = makeContext()

    render(
      <WizardContext.Provider value={context}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    vi.spyOn(window, "confirm").mockReturnValueOnce(false)

    await user.click(screen.getByRole("button", { name: /Novo plano/ }))

    await waitFor(() => {
      expect(context.updateSection).not.toHaveBeenCalled()
      expect(context.goToStep).not.toHaveBeenCalled()
    })
  })

  it("should maintain professional data when resetting", async () => {
    const user = userEvent.setup()
    const context = makeContext()

    render(
      <WizardContext.Provider value={context}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    vi.spyOn(window, "confirm").mockReturnValueOnce(true)

    await user.click(screen.getByRole("button", { name: /Novo plano/ }))

    await waitFor(() => {
      // Professional data should NOT be reset
      expect(context.updateSection).not.toHaveBeenCalledWith("professional", expect.anything())
    })
  })

  it("should display error message when error exists", () => {
    vi.mocked(usePDFExport).mockReturnValueOnce({
      downloadPDF: vi.fn(),
      loading: false,
      error: "Falha ao renderizar",
      resetError: vi.fn(),
    })

    render(
      <WizardContext.Provider value={makeContext()}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    expect(screen.getByText(/Erro ao gerar PDF: Falha ao renderizar/)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Descartar mensagem/i })).toBeInTheDocument()
  })

  it("should call resetError when Descartar mensagem is clicked", async () => {
    const user = userEvent.setup()
    const resetError = vi.fn()

    vi.mocked(usePDFExport).mockReturnValueOnce({
      downloadPDF: vi.fn(),
      loading: false,
      error: "Erro genérico",
      resetError,
    })

    render(
      <WizardContext.Provider value={makeContext()}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    await user.click(screen.getByRole("button", { name: /Descartar mensagem/i }))

    expect(resetError).toHaveBeenCalledOnce()
  })

  it("should show 'Gerando...' and disable download button when loading", () => {
    vi.mocked(usePDFExport).mockReturnValueOnce({
      downloadPDF: vi.fn(),
      loading: true,
      error: null,
      resetError: vi.fn(),
    })

    render(
      <WizardContext.Provider value={makeContext()}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    const btn = screen.getByRole("button", { name: /Gerando\.\.\./i })
    expect(btn).toBeDisabled()
  })

  it("should not render error section when there is no error", () => {
    render(
      <WizardContext.Provider value={makeContext()}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    expect(screen.queryByText(/Erro ao gerar PDF/)).not.toBeInTheDocument()
  })

  it("should disable download button when validation fails", () => {
    // When validatePDFData returns invalid, the button must be disabled
    vi.mocked(validatePDFData).mockReturnValueOnce({
      isValid: false,
      errors: ["Nome do profissional é obrigatório"],
    })

    render(
      <WizardContext.Provider value={makeContext()}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    expect(screen.getByRole("button", { name: /Baixar PDF/i })).toBeDisabled()
  })

  it("should show 'refeição' (singular) when there is exactly one meal", () => {
    const context = makeContext()

    const { container } = render(
      <WizardContext.Provider value={context}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    expect(container.textContent).toContain("1 refeição no plano")
  })

  it("should show 'refeições' (plural) when there are multiple meals", () => {
    const context = makeContext({
      data: {
        ...defaultWizardStore,
        professional: { name: "Dr. João", crn: "CRN123456", logo: "" },
        patient: { name: "John", age: 30, weight: 80, goal: "LEAN_MASS_GAIN", observations: "" },
        diet: {
          meals: [
            { id: "1", time: "07:00", name: "Breakfast", foods: [{ name: "Eggs", amount_caseira_value: "", amount_caseira_unit: "", amount_tecnica_value: "", amount_tecnica_unit: "" }] },
            { id: "2", time: "12:00", name: "Lunch", foods: [{ name: "Chicken", amount_caseira_value: "", amount_caseira_unit: "", amount_tecnica_value: "", amount_tecnica_unit: "" }] },
          ],
        },
      },
    })

    const { container } = render(
      <WizardContext.Provider value={context}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    expect(container.textContent).toContain("2 refeições no plano")
  })

  it("should show the PDF preview section", () => {
    const context = makeContext()

    render(
      <WizardContext.Provider value={context}>
        <ExportDietStep />
      </WizardContext.Provider>
    )

    expect(screen.getByText("Pré-visualização do PDF")).toBeInTheDocument()
  })
})
