
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-transparent py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center space-x-4 text-sm">
          <Link 
            to="/privacy-policy" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">© 2024 SewConnect. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
