
import { Calendar } from "./ui/calendar";
import { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export const FilterSection = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap items-center">
        <select className="px-4 py-2 rounded-md border border-primary/20 focus:outline-none focus:border-primary bg-white">
          <option value="">Price Range</option>
          <option value="0-50">$0 - $50</option>
          <option value="51-100">$51 - $100</option>
          <option value="101+">$101+</option>
        </select>
        <select className="px-4 py-2 rounded-md border border-primary/20 focus:outline-none focus:border-primary bg-white">
          <option value="">Specialty</option>
          <option value="wedding">Wedding Dresses</option>
          <option value="evening">Evening Gowns</option>
          <option value="casual">Casual Wear</option>
          <option value="traditional">Traditional Attire</option>
        </select>
        <select className="px-4 py-2 rounded-md border border-primary/20 focus:outline-none focus:border-primary bg-white">
          <option value="">Location</option>
          <option value="new-york">New York</option>
          <option value="los-angeles">Los Angeles</option>
          <option value="chicago">Chicago</option>
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
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
