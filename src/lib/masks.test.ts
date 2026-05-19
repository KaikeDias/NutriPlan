import { describe, it, expect } from "vitest"
import {
  crnMaskTransformer,
  crnPreprocessor,
  crnMaskOptions,
} from "@/lib/masks"

// ─── helpers ─────────────────────────────────────────────────────────────────

function makeState(value: string, cursor: number) {
  return { value, selection: [cursor, cursor] as [number, number] }
}

// ─── crnMaskTransformer ───────────────────────────────────────────────────────

describe("crnMaskTransformer", () => {
  it("formats a complete CRN", () => {
    expect(crnMaskTransformer("CRN-12345")).toBe("CRN-12345")
  })

  it("preserves an already-formatted CRN", () => {
    expect(crnMaskTransformer("CRN-12345")).toBe("CRN-12345")
  })

  it("partially formats an incomplete CRN", () => {
    expect(crnMaskTransformer("CRN-123")).toBe("CRN-123")
  })

  it("formats only digits without prefix", () => {
    expect(crnMaskTransformer("12345")).toBe("CRN-12345")
  })
})

// ─── crnPreprocessor ─────────────────────────────────────────────────────────

describe("crnPreprocessor", () => {
  it("prevents deletion of CRN- prefix (cursor at position 0)", () => {
    const state = makeState("CRN-12345", 0)
    const result = crnPreprocessor(
      { elementState: state, data: "" },
      "deleteBackward"
    )
    expect(result.elementState.selection).toEqual([4, 4])
  })

  it("prevents deletion of CRN- prefix (cursor at position 3)", () => {
    const state = makeState("CRN-12345", 3)
    const result = crnPreprocessor(
      { elementState: state, data: "" },
      "deleteBackward"
    )
    expect(result.elementState.selection).toEqual([4, 4])
  })

  it("prevents deletion of CRN- prefix (cursor at position 4)", () => {
    const state = makeState("CRN-12345", 4)
    const result = crnPreprocessor(
      { elementState: state, data: "" },
      "deleteBackward"
    )
    expect(result.elementState.selection).toEqual([4, 4])
  })

  it("allows deletion after CRN- prefix (cursor at position 5)", () => {
    const state = makeState("CRN-12345", 5)
    const result = crnPreprocessor(
      { elementState: state, data: "" },
      "deleteBackward"
    )
    expect(result).toEqual({ elementState: state, data: "" })
  })

  it("returns state unchanged for actionType insert", () => {
    const state = makeState("CRN-1", 5)
    const result = crnPreprocessor({ elementState: state, data: "2" }, "insert")
    expect(result).toEqual({ elementState: state, data: "2" })
  })

  it("returns state unchanged for actionType deleteForward", () => {
    const state = makeState("CRN-1", 5)
    const result = crnPreprocessor(
      { elementState: state, data: "" },
      "deleteForward"
    )
    expect(result).toEqual({ elementState: state, data: "" })
  })

  it("returns state unchanged for actionType validation", () => {
    const state = makeState("CRN-1", 5)
    const result = crnPreprocessor(
      { elementState: state, data: "" },
      "validation"
    )
    expect(result).toEqual({ elementState: state, data: "" })
  })
})

// ─── crnMaskOptions ──────────────────────────────────────────────────────────

describe("crnMaskOptions", () => {
  it("should have a valid mask configuration", () => {
    expect(crnMaskOptions.mask).toBeDefined()
    expect(crnMaskOptions.preprocessors).toBeDefined()
  })

  it("should have preprocessor array with crnPreprocessor", () => {
    expect(Array.isArray(crnMaskOptions.preprocessors)).toBe(true)
    expect(crnMaskOptions.preprocessors).toContain(crnPreprocessor)
  })
})
