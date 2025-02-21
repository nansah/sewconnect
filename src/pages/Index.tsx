
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { FilterSection } from "@/components/FilterSection";
import { SeamstressCard } from "@/components/SeamstressCard";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const Index = () => {
  // Demo seamstresses data with proper IDs for database operations
  const demoSeamstresses = [
    {
      id: "demo-seamstress-123",
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      specialty: "Traditional African Attire",
      rating: 4.8,
      price: "$80/hr",
      location: "Lagos, Nigeria"
    },
    {
      id: "demo-seamstress-124",
      name: "Maria Garcia",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      specialty: "Wedding Dresses",
      rating: 4.9,
      price: "$95/hr",
      location: "Madrid, Spain"
    },
    {
      id: "demo-seamstress-125",
      name: "Yuki Tanaka",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      specialty: "Modern Fashion",
      rating: 4.7,
      price: "$75/hr",
      location: "Tokyo, Japan"
    },
    {
      id: "demo-seamstress-126",
      name: "Emma Wilson",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      specialty: "Vintage Clothing",
      rating: 4.6,
      price: "$85/hr",
      location: "London, UK"
    }
  ];

  const [filteredSeamstresses, setFilteredSeamstresses] = useState(demoSeamstresses);

  const handleFilterChange = (filters: {
    priceRange: string;
    specialty: string;
    location: string;
    dateRange: DateRange | undefined;
  }) => {
    let filtered = [...demoSeamstresses];

    if (filters.priceRange) {
      filtered = filtered.filter(seamstress => {
        const price = parseInt(seamstress.price.replace(/\D/g, ""));
        const [min, max] = filters.priceRange.split("-").map(Number);
        if (filters.priceRange === "101+") {
          return price > 100;
        }
        return price >= min && price <= max;
      });
    }

    if (filters.specialty) {
      filtered = filtered.filter(seamstress =>
        seamstress.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(seamstress =>
        seamstress.location.includes(filters.location)
      );
    }

    setFilteredSeamstresses(filtered);
  };

  return (
    <div className="min-h-screen bg-[#EBE2D3]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            Find Your Perfect Seamstress
          </h1>
          <SearchBar />
          <FilterSection onFilterChange={handleFilterChange} seamstresses={demoSeamstresses} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSeamstresses.map((seamstress) => (
              <SeamstressCard key={seamstress.id} {...seamstress} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
