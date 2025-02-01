import { Star } from "lucide-react";

interface SeamstressCardProps {
  name: string;
  image: string;
  specialty: string;
  rating: number;
  price: string;
  location: string;
}

export const SeamstressCard = ({ name, image, specialty, rating, price, location }: SeamstressCardProps) => {
  return (
    <div className="seamstress-card bg-white rounded-lg overflow-hidden">
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
        <button className="w-full mt-4 bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition-colors">
          Book Appointment
        </button>
      </div>
    </div>
  );
};