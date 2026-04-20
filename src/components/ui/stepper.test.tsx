import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { User, Users, Utensils, FileText } from "lucide-react"
import { Stepper, type StepperStep } from "@/components/ui/stepper"

const STEPS: StepperStep[] = [
  { id: 1, label: "Perfil Profissional", icon: User },
  { id: 2, label: "Dados do Paciente", icon: Users },
  { id: 3, label: "Elaboração da Dieta", icon: Utensils },
  { id: 4, label: "Exportação", icon: FileText },
]

describe("Stepper", () => {
  it("renders all step labels", () => {
    render(<Stepper steps={STEPS} currentStep={1} />)
    expect(screen.getByText("Perfil Profissional")).toBeInTheDocument()
    expect(screen.getByText("Dados do Paciente")).toBeInTheDocument()
    expect(screen.getByText("Elaboração da Dieta")).toBeInTheDocument()
    expect(screen.getByText("Exportação")).toBeInTheDocument()
  })

  it("renders 4 step buttons", () => {
    render(<Stepper steps={STEPS} currentStep={1} />)
    expect(screen.getAllByRole("button")).toHaveLength(4)
  })

  it("calls onStepClick with the correct id when a step button is clicked", async () => {
    const user = userEvent.setup()
    const onStepClick = vi.fn()
    render(<Stepper steps={STEPS} currentStep={1} onStepClick={onStepClick} />)
    await user.click(screen.getAllByRole("button")[1]) // click step 2
    expect(onStepClick).toHaveBeenCalledWith(2)
  })

  it("applies teal-500 class to the active step button", () => {
    render(<Stepper steps={STEPS} currentStep={2} />)
    const buttons = screen.getAllByRole("button")
    // step 2 (index 1) is active
    expect(buttons[1].className).toContain("bg-teal-500")
  })

  it("applies teal-600 class to completed step buttons", () => {
    render(<Stepper steps={STEPS} currentStep={3} />)
    const buttons = screen.getAllByRole("button")
    // steps 1 and 2 (indices 0, 1) are completed
    expect(buttons[0].className).toContain("bg-teal-600")
    expect(buttons[1].className).toContain("bg-teal-600")
  })

  it("applies gray-700 class to future (inactive/incomplete) step buttons", () => {
    render(<Stepper steps={STEPS} currentStep={1} />)
    const buttons = screen.getAllByRole("button")
    // steps 2–4 are future steps
    expect(buttons[1].className).toContain("bg-gray-700")
    expect(buttons[2].className).toContain("bg-gray-700")
    expect(buttons[3].className).toContain("bg-gray-700")
  })
})
