import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import App from "@/App"

beforeEach(() => {
  localStorage.clear()
})

describe("App", () => {
  it("renders the Header", () => {
    render(<App />)
    expect(screen.getByText("NutriPlan")).toBeInTheDocument()
  })

  it("renders the wizard step 1 content", () => {
    render(<App />)
    expect(
      screen.getByRole("heading", { name: "Perfil Profissional" })
    ).toBeInTheDocument()
  })
})
