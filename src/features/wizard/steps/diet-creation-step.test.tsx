import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  WizardContext,
  type WizardContextType,
} from "@/features/wizard/context/wizard-context"
import DietCreationStep from "@/features/wizard/steps/diet-creation-step"
import { defaultWizardStore, type Meal } from "@/features/wizard/stores/wizard-store"
import { toast } from "sonner"

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}))

vi.mock("@/features/wizard/components/add-meal-modal", () => ({
  default: ({
    isOpen,
    onSave,
    editingMeal,
  }: {
    isOpen: boolean
    onSave: (meal: { name: string; time: string; foods: string }) => void
    editingMeal: Meal | null
  }) => (
    <div>
      <span data-testid="add-modal-state">{isOpen ? "open" : "closed"}</span>
      <span data-testid="editing-meal-id">{editingMeal?.id ?? "none"}</span>
      <button
        type="button"
        onClick={() => onSave({ name: "Nova refeição", time: "08:00", foods: "Frutas" })}
      >
        mock-save-new
      </button>
      <button
        type="button"
        onClick={() =>
          onSave({
            name: "Refeição editada",
            time: "09:00",
            foods: "Iogurte",
          })
        }
      >
        mock-save-edit
      </button>
    </div>
  ),
}))

vi.mock("@/features/wizard/components/meal-card", () => ({
  default: ({
    name,
    onEditing,
    onDelete,
    onClick,
  }: {
    name: string
    onEditing?: () => void
    onDelete?: () => void
    onClick?: () => void
  }) => (
    <div>
      <span>{name}</span>
      <button type="button" onClick={onEditing}>
        edit-{name}
      </button>
      <button type="button" onClick={onDelete}>
        delete-{name}
      </button>
      <button type="button" onClick={onClick}>
        details-{name}
      </button>
    </div>
  ),
}))

vi.mock("@/features/wizard/components/meal-card-modal", () => ({
  default: ({ isOpen }: { isOpen: boolean }) => (
    <span data-testid="meal-card-modal-state">{isOpen ? "open" : "closed"}</span>
  ),
}))

vi.mock("@/components/delete-modal", () => ({
  default: ({
    isOpen,
    onConfirm,
    onClose,
  }: {
    isOpen: boolean
    onConfirm: () => void
    onClose: () => void
  }) => (
    <div>
      <span data-testid="delete-modal-state">{isOpen ? "open" : "closed"}</span>
      <button type="button" onClick={onConfirm}>
        confirm-delete
      </button>
      <button type="button" onClick={onClose}>
        close-delete
      </button>
    </div>
  ),
}))

function makeContext(overrides: Partial<WizardContextType> = {}): WizardContextType {
  return {
    step: 3,
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
      <DietCreationStep />
    </WizardContext.Provider>
  )
}

describe("DietCreationStep", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders the empty state when there are no meals", () => {
    renderStep(makeContext())

    expect(
      screen.getByText(
        "Comece adicionando as refeições do dia do paciente, como café da manhã, almoço, lanches e jantar."
      )
    ).toBeInTheDocument()
  })

  it("opens add meal modal when Add button is clicked", async () => {
    const user = userEvent.setup()
    renderStep(makeContext())

    expect(screen.getByTestId("add-modal-state")).toHaveTextContent("closed")

    await user.click(screen.getByRole("button", { name: "Adicionar Refeição" }))

    expect(screen.getByTestId("add-modal-state")).toHaveTextContent("open")
  })

  it("adds a new meal and calls updateSection", async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue(
      "123e4567-e89b-12d3-a456-426614174000"
    )
    const ctx = makeContext()

    renderStep(ctx)

    await user.click(screen.getByRole("button", { name: "Adicionar Refeição" }))
    await user.click(screen.getByRole("button", { name: "mock-save-new" }))

    expect(ctx.updateSection).toHaveBeenCalledWith("diet", {
      meals: [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          name: "Nova refeição",
          time: "08:00",
          foods: "Frutas",
        },
      ],
    })
  })

  it("edits an existing meal and preserves id", async () => {
    const user = userEvent.setup()
    const existingMeal: Meal = {
      id: "meal-a",
      name: "Almoço",
      time: "12:00",
      foods: "Arroz e feijão",
    }

    const ctx = makeContext({
      data: {
        ...defaultWizardStore,
        diet: {
          meals: [existingMeal],
        },
      },
    })

    renderStep(ctx)

    await user.click(screen.getByRole("button", { name: "edit-Almoço" }))

    expect(screen.getByTestId("editing-meal-id")).toHaveTextContent("meal-a")

    await user.click(screen.getByRole("button", { name: "mock-save-edit" }))

    expect(ctx.updateSection).toHaveBeenCalledWith("diet", {
      meals: [
        {
          id: "meal-a",
          name: "Refeição editada",
          time: "09:00",
          foods: "Iogurte",
        },
      ],
    })
  })

  it("removes a meal when deletion is confirmed", async () => {
    const user = userEvent.setup()
    const existingMeal: Meal = {
      id: "meal-a",
      name: "Almoço",
      time: "12:00",
      foods: "Arroz e feijão",
    }

    const ctx = makeContext({
      data: {
        ...defaultWizardStore,
        diet: {
          meals: [existingMeal],
        },
      },
    })

    renderStep(ctx)

    await user.click(screen.getByRole("button", { name: "delete-Almoço" }))
    expect(screen.getByTestId("delete-modal-state")).toHaveTextContent("open")

    await user.click(screen.getByRole("button", { name: "confirm-delete" }))

    expect(ctx.updateSection).toHaveBeenCalledWith("diet", { meals: [] })
  })

  it("shows toast error and blocks next when there are no meals", async () => {
    const user = userEvent.setup()
    const ctx = makeContext()

    renderStep(ctx)

    await user.click(screen.getByRole("button", { name: "Próximo" }))

    expect(toast.error).toHaveBeenCalledWith(
      "Adicione pelo menos uma refeição para prosseguir."
    )
    expect(ctx.next).not.toHaveBeenCalled()
  })

  it("calls next when there is at least one meal", async () => {
    const user = userEvent.setup()
    const ctx = makeContext({
      data: {
        ...defaultWizardStore,
        diet: {
          meals: [
            {
              id: "meal-1",
              name: "Café",
              time: "08:00",
              foods: "Frutas",
            },
          ],
        },
      },
    })

    renderStep(ctx)

    await user.click(screen.getByRole("button", { name: "Próximo" }))

    await waitFor(() => expect(ctx.next).toHaveBeenCalledOnce())
    expect(toast.error).not.toHaveBeenCalled()
  })
})
