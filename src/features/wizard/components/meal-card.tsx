import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Utensils } from "lucide-react";

interface MealCardProps {
  name: string;
  time: string;
  foods: string;
  onEditing?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export default function MealCard({ name, time, foods, onEditing, onDelete, onClick }: Readonly<MealCardProps>) {
  return (
    <Card className="mb-2 bg-gray-900 border border-transparent hover:border-teal-600 transition-all">
      <CardContent className="flex flex-col justify-center items-start gap-4">
        <div className="w-full flex justify-between gap-2">
          <button
            type="button"
            onClick={onClick}
            className="flex flex-1 min-w-0 gap-4 rounded-lg bg-transparent p-0 text-left outline-none transition-colors hover:opacity-90 focus-visible:ring-2 focus-visible:ring-teal-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          >
            <div className="flex items-center">
              <Utensils className="mt-1" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-gray-300 text-md font-semibold break-all">{foods}</p>
              <span className="text-md text-gray-500">{time}</span>
            </div>
          </button>
          <div className="flex items-center gap-1">
            <Button type="button" onClick={onEditing} aria-label={`Editar refeição ${name}`} className="p-2 bg-gray-900 hover:bg-teal-700">
              <Pencil size={18} />
            </Button>
            <Button type="button" onClick={onDelete} aria-label={`Excluir refeição ${name}`} className="p-2 bg-gray-900 hover:bg-red-700">
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card >
  )
}