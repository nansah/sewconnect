
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// For now, we'll use static images for inspiration
// Later we can integrate with Pinterest API or another service
const inspirationImages = [
  {
    id: 1,
    url: "https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Evening Gown",
    category: "formal"
  },
  {
    id: 2,
    url: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Traditional Dress",
    category: "traditional"
  },
  {
    id: 3,
    url: "https://images.pexels.com/photos/1488507/pexels-photo-1488507.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Modern Suit",
    category: "business"
  },
  {
    id: 4,
    url: "https://images.pexels.com/photos/2850487/pexels-photo-2850487.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Wedding Dress",
    category: "bridal"
  }
];

const categories = ["All", "Formal", "Traditional", "Business", "Bridal", "Casual"];

const DesignInspiration = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredImages = inspirationImages.filter(img => {
    const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || img.category === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#EBE2D3] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Design Inspiration</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our collection of designs to find inspiration for your next custom piece
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-lg shadow-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search designs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <ScrollArea className="w-full sm:w-auto">
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div 
              key={image.id}
              className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white text-lg font-semibold">{image.title}</h3>
                <p className="text-white/80 text-sm capitalize">{image.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignInspiration;
