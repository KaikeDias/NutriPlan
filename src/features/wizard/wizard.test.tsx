import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import Wizard from "@/features/wizard/wizard"

beforeEach(() => {
  localStorage.clear()
})

describe("Wizard", () => {
  it("renders the wizard content inside a provider", () => {
    render(<Wizard />)
    expect(
      screen.getByRole("heading", { name: "Perfil Profissional" })
    ).toBeInTheDocument()
  })
})
