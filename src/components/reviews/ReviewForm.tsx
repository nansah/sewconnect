
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ReviewFormProps {
  orderId: string;
  seamstressId: string;
  seamstressName: string;
  onReviewSubmitted?: () => void;
}

export const ReviewForm = ({ orderId, seamstressId, seamstressName, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;

      const customerName = `${profileData.first_name} ${profileData.last_name}`;

      const { error } = await supabase
        .from('seamstress_reviews')
        .insert({
          seamstress_id: seamstressId,
          customer_id: session.user.id,
          customer_name: customerName,
          order_id: orderId,
          rating,
          review_text: reviewText
        });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: `Thank you for reviewing ${seamstressName}!`,
      });

      onReviewSubmitted?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Your Review
        </label>
        <Textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Tell others about your experience..."
          required
          className="h-32"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting || !reviewText.trim()}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};
