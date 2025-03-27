
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Form } from "@/components/ui/form";
import { useUserProfile } from "@/hooks/useUserProfile";
import { PersonalDetailsSection } from "@/components/profile/PersonalDetailsSection";
import { ShoppingPreferencesSection } from "@/components/profile/ShoppingPreferencesSection";
import { InterestsSection } from "@/components/profile/InterestsSection";
import { BrandsSection } from "@/components/profile/BrandsSection";
import { SpecialNotesSection } from "@/components/profile/SpecialNotesSection";
import { ProfileFormActions } from "@/components/profile/ProfileFormActions";
import { ProfileDialogs } from "@/components/profile/ProfileDialogs";

export default function UserProfilePage() {
  const {
    form,
    hasUnsavedChanges,
    showUnsavedChangesDialog,
    setShowUnsavedChangesDialog,
    showSaveInfoDialog,
    setShowSaveInfoDialog,
    handleReset,
    handleSaveClick,
    onSubmit
  } = useUserProfile();

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <Form {...form}>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (hasUnsavedChanges) {
              form.handleSubmit(onSubmit)(e);
            } else {
              setShowSaveInfoDialog(true);
            }
          }} className="space-y-8">
            <PersonalDetailsSection form={form} />
            <ShoppingPreferencesSection form={form} />
            <InterestsSection form={form} />
            <BrandsSection form={form} />
            <SpecialNotesSection form={form} />
            <ProfileFormActions 
              handleReset={handleReset}
              handleSaveClick={handleSaveClick}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </form>
        </Form>
      </div>

      <ProfileDialogs
        showSaveInfoDialog={showSaveInfoDialog}
        setShowSaveInfoDialog={setShowSaveInfoDialog}
        showUnsavedChangesDialog={showUnsavedChangesDialog}
        setShowUnsavedChangesDialog={setShowUnsavedChangesDialog}
        onSubmit={onSubmit}
        form={form}
        setHasUnsavedChanges={(value) => {
          // This is a new prop that wasn't in the original code
          // It's used to reset the hasUnsavedChanges state when discarding changes
          if (!value) {
            form.reset();
          }
        }}
      />
    </Layout>
  );
}
