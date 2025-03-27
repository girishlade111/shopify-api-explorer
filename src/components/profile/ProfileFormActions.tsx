
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ProfileFormActionsProps {
  handleReset: () => void;
  handleSaveClick: () => void;
  hasUnsavedChanges: boolean;
}

export function ProfileFormActions({ 
  handleReset, 
  handleSaveClick, 
  hasUnsavedChanges 
}: ProfileFormActionsProps) {
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={handleReset}
      >
        Reset
      </Button>
      <Button 
        type="button"
        onClick={handleSaveClick}
        disabled={!hasUnsavedChanges}
        className="gap-2"
      >
        <Save size={16} />
        Save Profile
      </Button>
    </div>
  );
}
