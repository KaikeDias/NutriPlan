import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Deletar item",
  description = "Tem certeza que deseja deletar este item?",
  itemName
}: Readonly<DeleteModalProps>) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm bg-gray-900">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-[16px] text-gray-200 mt-2">
            {description}
            {itemName && <span className="font-semibold text-gray-200"> "{itemName}"</span>}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 justify-between pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Deletar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
