
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Measurements } from "@/types/messaging";

interface MeasurementsFormProps {
  measurements: Measurements;
  setMeasurements: (measurements: Measurements) => void;
  onCancel: () => void;
  onShare: () => void;
}

export const MeasurementsForm = ({
  measurements,
  setMeasurements,
  onCancel,
  onShare,
}: MeasurementsFormProps) => {
  return (
    <div className="p-4 border-t">
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(measurements).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </label>
            <Input
              value={value}
              onChange={(e) => setMeasurements({
                ...measurements,
                [key]: e.target.value
              })}
              placeholder="in inches"
              className="w-full"
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onShare}>
          Share Measurements
        </Button>
      </div>
    </div>
  );
};
