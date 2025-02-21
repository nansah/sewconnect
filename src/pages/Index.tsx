
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Star, MapPin } from "lucide-react";

interface Seamstress {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  location: string;
  priceRange: string;
  imageUrl: string;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for seamstress profiles
  const seamstresses: Seamstress[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      specialty: "Wedding Dresses & Formal Wear",
      rating: 4.9,
      location: "New York, NY",
      priceRange: "$50-100/hr",
      imageUrl: "/placeholder.svg"
    },
    {
      id: "2",
      name: "Maria Garcia",
      specialty: "Alterations & Custom Design",
      rating: 4.8,
      location: "Los Angeles, CA",
      priceRange: "$40-80/hr",
      imageUrl: "/placeholder.svg"
    },
    {
      id: "3",
      name: "Emily Chen",
      specialty: "Casual Wear & Repairs",
      rating: 4.7,
      location: "Chicago, IL",
      priceRange: "$35-70/hr",
      imageUrl: "/placeholder.svg"
    }
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Implement search functionality here
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section with Search */}
        <section className="relative h-[500px] bg-accent">
          <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent/90" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8">
              Find Your Perfect Seamstress
            </h1>
            <SearchBar onSearch={handleSearch} />
          </div>
        </section>

        {/* Seamstress Profiles Grid */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-8">Featured Seamstresses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seamstresses.map((seamstress) => (
              <Card key={seamstress.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={seamstress.imageUrl}
                    alt={seamstress.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{seamstress.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{seamstress.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{seamstress.specialty}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{seamstress.location}</span>
                  </div>
                  <p className="text-accent font-semibold mb-4">{seamstress.priceRange}</p>
                  <Button className="w-full">View Profile</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
