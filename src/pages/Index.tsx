
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SeamstressGrid } from "@/components/SeamstressGrid";
import { useSeamstressFilter } from "@/hooks/useSeamstressFilter";

const Index = () => {
  const { filteredSeamstresses, handleFilterChange } = useSeamstressFilter();

  return (
    <div className="min-h-screen bg-[#EBE2D3]">
      <Header />
      <HeroSection onSearch={(term) => handleFilterChange({ priceRange: "", specialty: term, location: "" })} />
      <SeamstressGrid 
        seamstresses={filteredSeamstresses} 
        onFilterChange={handleFilterChange}
        allSeamstresses={filteredSeamstresses}
      />
    </div>
  );
};

export default Index;
