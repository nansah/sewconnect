
import { SearchBar } from "../components/SearchBar";
import { SeamstressCard } from "../components/SeamstressCard";
import { FilterSection } from "../components/FilterSection";
import { Header } from "../components/Header";

const SEAMSTRESSES = [
  {
    name: "Amara Okafor",
    image: "https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Traditional African Attire & Wedding Dresses",
    rating: 4.9,
    price: "$120/hr",
    location: "New York, NY"
  },
  {
    name: "Zainab Mensah",
    image: "https://images.pexels.com/photos/2739792/pexels-photo-2739792.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Evening Gowns & Traditional Wear",
    rating: 4.8,
    price: "$95/hr",
    location: "Los Angeles, CA"
  },
  {
    name: "Chioma Adebayo",
    image: "https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Contemporary African Fashion",
    rating: 4.7,
    price: "$85/hr",
    location: "Chicago, IL"
  },
  {
    name: "Sofia Rodriguez",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Wedding Dresses",
    rating: 4.9,
    price: "$150/hr",
    location: "Miami, FL"
  },
  {
    name: "Aisha Mohammed",
    image: "https://images.pexels.com/photos/1848471/pexels-photo-1848471.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Traditional Wear",
    rating: 4.6,
    price: "$90/hr",
    location: "Houston, TX"
  },
  {
    name: "Linda Chen",
    image: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Evening Gowns",
    rating: 4.8,
    price: "$110/hr",
    location: "San Francisco, CA"
  },
  {
    name: "Maria Santos",
    image: "https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Casual Wear",
    rating: 4.5,
    price: "$75/hr",
    location: "Boston, MA"
  },
  {
    name: "Sarah Johnson",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Bridal Wear",
    rating: 4.9,
    price: "$140/hr",
    location: "Seattle, WA"
  },
  {
    name: "Fatima Al-Hassan",
    image: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Traditional Middle Eastern Wear",
    rating: 4.7,
    price: "$95/hr",
    location: "Detroit, MI"
  },
  {
    name: "Priya Patel",
    image: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Indo-Western Fusion",
    rating: 4.8,
    price: "$100/hr",
    location: "Atlanta, GA"
  },
  {
    name: "Emma Wilson",
    image: "https://images.pexels.com/photos/1181527/pexels-photo-1181527.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Modern Fashion",
    rating: 4.6,
    price: "$85/hr",
    location: "Portland, OR"
  },
  {
    name: "Grace Kim",
    image: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Contemporary Fashion",
    rating: 4.7,
    price: "$95/hr",
    location: "Las Vegas, NV"
  },
  {
    name: "Isabella Martinez",
    image: "https://images.pexels.com/photos/1181547/pexels-photo-1181547.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Evening Wear",
    rating: 4.8,
    price: "$110/hr",
    location: "San Diego, CA"
  },
  {
    name: "Nina Williams",
    image: "https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Casual Wear",
    rating: 4.5,
    price: "$80/hr",
    location: "Denver, CO"
  },
  {
    name: "Jasmine Lee",
    image: "https://images.pexels.com/photos/1181576/pexels-photo-1181576.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Wedding Dresses",
    rating: 4.9,
    price: "$130/hr",
    location: "Phoenix, AZ"
  },
  {
    name: "Maya Singh",
    image: "https://images.pexels.com/photos/1181588/pexels-photo-1181588.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Traditional Indian Wear",
    rating: 4.8,
    price: "$100/hr",
    location: "Austin, TX"
  },
  {
    name: "Olivia Brown",
    image: "https://images.pexels.com/photos/1181599/pexels-photo-1181599.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Modern Fashion",
    rating: 4.6,
    price: "$90/hr",
    location: "Nashville, TN"
  },
  {
    name: "Sophia Garcia",
    image: "https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Evening Gowns",
    rating: 4.7,
    price: "$105/hr",
    location: "Philadelphia, PA"
  },
  {
    name: "Ava Thompson",
    image: "https://images.pexels.com/photos/1181615/pexels-photo-1181615.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Bridal Wear",
    rating: 4.9,
    price: "$135/hr",
    location: "Minneapolis, MN"
  },
  {
    name: "Lily Chen",
    image: "https://images.pexels.com/photos/1181623/pexels-photo-1181623.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "Contemporary Asian Fashion",
    rating: 4.8,
    price: "$115/hr",
    location: "San Jose, CA"
  },
  {
    name: "Elena Popov",
    image: "https://images.pexels.com/photos/1181634/pexels-photo-1181634.jpeg?auto=compress&cs=tinysrgb&w=800",
    specialty: "European Fashion",
    rating: 4.7,
    price: "$100/hr",
    location: "Sacramento, CA"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-32 px-4 before:absolute before:inset-0 before:bg-black/40"
        style={{ 
          backgroundImage: 'url("https://images.pexels.com/photos/4620843/pexels-photo-4620843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up text-white">
            Find Your Perfect Seamstress
          </h1>
          <p className="text-lg md:text-xl mb-12 text-white/90 animate-fade-up max-w-2xl mx-auto">
            Connect with talented seamstresses specializing in African and contemporary fashion
          </p>
          <div className="flex justify-center animate-fade-up">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-accent">Filter Seamstresses</h2>
          <FilterSection />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SEAMSTRESSES.map((seamstress) => (
            <SeamstressCard key={seamstress.name} {...seamstress} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
