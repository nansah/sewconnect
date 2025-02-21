
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
  };

  return (
    <div className="relative max-w-2xl w-full">
      <input
        type="text"
        value={inputValue}
        placeholder="Search for dress styles, patterns, designs..."
        className="w-full px-6 py-4 pl-14 rounded-full border border-primary/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white/90 backdrop-blur-sm text-accent placeholder:text-accent/50 shadow-lg"
        onChange={handleChange}
      />
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
    </div>
  );
};
