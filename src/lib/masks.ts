import {
  maskitoTransform,
  type MaskitoMaskExpression,
  type MaskitoOptions,
  type MaskitoPreprocessor,
} from "@maskito/core"

const crnOneDigitMask: MaskitoMaskExpression = [
  "C",
  "R",
  "N",
  "-",
  /\d/,
  "/",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
]
const crnTwoDigitMask: MaskitoMaskExpression = [
  "C",
  "R",
  "N",
  "-",
  /\d/,
  /\d/,
  "/",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
]

// When the user types '/' right after the first region digit (cursor at position 5,
// value = 'CRN-X'), we manually insert the '/' so the mask can switch to 1-digit mode.
export const crnPreprocessor: MaskitoPreprocessor = (
  { elementState, data },
  actionType
) => {
  if (actionType !== "insert") return { elementState, data }
  const { value, selection } = elementState
  if (data === "/" && selection[0] === 5 && value.length === 5) {
    return {
      elementState: { value: value + "/", selection: [6, 6] },
      data: "",
    }
  }
  return { elementState, data }
}

export const crnMaskOptions: MaskitoOptions = {
  mask: ({ value }) => (value[5] === "/" ? crnOneDigitMask : crnTwoDigitMask),
  preprocessors: [crnPreprocessor],
}

export const crnMaskTransformer = (value: string) =>
  maskitoTransform(value, crnMaskOptions)
