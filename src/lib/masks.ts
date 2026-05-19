import {
  maskitoTransform,
  type MaskitoMaskExpression,
  type MaskitoOptions,
  type MaskitoPreprocessor,
} from "@maskito/core"

// CRN format: CRN-[5 digits]
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

// Prevent deletion of "CRN-" prefix - always keep it
export const crnPreprocessor: MaskitoPreprocessor = (
  { elementState, data },
  actionType
) => {
  if (actionType === "deleteBackward") {
    const { value, selection } = elementState
    // If trying to delete the "CRN-" prefix, prevent it
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
