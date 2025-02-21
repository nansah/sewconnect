
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

interface Comment {
  id: string;
  author: string;
  content: string;
  created_at: string;
  post_id: string;
  user_id: string;
}

const demoData: Post[] = [
  {
    id: "1",
    author: "fashion.lover@email.com",
    content: "Just received my custom-made African print dress and I'm absolutely in love! The seamstress did an amazing job with the fitting. Has anyone else ordered something similar recently?",
    likes: 15,
    comments: 2,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    user_id: "1"
  },
  {
    id: "2",
    author: "style.enthusiast@email.com",
    content: "Looking for recommendations on the best fabric shops in Lagos. Planning to get materials for a wedding outfit!",
    likes: 8,
    comments: 3,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    user_id: "2"
  },
  {
    id: "3",
    author: "african.prints@email.com",
    content: "Check out this amazing Ankara blazer I got made! The craftsmanship is incredible. 🧵✨",
    likes: 24,
    comments: 5,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user_id: "3"
  }
];

const demoComments: { [key: string]: Comment[] } = {
  "1": [
    {
      id: "c1",
      author: "seamstress.pro@email.com",
      content: "So happy you liked it! The fabric choice was perfect for that design.",
      created_at: new Date(Date.now() - 1800000).toISOString(),
      post_id: "1",
      user_id: "4"
    },
    {
      id: "c2",
      author: "fashion.insider@email.com",
      content: "Beautiful! Could you share which seamstress you worked with?",
      created_at: new Date(Date.now() - 900000).toISOString(),
      post_id: "1",
      user_id: "5"
    }
  ],
  "2": [
    {
      id: "c3",
      author: "lagos.fashionista@email.com",
      content: "Try the Balogun Market - they have an amazing selection of fabrics!",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      post_id: "2",
      user_id: "6"
    },
    {
      id: "c4",
      author: "fabric.expert@email.com",
      content: "I recommend checking out Lovely Fabrics in Lekki. Great quality!",
      created_at: new Date(Date.now() - 1800000).toISOString(),
      post_id: "2",
      user_id: "7"
    }
  ]
};

const Forum = () => {
  const [posts, setPosts] = useState<Post[]>(demoData);
  const [newPost, setNewPost] = useState("");
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[]}>(demoComments);
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});

  // Group info data
  const groupInfo = {
    name: "SewConnect Community",
    members: 856,
    description: "A welcoming space for customers to connect, share experiences, and discuss their African fashion journey. Find recommendations, share success stories, and get advice from fellow fashion enthusiasts.",
    bannerImage: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&fit=crop"
  };

  // Fetch initial posts and subscribe to changes
  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    const newDemoPost: Post = {
      id: `${Date.now()}`,
      author: user?.email || "demo.user@email.com",
      content: newPost,
      likes: 0,
      comments: 0,
      created_at: new Date().toISOString(),
      user_id: user?.id || "demo"
    };

    setPosts(prev => [newDemoPost, ...prev]);
    setNewPost("");
    
    toast({
      title: "Post created",
      description: "Your post has been published to the forum.",
    });
  };

  const handleCreateComment = async (postId: string) => {
    if (!newComments[postId]?.trim()) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: user?.email || "demo.user@email.com",
      content: newComments[postId],
      created_at: new Date().toISOString(),
      post_id: postId,
      user_id: user?.id || "demo"
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, comments: (post.comments || 0) + 1 }
          : post
      )
    );

    setNewComments(prev => ({
      ...prev,
      [postId]: ''
    }));

    toast({
      title: "Comment added",
      description: "Your comment has been published.",
    });
  };

  const handleLike = async (postId: string, currentLikes: number) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, likes: currentLikes + 1 }
          : post
      )
    );
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
                <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
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
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-1 hover:text-accent">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {showComments[post.id] && (
                <div className="border-t bg-gray-50 p-4">
                  {comments[post.id]?.map((comment) => (
                    <div key={comment.id} className="mb-3 last:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-sm">
                          {comment.author[0]?.toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500 ml-2">{formatDate(comment.created_at)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 ml-10">{comment.content}</p>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="mt-4 flex gap-2">
                    <Textarea
                      value={newComments[post.id] || ''}
                      onChange={(e) => setNewComments(prev => ({
                        ...prev,
                        [post.id]: e.target.value
                      }))}
                      placeholder="Write a comment..."
                      className="text-sm min-h-[60px]"
                    />
                    <Button 
                      onClick={() => handleCreateComment(post.id)}
                      className="bg-accent hover:bg-accent/90"
                    >
                      Comment
                    </Button>
                  </div>
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
