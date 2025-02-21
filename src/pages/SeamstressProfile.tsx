
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const SeamstressProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
                <h1 className="text-4xl font-bold text-white">{seamstress.name}</h1>
                <p className="text-white/90 text-lg">{seamstress.location}</p>
              </div>
              <Button onClick={handleMessageClick} size="lg" className="bg-primary hover:bg-primary/90">
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
              <TabsList className="w-full mb-6 bg-[#FDE1D3]">
                <TabsTrigger value="about" className="flex-1 data-[state=active]:bg-[#FEC6A1]">About</TabsTrigger>
                <TabsTrigger value="specialties" className="flex-1 data-[state=active]:bg-[#FEC6A1]">Specialties</TabsTrigger>
                <TabsTrigger value="gallery" className="flex-1 data-[state=active]:bg-[#FEC6A1]">Gallery</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-6 bg-white rounded-xl p-8 shadow-lg">
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold mb-4">About Me</h3>
                  <p className="text-gray-700 leading-relaxed">
                    With over 10 years of experience in creating beautiful, custom-made garments, 
                    I specialize in bringing your vision to life. My passion lies in combining traditional 
                    techniques with modern styles to create unique pieces that perfectly fit your body and personality.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="specialties" className="mt-6 bg-white rounded-xl p-8 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["Traditional African Attire", "Wedding Dresses", "Evening Gowns", "Alterations"].map((specialty, index) => (
                    <div key={index} className="bg-[#FDE1D3]/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                      <h4 className="font-semibold text-lg mb-2">{specialty}</h4>
                      <p className="text-gray-600 text-sm">
                        Expert craftsmanship and attention to detail in {specialty.toLowerCase()}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-6 bg-white rounded-xl p-8 shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="aspect-square rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Info */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Booking Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Starting Price</p>
                  <p className="text-2xl font-semibold text-primary">{seamstress.price}</p>
                </div>
                <div>
                  <p className="text-gray-600">Specialty</p>
                  <p className="text-lg">{seamstress.specialty}</p>
                </div>
                <div>
                  <p className="text-gray-600">Rating</p>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-semibold">{seamstress.rating.toFixed(1)}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={handleMessageClick}>
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
