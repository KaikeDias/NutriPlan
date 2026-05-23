import {
  maskitoTransform,
  type MaskitoMaskExpression,
  type MaskitoOptions,
  type MaskitoPreprocessor,
} from "@maskito/core"

const crnMask: MaskitoMaskExpression = [
  "C",
  "R",
  "N",
  "-",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
]

export const crnPreprocessor: MaskitoPreprocessor = (
  { elementState, data },
  actionType
) => {
  if (actionType === "deleteBackward") {
    const { value, selection } = elementState
    if (selection[0] <= 4) {
      return {
        elementState: { value, selection: [4, 4] },
        data: "",
      }
    }
  }
  return { elementState, data }
}

export const crnMaskOptions: MaskitoOptions = {
  mask: crnMask,
  preprocessors: [crnPreprocessor],
}

export const crnMaskTransformer = (value: string) =>
  maskitoTransform(value, crnMaskOptions)

export function sanitizeFractionInput(value: string): string {
  let result = value.replace(/[^\d.,/]/g, "")

  if (result.includes("/")) {
    const firstSlash = result.indexOf("/")
    const beforeSlash = result.slice(0, firstSlash)
    const afterSlash = result.slice(firstSlash + 1).replace(/[.,/]/g, "")
    const numerator = beforeSlash.split(/[.,]/)[0]
    result = numerator + "/" + afterSlash
  } else {
    const sepIndex = result.search(/[.,]/)
    if (sepIndex !== -1) {
      result =
        result.slice(0, sepIndex + 1) +
        result.slice(sepIndex + 1).replace(/[.,]/g, "")
    }
  }

  return result
}

export function limitIntegerDigits(
  e: React.FormEvent<HTMLInputElement>,
  maxDigits = 4
): void {
  const input = e.currentTarget
  const raw = input.value

  if (!raw) return

  const preserved = raw.replace(/[^\d.,/]/g, "")

  const totalDigits = preserved.replace(/[^\d]/g, "").length

  if (totalDigits <= maxDigits) return

  let digitsUsed = 0

  const limited = preserved
    .split("")
    .filter((char) => {
      if (!/\d/.test(char)) {
        return true
      }

      if (digitsUsed < maxDigits) {
        digitsUsed++
        return true
      }

      return false
    })
    .join("")

  input.value = limited
}
