const STORAGE_VERSION = "2"

export function migrateLocalStorage() {
  const currentVersion = localStorage.getItem("storage_version")

  if (currentVersion !== STORAGE_VERSION) {
    localStorage.removeItem("meu_formulario")

    localStorage.setItem("storage_version", STORAGE_VERSION)
  }
}