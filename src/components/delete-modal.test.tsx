import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { fireEvent } from "@testing-library/react"
import DeleteModal from "@/components/delete-modal"

describe("DeleteModal", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders title, description and item name", () => {
    render(
      <DeleteModal
        isOpen
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Deletar refeição"
        description="Deseja mesmo excluir?"
        itemName="Almoço"
      />
    )

    expect(screen.getByText("Deletar refeição")).toBeInTheDocument()
    expect(screen.getByText(/Deseja mesmo excluir\?/)).toBeInTheDocument()
    expect(screen.getByText(/"Almoço"/)).toBeInTheDocument()
  })

  it("calls onConfirm and onClose when delete is confirmed", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onConfirm = vi.fn()

    render(<DeleteModal isOpen onClose={onClose} onConfirm={onConfirm} />)

    await user.click(screen.getByRole("button", { name: "Deletar" }))

    expect(onConfirm).toHaveBeenCalledOnce()
    expect(onClose).toHaveBeenCalledOnce()
  })

  it("calls only onClose when canceled", async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onConfirm = vi.fn()

    render(<DeleteModal isOpen onClose={onClose} onConfirm={onConfirm} />)

    await user.click(screen.getByRole("button", { name: "Cancelar" }))

    expect(onClose).toHaveBeenCalledOnce()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("calls onClose via onOpenChange when dialog is dismissed with Escape", async () => {
    const onClose = vi.fn()

    render(<DeleteModal isOpen onClose={onClose} onConfirm={vi.fn()} />)

    fireEvent.keyDown(document.activeElement ?? document.body, {
      key: "Escape",
      code: "Escape",
    })

    expect(onClose).toHaveBeenCalledOnce()
  })

  it("does not call onClose via onOpenChange when dialog opens (open=true branch)", () => {
    const onClose = vi.fn()

    // Render closed, then re-render as open — Radix fires onOpenChange(true) internally
    const { rerender } = render(
      <DeleteModal isOpen={false} onClose={onClose} onConfirm={vi.fn()} />
    )

    rerender(<DeleteModal isOpen onClose={onClose} onConfirm={vi.fn()} />)

    // onClose must NOT be called when the dialog opens
    expect(onClose).not.toHaveBeenCalled()
  })

  it("renders default title and description when not provided", () => {
    render(<DeleteModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} />)

    expect(screen.getByText("Deletar item")).toBeInTheDocument()
    expect(screen.getByText(/Tem certeza que deseja deletar este item\?/)).toBeInTheDocument()
  })

  it("does not render itemName span when itemName is not provided", () => {
    render(<DeleteModal isOpen onClose={vi.fn()} onConfirm={vi.fn()} />)

    expect(screen.queryByText(/^"/)).not.toBeInTheDocument()
  })
})
