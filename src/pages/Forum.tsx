
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, ThumbsUp, Share2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  created_at: string;
  user_id: string;
}

// Example comments data
const EXAMPLE_COMMENTS = {
  "demo-1": [
    { author: "Maria Chen", content: "Love this! I've been looking for someone to help with alterations.", time: "2h ago" },
    { author: "James Wilson", content: "The work looks amazing!", time: "1h ago" }
  ],
  "demo-2": [
    { author: "Sarah Johnson", content: "Thanks for sharing these tips!", time: "30m ago" }
  ]
};

const Forum = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

  // Demo group data
  const groupInfo = {
    name: "SewConnect Community",
    members: 1283,
    description: "A community of seamstresses and clients sharing their experiences, tips, and success stories.",
    bannerImage: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&fit=crop"
  };

  // Fetch initial posts and subscribe to changes
  useEffect(() => {
    fetchPosts();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('forum-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_posts'
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    setPosts(data || []);
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('forum_posts')
        .insert({
          content: newPost,
          user_id: user.id,
          author: user.email,
          likes: 0,
          comments: 0
        });

      if (error) throw error;

      setNewPost("");
      toast({
        title: "Post created",
        description: "Your post has been published to the forum.",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    }
  };

  const handleLike = async (postId: string, currentLikes: number) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to like posts.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('forum_posts')
        .update({ likes: currentLikes + 1 })
        .eq('id', postId);

      if (error) throw error;
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like post. Please try again.",
      });
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-[#EBE2D3]">
      <Header />
      
      {/* Group Banner */}
      <div className="relative h-64 w-full">
        <img 
          src={groupInfo.bannerImage} 
          alt="Group Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{groupInfo.name}</h1>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>{groupInfo.members.toLocaleString()} members</span>
          </div>
        </div>
      </div>

      {/* Group Description */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">About This Group</h2>
          <p className="text-gray-600">{groupInfo.description}</p>
        </div>

        {/* Create Post Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
          {user ? (
            <>
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your thoughts, questions, or experiences..."
                className="mb-4"
              />
              <Button onClick={handleCreatePost} className="bg-accent hover:bg-accent/90">
                Post
              </Button>
            </>
          ) : (
            <p className="text-gray-600">Please login to create posts.</p>
          )}
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md">
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
                <p className="mb-4">{post.content}</p>
                <div className="flex gap-4 text-sm text-gray-600">
                  <button 
                    className="flex items-center gap-1 hover:text-accent"
                    onClick={() => handleLike(post.id, post.likes)}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {post.likes}
                  </button>
                  <button 
                    className="flex items-center gap-1 hover:text-accent"
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {EXAMPLE_COMMENTS[post.id]?.length || 0}
                  </button>
                  <button className="flex items-center gap-1 hover:text-accent">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {showComments[post.id] && EXAMPLE_COMMENTS[post.id] && (
                <div className="border-t bg-gray-50 p-4">
                  {EXAMPLE_COMMENTS[post.id].map((comment, index) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-sm">
                          {comment.author[0]}
                        </div>
                        <div>
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500 ml-2">{comment.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 ml-10">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;
