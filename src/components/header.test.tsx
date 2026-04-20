import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import Header from "@/components/header"

describe("Header", () => {
  it("renders the brand name", () => {
    const { getByText } = render(<Header />)
    expect(getByText("NutriPlan")).toBeInTheDocument()
  })

  it("renders the tagline", () => {
    const { getByText } = render(<Header />)
    expect(getByText("Planos Alimentares Personalizados")).toBeInTheDocument()
  })

  it("is rendered as a <header> element", () => {
    const { container } = render(<Header />)
    expect(container.querySelector("header")).toBeInTheDocument()
  })
})
