
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DeliveryTimeframeProps {
  onTimeframeSelect: (timeframe: {
    date: Date;
    urgency: "standard" | "rush" | "express";
  }) => void;
}

export const DeliveryTimeframe = ({ onTimeframeSelect }: DeliveryTimeframeProps) => {
  const [date, setDate] = useState<Date>();
  const [urgency, setUrgency] = useState<"standard" | "rush" | "express">("standard");

  const handleSelect = () => {
    if (date) {
      onTimeframeSelect({ date, urgency });
    }
  };

  const urgencyOptions = {
    standard: {
      label: "Standard (2-3 weeks)",
      price: "Base price",
    },
    rush: {
      label: "Rush (1-2 weeks)",
      price: "+$50",
    },
    express: {
      label: "Express (5-7 days)",
      price: "+$100",
    },
  };

  return (
    <div className="space-y-6 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Select Delivery Timeframe</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Preferred Delivery Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Delivery Speed</Label>
          <RadioGroup
            value={urgency}
            onValueChange={(value: "standard" | "rush" | "express") => setUrgency(value)}
            className="grid gap-4"
          >
            {Object.entries(urgencyOptions).map(([key, { label, price }]) => (
              <div
                key={key}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-4",
                  urgency === key && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value={key} id={key} />
                  <Label htmlFor={key} className="cursor-pointer">
                    {label}
                  </Label>
                </div>
                <span className="text-sm font-medium text-primary">{price}</span>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button 
          className="w-full" 
          onClick={handleSelect}
          disabled={!date}
        >
          Confirm Timeframe
        </Button>
      </div>
    </div>
  );
};
