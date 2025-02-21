import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Scissors, ShieldCheck, Users2, Sparkles, Star } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1>Welcome to SewConnect</h1>
        {/* Add your index page content here */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
