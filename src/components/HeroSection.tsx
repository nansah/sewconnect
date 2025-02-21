
import { SearchBar } from "./SearchBar";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  onSearch: (term: string) => void;
}

export const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const [displayText, setDisplayText] = useState("");
  const words = ["Seamstresses", "Tailors", "Designers"];
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const typeWriter = () => {
      const currentWord = words[wordIndex];
      const shouldDelete = isDeleting;

      setDisplayText(prev => {
        if (shouldDelete) {
          return prev.slice(0, -1);
        }
        return currentWord.slice(0, prev.length + 1);
      });

      let timeout = shouldDelete ? 50 : 150; // Delete faster than type

      if (!shouldDelete && displayText === currentWord) {
        timeout = 3000; // 3 seconds pause at the end of word
        setIsDeleting(true);
      } else if (shouldDelete && displayText === "") {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        timeout = 3000; // 3 seconds pause before starting new word
      }

      timeoutId = setTimeout(typeWriter, timeout);
    };

    timeoutId = setTimeout(typeWriter, 100);

    return () => clearTimeout(timeoutId);
  }, [displayText, isDeleting, wordIndex, words]);

  return (
    <div className="relative h-[600px] overflow-hidden">
      <img 
        src="https://images.pexels.com/photos/6192554/pexels-photo-6192554.jpeg"
        alt="African Fashion"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4">
        <h1 className="text-5xl font-bold text-center mb-6 max-w-3xl animate-fade-up">
          Connect with Expert African{" "}
          <span className="inline-block min-w-[280px]">
            {displayText}
            <span className="animate-pulse">|</span>
          </span>
        </h1>
        <p className="text-xl text-center mb-8 max-w-2xl animate-fade-up opacity-90">
          Discover talented seamstresses who bring your fashion dreams to life with authentic African craftsmanship
        </p>
        <div className="w-full max-w-2xl animate-fade-up">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
};
