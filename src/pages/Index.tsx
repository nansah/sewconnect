
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
      name: "Amara Okafor",
      image: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=400&h=400&fit=crop",
      specialty: "Traditional Nigerian Attire",
      rating: 4.9,
      price: "$85/hr",
      location: "Lagos, Nigeria"
    },
    {
      id: "demo-seamstress-124",
      name: "Zainab Ahmed",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop",
      specialty: "Modern African Fusion",
      rating: 4.8,
      price: "$90/hr",
      location: "Accra, Ghana"
    },
    {
      id: "demo-seamstress-125",
      name: "Aisha Diallo",
      image: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=400&h=400&fit=crop",
      specialty: "Traditional Wedding Attire",
      rating: 4.9,
      price: "$95/hr",
      location: "Dakar, Senegal"
    },
    {
      id: "demo-seamstress-126",
      name: "Grace Mbeki",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
      specialty: "Contemporary African Fashion",
      rating: 4.7,
      price: "$80/hr",
      location: "Nairobi, Kenya"
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
      <div 
        className="relative h-[600px] bg-cover bg-center before:absolute before:inset-0 before:bg-black/30"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1524069615294-e7f6267d12f3?auto=format&fit=crop&w=2000&q=80')`
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4">
          <h1 className="text-5xl font-bold text-center mb-6 max-w-3xl animate-fade-up">
            Connect with Expert African Seamstresses
          </h1>
          <p className="text-xl text-center mb-8 max-w-2xl animate-fade-up opacity-90">
            Discover talented seamstresses who bring your fashion dreams to life with authentic African craftsmanship
          </p>
          <div className="w-full max-w-2xl animate-fade-up">
            <SearchBar />
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 -mt-6 relative z-20">
        <div className="max-w-4xl mx-auto space-y-8 bg-white rounded-lg shadow-lg p-8">
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
