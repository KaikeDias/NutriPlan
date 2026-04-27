import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import MealCard from "@/features/wizard/components/meal-card"

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
        foods="Ovos e pão integral"
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
})