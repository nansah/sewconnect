
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SeamstressCardProps {
  name: string;
  image: string;
  specialty: string;
  rating: number;
  price: string;
  location: string;
}

export const SeamstressCard = ({ name, image, specialty, rating, price, location }: SeamstressCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/seamstress-profile", { 
      state: { 
        seamstress: { name, image, specialty, rating, price, location } 
      } 
    });
  };

  return (
    <div 
      className="seamstress-card bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-primary/10"
      onClick={handleClick}
    >
      <div className="relative">
        <img src={image} alt={name} className="w-full h-72 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-semibold text-accent">{name}</h3>
        <p className="text-accent/80">{specialty}</p>
        <div className="flex items-center gap-2">
          <Star className="fill-primary stroke-primary" size={18} />
          <span className="text-accent/90 font-medium">{rating.toFixed(1)}</span>
        </div>
        <p className="text-accent/80">{location}</p>
        <p className="text-primary font-semibold pt-2 border-t border-primary/10">
          Starting at {price}
        </p>
      </div>
    </div>
  );
};
