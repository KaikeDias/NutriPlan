import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MealCard from "@/features/wizard/components/meal-card"

const sampleFoods = [
  { name: "Ovos e pão integral", amount_caseira_value: "2", amount_caseira_unit: "unidade", amount_tecnica_value: "100", amount_tecnica_unit: "g" },
]

describe("MealCard", () => {
  it("calls the correct handlers from the main action and icon buttons", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onEditing = vi.fn()
    const onDelete = vi.fn()

    render(
      <MealCard
        name="Café da manhã"
        time="07:30"
        foods={sampleFoods}
        onClick={onClick}
        onEditing={onEditing}
        onDelete={onDelete}
      />
    )

    await user.click(screen.getByRole("button", { name: /Ovos e pão integral/ }))
    await user.click(screen.getByRole("button", { name: "Editar refeição Café da manhã" }))
    await user.click(screen.getByRole("button", { name: "Excluir refeição Café da manhã" }))

    expect(onClick).toHaveBeenCalledOnce()
    expect(onEditing).toHaveBeenCalledOnce()
    expect(onDelete).toHaveBeenCalledOnce()
  })

  it("shows +N mais when more than 2 foods", () => {
    const manyFoods = [
      { name: "Arroz", amount_caseira_value: "", amount_caseira_unit: "", amount_tecnica_value: "", amount_tecnica_unit: "" },
      { name: "Feijão", amount_caseira_value: "", amount_caseira_unit: "", amount_tecnica_value: "", amount_tecnica_unit: "" },
      { name: "Frango", amount_caseira_value: "", amount_caseira_unit: "", amount_tecnica_value: "", amount_tecnica_unit: "" },
    ]

    const { container } = render(
      <MealCard name="Almoço" time="12:00" foods={manyFoods} />
    )

    expect(container.textContent).toContain("+1 mais")
  })
})