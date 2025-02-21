
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Scissors, ShieldCheck, Users2, Sparkles, Star } from "lucide-react";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      // Since we don't have a waitlist table yet, we'll just show a success message
      // You'll need to create the table first
      toast("Success!", {
        description: "You've been added to our waitlist. We'll notify you when we launch!"
      });
      setEmail("");
    } catch (error) {
      toast("Error", {
        description: "There was an error joining the waitlist. Please try again."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EBE2D3]">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-accent text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connect with Expert Seamstresses
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/80">
            Find the perfect seamstress for your clothing alterations and custom designs
          </p>
          <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              required
            />
            <Button type="submit" disabled={submitting}>
              Join Waitlist
            </Button>
          </form>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users2 className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Your Seamstress</h3>
              <p className="text-gray-600">Browse through profiles of skilled seamstresses in your area</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scissors className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discuss Your Project</h3>
              <p className="text-gray-600">Chat directly with seamstresses to discuss your needs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Perfect Results</h3>
              <p className="text-gray-600">Receive your perfectly fitted garments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <ShieldCheck className="w-6 h-6 text-accent flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
                <p className="text-gray-600">All seamstresses are vetted for quality and reliability</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Users2 className="w-6 h-6 text-accent flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
                <p className="text-gray-600">Chat directly with seamstresses to ensure perfect results</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "I found the perfect seamstress for my wedding dress alterations. The results were amazing!"
              </p>
              <p className="font-semibold">Sarah M.</p>
              <p className="text-sm text-gray-500">Bride</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "As a seamstress, this platform has helped me connect with amazing clients and grow my business."
              </p>
              <p className="font-semibold">Maria R.</p>
              <p className="text-sm text-gray-500">Professional Seamstress</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Quick, easy, and professional. My go-to platform for all my alteration needs!"
              </p>
              <p className="font-semibold">John D.</p>
              <p className="text-sm text-gray-500">Regular Customer</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
