import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import React from "react"
import {
  WizardContext,
  type WizardContextType,
} from "@/features/wizard/context/wizard-context"
import WizardContent from "@/features/wizard/components/wizard-content"
import { defaultWizardStore } from "@/features/wizard/stores/wizard-store"

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

function renderWithContext(ctx: WizardContextType) {
  return render(
    <WizardContext.Provider value={ctx}>
      <WizardContent />
    </WizardContext.Provider>
  )
}

describe("WizardContent", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders the professional profile form on step 1", () => {
    renderWithContext(makeContext({ step: 1 }))
    expect(
      screen.getByRole("heading", { name: "Perfil Profissional" })
    ).toBeInTheDocument()
  })

  it("renders a placeholder on step 2", () => {
    renderWithContext(makeContext({ step: 2 }))
    expect(
      screen.getByRole("heading", { name: "Dados do Paciente" })
    ).toBeInTheDocument()
  })

  it("renders a placeholder on step 3", () => {
    renderWithContext(makeContext({ step: 3 }))
    expect(
      screen.getByRole("heading", { name: "Elaboração da Dieta" })
    ).toBeInTheDocument()
  })

  it("renders a placeholder on step 4", () => {
    renderWithContext(makeContext({ step: 4 }))
    expect(
      screen.getByRole("heading", { name: "Exportação" })
    ).toBeInTheDocument()
  })

  it("does NOT show the Anterior button on step 1", () => {
    renderWithContext(makeContext({ step: 1 }))
    expect(
      screen.queryByRole("button", { name: "Anterior" })
    ).not.toBeInTheDocument()
  })

  it("shows the Anterior button on step 2", () => {
    renderWithContext(makeContext({ step: 2 }))
    expect(screen.getByRole("button", { name: "Anterior" })).toBeInTheDocument()
  })

  it("shows the Anterior button on step 3", () => {
    renderWithContext(makeContext({ step: 3 }))
    expect(screen.getByRole("button", { name: "Anterior" })).toBeInTheDocument()
  })

  it("calls prev() when Anterior is clicked", async () => {
    const user = userEvent.setup()
    const ctx = makeContext({ step: 2 })
    renderWithContext(ctx)
    await user.click(screen.getByRole("button", { name: "Anterior" }))
    expect(ctx.prev).toHaveBeenCalledOnce()
  })
})
