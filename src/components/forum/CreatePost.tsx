
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CreatePostProps {
  newPost: string;
  onPostChange: (value: string) => void;
  onPostSubmit: () => void;
}

export const CreatePost = ({ newPost, onPostChange, onPostSubmit }: CreatePostProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
      <Textarea
        value={newPost}
        onChange={(e) => onPostChange(e.target.value)}
        placeholder="Share your thoughts, questions, or experiences..."
        className="mb-4"
      />
      <Button 
        onClick={onPostSubmit} 
        className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
      >
        Post
      </Button>
    </div>
  );
};
