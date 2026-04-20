import { Leaf } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 mb-10 border-b bg-gray-900">
      <div className="ml-2 max-w-5xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">NutriPlan</h1>
              <p className="text-xs text-muted-foreground">
                Planos Alimentares Personalizados
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
