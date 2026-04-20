import Wizard from "@/features/wizard/wizard"
import Header from "./components/header"

export function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <Wizard />
    </div>
  )
}

export default App