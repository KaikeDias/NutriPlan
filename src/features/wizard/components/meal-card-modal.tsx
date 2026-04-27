import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Meal } from "../stores/wizard-store";

interface MealCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal?: Meal;
}

export default function MealCardModal({ isOpen, onClose, meal }: Readonly<MealCardModalProps>) {
  const handleClose = () => {
    onClose();
  }

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
        <div className="text-gray-300 break-all">
          {meal.foods}
        </div>
      </DialogContent >
    </Dialog >
  );
}