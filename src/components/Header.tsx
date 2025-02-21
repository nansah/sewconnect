
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LogIn, UserPlus } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          SewConnect
        </Link>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="outline" className="flex gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="flex gap-2">
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
