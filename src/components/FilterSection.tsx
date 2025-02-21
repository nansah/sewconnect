
import { Calendar } from "./ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

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
    dateRange: DateRange | undefined;
  }) => void;
  seamstresses: Seamstress[];
}

export const FilterSection = ({ onFilterChange, seamstresses }: FilterSectionProps) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [priceRange, setPriceRange] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

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
    type: "priceRange" | "specialty" | "location" | "dateRange",
    value: any
  ) => {
    let newFilters;
    switch (type) {
      case "priceRange":
        setPriceRange(value);
        newFilters = { priceRange: value, specialty, location, dateRange: date };
        break;
      case "specialty":
        setSpecialty(value);
        newFilters = { priceRange, specialty: value, location, dateRange: date };
        break;
      case "location":
        setLocation(value);
        const locationSeamstresses = seamstresses.filter(s => s.location.includes(value));
        const hasSpecialty = locationSeamstresses.some(s => 
          s.specialty.toLowerCase().includes(specialty.toLowerCase())
        );
        if (!hasSpecialty) {
          setSpecialty("");
          newFilters = { priceRange, specialty: "", location: value, dateRange: date };
        } else {
          newFilters = { priceRange, specialty, location: value, dateRange: date };
        }
        break;
      case "dateRange":
        setDate(value);
        setShowCalendar(false);
        newFilters = { priceRange, specialty, location, dateRange: value };
        break;
    }
    onFilterChange(newFilters);
  };

  const formatDateDisplay = (date: DateRange | undefined) => {
    if (!date?.from) return "Select dates";
    if (!date.to) return format(date.from, "MMM dd, yyyy");
    return `${format(date.from, "MMM dd")} - ${format(date.to, "MMM dd, yyyy")}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap items-center">
        <select
          className="px-4 py-2 rounded-md border border-primary/20 focus:outline-none focus:border-primary bg-white"
          value={priceRange}
          onChange={(e) => handleFilterChange("priceRange", e.target.value)}
        >
          <option value="">Price Range</option>
          <option value="0-50">$0 - $50</option>
          <option value="51-100">$51 - $100</option>
          <option value="101+">$101+</option>
        </select>
        
        <select
          className="px-4 py-2 rounded-md border border-primary/20 focus:outline-none focus:border-primary bg-white"
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
          className="px-4 py-2 rounded-md border border-primary/20 focus:outline-none focus:border-primary bg-white"
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

        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="px-4 py-2 rounded-md border border-primary/20 focus:outline-none focus:border-primary bg-white text-left w-[200px]"
          >
            {formatDateDisplay(date)}
          </button>
          
          {showCalendar && (
            <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg border border-primary/20">
              <Calendar
                mode="range"
                selected={date}
                onSelect={(value) => handleFilterChange("dateRange", value)}
                initialFocus
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
