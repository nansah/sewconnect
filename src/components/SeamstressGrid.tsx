
import { FilterSection } from "./FilterSection";
import { SeamstressCard } from "./SeamstressCard";

interface Seamstress {
  id: string;
  name: string;
  image: string;
  specialty: string;
  rating: number;
  price: string;
  location: string;
  yearsOfExperience?: number;
  activeOrders?: number;
}

interface SeamstressGridProps {
  seamstresses: Seamstress[];
  onFilterChange: (filters: {
    priceRange: string;
    specialty: string;
    location: string;
  }) => void;
  allSeamstresses: Seamstress[];
}

export const SeamstressGrid = ({ seamstresses, onFilterChange, allSeamstresses }: SeamstressGridProps) => {
  return (
    <main className="container mx-auto px-4 -mt-6 relative z-20">
      <div className="max-w-6xl mx-auto space-y-8 bg-white rounded-lg shadow-lg p-8">
        <FilterSection onFilterChange={onFilterChange} seamstresses={allSeamstresses} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seamstresses.map((seamstress) => (
            <SeamstressCard key={seamstress.id} {...seamstress} />
          ))}
        </div>
      </div>
    </main>
  );
};
