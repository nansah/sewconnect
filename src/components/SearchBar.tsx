
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const searchSeamstresses = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      const { data, error } = await supabase
        .from('seamstress_profiles')
        .select('*')
        .or(`location.ilike.%${query}%,specialty.ilike.%${query}%`)
        .limit(5);

      if (error) {
        console.error('Error searching seamstresses:', error);
        return;
      }

      setResults(data || []);
    };

    const debounceTimer = setTimeout(() => {
      searchSeamstresses();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div className="relative max-w-2xl w-full">
      <input
        type="text"
        placeholder="Search by location or specialty..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-6 py-4 pl-14 rounded-full border border-primary/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white/90 backdrop-blur-sm text-accent placeholder:text-accent/50 shadow-lg"
      />
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
      
      {/* Search Results Dropdown */}
      {results.length > 0 && query && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
          {results.map((seamstress) => (
            <div
              key={seamstress.id}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
              onClick={() => {
                navigate("/seamstress-profile", { 
                  state: { seamstress } 
                });
                setQuery("");
                setResults([]);
              }}
            >
              <img 
                src={seamstress.image_url || "https://via.placeholder.com/40"} 
                alt={seamstress.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-medium">{seamstress.name}</div>
                <div className="text-sm text-gray-500">{seamstress.specialty}</div>
                <div className="text-xs text-gray-400">{seamstress.location}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
