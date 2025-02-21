
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import Landing from "@/pages/Landing";
import { AdminDashboard } from "@/pages/AdminDashboard";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import SeamstressProfile from "@/pages/SeamstressProfile";
import SeamstressDashboard from "@/pages/SeamstressDashboard";
import MessagingPortal from "@/pages/MessagingPortal";
import Forum from "@/pages/Forum";
import DesignInspiration from "@/pages/DesignInspiration";
import PrivacyPolicy from "@/pages/PrivacyPolicy";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/seamstress-profile" element={<SeamstressProfile />} />
          <Route path="/seamstress-dashboard" element={<SeamstressDashboard />} />
          <Route path="/messaging" element={<MessagingPortal />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/inspiration" element={<DesignInspiration />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
};

export default App;
