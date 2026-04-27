import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { mealSchema, type MealData } from "../schemas/wizard-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Meal } from "../stores/wizard-store";
import { useEffect } from "react";

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meal: Omit<Meal, "id">) => void;
  editingMeal: Meal | null;
}

export default function AddMealModal({ isOpen, onClose, onSave, editingMeal }: Readonly<AddMealModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<MealData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: "",
      time: "",
      foods: "",
    },
  });

  const onSubmit = (values: MealData) => {
    const meal: Omit<Meal, "id"> = {
      name: values.name,
      time: values.time,
      foods: values.foods,
    }

    onSave(meal);
    handleClose();
  }

  useEffect(() => {
    if (editingMeal) {
      reset(editingMeal)
    } else {
      reset({ name: "", time: "", foods: "" })
    }
  }, [editingMeal, reset])

  const handleClose = () => {
    reset();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg bg-gray-900">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">Nova Refeição</DialogTitle>
          <DialogDescription className="text-md">
            Preencha os dados da nova refeição.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Horario"
            placeholder="Ex: 08:00"
            type="time"
            error={errors.time?.message}
            {...register("time")}
          />
          <TextField
            label="Refeição"
            placeholder="Ex: Café da manhã"
            maxLength={100}
            error={errors.name?.message}
            {...register("name")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="foods">Alimentos</Label>
          <Textarea
            id="foods"
            placeholder="Ex: 2 fatias de pão integral, 1 ovo cozido, 1 xícara de café"
            maxLength={1000}
            className="max-h-112.5 resize-none break-all"
            {...register("foods")}
          />
          {errors.foods?.message && (
            <p className="text-sm text-destructive">{errors.foods.message}</p>
          )}
        </div>

        <div className="bg-gray-900 flex justify-between">
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)} className="bg-teal-600 hover:bg-teal-700">Salvar refeição</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}