
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LogIn, LogOut, UserPlus, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { signOut } from "@/lib/auth";

export const Header = () => {
  const [user, setUser] = useState(null);

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

  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-white/90 transition-colors">
          SewConnect
        </Link>
        <div className="flex gap-4">
          <Link to="/forum">
            <Button variant="outline" className="flex gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Users2 className="w-4 h-4" />
              Community
            </Button>
          </Link>
          {user ? (
            <Button 
              variant="outline" 
              className="flex gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20" 
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
                  className="flex gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
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
            </>
          )}
        </div>
      </div>
    </header>
  );
};
