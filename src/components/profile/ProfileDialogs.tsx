
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { UserProfileValues } from "@/hooks/useUserProfile";
import { UseFormReturn } from "react-hook-form";

interface ProfileDialogsProps {
  showSaveInfoDialog: boolean;
  setShowSaveInfoDialog: (show: boolean) => void;
  showUnsavedChangesDialog: boolean;
  setShowUnsavedChangesDialog: (show: boolean) => void;
  onSubmit: (data: UserProfileValues) => void;
  form: UseFormReturn<UserProfileValues>;
  setHasUnsavedChanges?: (value: boolean) => void;
}

export function ProfileDialogs({
  showSaveInfoDialog,
  setShowSaveInfoDialog,
  showUnsavedChangesDialog,
  setShowUnsavedChangesDialog,
  onSubmit,
  form,
  setHasUnsavedChanges
}: ProfileDialogsProps) {
  return (
    <>
      <Dialog open={showSaveInfoDialog} onOpenChange={setShowSaveInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Changes to Save</DialogTitle>
            <DialogDescription>
              There are no changes to save. Make changes to your profile first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={(e) => {
              e.preventDefault();
              setShowSaveInfoDialog(false);
            }}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showUnsavedChangesDialog} onOpenChange={setShowUnsavedChangesDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save them before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => {
              e.preventDefault();
              setShowUnsavedChangesDialog(false);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
                setShowUnsavedChangesDialog(false);
              }}
            >
              Save
            </AlertDialogAction>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                setShowUnsavedChangesDialog(false);
                if (setHasUnsavedChanges) {
                  setHasUnsavedChanges(false);
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
