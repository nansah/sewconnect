import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Review } from "@/types/messaging";

interface LocationState {
  seamstress: {
    id: string;
    name: string;
    image: string;
    specialty: string;
    rating: number;
    price: string;
    location: string;
  };
}

const DEMO_REVIEWS: Review[] = [
  {
    id: "1",
    customer_name: "Emily Watson",
    customer_id: "demo-customer-1",
    seamstress_id: "demo-seamstress-1",
    order_id: "demo-order-1",
    rating: 5,
    review_text: "Amazing work on my wedding dress alterations! Professional, timely, and exceeded my expectations.",
    created_at: "2024-02-15T10:00:00Z"
  },
  {
    id: "2",
    customer_name: "Sarah Chen",
    customer_id: "demo-customer-2",
    seamstress_id: "demo-seamstress-1",
    order_id: "demo-order-2",
    rating: 5,
    review_text: "Incredible attention to detail. Made my dream dress come true!",
    created_at: "2024-02-10T15:30:00Z"
  },
  {
    id: "3",
    customer_name: "Maria Garcia",
    customer_id: "demo-customer-3",
    seamstress_id: "demo-seamstress-1",
    order_id: "demo-order-3",
    rating: 4,
    review_text: "Very professional and skilled. Would definitely recommend!",
    created_at: "2024-02-05T09:15:00Z"
  }
];

const SeamstressProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>(DEMO_REVIEWS);
  const { seamstress } = (location.state as LocationState) || {
    seamstress: {
      id: "",
      name: "Seamstress",
      image: "",
      specialty: "",
      rating: 0,
      price: "",
      location: ""
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [seamstress.id]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('seamstress_reviews')
        .select('*')
        .eq('seamstress_id', seamstress.id);

      if (!error && data && data.length > 0) {
        setReviews(data as Review[]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleMessageClick = () => {
    navigate("/messaging", {
      state: { seamstress: { id: seamstress.id, name: seamstress.name, image: seamstress.image } }
    });
  };

  // Sample gallery images - in a real app, these would come from the database
  const galleryImages = [
    "https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1488507/pexels-photo-1488507.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2850487/pexels-photo-2850487.jpeg?auto=compress&cs=tinysrgb&w=800"
  ];

  return (
    <div className="min-h-screen bg-[#EBE2D3]">
      {/* Hero Section with Glassmorphism */}
      <div className="relative h-[500px]">
        <img
          src={seamstress.image}
          alt={seamstress.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white tracking-tight">{seamstress.name}</h1>
                <p className="text-white/90 text-lg font-medium">{seamstress.location}</p>
              </div>
              <Button 
                onClick={handleMessageClick} 
                size="lg" 
                className="bg-primary hover:bg-primary/90 transform transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full mb-8 bg-[#FDE1D3] rounded-xl p-1.5 shadow-md">
                <TabsTrigger 
                  value="about" 
                  className="flex-1 data-[state=active]:bg-[#FEC6A1] transition-all duration-300 rounded-lg"
                >
                  About
                </TabsTrigger>
                <TabsTrigger 
                  value="specialties" 
                  className="flex-1 data-[state=active]:bg-[#FEC6A1] transition-all duration-300 rounded-lg"
                >
                  Specialties
                </TabsTrigger>
                <TabsTrigger 
                  value="gallery" 
                  className="flex-1 data-[state=active]:bg-[#FEC6A1] transition-all duration-300 rounded-lg"
                >
                  Gallery
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="flex-1 data-[state=active]:bg-[#FEC6A1] transition-all duration-300 rounded-lg"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-6 bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold mb-4 text-accent">About Me</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    With over 10 years of experience in creating beautiful, custom-made garments, 
                    I specialize in bringing your vision to life. My passion lies in combining traditional 
                    techniques with modern styles to create unique pieces that perfectly fit your body and personality.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="specialties" className="mt-6 bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["Traditional African Attire", "Wedding Dresses", "Evening Gowns", "Alterations"].map((specialty, index) => (
                    <div 
                      key={index} 
                      className="bg-[#FDE1D3]/10 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#FDE1D3]/20"
                    >
                      <h4 className="font-semibold text-lg mb-2 text-accent">{specialty}</h4>
                      <p className="text-gray-600 text-sm">
                        Expert craftsmanship and attention to detail in {specialty.toLowerCase()}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-6 bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  {galleryImages.map((image, index) => (
                    <div 
                      key={index} 
                      className="aspect-square rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                    >
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg">{review.customer_name}</h3>
                            <div className="flex items-center text-yellow-500">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review.review_text}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-semibold mb-6 text-accent">Booking Information</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Starting Price</p>
                  <p className="text-2xl font-semibold text-primary">{seamstress.price}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Specialty</p>
                  <p className="text-lg font-medium">{seamstress.specialty}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Rating</p>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-semibold">{seamstress.rating.toFixed(1)}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 transform transition-all duration-300 hover:scale-105" 
                  size="lg" 
                  onClick={handleMessageClick}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeamstressProfile;
