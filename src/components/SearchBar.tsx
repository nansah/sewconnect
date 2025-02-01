import { Search } from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="relative max-w-2xl w-full">
      <input
        type="text"
        placeholder="Search by location or specialty..."
        className="w-full px-4 py-3 pl-12 rounded-full border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    </div>
  );
};