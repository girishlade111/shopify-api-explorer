
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ProfileFormActionsProps {
  handleReset: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleSaveClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
        onClick={(e) => {
          e.preventDefault();
          handleReset(e);
        }}
      >
        Reset
      </Button>
      <Button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          handleSaveClick(e);
        }}
        disabled={!hasUnsavedChanges}
        className="gap-2"
      >
        <Save size={16} />
        Save Profile
      </Button>
    </div>
  );
}
