
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileEditFormProps {
  editForm: {
    name: string;
    specialty: string;
    location: string;
    price: string;
  };
  setEditForm: (form: {
    name: string;
    specialty: string;
    location: string;
    price: string;
  }) => void;
  onSave: () => void;
}

export const ProfileEditForm = ({ editForm, setEditForm, onSave }: ProfileEditFormProps) => {
  return (
    <Card className="p-6 bg-white border-none shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Specialty</label>
          <Input
            value={editForm.specialty}
            onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <Input
            value={editForm.location}
            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price Range</label>
          <Input
            value={editForm.price}
            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
          />
        </div>
        <Button onClick={onSave} className="w-full">Save Changes</Button>
      </div>
    </Card>
  );
};

