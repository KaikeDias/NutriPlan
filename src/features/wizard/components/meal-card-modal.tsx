import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Meal } from "../stores/wizard-store";
import { formatFoodDisplay } from "../utils/pdf-generator";
import type { PDFFoodItem } from "../utils/pdf-generator";

interface MealCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal?: Meal;
}

export default function MealCardModal({ isOpen, onClose, meal }: Readonly<MealCardModalProps>) {
  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-gray-900">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">{meal.name}</DialogTitle>
          <DialogDescription className="text-md">
            {meal.time}
          </DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-2 list-none p-0 m-0">
          {meal.foods.map((food, index) => (
            <li key={index} className="text-gray-300 text-sm">
              {formatFoodDisplay(food as PDFFoodItem)}
            </li>
          ))}
        </ul>
      </DialogContent >
    </Dialog >
  );
}