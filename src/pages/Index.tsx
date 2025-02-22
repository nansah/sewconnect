
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SeamstressGrid } from "@/components/SeamstressGrid";
import { Footer } from "@/components/Footer";
import { useSeamstressFilter } from "@/hooks/useSeamstressFilter";
import { useSeamstressStore } from "@/data/seamstressData";

const Index = () => {
  const seamstresses = useSeamstressStore((state) => state.seamstresses);
  const { filteredSeamstresses, handleFilterChange, handleSearch } = useSeamstressFilter(seamstresses);

  return (
    <div className="min-h-screen bg-[#EBE2D3]">
      <Header onSearch={handleSearch} />
      <HeroSection onSearch={(term) => handleFilterChange({ priceRange: "", specialty: term, location: "" })} />
      <SeamstressGrid 
        seamstresses={filteredSeamstresses} 
        onFilterChange={handleFilterChange}
        allSeamstresses={seamstresses}
      />
      <Footer />
    </div>
  );
};

export default Index;
