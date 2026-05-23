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
    expect(screen.getByPlaceholderText("Ex: Pão integral")).toBeInTheDocument()
    expect(screen.getByText("Adicionar alimento")).toBeInTheDocument()
  })

  it("renders editing title when editingMeal is provided", () => {
    const editingMeal: Meal = {
      id: "meal-1",
      name: "Almoço",
      time: "12:00",
      foods: [{ name: "Arroz", amount_caseira_value: "1", amount_caseira_unit: "concha", amount_tecnica_value: "100", amount_tecnica_unit: "g" }],
    }
    renderModal({ editingMeal })
    expect(screen.getByText("Editar Refeição")).toBeInTheDocument()
  })

  it("calls onSave with valid payload on submit", async () => {
    const user = userEvent.setup()
    const { props } = renderModal()

    const timeInput = document.querySelector('input[name="time"]') as HTMLInputElement
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement
    const foodNameInput = document.querySelector('input[name="foods.0.name"]') as HTMLInputElement

    fireEvent.change(timeInput, { target: { value: "08:30" } })
    await user.type(nameInput, "Café da manhã")
    await user.type(foodNameInput, "Ovo cozido")

    await user.click(screen.getByRole("button", { name: "Salvar refeição" }))

    await waitFor(() => {
      expect(props.onSave).toHaveBeenCalledWith({
        name: "Café da manhã",
        time: "08:30",
        foods: expect.arrayContaining([
          expect.objectContaining({ name: "Ovo cozido" }),
        ]),
      })
    })
  })

  it("pre-fills fields when editingMeal is provided", () => {
    const editingMeal: Meal = {
      id: "meal-1",
      name: "Almoço",
      time: "12:00",
      foods: [
        {
          name: "Arroz e frango",
          amount_caseira_value: "1",
          amount_caseira_unit: "concha",
          amount_tecnica_value: "100",
          amount_tecnica_unit: "g",
        },
      ],
    }

    renderModal({ editingMeal })

    const timeInput = document.querySelector('input[name="time"]') as HTMLInputElement
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement
    const foodNameInput = document.querySelector('input[name="foods.0.name"]') as HTMLInputElement

    expect(nameInput.value).toBe("Almoço")
    expect(timeInput.value).toBe("12:00")
    expect(foodNameInput.value).toBe("Arroz e frango")
  })

  it("adds a new food row when Adicionar alimento is clicked", async () => {
    const user = userEvent.setup()
    renderModal()

    expect(document.querySelectorAll('input[name^="foods."]').length).toBeGreaterThan(0)

    await user.click(screen.getByRole("button", { name: "Adicionar alimento" }))

    const foodNameInputs = document.querySelectorAll('input[name$=".name"]')
    expect(foodNameInputs.length).toBeGreaterThanOrEqual(2)
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

  it("shows validation error when food name is empty on submit", async () => {
    const user = userEvent.setup()
    renderModal()

    const timeInput = document.querySelector('input[name="time"]') as HTMLInputElement
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement
    fireEvent.change(timeInput, { target: { value: "08:00" } })
    await user.type(nameInput, "Café da manhã")

    await user.click(screen.getByRole("button", { name: "Salvar refeição" }))

    await waitFor(() => {
      expect(screen.getByText("Nome do alimento é obrigatório")).toBeInTheDocument()
    })
  })
})
