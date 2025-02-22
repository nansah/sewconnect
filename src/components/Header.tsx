
import { Button } from "@/components/ui/button";
import { SearchBar } from "./SearchBar";
import { Link } from "react-router-dom";

interface HeaderProps {
  onSearch?: (term: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">SewConnect</span>
        </Link>
        <div className="flex-1 mx-8">
          {onSearch && <SearchBar onSearch={onSearch} />}
        </div>
        <nav className="flex items-center space-x-4">
          <Link to="/forum">
            <Button variant="ghost">Forum</Button>
          </Link>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};
