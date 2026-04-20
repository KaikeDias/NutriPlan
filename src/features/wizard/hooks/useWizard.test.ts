import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useWizard } from "@/features/wizard/hooks/useWizard"
import { defaultWizardStore } from "@/features/wizard/stores/wizard-store"

const STORAGE_KEY = "diet_wizard"

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
})

describe("useWizard — navigation", () => {
  it("starts at step 1", () => {
    const { result } = renderHook(() => useWizard())
    expect(result.current.step).toBe(1)
  })

  it("next() increments the step", () => {
    const { result } = renderHook(() => useWizard())
    act(() => result.current.next())
    expect(result.current.step).toBe(2)
  })

  it("next() does not exceed step 4", () => {
    const { result } = renderHook(() => useWizard())
    act(() => {
      result.current.next()
      result.current.next()
      result.current.next()
      result.current.next() // this call must be a no-op
    })
    expect(result.current.step).toBe(4)
  })

  it("prev() decrements the step", () => {
    const { result } = renderHook(() => useWizard())
    act(() => result.current.next())
    act(() => result.current.prev())
    expect(result.current.step).toBe(1)
  })

  it("prev() does not go below step 1", () => {
    const { result } = renderHook(() => useWizard())
    act(() => result.current.prev())
    expect(result.current.step).toBe(1)
  })
})

describe("useWizard — data management", () => {
  it("initialises with defaultWizardStore when localStorage is empty", () => {
    const { result } = renderHook(() => useWizard())
    expect(result.current.data).toEqual(defaultWizardStore)
  })

  it("updateSection() updates the targeted section immutably", () => {
    const { result } = renderHook(() => useWizard())
    const professional = {
      name: "Ana Lima",
      crn: "CRN-3/1",
      document: "123",
      logo: "",
    }

    act(() => result.current.updateSection("professional", professional))

    expect(result.current.data.professional).toEqual(professional)
    // other sections remain unchanged
    expect(result.current.data.patient).toEqual(defaultWizardStore.patient)
  })

  it("persists data to localStorage after updateSection()", () => {
    const { result } = renderHook(() => useWizard())
    const professional = {
      name: "João",
      crn: "CRN-1/99",
      document: "456",
      logo: "",
    }

    act(() => result.current.updateSection("professional", professional))

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")
    expect(stored.professional).toEqual(professional)
  })

  it("hydrates data from localStorage on mount", () => {
    const saved = {
      ...defaultWizardStore,
      professional: { name: "Stored", crn: "X", document: "Y", logo: "" },
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))

    const { result } = renderHook(() => useWizard())
    expect(result.current.data.professional.name).toBe("Stored")
  })

  it("falls back to defaultWizardStore when localStorage contains corrupt JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not-valid-json")
    const { result } = renderHook(() => useWizard())
    expect(result.current.data).toEqual(defaultWizardStore)
  })
})
