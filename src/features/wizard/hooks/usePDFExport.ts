import { useState } from "react"

export function usePDFExport(
  pdfRef: React.RefObject<HTMLDivElement | null>
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadPDF = async (filename: string) => {
    if (!pdfRef.current) {
      setError("Elemento PDF não encontrado")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { default: html2canvas } = await import("html2canvas")
      const { jsPDF } = await import("jspdf")

      // Sobrescrever temporariamente as CSS vars com oklch por valores hex
      // para que html2canvas consiga processar sem erros
      const styleOverride = document.createElement("style")
      styleOverride.id = "__pdf-color-override__"
      styleOverride.textContent = `
        :root {
          --background: #ffffff !important;
          --foreground: #111827 !important;
          --card: #ffffff !important;
          --card-foreground: #111827 !important;
          --popover: #ffffff !important;
          --popover-foreground: #111827 !important;
          --primary: #059669 !important;
          --primary-foreground: #ecfdf5 !important;
          --secondary: #f3f4f6 !important;
          --secondary-foreground: #111827 !important;
          --muted: #f3f4f6 !important;
          --muted-foreground: #6b7280 !important;
          --accent: #f3f4f6 !important;
          --accent-foreground: #111827 !important;
          --destructive: #ef4444 !important;
          --border: #e5e7eb !important;
          --input: #e5e7eb !important;
          --ring: #9ca3af !important;
          --chart-1: #34d399 !important;
          --chart-2: #10b981 !important;
          --chart-3: #059669 !important;
        }
      `
      document.head.appendChild(styleOverride)

      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        foreignObjectRendering: false,
      })

      // Remover o override após captura
      document.head.removeChild(styleOverride)

      const imgData = canvas.toDataURL("image/jpeg", 0.95)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * pageWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(filename)
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
