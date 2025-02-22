
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Scissors, ShieldCheck, Users2, ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("waitlist")
        .insert([{ email }]);

      if (error) throw error;

      toast.success("Thanks for joining!", {
        description: "We'll notify you when SewConnect launches.",
      });
      setEmail("");
    } catch (error: any) {
      toast.error("Failed to join waitlist", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <Scissors className="w-12 h-12 text-primary" />,
      title: "Expert Seamstresses",
      description: "Connect with skilled professionals for your tailoring needs."
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-primary" />,
      title: "Secure Platform",
      description: "Your transactions and communications are always protected."
    },
    {
      icon: <Users2 className="w-12 h-12 text-primary" />,
      title: "Growing Community",
      description: "Join thousands of satisfied customers and seamstresses."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection onSearch={() => {}} />

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SewConnect?</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-secondary/20 p-8 rounded-lg hover:shadow-lg transition-all">
                <div className="mb-6 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-center">{feature.title}</h3>
                <p className="text-muted-foreground text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-[#4A3034] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Growing Community</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-4">500+</div>
              <div className="text-xl">Active Seamstresses</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-4">10k+</div>
              <div className="text-xl">Satisfied Customers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-4">4.8</div>
              <div className="text-xl">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-secondary/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Fashion Journey?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Join our waitlist to be notified when we launch and get early access to our platform.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" disabled={isSubmitting}>
              Join Waitlist 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Landing;
