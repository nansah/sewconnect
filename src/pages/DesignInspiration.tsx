
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SearchBar } from "@/components/SearchBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Design {
  id: string;
  imageUrl: string;
  description: string;
  bookmarked: boolean;
}

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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [designs, setDesigns] = useState<Design[]>(mockDesigns);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarkedDesigns();
  }, []);

  const loadBookmarkedDesigns = async () => {
    try {
      const { data: bookmarks, error } = await supabase
        .from('bookmarked_designs')
        .select('image_url');

      if (error) throw error;

      // Update designs with bookmark status
      setDesigns(designs.map(design => ({
        ...design,
        bookmarked: bookmarks?.some(bookmark => bookmark.image_url === design.imageUrl) || false
      })));
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load bookmarked designs.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // In the future, this would make an API call to Pinterest or our design database
    console.log("Searching for:", term);
  };

  const toggleBookmark = async (design: Design) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication required",
          description: "Please log in to bookmark designs.",
        });
        return;
      }

      if (design.bookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarked_designs')
          .delete()
          .eq('image_url', design.imageUrl)
          .eq('user_id', session.session.user.id);

        if (error) throw error;
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarked_designs')
          .insert({
            user_id: session.session.user.id,
            image_url: design.imageUrl,
            description: design.description
          });

        if (error) throw error;
      }

      // Update local state
      setDesigns(designs.map(d => 
        d.id === design.id ? { ...d, bookmarked: !d.bookmarked } : d
      ));

      toast({
        title: design.bookmarked ? "Design removed" : "Design saved",
        description: design.bookmarked 
          ? "The design has been removed from your bookmarks."
          : "The design has been added to your bookmarks.",
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update bookmark.",
      });
    }
  };

  const shareWithSeamstress = (design: Design) => {
    // Navigate to messaging portal with the design data
    navigate('/messaging', { 
      state: { 
        seamstress: {
          id: "demo-seamstress",
          name: "Sarah Johnson",
          image: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=400&h=400&fit=crop"
        },
        designToShare: {
          imageUrl: design.imageUrl,
          description: design.description
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBE2D3] p-6 flex items-center justify-center">
        <p>Loading designs...</p>
      </div>
    );
  }

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
                        onClick={() => toggleBookmark(design)}
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
