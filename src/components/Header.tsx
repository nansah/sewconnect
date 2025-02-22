
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { LogIn, LogOut, UserPlus, Users2, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { signOut } from "@/lib/auth";

export const Header = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Determine header style based on route
  const isIndex = location.pathname === "/";
  const headerClasses = isIndex
    ? "absolute w-full z-30"
    : "w-full z-30 bg-[#8B4513] shadow-md";

  const buttonClasses = isIndex
    ? "flex gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
    : "flex gap-2 bg-white/5 text-white border-white/10 hover:bg-white/10";

  return (
    <header className={headerClasses}>
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-white/90 transition-colors">
          SewConnect
        </Link>
        <div className="flex gap-4">
          <Link to="/contact">
            <Button variant="outline" className={buttonClasses}>
              <MessageSquare className="w-4 h-4" />
              Contact
            </Button>
          </Link>
          <Link to="/forum">
            <Button variant="outline" className={buttonClasses}>
              <Users2 className="w-4 h-4" />
              Community
            </Button>
          </Link>
          {user ? (
            <Button 
              variant="outline" 
              className={buttonClasses}
              onClick={signOut}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className={buttonClasses}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="flex gap-2 bg-[#FEC6A1] text-[#4A3034] hover:bg-[#FEC6A1]/90">
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
