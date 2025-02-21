
import { Calendar } from "./ui/calendar";
import { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface FilterSectionProps {
  onFilterChange: (filters: {
    priceRange: string;
    specialty: string;
    location: string;
    dateRange: DateRange | undefined;
  }) => void;
}

export const FilterSection = ({ onFilterChange }: FilterSectionProps) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [priceRange, setPriceRange] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");

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
        newFilters = { priceRange, specialty, location: value, dateRange: date };
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
          <option value="Wedding Dresses">Wedding Dresses</option>
          <option value="Evening Gowns">Evening Gowns</option>
          <option value="Casual Wear">Casual Wear</option>
          <option value="Traditional Attire">Traditional Attire</option>
          <option value="Kids Fashion">Kids Fashion</option>
          <option value="Bridal Wear">Bridal Wear</option>
          <option value="Modern Fashion">Modern Fashion</option>
        </select>
        <select
          className="px-4 py-2 rounded-md border border-primary/20 focus:outline-none focus:border-primary bg-white"
          value={location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        >
          <option value="">Location</option>
          <option value="New York">New York</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Chicago">Chicago</option>
          <option value="Miami">Miami</option>
          <option value="Houston">Houston</option>
          <option value="San Francisco">San Francisco</option>
          <option value="Boston">Boston</option>
          <option value="Seattle">Seattle</option>
          <option value="Detroit">Detroit</option>
          <option value="Atlanta">Atlanta</option>
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
