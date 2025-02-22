
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
  const [searchTerm, setSearchTerm] = useState("");

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

    // Apply search term filter first
    if (searchTerm) {
      filtered = filtered.filter((seamstress) =>
        seamstress.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seamstress.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seamstress.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Then apply other filters
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

    if (filters.specialty) {
      filtered = filtered.filter((seamstress) =>
        seamstress.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter((seamstress) =>
        seamstress.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredSeamstresses(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    let filtered = [...seamstresses];
    
    if (term) {
      filtered = filtered.filter((seamstress) =>
        seamstress.location.toLowerCase().includes(term.toLowerCase()) ||
        seamstress.specialty.toLowerCase().includes(term.toLowerCase()) ||
        seamstress.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    setFilteredSeamstresses(filtered);
  };

  return {
    seamstresses,
    filteredSeamstresses,
    loading,
    handleFilterChange,
    handleSearch
  };
};
