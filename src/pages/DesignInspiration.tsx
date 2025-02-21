
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SearchBar } from "@/components/SearchBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2 } from "lucide-react";

// Temporary mock data until Pinterest API integration
const mockDesigns = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    description: "Elegant evening gown with lace details",
    bookmarked: false
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098",
    description: "Vintage-inspired wedding dress",
    bookmarked: false
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
    description: "Modern minimalist cocktail dress",
    bookmarked: false
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1501286353178-1ec881214838",
    description: "Bohemian summer dress",
    bookmarked: false
  },
];

const DesignInspiration = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [designs, setDesigns] = useState(mockDesigns);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // In the future, this would make an API call to Pinterest or our design database
    console.log("Searching for:", term);
  };

  const toggleBookmark = (id: string) => {
    setDesigns(designs.map(design => 
      design.id === id 
        ? { ...design, bookmarked: !design.bookmarked }
        : design
    ));
    
    toast({
      title: "Design saved",
      description: "The design has been added to your bookmarks.",
    });
  };

  const shareWithSeamstress = (design: typeof designs[0]) => {
    // This would integrate with the messaging system
    toast({
      title: "Design shared",
      description: "The design has been shared with your seamstress.",
    });
  };

  return (
    <div className="min-h-screen bg-[#EBE2D3] p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Design Inspiration</h1>
          <p className="text-gray-600">Find and save designs to share with your seamstress</p>
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((design) => (
            <Card key={design.id} className="overflow-hidden group">
              <CardContent className="p-0 relative">
                <img 
                  src={design.imageUrl} 
                  alt={design.description}
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="mb-4">{design.description}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleBookmark(design.id)}
                        className="flex-1"
                      >
                        <Bookmark 
                          className={design.bookmarked ? "fill-current" : ""} 
                          size={16} 
                        />
                        {design.bookmarked ? "Saved" : "Save"}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => shareWithSeamstress(design)}
                        className="flex-1"
                      >
                        <Share2 size={16} />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignInspiration;
