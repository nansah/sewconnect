
import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, ThumbsUp, Share2 } from "lucide-react";

interface Post {
  id: number;
  author: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    author: "Sarah J.",
    content: "Just finished my first dress alteration! Any tips for working with silk?",
    likes: 24,
    comments: 12,
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    author: "Maria R.",
    content: "Found an amazing seamstress through SewConnect! She helped me create my dream wedding dress ❤️",
    likes: 45,
    comments: 8,
    timestamp: "5 hours ago"
  },
  {
    id: 3,
    author: "Emma L.",
    content: "Looking for recommendations on the best fabric stores in New York City. Any suggestions?",
    likes: 15,
    comments: 20,
    timestamp: "1 day ago"
  }
];

const Forum = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [newPost, setNewPost] = useState("");
  const { toast } = useToast();

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: posts.length + 1,
      author: "You",
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: "Just now"
    };

    setPosts([post, ...posts]);
    setNewPost("");
    toast({
      title: "Post created",
      description: "Your post has been published to the forum.",
    });
  };

  return (
    <div className="min-h-screen bg-[#EBE2D3]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-accent">SewConnect Community Forum</h1>
        
        {/* Create Post Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts, questions, or experiences..."
            className="mb-4"
          />
          <Button onClick={handleCreatePost} className="bg-accent hover:bg-accent/90">
            Post
          </Button>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  {post.author[0]}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold">{post.author}</h3>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </div>
              <p className="mb-4">{post.content}</p>
              <div className="flex gap-4 text-sm text-gray-600">
                <button className="flex items-center gap-1 hover:text-accent">
                  <ThumbsUp className="w-4 h-4" />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-accent">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments}
                </button>
                <button className="flex items-center gap-1 hover:text-accent">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;
