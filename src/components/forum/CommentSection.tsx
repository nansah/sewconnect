
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "./Comment";

interface Comment {
  id: string;
  author: string;
  content: string;
  created_at: string;
  post_id: string;
  user_id: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  newComment: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: () => void;
  formatDate: (date: string) => string;
}

export const CommentSection = ({ 
  postId,
  comments,
  newComment,
  onCommentChange,
  onCommentSubmit,
  formatDate
}: CommentSectionProps) => {
  return (
    <div className="border-t bg-gray-50 p-4">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          author={comment.author}
          content={comment.content}
          createdAt={comment.created_at}
          formatDate={formatDate}
        />
      ))}

      {/* Add Comment */}
      <div className="mt-4 flex gap-2">
        <Textarea
          value={newComment || ''}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Write a comment..."
          className="text-sm min-h-[60px]"
        />
        <Button 
          onClick={onCommentSubmit}
          className="bg-accent hover:bg-accent/90"
        >
          Comment
        </Button>
      </div>
    </div>
  );
};
