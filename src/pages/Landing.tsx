
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Scissors, ShieldCheck, Users2 } from "lucide-react";

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
    <div className="min-h-screen bg-background">      
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connect with Expert Seamstresses
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Find the perfect seamstress for your clothing alterations and custom designs. Join our waitlist to be notified when we launch!
          </p>
          
          {/* Waitlist Form */}
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
            </Button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose SewConnect?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mb-6 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Active Seamstresses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10k+</div>
              <div className="text-muted-foreground">Satisfied Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.8</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
