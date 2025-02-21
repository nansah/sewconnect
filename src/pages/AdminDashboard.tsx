
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SeamstressProfile {
  id: string;
  name: string;
  image_url: string;
  specialty: string;
  rating: number;
  price: string;
  location: string;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<SeamstressProfile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Removed admin check for demo purposes
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('seamstress_profiles')
      .select('*');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profiles",
        variant: "destructive"
      });
      return;
    }

    setProfiles(data || []);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleProfileUpdate = async (profileId: string) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${profileId}.${fileExt}`;

      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, selectedFile, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('seamstress_profiles')
        .update({ image_url: publicUrl })
        .eq('id', profileId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

      fetchProfiles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Seamstress Profiles Management</h1>
      
      <div className="grid gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="border p-4 rounded-lg">
            <div className="flex items-start gap-4">
              <img 
                src={profile.image_url || '/placeholder.svg'} 
                alt={profile.name}
                className="w-32 h-32 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p>{profile.specialty}</p>
                <p>{profile.location}</p>
                
                <div className="mt-4">
                  <Label htmlFor={`image-${profile.id}`}>Update Profile Picture</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id={`image-${profile.id}`}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Button 
                      onClick={() => handleProfileUpdate(profile.id)}
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
