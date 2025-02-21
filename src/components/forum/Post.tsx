
import { MessageCircle, ThumbsUp, Share2 } from "lucide-react";
import { CommentSection } from "./CommentSection";

interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  created_at: string;
  user_id: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  created_at: string;
  post_id: string;
  user_id: string;
}

interface PostProps {
  post: Post;
  showComments: boolean;
  comments: Comment[];
  newComment: string;
  onLike: () => void;
  onCommentToggle: () => void;
  onCommentChange: (value: string) => void;
  onCommentSubmit: () => void;
  formatDate: (date: string) => string;
}

export const Post = ({
  post,
  showComments,
  comments,
  newComment,
  onLike,
  onCommentToggle,
  onCommentChange,
  onCommentSubmit,
  formatDate,
}: PostProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            {post.author[0]?.toUpperCase()}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold">{post.author}</h3>
            <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </div>
        <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
        <div className="flex gap-4 text-sm text-gray-600">
          <button 
            className="flex items-center gap-1 hover:text-accent"
            onClick={onLike}
          >
            <ThumbsUp className="w-4 h-4" />
            {post.likes}
          </button>
          <button 
            className="flex items-center gap-1 hover:text-accent"
            onClick={onCommentToggle}
          >
            <MessageCircle className="w-4 h-4" />
            {post.comments}
          </button>
          <button className="flex items-center gap-1 hover:text-accent">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {showComments && (
        <CommentSection
          postId={post.id}
          comments={comments}
          newComment={newComment}
          onCommentChange={onCommentChange}
          onCommentSubmit={onCommentSubmit}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};
