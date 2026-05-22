import { createElement } from "react"
import type { ReactElement } from "react"
import { useState } from "react"
import { pdf } from "@react-pdf/renderer"
import type { DocumentProps } from "@react-pdf/renderer"
import { NutritionPDF } from "../components/NutritionPDF"
import type { PDFPreviewProps } from "../utils/pdf-generator"

export function usePDFExport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadPDF = async (filename: string, props: PDFPreviewProps) => {
    try {
      setLoading(true)
      setError(null)

      const blob = await pdf(
        createElement(NutritionPDF, props) as ReactElement<DocumentProps>
      ).toBlob()
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setLoading(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      setLoading(false)
      console.error("Erro ao gerar PDF:", err)
    }
  }

  const resetError = () => {
    setError(null)
  }

  return {
    downloadPDF,
    loading,
    error,
    resetError,
  }
}
