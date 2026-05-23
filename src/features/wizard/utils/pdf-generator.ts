import type { WizardStore } from "../stores/wizard-store"
import { PATIENT_GOAL_LABELS } from "../types/patient-goal"

export interface PDFProfessional {
  name: string
  crn: string
  logo?: string
  cpfCnpj?: string
}

export interface PDFPatient {
  name: string
  age: number
  currentWeight: number
  objective: string
  clinicalNotes?: string
}

export interface PDFFoodItem {
  name: string
  amount_caseira_value: string
  amount_caseira_unit: string
  amount_tecnica_value: string
  amount_tecnica_unit: string
}

export interface PDFMeal {
  id: string
  title: string
  time: string
  foods: PDFFoodItem[]
}

/**
 * Formata um alimento para exibição: "Nome — qtd caseira (qtd técnica)"
 */
export function formatFoodDisplay(food: PDFFoodItem): string {
  const caseira = [food.amount_caseira_value, food.amount_caseira_unit].filter(Boolean).join(" ")
  const tecnica = [food.amount_tecnica_value, food.amount_tecnica_unit].filter(Boolean).join(" ")
  if (!caseira && !tecnica) return food.name
  if (!tecnica) return `${food.name} — ${caseira}`
  if (!caseira) return `${food.name} (${tecnica})`
  return `${food.name} — ${caseira} (${tecnica})`
}

export interface PDFPreviewProps {
  professional: PDFProfessional
  patient: PDFPatient
  meals: PDFMeal[]
  currentDate: string
  objectiveLabels: Record<string, string>
}

/**
 * Mapeia dados do WizardStore para o formato esperado pelo PDFPreview
 */
export function mapWizardDataToPDF(wizardData: WizardStore): PDFPreviewProps {
  return {
    professional: {
      name: wizardData.professional.name,
      crn: wizardData.professional.crn,
      logo: wizardData.professional.logo,
    },
    patient: {
      name: wizardData.patient.name,
      age: wizardData.patient.age,
      currentWeight: wizardData.patient.weight,
      objective: wizardData.patient.goal,
      clinicalNotes: wizardData.patient.observations,
    },
    meals: wizardData.diet.meals.map((meal) => ({
      id: meal.id,
      title: meal.name,
      time: meal.time,
      foods: meal.foods.map((food) => ({
        name: food.name,
        amount_caseira_value: food.amount_caseira_value,
        amount_caseira_unit: food.amount_caseira_unit,
        amount_tecnica_value: food.amount_tecnica_value,
        amount_tecnica_unit: food.amount_tecnica_unit,
      })),
    })),
    currentDate: formatDateForPDF(new Date()),
    objectiveLabels: PATIENT_GOAL_LABELS,
  }
}

/**
 * Formata data para o padrão brasileiro (DD/MM/YYYY)
 */
export function formatDateForPDF(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

/**
 * Valida se todos os dados obrigatórios estão presentes
 */
export function validatePDFData(wizardData: WizardStore): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Professional
  if (!wizardData.professional.name?.trim()) {
    errors.push("Nome do profissional é obrigatório")
  }
  if (!wizardData.professional.crn?.trim()) {
    errors.push("CRN do profissional é obrigatório")
  }

  // Patient
  if (!wizardData.patient.name?.trim()) {
    errors.push("Nome do paciente é obrigatório")
  }
  if (wizardData.patient.age <= 0) {
    errors.push("Idade do paciente deve ser maior que 0")
  }
  if (wizardData.patient.weight <= 0) {
    errors.push("Peso do paciente deve ser maior que 0")
  }

  // Diet
  if (wizardData.diet.meals.length === 0) {
    errors.push("Adicione pelo menos uma refeição ao plano")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Gera nome de arquivo para download
 */
export function generatePDFFilename(patientName: string): string {
  const sanitized = patientName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  const timestamp = new Date().getTime()
  return `plano-alimentar-${sanitized}-${timestamp}.pdf`
}
