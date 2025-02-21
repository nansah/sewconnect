
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LocationState {
  seamstress: {
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
      state: { seamstress: { name: seamstress.name, image: seamstress.image } }
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
    <div className="min-h-screen bg-secondary p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Hero Section */}
        <div className="relative h-64 md:h-96">
          <img
            src={seamstress.image}
            alt={seamstress.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">{seamstress.name}</h1>
            <p className="text-white/90">{seamstress.location}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-lg font-semibold text-accent">{seamstress.specialty}</p>
              <p className="text-primary font-bold">{seamstress.price}</p>
            </div>
            <Button onClick={handleMessageClick} className="flex gap-2">
              <MessageCircle className="w-4 h-4" />
              Message
            </Button>
          </div>

          <Tabs defaultValue="about" className="w-full">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="specialties">Specialties</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-4">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">About Me</h3>
                <p className="text-gray-600">
                  With over 10 years of experience in creating beautiful, custom-made garments, 
                  I specialize in bringing your vision to life. My passion lies in combining traditional 
                  techniques with modern styles to create unique pieces that perfectly fit your body and personality.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specialties" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">My Specialties</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-center gap-2 bg-secondary rounded-lg p-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">Traditional African Attire</h4>
                      <p className="text-sm text-gray-600">Expert in various regional styles and modern fusion designs</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-2 bg-secondary rounded-lg p-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">Wedding Dresses</h4>
                      <p className="text-sm text-gray-600">Custom bridal wear with attention to detail</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-2 bg-secondary rounded-lg p-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">Evening Gowns</h4>
                      <p className="text-sm text-gray-600">Elegant and sophisticated formal wear</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-2 bg-secondary rounded-lg p-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">Alterations</h4>
                      <p className="text-sm text-gray-600">Professional garment modifications and repairs</p>
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-4">
              <h3 className="text-xl font-semibold mb-4">Previous Work</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Previous work ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SeamstressProfile;
