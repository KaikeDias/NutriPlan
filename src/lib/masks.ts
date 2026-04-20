import {
  maskitoTransform,
  type MaskitoMaskExpression,
  type MaskitoOptions,
  type MaskitoPreprocessor,
} from "@maskito/core"

// ─── CPF ─────────────────────────────────────────────────────────────────────

export const cpfMaskOptions: MaskitoOptions = {
  mask: [
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ],
}

export const cpfMaskTransformer = (value: string) =>
  maskitoTransform(value, cpfMaskOptions)

// ─── CRN ─────────────────────────────────────────────────────────────────────
// Supports: CRN-X/NNNNN (1-digit region) and CRN-XX/NNNNN (2-digit region)

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
const crnPreprocessor: MaskitoPreprocessor = (
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

// ─── CNPJ ────────────────────────────────────────────────────────────────────

export const cnpjMaskOptions: MaskitoOptions = {
  mask: [
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "/",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ],
}

export const cnpjMaskTransformer = (value: string) =>
  maskitoTransform(value, cnpjMaskOptions)

// ─── Document (CPF or CNPJ, dynamic) ─────────────────────────────────────────

// When CPF is complete (11 raw digits) and the user types one more digit,
// the preprocessor strips the mask chars and passes raw digits + new digit
// so the mask function can switch to CNPJ mode.
const documentPreprocessor: MaskitoPreprocessor = (
  { elementState, data },
  actionType
) => {
  if (actionType !== "insert" || !/^\d$/.test(data))
    return { elementState, data }
  const raw = elementState.value.replace(/\D/g, "")
  if (raw.length === 11) {
    const newRaw = raw + data
    return {
      elementState: {
        value: newRaw,
        selection: [newRaw.length, newRaw.length],
      },
      data: "",
    }
  }
  return { elementState, data }
}

export const documentMaskOptions: MaskitoOptions = {
  mask: ({ value }) => {
    const digits = value.replace(/\D/g, "").length
    if (digits > 11) {
      return [
        /\d/,
        /\d/,
        ".",
        /\d/,
        /\d/,
        /\d/,
        ".",
        /\d/,
        /\d/,
        /\d/,
        "/",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
      ]
    }
    return [
      /\d/,
      /\d/,
      /\d/,
      ".",
      /\d/,
      /\d/,
      /\d/,
      ".",
      /\d/,
      /\d/,
      /\d/,
      "-",
      /\d/,
      /\d/,
    ]
  },
  preprocessors: [documentPreprocessor],
}
