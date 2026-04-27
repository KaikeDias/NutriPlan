import { describe, it, expect, vi, beforeEach } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ComponentProps } from "react"
import AddMealModal from "@/features/wizard/components/add-meal-modal"
import type { Meal } from "@/features/wizard/stores/wizard-store"

function renderModal(overrides: Partial<ComponentProps<typeof AddMealModal>> = {}) {
  const props: ComponentProps<typeof AddMealModal> = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    editingMeal: null,
    ...overrides,
  }

  const utils = render(<AddMealModal {...props} />)
  return { ...utils, props }
}

describe("AddMealModal", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders form fields", () => {
    renderModal()

    expect(screen.getByText("Nova Refeição")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Ex: 08:00")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Ex: Café da manhã")).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(
        "Ex: 2 fatias de pão integral, 1 ovo cozido, 1 xícara de café"
      )
    ).toBeInTheDocument()
  })

  it("calls onSave with valid payload on submit", async () => {
    const user = userEvent.setup()
    const { props } = renderModal()

    const timeInput = document.querySelector('input[name="time"]') as HTMLInputElement
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement
    const foodsInput = screen.getByLabelText("Alimentos") as HTMLTextAreaElement

    fireEvent.change(timeInput, { target: { value: "08:30" } })
    await user.type(nameInput, "Café da manhã")
    await user.type(foodsInput, "2 ovos e café")

    await user.click(screen.getByRole("button", { name: "Salvar refeição" }))

    await waitFor(() => {
      expect(props.onSave).toHaveBeenCalledWith({
        name: "Café da manhã",
        time: "08:30",
        foods: "2 ovos e café",
      })
    })
  })

  it("pre-fills fields when editingMeal is provided", () => {
    const editingMeal: Meal = {
      id: "meal-1",
      name: "Almoço",
      time: "12:00",
      foods: "Arroz e frango",
    }

    renderModal({ editingMeal })

    const timeInput = document.querySelector('input[name="time"]') as HTMLInputElement
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement
    const foodsInput = screen.getByLabelText("Alimentos") as HTMLTextAreaElement

    expect(nameInput.value).toBe("Almoço")
    expect(timeInput.value).toBe("12:00")
    expect(foodsInput.value).toBe("Arroz e frango")
  })

  it("discards draft on cancel", async () => {
    const user = userEvent.setup()
    const { props } = renderModal()

    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement
    await user.type(nameInput, "Rascunho")

    await user.click(screen.getByRole("button", { name: "Cancelar" }))

    expect(props.onClose).toHaveBeenCalledOnce()
    expect(nameInput.value).toBe("")
  })

  it("discards draft on close button", async () => {
    const user = userEvent.setup()
    const { props } = renderModal()

    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement
    await user.type(nameInput, "Rascunho")

    await user.click(screen.getByRole("button", { name: /close/i }))

    expect(props.onClose).toHaveBeenCalledOnce()
    expect(nameInput.value).toBe("")
  })

  it("discards draft on escape key", async () => {
    const user = userEvent.setup()
    const { props } = renderModal()

    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement
    await user.type(nameInput, "Rascunho")

    await user.keyboard("{Escape}")

    expect(props.onClose).toHaveBeenCalledOnce()
    expect(nameInput.value).toBe("")
  })

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup()
    const { props } = renderModal()

    await user.click(screen.getByRole("button", { name: "Salvar refeição" }))

    await waitFor(() => {
      expect(screen.getByText("Nome da refeição é obrigatório")).toBeInTheDocument()
      expect(screen.getByText("Horário é obrigatório")).toBeInTheDocument()
      expect(screen.getByText("Alimentos são obrigatórios")).toBeInTheDocument()
    })

    expect(props.onSave).not.toHaveBeenCalled()
  })
})
