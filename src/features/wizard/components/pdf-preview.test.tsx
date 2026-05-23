import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { createRef } from "react"
import { PDFPreview } from "@/features/wizard/components/pdf-preview"

const mockPDFProps = {
  professional: {
    name: "Dr João Silva",
    crn: "CRN123456",
    logo: "",
    cpfCnpj: "123.456.789-00",
  },
  patient: {
    name: "Maria Santos",
    age: 25,
    currentWeight: 70,
    objective: "GAIN_MUSCLE" as const,
    clinicalNotes: "Sem restricoes",
  },
  meals: [
    {
      id: "1",
      time: "07:30",
      title: "Cafe da Manha",
      foods: [
        { name: "2 ovos", amount_caseira_value: "2", amount_caseira_unit: "unidade", amount_tecnica_value: "100", amount_tecnica_unit: "g" },
      ],
    },
  ],
  currentDate: "18/05/2026",
  objectiveLabels: {
    GAIN_MUSCLE: "Ganho de Massa Magra",
    LOSE_WEIGHT: "Perda de Peso",
    MAINTAIN_WEIGHT: "Manutencao de Peso",
    OTHER: "Outro",
  },
}

describe("PDFPreview", () => {
  it("should render with forwardRef", () => {
    const ref = createRef<HTMLDivElement>()

    render(<PDFPreview ref={ref} {...mockPDFProps} />)

    expect(ref.current).toBeTruthy()
  })

  it("should have A4 dimensions with 210mm width", () => {
    const ref = createRef<HTMLDivElement>()

    render(<PDFPreview ref={ref} {...mockPDFProps} />)

    expect(ref.current?.style.width).toBe("210mm")
  })

  it("should have A4 dimensions with 297mm height", () => {
    const ref = createRef<HTMLDivElement>()

    render(<PDFPreview ref={ref} {...mockPDFProps} />)

    expect(ref.current?.style.minHeight).toBe("297mm")
  })

  it("should render professional name", () => {
    const { container } = render(<PDFPreview {...mockPDFProps} />)

    expect(container.textContent).toContain("Dr")
    expect(container.textContent).toContain("Silva")
  })

  it("should render patient name", () => {
    const { container } = render(<PDFPreview {...mockPDFProps} />)

    expect(container.textContent).toContain("Maria Santos")
  })

  it("should render patient age and weight", () => {
    const { container } = render(<PDFPreview {...mockPDFProps} />)

    expect(container.textContent).toContain("25")
    expect(container.textContent).toContain("70")
  })

  it("should render meal information", () => {
    const { container } = render(<PDFPreview {...mockPDFProps} />)

    expect(container.textContent).toContain("07:30")
    expect(container.textContent).toContain("2 ovos")
  })

  it("should render multiple meals", () => {
    const props = {
      ...mockPDFProps,
      meals: [
        ...mockPDFProps.meals,
        {
          id: "2",
          time: "12:30",
          title: "Almoco",
          foods: [
            { name: "Frango com arroz", amount_caseira_value: "", amount_caseira_unit: "", amount_tecnica_value: "", amount_tecnica_unit: "" },
          ],
        },
      ],
    }

    const { container } = render(<PDFPreview {...props} />)

    expect(container.textContent).toContain("07:30")
    expect(container.textContent).toContain("12:30")
  })

  it("should render with empty meals", () => {
    const props = {
      ...mockPDFProps,
      meals: [],
    }

    const { container } = render(<PDFPreview {...props} />)

    expect(container.textContent).toContain("Maria Santos")
  })
})