import Wizard from "@/features/wizard/wizard"
import Header from "./components/header"
import { Toaster } from "sonner"
import { CircleX } from "lucide-react"

export function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <Header />
      <Wizard />
      <Toaster
        position="bottom-right"
        duration={3000}
        richColors
        icons={{
          error: <CircleX />
        }}
      />
    </div>
  )
}

export default App
