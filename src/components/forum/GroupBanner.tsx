
import { Users } from "lucide-react";

interface GroupBannerProps {
  name: string;
  members: number;
  bannerImage: string;
}

export const GroupBanner = ({ name, members, bannerImage }: GroupBannerProps) => {
  return (
    <div className="relative h-[400px] w-full">
      <img 
        src={bannerImage} 
        alt="Group Banner" 
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error("Image failed to load:", bannerImage);
          // Fallback to a default African fashion image if the upload fails
          e.currentTarget.src = "https://images.pexels.com/photos/2968231/pexels-photo-2968231.jpeg";
        }}
        onLoad={() => {
          console.log("Image loaded successfully:", bannerImage);
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute bottom-6 left-6 text-white">
        <h1 className="text-4xl font-bold mb-2">{name}</h1>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <span>{members.toLocaleString()} members</span>
        </div>
      </div>
    </div>
  );
};
