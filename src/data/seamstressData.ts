
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
