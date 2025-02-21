
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { FilterSection } from "@/components/FilterSection";
import { SeamstressCard } from "@/components/SeamstressCard";

const Index = () => {
  // Demo seamstress data with a proper ID for database operations
  const demoSeamstress = {
    id: "demo-seamstress-123",
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    specialty: "Traditional African Attire",
    rating: 4.8,
    price: "$80/hr",
    location: "Lagos, Nigeria"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SeamstressCard {...demoSeamstress} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
