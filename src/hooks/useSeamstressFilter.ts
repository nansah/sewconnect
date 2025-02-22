
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Seamstress {
  id: string;
  name: string;
  image: string;
  specialty: string;
  rating: number;
  price: string;
  location: string;
  yearsOfExperience?: number;
  activeOrders?: number;
}

export const useSeamstressFilter = (initialSeamstresses: Seamstress[] = []) => {
  const [seamstresses, setSeamstresses] = useState<Seamstress[]>(initialSeamstresses);
  const [filteredSeamstresses, setFilteredSeamstresses] = useState<Seamstress[]>(initialSeamstresses);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialSeamstresses.length > 0) {
      setSeamstresses(initialSeamstresses);
      setFilteredSeamstresses(initialSeamstresses);
      setLoading(false);
    } else {
      fetchSeamstresses();
    }
  }, [initialSeamstresses]);

  const fetchSeamstresses = async () => {
    try {
      const { data: seamstressData, error: seamstressError } = await supabase
        .from('seamstress_profiles')
        .select('*');

      if (seamstressError) throw seamstressError;

      const { data: ordersData, error: ordersError } = await supabase
        .from('seamstress_active_orders')
        .select('*');

      if (ordersError) throw ordersError;

      const combinedData: Seamstress[] = seamstressData.map(seamstress => ({
        id: seamstress.id,
        name: seamstress.name,
        image: seamstress.image_url || 'https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=400&h=400&fit=crop',
        specialty: seamstress.specialty,
        rating: seamstress.rating,
        price: seamstress.price,
        location: seamstress.location,
        yearsOfExperience: seamstress.years_of_experience || 1,
        activeOrders: ordersData?.find(order => order.seamstress_id === seamstress.id)?.active_orders || 0
      }));

      setSeamstresses(combinedData);
      setFilteredSeamstresses(combinedData);
    } catch (error) {
      console.error('Error fetching seamstresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: {
    priceRange: string;
    specialty: string;
    location: string;
  }) => {
    let filtered = [...seamstresses];

    // If there's a specialty search term, search across multiple fields
    if (filters.specialty) {
      const searchTerm = filters.specialty.toLowerCase();
      filtered = filtered.filter((seamstress) => 
        seamstress.location.toLowerCase().includes(searchTerm) ||
        seamstress.specialty.toLowerCase().includes(searchTerm) ||
        seamstress.name.toLowerCase().includes(searchTerm)
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter((seamstress) => {
        const price = parseInt(seamstress.price.replace(/\D/g, ""));
        const [min, max] = filters.priceRange.split("-").map(Number);
        if (filters.priceRange === "101+") {
          return price > 100;
        }
        return price >= min && price <= max;
      });
    }

    // Apply location filter if it's different from the search term
    if (filters.location && (!filters.specialty || !filters.specialty.toLowerCase().includes(filters.location.toLowerCase()))) {
      filtered = filtered.filter((seamstress) =>
        seamstress.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredSeamstresses(filtered);
  };

  return {
    seamstresses,
    filteredSeamstresses,
    loading,
    handleFilterChange,
  };
};
