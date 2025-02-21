
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DesignInspiration = () => {
  const { toast } = useToast();
  const [inspirationUrl, setInspirationUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "Design inspiration submitted",
      description: "We'll review your inspiration and get back to you soon.",
    });
  };

  return (
    <div className="min-h-screen bg-[#EBE2D3] p-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Design Inspiration</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <Label htmlFor="inspiration-url">Inspiration Image URL</Label>
            <Input
              id="inspiration-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={inspirationUrl}
              onChange={(e) => setInspirationUrl(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what you like about this design..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Design Inspiration
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DesignInspiration;
