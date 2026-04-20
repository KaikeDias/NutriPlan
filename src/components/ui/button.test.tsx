import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument()
  })

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it("is disabled when the disabled prop is set", () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        Click
      </Button>
    )
    await user.click(screen.getByRole("button"))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("renders with the outline variant", () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-variant",
      "outline"
    )
  })

  it("renders with the destructive variant", () => {
    render(<Button variant="destructive">Danger</Button>)
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-variant",
      "destructive"
    )
  })
})
