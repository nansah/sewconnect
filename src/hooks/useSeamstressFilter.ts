
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";

interface Seamstress {
  id: string;
  name: string;
  image: string;
  specialty: string;
  rating: number;
  price: string;
  location: string;
}

export const useSeamstressFilter = (initialSeamstresses: Seamstress[]) => {
  const [filteredSeamstresses, setFilteredSeamstresses] = useState(initialSeamstresses);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    priceRange: "",
    specialty: "",
    location: "",
    dateRange: undefined as DateRange | undefined,
  });

  const applyFilters = (search: string, filters: {
    priceRange: string;
    specialty: string;
    location: string;
    dateRange: DateRange | undefined;
  }) => {
    console.log("Applying filters with search:", search);
    let filtered = [...initialSeamstresses];

    if (search) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(seamstress =>
        seamstress.location.toLowerCase().includes(searchLower) ||
        seamstress.specialty.toLowerCase().includes(searchLower) ||
        seamstress.name.toLowerCase().includes(searchLower)
      );
      console.log("Search term (lowercase):", searchLower);
      console.log("Available locations:", initialSeamstresses.map(s => s.location));
      console.log("Filtered results:", filtered);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(seamstress => {
        const price = parseInt(seamstress.price.replace(/\D/g, ""));
        const [min, max] = filters.priceRange.split("-").map(Number);
        if (filters.priceRange === "101+") {
          return price > 100;
        }
        return price >= min && price <= max;
      });
    }

    if (filters.specialty) {
      filtered = filtered.filter(seamstress =>
        seamstress.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(seamstress =>
        seamstress.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredSeamstresses(filtered);
  };

  const handleSearch = (term: string) => {
    console.log("Search handler called with term:", term);
    setSearchTerm(term);
    applyFilters(term, activeFilters);
  };

  const handleFilterChange = (filters: {
    priceRange: string;
    specialty: string;
    location: string;
    dateRange: DateRange | undefined;
  }) => {
    setActiveFilters(filters);
    applyFilters(searchTerm, filters);
  };

  useEffect(() => {
    console.log("Current filtered seamstresses:", filteredSeamstresses);
  }, [filteredSeamstresses]);

  return {
    filteredSeamstresses,
    handleSearch,
    handleFilterChange
  };
};
