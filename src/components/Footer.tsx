
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-accent text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">SewConnect</h3>
            <p className="text-sm text-white/80">
              Connecting seamstresses with clients for perfect fits and beautiful designs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-sm text-white/80 hover:text-white transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-white/80 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-sm text-white/80">
              Email: support@sewconnect.com<br />
              Follow us on social media for updates
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/60">
          © {new Date().getFullYear()} SewConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
