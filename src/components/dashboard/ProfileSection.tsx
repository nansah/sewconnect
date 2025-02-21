
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";

interface ProfileSectionProps {
  profile: SeamstressProfile | null;
  onUpdateProfile: (formData: ProfileFormData) => Promise<void>;
}

export interface SeamstressProfile {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  location: string;
  price: string;
  rating: number;
  years_of_experience: number;
  portfolio_images: string[];
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  name: string;
  specialty: string;
  location: string;
  price: string;
}

export const ProfileSection = ({ profile, onUpdateProfile }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState<ProfileFormData>({
    name: profile?.name || '',
    specialty: profile?.specialty || '',
    location: profile?.location || '',
    price: profile?.price || ''
  });

  const handleSubmit = async () => {
    try {
      setUpdating(true);
      await onUpdateProfile(editForm);
      setIsEditing(false);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Seamstress Dashboard</h1>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          className="bg-accent hover:bg-accent/90 text-white"
          disabled={updating}
        >
          {isEditing ? "Cancel Editing" : "Edit Profile"}
          {updating && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
        </Button>
      </div>

      {isEditing && (
        <Card className="p-6 bg-white border-none shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Specialty</label>
              <Input
                value={editForm.specialty}
                onChange={(e) => setEditForm(prev => ({ ...prev, specialty: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                value={editForm.location}
                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price Range</label>
              <Input
                value={editForm.price}
                onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
            <Button onClick={handleSubmit} disabled={updating}>
              Save Changes
              {updating && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};
