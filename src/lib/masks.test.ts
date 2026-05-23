import { describe, it, expect, vi } from "vitest"
import {
  crnMaskTransformer,
  crnPreprocessor,
  crnMaskOptions,
  sanitizeFractionInput,
  limitIntegerDigits,
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

// ─── sanitizeFractionInput ───────────────────────────────────────────────────

describe("sanitizeFractionInput", () => {
  it("allows empty string", () => {
    expect(sanitizeFractionInput("")).toBe("")
  })

  it("allows integers", () => {
    expect(sanitizeFractionInput("1")).toBe("1")
    expect(sanitizeFractionInput("10")).toBe("10")
    expect(sanitizeFractionInput("100")).toBe("100")
  })

  it("allows decimal with dot", () => {
    expect(sanitizeFractionInput("1.5")).toBe("1.5")
    expect(sanitizeFractionInput("10.25")).toBe("10.25")
  })

  it("allows decimal with comma", () => {
    expect(sanitizeFractionInput("1,5")).toBe("1,5")
    expect(sanitizeFractionInput("10,25")).toBe("10,25")
  })

  it("allows fractions", () => {
    expect(sanitizeFractionInput("1/2")).toBe("1/2")
    expect(sanitizeFractionInput("3/4")).toBe("3/4")
  })

  it("strips letters and invalid characters", () => {
    expect(sanitizeFractionInput("1abc")).toBe("1")
    expect(sanitizeFractionInput("abc")).toBe("")
    expect(sanitizeFractionInput("1@2")).toBe("12")
  })

  it("prevents multiple slashes", () => {
    expect(sanitizeFractionInput("1/2/3")).toBe("1/23")
  })

  it("prevents mixing fraction with decimal", () => {
    expect(sanitizeFractionInput("1/2.5")).toBe("1/25")
    expect(sanitizeFractionInput("1.5/2")).toBe("1/2")
  })

  it("keeps only the first decimal separator", () => {
    expect(sanitizeFractionInput("1.5.5")).toBe("1.55")
    expect(sanitizeFractionInput("1,5,5")).toBe("1,55")
  })
})

// ─── limitIntegerDigits ──────────────────────────────────────────────────────

describe("limitIntegerDigits", () => {
  function makeInput(value: string): HTMLInputElement {
    const input = document.createElement("input")
    input.value = value
    return input
  }

  function callLimitIntegerDigits(
    input: HTMLInputElement,
    maxDigits = 3
  ): string {
    const event = { currentTarget: input } as React.FormEvent<HTMLInputElement>
    limitIntegerDigits(event, maxDigits)
    return input.value
  }

  it("limits integer digits to maxDigits", () => {
    const input = makeInput("12345")
    const result = callLimitIntegerDigits(input, 3)
    expect(result).toBe("123")
  })

  it("allows maxDigits = 4", () => {
    const input = makeInput("12345")
    const result = callLimitIntegerDigits(input, 4)
    expect(result).toBe("1234")
  })

  it("preserves decimal with dot", () => {
    const input = makeInput("123456.789")
    const result = callLimitIntegerDigits(input, 3)
    expect(result).toBe("123.789")
  })

  it("preserves decimal with comma", () => {
    const input = makeInput("123456,789")
    const result = callLimitIntegerDigits(input, 3)
    expect(result).toBe("123,789")
  })

  it("preserves fractions", () => {
    const input = makeInput("123/4")
    const result = callLimitIntegerDigits(input, 3)
    expect(result).toBe("123/4")
  })

  it("limits numerator in fraction to maxDigits", () => {
    const input = makeInput("12345/6")
    const result = callLimitIntegerDigits(input, 3)
    expect(result).toBe("123/6")
  })

  it("limits denominator in fraction to maxDigits", () => {
    const input = makeInput("1/23456")
    const result = callLimitIntegerDigits(input, 3)
    expect(result).toBe("1/234")
  })

  it("limits both numerator and denominator to maxDigits", () => {
    const input = makeInput("12345/67890")
    const result = callLimitIntegerDigits(input, 4)
    expect(result).toBe("1234/6789")
  })

  it("strips non-numeric characters except ., comma, /", () => {
    const input = makeInput("12a3b4")
    const result = callLimitIntegerDigits(input, 3)
    expect(result).toBe("123")
  })

  it("returns unchanged for empty string", () => {
    const input = makeInput("")
    const result = callLimitIntegerDigits(input, 3)
    expect(result).toBe("")
  })
})
