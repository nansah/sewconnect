
import { Calendar } from "./ui/calendar";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
        // Reset specialty if the selected location doesn't have the current specialty
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
        newFilters = { priceRange, specialty, location, dateRange: value };
        break;
    }
    onFilterChange(newFilters);
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
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Select dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(value) => handleFilterChange("dateRange", value)}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
