import { describe, it, expect, beforeEach } from "vitest"
import { migrateLocalStorage } from "./storage-migration"

describe("migrateLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("runs migration when no version is stored", () => {
    localStorage.setItem("meu_formulario", '{"data":"old"}')

    migrateLocalStorage()

    expect(localStorage.getItem("meu_formulario")).toBeNull()
    expect(localStorage.getItem("storage_version")).toBe("2")
  })

  it("runs migration when stored version is outdated", () => {
    localStorage.setItem("storage_version", "1")
    localStorage.setItem("meu_formulario", '{"data":"old"}')

    migrateLocalStorage()

    expect(localStorage.getItem("meu_formulario")).toBeNull()
    expect(localStorage.getItem("storage_version")).toBe("2")
  })

  it("skips migration when version is already current", () => {
    localStorage.setItem("storage_version", "2")
    localStorage.setItem("meu_formulario", '{"data":"kept"}')

    migrateLocalStorage()

    expect(localStorage.getItem("meu_formulario")).toBe('{"data":"kept"}')
    expect(localStorage.getItem("storage_version")).toBe("2")
  })

  it("sets storage_version even when meu_formulario is absent", () => {
    migrateLocalStorage()

    expect(localStorage.getItem("storage_version")).toBe("2")
  })
})
