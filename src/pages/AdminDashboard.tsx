
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
  portfolio_images: string[];
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<SeamstressProfile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<{ [key: string]: File[] }>({});
  const [loading, setLoading] = useState(false);
  const [editingName, setEditingName] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchProfiles();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'seamstress_profiles'
        },
        (payload) => {
          console.log('Real-time change received:', payload);
          
          // Refresh the profiles list when any change occurs
          fetchProfiles();
          
          // Show a toast notification
          const eventType = payload.eventType;
          let message = '';
          
          switch (eventType) {
            case 'INSERT':
              message = 'New seamstress profile created';
              break;
            case 'UPDATE':
              message = 'Seamstress profile updated';
              break;
            case 'DELETE':
              message = 'Seamstress profile deleted';
              break;
          }
          
          toast({
            title: "Profile Change",
            description: message,
          });
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('seamstress_profiles')
      .select('*')
      .order('created_at', { ascending: false }); // Show newest profiles first

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

  const handlePortfolioFileChange = (event: React.ChangeEvent<HTMLInputElement>, profileId: string) => {
    const files = Array.from(event.target.files || []);
    setPortfolioFiles(prev => ({
      ...prev,
      [profileId]: files
    }));
  };

  const handleNameChange = (profileId: string, value: string) => {
    setEditingName(prev => ({
      ...prev,
      [profileId]: value
    }));
  };

  const handleUpdateName = async (profileId: string) => {
    const newName = editingName[profileId];
    if (!newName) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('seamstress_profiles')
        .update({ name: newName })
        .eq('id', profileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Name updated successfully",
      });

      // No need to manually fetch profiles here as the real-time subscription will handle it
      setEditingName(prev => {
        const newState = { ...prev };
        delete newState[profileId];
        return newState;
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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

  const handlePortfolioUpdate = async (profileId: string) => {
    const files = portfolioFiles[profileId];
    if (!files?.length) {
      toast({
        title: "Error",
        description: "Please select portfolio images",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `portfolio/${profileId}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      const { data: profile } = await supabase
        .from('seamstress_profiles')
        .select('portfolio_images')
        .eq('id', profileId)
        .single();

      const currentImages = profile?.portfolio_images || [];
      const updatedImages = [...currentImages, ...uploadedUrls];

      const { error: updateError } = await supabase
        .from('seamstress_profiles')
        .update({ portfolio_images: updatedImages })
        .eq('id', profileId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Portfolio images updated successfully",
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
      setPortfolioFiles(prev => {
        const newState = { ...prev };
        delete newState[profileId];
        return newState;
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Seamstress Profiles Management</h1>
      
      <div className="grid gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="border p-6 rounded-lg space-y-4">
            <div className="flex items-start gap-4">
              <img 
                src={profile.image_url || '/placeholder.svg'} 
                alt={profile.name}
                className="w-32 h-32 object-cover rounded"
              />
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  {editingName[profile.id] ? (
                    <>
                      <Input
                        value={editingName[profile.id]}
                        onChange={(e) => handleNameChange(profile.id, e.target.value)}
                        className="max-w-sm"
                      />
                      <Button 
                        onClick={() => handleUpdateName(profile.id)}
                        disabled={loading}
                      >
                        Save
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setEditingName(prev => {
                          const newState = { ...prev };
                          delete newState[profile.id];
                          return newState;
                        })}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold">{profile.name}</h2>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingName(prev => ({
                          ...prev,
                          [profile.id]: profile.name
                        }))}
                      >
                        Edit Name
                      </Button>
                    </>
                  )}
                </div>
                
                <p>{profile.specialty}</p>
                <p>{profile.location}</p>
                
                <div className="space-y-2">
                  <Label htmlFor={`profile-${profile.id}`}>Update Profile Picture</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`profile-${profile.id}`}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Button 
                      onClick={() => handleProfileUpdate(profile.id)}
                      disabled={loading}
                    >
                      Upload
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`portfolio-${profile.id}`}>Add Portfolio Images</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`portfolio-${profile.id}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handlePortfolioFileChange(e, profile.id)}
                    />
                    <Button 
                      onClick={() => handlePortfolioUpdate(profile.id)}
                      disabled={loading}
                    >
                      Upload
                    </Button>
                  </div>
                </div>

                {profile.portfolio_images?.length > 0 && (
                  <div className="mt-4">
                    <Label>Portfolio Images</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {profile.portfolio_images.map((image, index) => (
                        <img 
                          key={index}
                          src={image} 
                          alt={`Portfolio ${index + 1}`}
                          className="w-full aspect-square object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
