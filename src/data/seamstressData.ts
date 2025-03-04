
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Seamstress {
  id: string;
  name: string;
  image: string;
  specialty: string;
  rating: number;
  price: string;
  location: string;
  yearsOfExperience: number;
  activeOrders: number;
}

export const initialDemoSeamstresses: Seamstress[] = [
  {
    id: "demo-seamstress-123",
    name: "Amara Okafor",
    image: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=400&h=400&fit=crop",
    specialty: "Traditional Nigerian Attire",
    rating: 4.9,
    price: "$85/hr",
    location: "Lagos, Nigeria",
    yearsOfExperience: 8,
    activeOrders: 3
  },
  {
    id: "demo-seamstress-124",
    name: "Zainab Ahmed",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    specialty: "Modern African Fusion",
    rating: 4.8,
    price: "$90/hr",
    location: "Accra, Ghana",
    yearsOfExperience: 12,
    activeOrders: 5
  },
  {
    id: "demo-seamstress-125",
    name: "Aisha Diallo",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    specialty: "Traditional Wedding Attire",
    rating: 4.9,
    price: "$95/hr",
    location: "Dakar, Senegal",
    yearsOfExperience: 15,
    activeOrders: 2
  },
  {
    id: "demo-seamstress-126",
    name: "Grace Mbeki",
    image: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=400&h=400&fit=crop",
    specialty: "Contemporary African Fashion",
    rating: 4.7,
    price: "$80/hr",
    location: "Nairobi, Kenya",
    yearsOfExperience: 7,
    activeOrders: 4
  },
  // New seamstresses
  {
    id: "demo-seamstress-127",
    name: "Maya Thompson",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop",
    specialty: "Evening Wear",
    rating: 4.9,
    price: "$110/hr",
    location: "Los Angeles, USA",
    yearsOfExperience: 10,
    activeOrders: 4
  },
  {
    id: "demo-seamstress-128",
    name: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    specialty: "Bridal Alterations",
    rating: 5.0,
    price: "$125/hr",
    location: "New York City, USA",
    yearsOfExperience: 15,
    activeOrders: 6
  },
  {
    id: "demo-seamstress-129",
    name: "Adwoa Mensah",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop",
    specialty: "Traditional Kente Designs",
    rating: 4.8,
    price: "$75/hr",
    location: "Accra, Ghana",
    yearsOfExperience: 20,
    activeOrders: 3
  },
  {
    id: "demo-seamstress-130",
    name: "Isabella Martinez",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    specialty: "Costume Design",
    rating: 4.7,
    price: "$95/hr",
    location: "Los Angeles, USA",
    yearsOfExperience: 8,
    activeOrders: 2
  },
  {
    id: "demo-seamstress-131",
    name: "Patricia Washington",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    specialty: "Custom Suits",
    rating: 4.9,
    price: "$115/hr",
    location: "Washington, DC",
    yearsOfExperience: 12,
    activeOrders: 5
  },
  {
    id: "demo-seamstress-132",
    name: "Rachel Kim",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    specialty: "Vintage Restoration",
    rating: 4.8,
    price: "$105/hr",
    location: "New York City, USA",
    yearsOfExperience: 9,
    activeOrders: 3
  }
];

interface SeamstressStore {
  seamstresses: Seamstress[];
  updateSeamstress: (id: string, data: Partial<Seamstress>) => void;
}

export const useSeamstressStore = create<SeamstressStore>()(
  persist(
    (set) => ({
      seamstresses: initialDemoSeamstresses,
      updateSeamstress: (id, data) =>
        set((state) => ({
          seamstresses: state.seamstresses.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        })),
    }),
    {
      name: 'seamstress-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
