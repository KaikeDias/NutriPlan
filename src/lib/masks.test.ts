import { describe, it, expect } from "vitest"
import {
  cpfMaskTransformer,
  crnMaskTransformer,
  cnpjMaskTransformer,
} from "@/lib/masks"

describe("cpfMaskTransformer", () => {
  it("formats 11 raw digits as CPF", () => {
    expect(cpfMaskTransformer("52998224725")).toBe("529.982.247-25")
  })

  it("preserves already-formatted CPF", () => {
    expect(cpfMaskTransformer("529.982.247-25")).toBe("529.982.247-25")
  })

  it("partially formats an incomplete CPF", () => {
    expect(cpfMaskTransformer("529982")).toBe("529.982")
  })

  it("strips extra digits beyond 11", () => {
    expect(cpfMaskTransformer("529982247251")).toBe("529.982.247-25")
  })
})

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

describe("cnpjMaskTransformer", () => {
  it("formats 14 raw digits as CNPJ", () => {
    expect(cnpjMaskTransformer("11222333000181")).toBe("11.222.333/0001-81")
  })

  it("preserves already-formatted CNPJ", () => {
    expect(cnpjMaskTransformer("11.222.333/0001-81")).toBe("11.222.333/0001-81")
  })

  it("partially formats an incomplete CNPJ", () => {
    expect(cnpjMaskTransformer("11222333")).toBe("11.222.333")
  })

  it("strips extra digits beyond 14", () => {
    expect(cnpjMaskTransformer("112223330001819")).toBe("11.222.333/0001-81")
  })
})
