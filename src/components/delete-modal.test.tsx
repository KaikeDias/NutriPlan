import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
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
})
