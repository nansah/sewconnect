
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LogIn, LogOut, UserPlus, Users } from "lucide-react";
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
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-[#1A1F2C]">
          SewConnect
        </Link>
        <div className="flex gap-4">
          <Link to="/forum">
            <Button variant="outline" className="flex gap-2">
              <Users className="w-4 h-4" />
              Community
            </Button>
          </Link>
          {user ? (
            <Button variant="outline" className="flex gap-2" onClick={signOut}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
};
