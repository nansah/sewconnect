
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
      className="group bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-100"
      onClick={handleClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="p-5 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{name}</h3>
          <div className="flex items-center gap-1">
            <Star className="fill-[#FFB800] stroke-[#FFB800]" size={16} />
            <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">{specialty}</p>
        <p className="text-sm text-gray-500">{location}</p>
        <p className="text-accent font-semibold pt-2 border-t border-gray-100">
          Starting at <span className="text-lg">{price}</span>
        </p>
      </div>
    </div>
  );
};
