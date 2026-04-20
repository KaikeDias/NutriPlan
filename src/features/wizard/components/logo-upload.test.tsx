import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LogoUpload } from "@/features/wizard/components/logo-upload"

describe("LogoUpload", () => {
  it("renders the upload button with 'Enviar Logo' when no value", () => {
    render(<LogoUpload onChange={vi.fn()} />)
    expect(
      screen.getByRole("button", { name: /Enviar Logo/i })
    ).toBeInTheDocument()
  })

  it("renders 'Alterar Logo' button when a value is provided", () => {
    render(<LogoUpload value="data:image/png;base64,abc" onChange={vi.fn()} />)
    expect(
      screen.getByRole("button", { name: /Alterar Logo/i })
    ).toBeInTheDocument()
  })

  it("renders a preview image when value is provided", () => {
    render(<LogoUpload value="data:image/png;base64,abc" onChange={vi.fn()} />)
    expect(screen.getByRole("img", { name: "Logo" })).toBeInTheDocument()
  })

  it("calls onChange(undefined) when the remove button is clicked", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <LogoUpload value="data:image/png;base64,abc" onChange={handleChange} />
    )
    // The remove (X) button is inside the group — find it by its SVG icon container
    // It becomes visible on hover; we click it directly
    const buttons = screen.getAllByRole("button")
    // There are 2 buttons: "Alterar Logo" and the remove button
    const removeBtn = buttons.find((b) => !b.textContent?.includes("Alterar"))
    expect(removeBtn).toBeDefined()
    await user.click(removeBtn!)
    expect(handleChange).toHaveBeenCalledWith(undefined)
  })

  it("renders an error message when error prop is provided", () => {
    render(
      <LogoUpload
        onChange={vi.fn()}
        error="Imagem muito grande (máx. ~1.5MB)"
      />
    )
    expect(
      screen.getByText("Imagem muito grande (máx. ~1.5MB)")
    ).toBeInTheDocument()
  })

  it("does not render an error message when error is undefined", () => {
    render(<LogoUpload onChange={vi.fn()} />)
    expect(screen.queryByText(/Imagem muito grande/i)).not.toBeInTheDocument()
  })

  it("calls onChange with base64 string when a valid file is selected", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<LogoUpload onChange={handleChange} />)

    const file = new File(["(content)"], "logo.png", { type: "image/png" })
    const input = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement

    await user.upload(input, file)

    // FileReader is async — wait for onChange to be called
    await vi.waitFor(() => expect(handleChange).toHaveBeenCalled())
    expect(handleChange.mock.calls[0][0]).toMatch(/^data:/)
  })
})
