
import { SearchBar } from "./SearchBar";

interface HeroSectionProps {
  onSearch: (term: string) => void;
}

export const HeroSection = ({ onSearch }: HeroSectionProps) => {
  return (
    <div className="relative h-[600px] overflow-hidden">
      <img 
        src="https://images.pexels.com/photos/6192554/pexels-photo-6192554.jpeg"
        alt="African Fashion"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4">
        <h1 className="text-5xl font-bold text-center mb-6 max-w-3xl animate-fade-up">
          Connect with Expert African Seamstresses
        </h1>
        <p className="text-xl text-center mb-8 max-w-2xl animate-fade-up opacity-90">
          Discover talented seamstresses who bring your fashion dreams to life with authentic African craftsmanship
        </p>
        <div className="w-full max-w-2xl animate-fade-up">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
};
