import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MealCardModal from "@/features/wizard/components/meal-card-modal"

const sampleMeal = {
  id: "meal-1",
  name: "Almoço",
  time: "12:00",
  foods: [
    { name: "Arroz", amount_caseira_value: "1", amount_caseira_unit: "concha", amount_tecnica_value: "100", amount_tecnica_unit: "g" },
    { name: "Feijão", amount_caseira_value: "1", amount_caseira_unit: "concha", amount_tecnica_value: "80", amount_tecnica_unit: "g" },
    { name: "Frango", amount_caseira_value: "", amount_caseira_unit: "", amount_tecnica_value: "120", amount_tecnica_unit: "g" },
  ],
}

describe("MealCardModal", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders meal details when meal is provided", () => {
    render(<MealCardModal isOpen onClose={vi.fn()} meal={sampleMeal} />)

    expect(screen.getByText("Almoço")).toBeInTheDocument()
    expect(screen.getByText("12:00")).toBeInTheDocument()
    expect(screen.getByText(/Arroz — 1 concha/)).toBeInTheDocument()
    expect(screen.getByText(/Feijão — 1 concha/)).toBeInTheDocument()
    expect(screen.getByText(/Frango.*120 g/)).toBeInTheDocument()
  })

  it("does not render when meal is undefined", () => {
    const { container } = render(
      <MealCardModal isOpen onClose={vi.fn()} meal={undefined} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("calls onClose when dialog close button is clicked", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(<MealCardModal isOpen onClose={onClose} meal={sampleMeal} />)

    await user.click(screen.getByRole("button", { name: /close/i }))

    expect(onClose).toHaveBeenCalledOnce()
  })
})
