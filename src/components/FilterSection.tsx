import { Calendar } from "./ui/calendar";
import { useState } from "react";

export const FilterSection = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
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
      </div>
      <div className="bg-white p-4 rounded-md border border-primary/20">
        <h3 className="text-lg font-semibold mb-2">Select Available Date</h3>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
    </div>
  );
};