import { Plus, Utensils } from "lucide-react"
import { useWizardContext } from "../context/wizard-context"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { Meal } from "../stores/wizard-store"
import AddMealModal from "../components/add-meal-modal"
import MealCard from "../components/meal-card"
import { toast } from "sonner"
import MealCardModal from "../components/meal-card-modal"
import DeleteModal from "@/components/delete-modal"

export default function DietCreationStep() {
  const { data, updateSection, next, prev } = useWizardContext()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [mealToEdit, setMealToEdit] = useState<Meal | null>(null)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [mealToDelete, setMealToDelete] = useState<Meal | null>(null)

  const handleOpenAddModal = (meal?: Meal) => {
    setMealToEdit(meal || null)
    setIsAddModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setMealToEdit(null)
    setIsAddModalOpen(false)
  }

  const handleOpenCardModal = (meal: Meal) => {
    setSelectedMeal(meal)
    setIsCardModalOpen(true)
  }

  const handleCloseCardModal = () => {
    setSelectedMeal(null)
    setIsCardModalOpen(false)
  }

  const handleOpenDeleteModal = (meal: Meal) => {
    setMealToDelete(meal)
    setIsDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setMealToDelete(null)
    setIsDeleteModalOpen(false)
  }

  const handleSaveMeal = (meal: Omit<Meal, "id">) => {
    if (mealToEdit) {
      const updatedMeals = data.diet.meals.map((m) =>
        m.id === mealToEdit.id ? { ...meal, id: mealToEdit.id } : m
      )
      updateSection("diet", { meals: updatedMeals })
    } else {
      const newMeal = {
        ...meal,
        id: crypto.randomUUID(),
      }
      updateSection("diet", { meals: [...data.diet.meals, newMeal] })
    }

    handleCloseAddModal()
  }

  const handleDeleteMeal = (meal: Meal) => {
    const updatedMeals = data.diet.meals.filter((m) => m.id !== meal.id)
    updateSection("diet", { meals: updatedMeals })
  }

  const handleNext = () => {
    if (data.diet.meals.length === 0) {
      return (
        toast.error("Adicione pelo menos uma refeição para prosseguir.")
      )
    }
    next()
  }

  return (
    <div>
      <p className="text-gray-400">Monte o plano alimentar adicionando as refeições do dia.</p>
      <div className="flex justify-end">
        <Button onClick={() => handleOpenAddModal()} className="mt-4 gap-2 bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4" />
          Adicionar Refeição
        </Button>
      </div>
      {data.diet.meals.length > 0 ? (
        <div className="mt-6 space-y-3">
          {data.diet.meals.map((meal) => (
            <MealCard
              key={meal.id}
              name={meal.name}
              time={meal.time}
              foods={meal.foods}
              onEditing={() => handleOpenAddModal(meal)}
              onClick={() => handleOpenCardModal(meal)}
              onDelete={() => handleOpenDeleteModal(meal)}
            />
          ))}
        </div>
      ) :
        <div className="flex flex-col items-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Utensils className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Comece adicionando as refeições do dia do paciente, como café da manhã, almoço, lanches e jantar.
          </p>
          <Button variant="outline" onClick={() => handleOpenAddModal()} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Primeira Refeição
          </Button>
        </div>
      }
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          onClick={prev}
          variant="outline"
          className="border-gray-700"
        >
          Anterior
        </Button>
        <Button onClick={handleNext} className="bg-teal-600 hover:bg-teal-700">
          Próximo
        </Button>
      </div>

      <AddMealModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveMeal}
        editingMeal={mealToEdit}
      />

      <MealCardModal
        isOpen={isCardModalOpen}
        onClose={handleCloseCardModal}
        meal={selectedMeal ?? undefined}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={() => {
          if (mealToDelete) {
            handleDeleteMeal(mealToDelete)
          }
        }}
        description="Tem certeza que deseja deletar esta refeição? Esta ação não pode ser desfeita."
      />
    </div>
  )
}