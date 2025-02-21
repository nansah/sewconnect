
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SeamstressGrid } from "@/components/SeamstressGrid";
import { useSeamstressFilter } from "@/hooks/useSeamstressFilter";
import { demoSeamstresses } from "@/data/seamstressData";

const Index = () => {
  const { filteredSeamstresses, handleFilterChange } = useSeamstressFilter(demoSeamstresses);

  return (
    <div className="min-h-screen bg-[#EBE2D3]">
      <Header />
      <HeroSection onSearch={(term) => handleFilterChange({ priceRange: "", specialty: term, location: "" })} />
      <SeamstressGrid 
        seamstresses={filteredSeamstresses} 
        onFilterChange={handleFilterChange}
        allSeamstresses={demoSeamstresses}
      />
    </div>
  );
};

export default Index;
