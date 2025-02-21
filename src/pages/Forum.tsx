import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GroupBanner } from "@/components/forum/GroupBanner";
import { GroupDescription } from "@/components/forum/GroupDescription";
import { CreatePost } from "@/components/forum/CreatePost";
import { PostList } from "@/components/forum/PostList";

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

  const groupInfo = {
    name: "SewConnect Community",
    members: 856,
    description: "A welcoming space for customers to connect, share experiences, and discuss their African fashion journey. Find recommendations, share success stories, and get advice from fellow fashion enthusiasts.",
    bannerImage: "https://images.pexels.com/photos/2968231/pexels-photo-2968231.jpeg"
  };

  useEffect(() => {
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
      
      <GroupBanner 
        name={groupInfo.name}
        members={groupInfo.members}
        bannerImage={groupInfo.bannerImage}
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <GroupDescription description={groupInfo.description} />

        <CreatePost
          newPost={newPost}
          onPostChange={setNewPost}
          onPostSubmit={handleCreatePost}
        />

        <PostList
          posts={posts}
          comments={comments}
          showComments={showComments}
          newComments={newComments}
          onLike={handleLike}
          onCommentToggle={toggleComments}
          onCommentChange={(postId, value) => setNewComments(prev => ({
            ...prev,
            [postId]: value
          }))}
          onCommentSubmit={handleCreateComment}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
};

export default Forum;
