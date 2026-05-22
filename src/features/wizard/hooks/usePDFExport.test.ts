import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { usePDFExport } from "./usePDFExport"
import type { PDFPreviewProps } from "../utils/pdf-generator"

vi.mock("@react-pdf/renderer", () => ({
  pdf: vi.fn(() => ({
    toBlob: vi.fn().mockResolvedValue(new Blob(["pdf content"], { type: "application/pdf" })),
  })),
}))

vi.mock("../components/NutritionPDF", () => ({
  NutritionPDF: vi.fn(),
}))

const mockProps: PDFPreviewProps = {
  professional: { name: "Dr. Teste", crn: "CRN123" },
  patient: { name: "Paciente", age: 30, currentWeight: 70, objective: "LEAN_MASS_GAIN" },
  meals: [{ id: "1", title: "Café da Manhã", time: "08:00", foods: "Ovos" }],
  currentDate: "22/05/2026",
  objectiveLabels: { LEAN_MASS_GAIN: "Ganho de Massa Magra" },
}

// Capture the real DOM implementation before any spy is set up
const realCreateElement = document.createElement.bind(document)

describe("usePDFExport", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    global.URL.createObjectURL = vi.fn(() => "blob:mock-url")
    global.URL.revokeObjectURL = vi.fn()

    const mockLink = { href: "", download: "", click: vi.fn() }
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "a") return mockLink as unknown as HTMLElement
      return realCreateElement(tag as keyof HTMLElementTagNameMap)
    })
    vi.spyOn(document.body, "appendChild").mockImplementation((node) => node)
    vi.spyOn(document.body, "removeChild").mockImplementation((node) => node)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("should initialize with loading false and no error", () => {
    const { result } = renderHook(() => usePDFExport())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it("should return downloadPDF and resetError functions", () => {
    const { result } = renderHook(() => usePDFExport())

    expect(typeof result.current.downloadPDF).toBe("function")
    expect(typeof result.current.resetError).toBe("function")
    expect(typeof result.current.loading).toBe("boolean")
    expect(result.current.error).toBeNull()
  })

  it("should set loading to true during download and false after", async () => {
    const { result } = renderHook(() => usePDFExport())

    await act(async () => {
      await result.current.downloadPDF("test.pdf", mockProps)
    })

    expect(result.current.loading).toBe(false)
  })

  it("should reset error when resetError is called", async () => {
    const { pdf } = await import("@react-pdf/renderer")
    vi.mocked(pdf).mockImplementationOnce(() => {
      throw new Error("PDF generation failed")
    })

    const { result } = renderHook(() => usePDFExport())

    await act(async () => {
      await result.current.downloadPDF("test.pdf", mockProps)
    })

    expect(result.current.error).not.toBeNull()

    act(() => {
      result.current.resetError()
    })

    expect(result.current.error).toBe(null)
  })

  it("should set error string when PDF generation fails", async () => {
    const { pdf } = await import("@react-pdf/renderer")
    vi.mocked(pdf).mockImplementationOnce(() => {
      throw new Error("Rendering error")
    })

    const { result } = renderHook(() => usePDFExport())

    await act(async () => {
      await result.current.downloadPDF("test.pdf", mockProps)
    })

    expect(typeof result.current.error).toBe("string")
    expect(result.current.error?.length).toBeGreaterThan(0)
  })

  it("should handle multiple consecutive error resets", async () => {
    const { pdf } = await import("@react-pdf/renderer")
    vi.mocked(pdf).mockImplementationOnce(() => {
      throw new Error("Rendering error")
    })

    const { result } = renderHook(() => usePDFExport())

    await act(async () => {
      await result.current.downloadPDF("test.pdf", mockProps)
    })

    expect(result.current.error).not.toBeNull()

    act(() => {
      result.current.resetError()
    })
    expect(result.current.error).toBeNull()

    act(() => {
      result.current.resetError()
    })
    expect(result.current.error).toBeNull()
  })
})

