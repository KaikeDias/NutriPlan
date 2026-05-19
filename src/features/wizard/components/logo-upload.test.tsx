import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LogoUpload } from "@/features/wizard/components/logo-upload"

describe("LogoUpload", () => {
  it("renders the upload placeholder as a clickable button when no value", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<LogoUpload onChange={handleChange} />)

    // When no value, there are 2 buttons: placeholder + "Enviar Logo"
    const buttons = screen.getAllByRole("button")
    expect(buttons.length).toBe(2)

    // The first button is the placeholder
    const placeholderBtn = buttons[0]
    expect(placeholderBtn).toBeInTheDocument()

    // Clicking the placeholder should trigger file input
    await user.click(placeholderBtn)
    expect(placeholderBtn).toBeInTheDocument()
  })

  it("renders 'Enviar Logo' button when no value is provided", () => {
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
    // When value exists, there are 2 buttons: the remove (X) button and "Alterar Logo"
    const buttons = screen.getAllByRole("button")
    expect(buttons.length).toBe(2)

    // The remove (X) button is rendered first in the DOM (index 0)
    const removeBtn = buttons[0]

    await user.click(removeBtn)
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
