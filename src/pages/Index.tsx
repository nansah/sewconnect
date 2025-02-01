import { SearchBar } from "../components/SearchBar";
import { SeamstressCard } from "../components/SeamstressCard";
import { FilterSection } from "../components/FilterSection";

const SEAMSTRESSES = [
  {
    name: "Amara Okafor",
    image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf",
    specialty: "Traditional African Attire & Wedding Dresses",
    rating: 4.9,
    price: "$120/hr",
    location: "New York, NY"
  },
  {
    name: "Zainab Mensah",
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c",
    specialty: "Evening Gowns & Traditional Wear",
    rating: 4.8,
    price: "$95/hr",
    location: "Los Angeles, CA"
  },
  {
    name: "Chioma Adebayo",
    image: "https://images.unsplash.com/photo-1595908129346-3c4923829c03",
    specialty: "Contemporary African Fashion",
    rating: 4.7,
    price: "$85/hr",
    location: "Chicago, IL"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <div className="bg-primary/10 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up">
            Find Your Perfect Seamstress
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600 animate-fade-up">
            Connect with talented seamstresses specializing in African and contemporary fashion
          </p>
          <div className="flex justify-center animate-fade-up">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Filter Seamstresses</h2>
          <FilterSection />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEAMSTRESSES.map((seamstress) => (
            <SeamstressCard key={seamstress.name} {...seamstress} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;