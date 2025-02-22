import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, User, ShieldCheck } from "lucide-react";
import { signIn, demoSeamstressLogin } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        // Check if user is admin
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', session.user.id)
          .single();

        if (adminData) {
          navigate('/admin');
        } else if (profile?.user_type === 'seamstress') {
          navigate('/seamstress-dashboard');
        } else {
          navigate('/');
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent, isAdmin: boolean = false) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await signIn(email, password);
      if (!error && data) {
        if (isAdmin) {
          // Check if user is in admin_users table
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('user_id')
            .eq('user_id', data.session?.user.id)
            .single();

          if (adminError || !adminData) {
            throw new Error("Unauthorized: Not an admin user");
          }
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting demo login...");
      const { error } = await demoSeamstressLogin();
      if (!error) {
        console.log("Demo login successful, navigating...");
        navigate("/seamstress-dashboard");
      }
    } catch (error) {
      console.error("Error in demo login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-primary/10 gap-1">
            <TabsTrigger 
              value="customer" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200 rounded-md"
            >
              <User className="w-4 h-4 mr-2" />
              Customer
            </TabsTrigger>
            <TabsTrigger 
              value="seamstress"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md transition-all duration-200 rounded-md"
            >
              <Scissors className="w-4 h-4 mr-2" />
              Seamstress
            </TabsTrigger>
            <TabsTrigger 
              value="admin"
              className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 rounded-md"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer">
            <div className="text-center space-y-2 border-l-4 border-primary p-4 bg-primary/5">
              <h2 className="text-3xl font-bold text-gray-800">Customer Login</h2>
              <p className="text-gray-600">Access your customer account</p>
            </div>
            <form onSubmit={(e) => handleSubmit(e, false)} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>

                <Button 
                  type="button"
                  variant="secondary" 
                  className="w-full"
                  size="lg"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  <User className="w-4 h-4 mr-2" />
                  {isLoading ? "Loading..." : "Try Demo Seamstress Account"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="seamstress">
            <div className="text-center space-y-2 border-l-4 border-accent p-4 bg-accent/5">
              <h2 className="text-3xl font-bold text-gray-800">Seamstress Login</h2>
              <p className="text-gray-600">Access your seamstress dashboard</p>
            </div>
            <form onSubmit={(e) => handleSubmit(e, false)} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>

                <Button 
                  type="button"
                  variant="secondary" 
                  className="w-full"
                  size="lg"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  <User className="w-4 h-4 mr-2" />
                  {isLoading ? "Loading..." : "Try Demo Seamstress Account"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="admin">
            <div className="text-center space-y-2 border-l-4 border-gray-800 p-4 bg-gray-50">
              <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
              <p className="text-gray-600">Secure access for administrators</p>
            </div>
            <form onSubmit={(e) => handleSubmit(e, true)} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700">
                    Admin Email
                  </label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Admin Sign In
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
