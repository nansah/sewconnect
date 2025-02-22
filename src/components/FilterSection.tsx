import { useState } from "react";

interface Seamstress {
  name: string;
  specialty: string;
  location: string;
  price: string;
}

interface FilterSectionProps {
  onFilterChange: (filters: {
    priceRange: string;
    specialty: string;
    location: string;
  }) => void;
  seamstresses: Seamstress[];
}

export const FilterSection = ({ onFilterChange, seamstresses }: FilterSectionProps) => {
  const [priceRange, setPriceRange] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");

  // Get available options based on current filters
  const getFilteredOptions = () => {
    let filteredSeamstresses = [...seamstresses];

    // Apply existing filters
    if (location) {
      filteredSeamstresses = filteredSeamstresses.filter(
        (s) => s.location.includes(location)
      );
    }

    if (specialty) {
      filteredSeamstresses = filteredSeamstresses.filter(
        (s) => s.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    }

    if (priceRange) {
      filteredSeamstresses = filteredSeamstresses.filter((seamstress) => {
        const price = parseInt(seamstress.price.replace(/\D/g, ""));
        const [min, max] = priceRange.split("-").map(Number);
        if (priceRange === "101+") {
          return price > 100;
        }
        return price >= min && price <= max;
      });
    }

    // Get unique locations and specialties from filtered results
    const availableLocations = Array.from(
      new Set(seamstresses.map((s) => s.location))
    ).sort();

    const availableSpecialties = Array.from(
      new Set(filteredSeamstresses.map((s) => s.specialty))
    ).sort();

    return {
      locations: availableLocations,
      specialties: availableSpecialties,
    };
  };

  const { locations, specialties } = getFilteredOptions();

  const handleFilterChange = (
    type: "priceRange" | "specialty" | "location",
    value: string
  ) => {
    let newFilters;
    switch (type) {
      case "priceRange":
        setPriceRange(value);
        newFilters = { priceRange: value, specialty, location };
        break;
      case "specialty":
        setSpecialty(value);
        newFilters = { priceRange, specialty: value, location };
        break;
      case "location":
        setLocation(value);
        const locationSeamstresses = seamstresses.filter(s => s.location.includes(value));
        const hasSpecialty = locationSeamstresses.some(s => 
          s.specialty.toLowerCase().includes(specialty.toLowerCase())
        );
        if (!hasSpecialty) {
          setSpecialty("");
          newFilters = { priceRange, specialty: "", location: value };
        } else {
          newFilters = { priceRange, specialty, location: value };
        }
        break;
    }
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <select
          className="px-4 py-2 rounded-md border-2 border-primary/30 focus:outline-none focus:border-primary bg-secondary/10 w-full shadow-sm hover:border-primary/50 transition-colors"
          value={priceRange}
          onChange={(e) => handleFilterChange("priceRange", e.target.value)}
        >
          <option value="">Price Range</option>
          <option value="0-50">$0 - $50</option>
          <option value="51-100">$51 - $100</option>
          <option value="101+">$101+</option>
        </select>
        
        <select
          className="px-4 py-2 rounded-md border-2 border-primary/30 focus:outline-none focus:border-primary bg-secondary/10 w-full shadow-sm hover:border-primary/50 transition-colors"
          value={specialty}
          onChange={(e) => handleFilterChange("specialty", e.target.value)}
        >
          <option value="">Specialty</option>
          {specialties.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        
        <select
          className="px-4 py-2 rounded-md border-2 border-primary/30 focus:outline-none focus:border-primary bg-secondary/10 w-full shadow-sm hover:border-primary/50 transition-colors"
          value={location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        >
          <option value="">Location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
