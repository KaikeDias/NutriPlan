import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "./label"

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, id, error, className = "", ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          className={`mb-1 h-10 ${error ? "border-destructive" : ""} ${className}`}
          {...rest}
        />
        {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)

TextField.displayName = "TextField"
