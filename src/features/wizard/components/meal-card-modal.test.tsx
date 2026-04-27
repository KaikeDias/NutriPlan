import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MealCardModal from "@/features/wizard/components/meal-card-modal"

const sampleMeal = {
  id: "meal-1",
  name: "Almoço",
  time: "12:00",
  foods: "Arroz, feijão e frango",
}

describe("MealCardModal", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders meal details when meal is provided", () => {
    render(<MealCardModal isOpen onClose={vi.fn()} meal={sampleMeal} />)

    expect(screen.getByText("Almoço")).toBeInTheDocument()
    expect(screen.getByText("12:00")).toBeInTheDocument()
    expect(screen.getByText("Arroz, feijão e frango")).toBeInTheDocument()
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
