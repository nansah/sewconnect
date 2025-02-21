
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
      className="seamstress-card bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <img src={image} alt={name} className="w-full h-64 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-2">{specialty}</p>
        <div className="flex items-center gap-2 mb-2">
          <Star className="fill-yellow-400 stroke-yellow-400" size={16} />
          <span>{rating.toFixed(1)}</span>
        </div>
        <p className="text-gray-600">{location}</p>
        <p className="text-accent font-semibold mt-2">Starting at {price}</p>
      </div>
    </div>
  );
};
