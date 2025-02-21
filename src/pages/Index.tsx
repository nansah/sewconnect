
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { FilterSection } from "@/components/FilterSection";
import { SeamstressCard } from "@/components/SeamstressCard";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const Index = () => {
  const demoSeamstresses = [
    {
      id: "demo-seamstress-123",
      name: "Amara Okafor",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
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
      image: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400&h=400&fit=crop",
      specialty: "Traditional Wedding Attire",
      rating: 4.9,
      price: "$95/hr",
      location: "Dakar, Senegal"
    },
    {
      id: "demo-seamstress-126",
      name: "Grace Mbeki",
      image: "https://images.unsplash.com/photo-1519938755566-f59da6f8343d?w=400&h=400&fit=crop",
      specialty: "Contemporary African Fashion",
      rating: 4.7,
      price: "$80/hr",
      location: "Nairobi, Kenya"
    },
    {
      id: "demo-seamstress-127",
      name: "Chioma Adebayo",
      image: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=400&h=400&fit=crop",
      specialty: "Ankara Print Design",
      rating: 4.9,
      price: "$88/hr",
      location: "Abuja, Nigeria"
    },
    {
      id: "demo-seamstress-128",
      name: "Fatima Omar",
      image: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=400&h=400&fit=crop",
      specialty: "East African Traditional Wear",
      rating: 4.8,
      price: "$92/hr",
      location: "Addis Ababa, Ethiopia"
    },
    {
      id: "demo-seamstress-129",
      name: "Nadia Mensah",
      image: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=400&h=400&fit=crop",
      specialty: "Kente Cloth Designs",
      rating: 4.7,
      price: "$87/hr",
      location: "Kumasi, Ghana"
    },
    {
      id: "demo-seamstress-130",
      name: "Esther Moyo",
      image: "https://images.unsplash.com/photo-1539701938214-0d9736e1c16c?w=400&h=400&fit=crop",
      specialty: "Southern African Fashion",
      rating: 4.8,
      price: "$83/hr",
      location: "Harare, Zimbabwe"
    },
    {
      id: "demo-seamstress-131",
      name: "Aminata Sow",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      specialty: "West African Formal Wear",
      rating: 4.9,
      price: "$94/hr",
      location: "Bamako, Mali"
    },
    {
      id: "demo-seamstress-132",
      name: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1611432579699-484f7990b127?w=400&h=400&fit=crop",
      specialty: "Modern Fusion & Alterations",
      rating: 4.8,
      price: "$95/hr",
      location: "New York, USA"
    },
    {
      id: "demo-seamstress-133",
      name: "Isabella Martinez",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop",
      specialty: "Haute Couture & Evening Wear",
      rating: 4.9,
      price: "$98/hr",
      location: "Los Angeles, USA"
    },
    {
      id: "demo-seamstress-134",
      name: "Maya Johnson",
      image: "https://images.unsplash.com/photo-1500840216050-6ffa99d75160?w=400&h=400&fit=crop",
      specialty: "Professional Attire & Tailoring",
      rating: 4.8,
      price: "$92/hr",
      location: "Washington DC, USA"
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
      <div className="relative h-[600px] overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/6192554/pexels-photo-6192554.jpeg"
          alt="African Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
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
        <div className="max-w-6xl mx-auto space-y-8 bg-white rounded-lg shadow-lg p-8">
          <FilterSection onFilterChange={handleFilterChange} seamstresses={demoSeamstresses} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
