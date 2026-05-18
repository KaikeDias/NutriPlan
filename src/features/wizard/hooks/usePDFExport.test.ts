import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { usePDFExport } from "./usePDFExport"

describe("usePDFExport", () => {
  let mockRef: React.RefObject<HTMLDivElement | null>

  beforeEach(() => {
    vi.clearAllMocks()
    mockRef = { current: document.createElement("div") }
    if (mockRef.current) {
      mockRef.current.style.width = "210mm"
      mockRef.current.style.height = "297mm"
      mockRef.current.innerHTML = "<p>Test PDF Content</p>"
    }
  })

  afterEach(() => {
    const styleOverride = document.getElementById("__pdf-color-override__")
    if (styleOverride && document.head.contains(styleOverride)) {
      document.head.removeChild(styleOverride)
    }
  })

  it("should initialize with loading false and no error", () => {
    const { result } = renderHook(() => usePDFExport(mockRef as any))

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it("should set error when ref is null", async () => {
    const nullRef = { current: null }
    const { result } = renderHook(() => usePDFExport(nullRef as any))

    await act(async () => {
      await result.current.downloadPDF("test.pdf")
    })

    expect(result.current.error).toBe("Elemento PDF não encontrado")
    expect(result.current.loading).toBe(false)
  })

  it("should reset error when resetError is called", async () => {
    const nullRef = { current: null }
    const { result } = renderHook(() => usePDFExport(nullRef as any))

    await act(async () => {
      await result.current.downloadPDF("test.pdf")
    })

    expect(result.current.error).not.toBeNull()

    act(() => {
      result.current.resetError()
    })

    expect(result.current.error).toBe(null)
  })

  it("should return downloadPDF and resetError functions", () => {
    const { result } = renderHook(() => usePDFExport(mockRef as any))

    expect(typeof result.current.downloadPDF).toBe("function")
    expect(typeof result.current.resetError).toBe("function")
    expect(typeof result.current.loading).toBe("boolean")
    expect(result.current.error).toBeNull()
  })

  it("should handle multiple consecutive error resets", async () => {
    const nullRef = { current: null }
    const { result } = renderHook(() => usePDFExport(nullRef as any))

    await act(async () => {
      await result.current.downloadPDF("test.pdf")
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

  it("should provide error message string when error occurs", async () => {
    const nullRef = { current: null }
    const { result } = renderHook(() => usePDFExport(nullRef as any))

    await act(async () => {
      await result.current.downloadPDF("test.pdf")
    })

    expect(typeof result.current.error).toBe("string")
    expect(result.current.error?.length).toBeGreaterThan(0)
  })
})
