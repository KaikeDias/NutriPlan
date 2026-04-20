import { describe, it, expect } from "vitest"
import {
  crnMaskTransformer,
  crnPreprocessor,
  crnMaskOptions,
} from "@/lib/masks"
import type { MaskitoOptions } from "@maskito/core"

// ─── helpers ─────────────────────────────────────────────────────────────────

function makeState(value: string, cursor: number) {
  return { value, selection: [cursor, cursor] as [number, number] }
}

function crnDynamicMask(value: string) {
  const maskFn = (
    crnMaskOptions as MaskitoOptions & {
      mask: (state: { value: string }) => unknown
    }
  ).mask
  return maskFn({ value })
}

// ─── crnMaskTransformer ───────────────────────────────────────────────────────

describe("crnMaskTransformer", () => {
  it("formats a 2-digit region CRN", () => {
    expect(crnMaskTransformer("CRN-1112345")).toBe("CRN-11/12345")
  })

  it("preserves an already-formatted 2-digit region CRN", () => {
    expect(crnMaskTransformer("CRN-11/12345")).toBe("CRN-11/12345")
  })

  it("partially formats an incomplete CRN", () => {
    expect(crnMaskTransformer("CRN-11")).toBe("CRN-11")
  })
})

// ─── crnPreprocessor ─────────────────────────────────────────────────────────

describe("crnPreprocessor", () => {
  it("returns state unchanged for actionType deleteBackward", () => {
    const state = makeState("CRN-1", 5)
    const result = crnPreprocessor(
      { elementState: state, data: "/" },
      "deleteBackward"
    )
    expect(result).toEqual({ elementState: state, data: "/" })
  })

  it("returns state unchanged for actionType deleteForward", () => {
    const state = makeState("CRN-1", 5)
    const result = crnPreprocessor(
      { elementState: state, data: "/" },
      "deleteForward"
    )
    expect(result).toEqual({ elementState: state, data: "/" })
  })

  it("returns state unchanged for actionType validation", () => {
    const state = makeState("CRN-1", 5)
    const result = crnPreprocessor(
      { elementState: state, data: "/" },
      "validation"
    )
    expect(result).toEqual({ elementState: state, data: "/" })
  })

  it("returns state unchanged when data is not '/'", () => {
    const state = makeState("CRN-1", 5)
    const result = crnPreprocessor({ elementState: state, data: "#" }, "insert")
    expect(result).toEqual({ elementState: state, data: "#" })
  })

  it("returns state unchanged when selection[0] is not 5", () => {
    const state = makeState("CRN-1", 3)
    const result = crnPreprocessor({ elementState: state, data: "/" }, "insert")
    expect(result).toEqual({ elementState: state, data: "/" })
  })

  it("returns state unchanged when value.length is not 5", () => {
    const state = makeState("CRN-", 5)
    const result = crnPreprocessor({ elementState: state, data: "/" }, "insert")
    expect(result).toEqual({ elementState: state, data: "/" })
  })

  it("inserts '/' and advances cursor when all conditions match", () => {
    const state = makeState("CRN-3", 5)
    const result = crnPreprocessor({ elementState: state, data: "/" }, "insert")
    expect(result).toEqual({
      elementState: { value: "CRN-3/", selection: [6, 6] },
      data: "",
    })
  })
})

// ─── crnMaskOptions dynamic mask ─────────────────────────────────────────────

describe("crnMaskOptions dynamic mask", () => {
  it("returns 1-digit region mask when value[5] is '/'", () => {
    const mask = crnDynamicMask("CRN-3/1")
    // 1-digit mask has 11 entries: C R N - \d / \d \d \d \d \d
    expect((mask as unknown[]).length).toBe(11)
  })

  it("returns 2-digit region mask when value[5] is not '/'", () => {
    const mask = crnDynamicMask("CRN-11")
    // 2-digit mask has 12 entries: C R N - \d \d / \d \d \d \d \d
    expect((mask as unknown[]).length).toBe(12)
  })
})
