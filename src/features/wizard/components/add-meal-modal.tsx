import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/ui/text-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mealSchema, type MealData, type FoodItemData } from "../schemas/wizard-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import type { Meal } from "../stores/wizard-store";
import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { sanitizeFractionInput, limitIntegerDigits } from "@/lib/masks";

const CASEIRA_UNITS = [
  "colher de café",
  "colher de chá",
  "colher de sobremesa",
  "colher de sopa",
  "xícara de chá (240 mL)",
  "copo americano (200 mL)",
  "concha",
  "pegador",
  "colher de arroz",
  "fatia",
  "unidade",
]

const TECNICA_UNITS = ["g", "kg", "mg", "mL", "L", "unidades"]

const defaultFood: FoodItemData = {
  name: "",
  amount_caseira_value: "",
  amount_caseira_unit: "",
  amount_tecnica_value: "",
  amount_tecnica_unit: "",
}

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
    control,
    formState: { errors },
    reset,
  } = useForm<MealData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: "",
      time: "",
      foods: [defaultFood],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "foods" });

  const onSubmit = (values: MealData) => {
    onSave({ name: values.name, time: values.time, foods: values.foods });
    handleClose();
  }

  useEffect(() => {
    if (editingMeal) {
      reset({
        name: editingMeal.name,
        time: editingMeal.time,
        foods: editingMeal.foods.length > 0 ? editingMeal.foods : [defaultFood],
      });
    } else {
      reset({ name: "", time: "", foods: [defaultFood] });
    }
  }, [editingMeal, reset])

  const handleClose = () => {
    reset({ name: "", time: "", foods: [defaultFood] });
    onClose();
  }

  const foodsError = (errors.foods as { root?: { message?: string }; message?: string } | undefined)
    ?.root?.message ?? (errors.foods as { message?: string } | undefined)?.message;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl bg-gray-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">
            {editingMeal ? "Editar Refeição" : "Nova Refeição"}
          </DialogTitle>
          <DialogDescription className="text-md">
            Preencha os dados da refeição e adicione os alimentos.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Horário"
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

        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center justify-between">
            <Label>Alimentos</Label>
            {foodsError && (
              <p className="text-sm text-destructive">{foodsError}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col gap-4 rounded-lg border border-gray-700 p-3"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <TextField
                      label="Nome do alimento"
                      placeholder="Ex: Pão integral"
                      maxLength={100}
                      error={errors.foods?.[index]?.name?.message}
                      {...register(`foods.${index}.name`)}
                    />
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-[22px] p-2 w-10 h-10 bg-red-500 text-white font-bold hover:bg-transparent"
                      onClick={() => remove(index)}
                      aria-label={`Remover alimento ${index + 1}`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <Label className="mb-2">Medida caseira</Label>
                    <div className="flex gap-1">
                      <Controller
                        control={control}
                        name={`foods.${index}.amount_caseira_value`}
                        render={({ field }) => (
                          <Input
                            placeholder="Qtd"
                            className="w-16 shrink-0"
                            value={field.value}
                            onChange={(e) => field.onChange(sanitizeFractionInput(e.target.value))}
                            onInput={(e) => limitIntegerDigits(e, 4)}
                            onBlur={field.onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`foods.${index}.amount_caseira_unit`}
                        render={({ field: selectField }) => (
                          <Select value={selectField.value} onValueChange={selectField.onChange}>
                            <SelectTrigger className="flex-1 min-w-0 border-gray-700 bg-gray-800/60 text-gray-100 data-placeholder:text-gray-400">
                              <SelectValue placeholder="Unidade" />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              className="border border-gray-800 bg-gray-900 text-gray-100"
                            >
                              {CASEIRA_UNITS.map((u) => (
                                <SelectItem key={u} value={u} className="transition-colors focus:bg-teal-600/20 focus:text-teal-100 data-[state=checked]:bg-teal-600/30 data-[state=checked]:text-teal-100">{u}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label className="mb-2">Medida técnica</Label>
                    <div className="flex gap-1">
                      <Controller
                        control={control}
                        name={`foods.${index}.amount_tecnica_value`}
                        render={({ field }) => (
                          <Input
                            placeholder="Qtd"
                            className="w-16 shrink-0"
                            value={field.value}
                            maxLength={3}
                            onChange={(e) => field.onChange(sanitizeFractionInput(e.target.value))}
                            onInput={(e) => limitIntegerDigits(e, 4)}
                            onBlur={field.onBlur}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name={`foods.${index}.amount_tecnica_unit`}
                        render={({ field: selectField }) => (
                          <Select value={selectField.value} onValueChange={selectField.onChange}>
                            <SelectTrigger className="flex-1 min-w-0 border-gray-700 bg-gray-800/60 text-gray-100 data-placeholder:text-gray-400">
                              <SelectValue placeholder="Unidade" />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              className="border border-gray-800 bg-gray-900 text-gray-100"
                            >
                              {TECNICA_UNITS.map((u) => (
                                <SelectItem key={u} value={u} className="transition-colors focus:bg-teal-600/20 focus:text-teal-100 data-[state=checked]:bg-teal-600/30 data-[state=checked]:text-teal-100">{u}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-gray-600 text-gray-400 hover:text-teal-400 hover:border-teal-600"
            onClick={() => append(defaultFood)}
          >
            <Plus size={16} className="mr-2" />
            Adicionar alimento
          </Button>
        </div>

        <div className="bg-gray-900 flex justify-between mt-2">
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)} className="bg-teal-600 hover:bg-teal-700">
            Salvar refeição
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}