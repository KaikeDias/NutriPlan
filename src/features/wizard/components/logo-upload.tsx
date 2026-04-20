import { useRef } from "react"
import { ImageIcon, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LogoUploadProps {
  value?: string
  onChange: (base64: string | undefined) => void
  error?: string
}

export function LogoUpload({
  value,
  onChange,
  error,
}: Readonly<LogoUploadProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      onChange(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Reset so the same file can be re-selected
    e.target.value = ""
  }

  function removeLogo() {
    onChange(undefined)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-6">
        {value ? (
          <div className="group relative">
            <div className="h-32 w-32 overflow-hidden rounded-xl border-2 border-border bg-muted">
              <img
                src={value}
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={removeLogo}
              className="text-destructive-foreground absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" />
            {value ? "Alterar Logo" : "Enviar Logo"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Formatos aceitos: PNG, JPG, SVG. Tamanho recomendado: 200x200px
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
