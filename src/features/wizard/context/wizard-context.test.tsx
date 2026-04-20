import { describe, it, expect } from "vitest"
import { render, renderHook } from "@testing-library/react"
import {
  WizardProvider,
  useWizardContext,
} from "@/features/wizard/context/wizard-context"

describe("useWizardContext()", () => {
  it("throws when used outside a WizardProvider", () => {
    const { result } = renderHook(() => {
      try {
        return { value: useWizardContext(), error: null }
      } catch (e) {
        return { value: null, error: e as Error }
      }
    })
    expect(result.current.error?.message).toBe(
      "useWizardContext must be used within a WizardProvider"
    )
  })

  it("returns wizard context values inside a WizardProvider", () => {
    const { result } = renderHook(() => useWizardContext(), {
      wrapper: ({ children }) => <WizardProvider>{children}</WizardProvider>,
    })
    expect(result.current.step).toBe(1)
    expect(typeof result.current.next).toBe("function")
    expect(typeof result.current.prev).toBe("function")
    expect(typeof result.current.updateSection).toBe("function")
  })

  it("renders children inside WizardProvider", () => {
    const { getByText } = render(
      <WizardProvider>
        <span>child content</span>
      </WizardProvider>
    )
    expect(getByText("child content")).toBeInTheDocument()
  })
})
