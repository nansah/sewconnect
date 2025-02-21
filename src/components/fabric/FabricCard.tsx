
import { cn } from "@/lib/utils";

interface FabricCardProps {
  id: string;
  name: string;
  image: string;
  type: string;
  description: string;
  price: string;
  selected?: boolean;
  onClick?: () => void;
}

export const FabricCard = ({
  name,
  image,
  type,
  description,
  price,
  selected = false,
  onClick
}: FabricCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-lg border-2 p-4 transition-all duration-300",
        selected 
          ? "border-primary bg-primary/5" 
          : "border-transparent bg-white hover:border-primary/30"
      )}
    >
      <div className="aspect-square overflow-hidden rounded-md">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{type}</p>
          </div>
          <p className="text-sm font-medium text-primary">{price}</p>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};
