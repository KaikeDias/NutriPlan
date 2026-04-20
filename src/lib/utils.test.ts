import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn()", () => {
  it("returns empty string when called with no arguments", () => {
    expect(cn()).toBe("")
  })

  it("concatenates simple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("ignores falsy values", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar")
  })

  it("resolves conditional classes via object syntax", () => {
    expect(cn({ active: true, disabled: false })).toBe("active")
  })

  it("merges conflicting Tailwind utilities, keeping the last one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
  })

  it("merges conflicting text color utilities", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })
})
