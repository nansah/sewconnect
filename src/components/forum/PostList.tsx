
import { Post } from "./Post";

interface PostData {
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

interface PostListProps {
  posts: PostData[];
  comments: { [key: string]: Comment[] };
  showComments: { [key: string]: boolean };
  newComments: { [key: string]: string };
  onLike: (postId: string, currentLikes: number) => void;
  onCommentToggle: (postId: string) => void;
  onCommentChange: (postId: string, value: string) => void;
  onCommentSubmit: (postId: string) => void;
  formatDate: (date: string) => string;
}

export const PostList = ({
  posts,
  comments,
  showComments,
  newComments,
  onLike,
  onCommentToggle,
  onCommentChange,
  onCommentSubmit,
  formatDate,
}: PostListProps) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          showComments={showComments[post.id]}
          comments={comments[post.id] || []}
          newComment={newComments[post.id] || ''}
          onLike={() => onLike(post.id, post.likes)}
          onCommentToggle={() => onCommentToggle(post.id)}
          onCommentChange={(value) => onCommentChange(post.id, value)}
          onCommentSubmit={() => onCommentSubmit(post.id)}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};
