
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FabricCard } from "./FabricCard";

const fabricTypes = [
  "All",
  "Ankara",
  "Lace",
  "Adire",
  "Kente",
  "Cotton",
  "Silk",
  "Aso Oke"
];

const fabrics = [
  {
    id: "1",
    name: "Premium Ankara Print",
    type: "Ankara",
    image: "https://images.unsplash.com/photo-1617883861744-13b534e3b928?w=800&auto=format&fit=crop",
    description: "High-quality 100% cotton wax print fabric with vibrant traditional patterns",
    price: "$25/yard"
  },
  {
    id: "2",
    name: "Handwoven Kente",
    type: "Kente",
    image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=800&auto=format&fit=crop",
    description: "Traditional Ghanaian Kente cloth with intricate geometric patterns",
    price: "$45/yard"
  },
  {
    id: "3",
    name: "Luxury French Lace",
    type: "Lace",
    image: "https://images.unsplash.com/photo-1595511890410-3b8dc82b2f9e?w=800&auto=format&fit=crop",
    description: "High-end French lace fabric perfect for special occasions",
    price: "$35/yard"
  },
  {
    id: "4",
    name: "Traditional Adire",
    type: "Adire",
    image: "https://images.unsplash.com/photo-1586996292898-71f4036c4e07?w=800&auto=format&fit=crop",
    description: "Hand-dyed Nigerian Adire fabric with unique indigo patterns",
    price: "$30/yard"
  },
  {
    id: "5",
    name: "Premium Aso Oke",
    type: "Aso Oke",
    image: "https://images.unsplash.com/photo-1589363360147-4f2d51541551?w=800&auto=format&fit=crop",
    description: "Traditional Nigerian hand-woven fabric for special occasions",
    price: "$40/yard"
  },
  {
    id: "6",
    name: "African Print Cotton",
    type: "Cotton",
    image: "https://images.unsplash.com/photo-1586996574277-cfd06e879d4c?w=800&auto=format&fit=crop",
    description: "Lightweight cotton fabric with modern African prints",
    price: "$20/yard"
  }
];

export const FabricSelection = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFabric, setSelectedFabric] = useState<string | null>(null);

  const filteredFabrics = fabrics.filter(fabric => {
    const matchesType = selectedType === "All" || fabric.type === selectedType;
    const matchesSearch = fabric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fabric.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Select Your Fabric</h2>
        <p className="text-gray-600">
          Choose from our collection of high-quality African fabrics
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search fabrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <ScrollArea className="w-full sm:w-auto">
          <div className="flex gap-2">
            {fabricTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                className="whitespace-nowrap"
              >
                {type}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFabrics.map((fabric) => (
          <FabricCard
            key={fabric.id}
            {...fabric}
            selected={selectedFabric === fabric.id}
            onClick={() => setSelectedFabric(fabric.id)}
          />
        ))}
      </div>

      {filteredFabrics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No fabrics found matching your criteria</p>
        </div>
      )}
    </div>
  );
};
