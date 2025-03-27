
import { useEffect, useState, useCallback, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useBeforeUnload } from "react-router-dom";
import { useUserActivity } from "@/contexts/UserActivityContext";

export const UserProfileSchema = z.object({
  name: z.string().optional(),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"]).optional(),
  location: z.string().optional(),
  birthday: z.date().optional(),
  mailingList: z.boolean().default(false),
  clothingSize: z.string().optional(),
  shoeSize: z.string().optional(),
  favoriteColors: z.string().optional(),
  avoidColors: z.string().optional(),
  styleDescriptors: z.string().optional(),
  fashionInterests: z.string().optional(),
  lifestyle: z.string().optional(),
  preferredBrands: z.string().optional(),
  preferredCategories: z.string().optional(),
  specialNotes: z.string().optional(),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
});

export type UserProfileValues = z.infer<typeof UserProfileSchema>;

const STORAGE_KEY = "user-profile";

export const defaultValues: UserProfileValues = {
  name: "",
  gender: "prefer-not-to-say",
  location: "",
  birthday: undefined,
  mailingList: false,
  clothingSize: "",
  shoeSize: "",
  favoriteColors: "",
  avoidColors: "",
  styleDescriptors: "",
  fashionInterests: "",
  lifestyle: "",
  preferredBrands: "",
  preferredCategories: "",
  specialNotes: "",
  budgetMin: "",
  budgetMax: "",
};

export function useUserProfile() {
  const { toast } = useToast();
  const { updateUserProfile } = useUserActivity();
  
  const [savedProfile, setSavedProfile] = useState<UserProfileValues | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
  const [showSaveInfoDialog, setShowSaveInfoDialog] = useState(false);
  
  // Add a ref to track if we're currently updating from a saved profile
  const isLoadingProfile = useRef(false);
  
  const form = useForm<UserProfileValues>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues,
  });

  useEffect(() => {
    const storedProfile = localStorage.getItem(STORAGE_KEY);
    if (storedProfile) {
      try {
        isLoadingProfile.current = true;
        const parsedProfile = JSON.parse(storedProfile);
        
        if (parsedProfile.birthday) {
          parsedProfile.birthday = new Date(parsedProfile.birthday);
        }
        
        form.reset(parsedProfile);
        setSavedProfile(parsedProfile);
        
        // Update the user activity context with the loaded profile
        updateUserProfile(parsedProfile);
        
        console.log("User Profile Loaded:", JSON.stringify(parsedProfile, null, 2));
        
        // Set isLoadingProfile back to false after a short delay to ensure form reset is complete
        setTimeout(() => {
          isLoadingProfile.current = false;
        }, 100);
      } catch (error) {
        console.error("Failed to parse saved profile", error);
        isLoadingProfile.current = false;
      }
    }
  }, [form, updateUserProfile]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      // Skip the check if we're loading a profile from storage
      if (isLoadingProfile.current) return;
      
      if (!savedProfile) {
        const hasValues = Object.values(value).some(val => {
          if (typeof val === 'string') return val.trim().length > 0;
          return val !== undefined && val !== null;
        });
        setHasUnsavedChanges(hasValues);
      } else {
        const formValues = form.getValues();
        
        let formBirthday = formValues.birthday ? formValues.birthday.toISOString() : undefined;
        let savedBirthday = savedProfile.birthday ? new Date(savedProfile.birthday).toISOString() : undefined;
        
        const formWithoutBirthday = { ...formValues, birthday: undefined };
        const savedWithoutBirthday = { ...savedProfile, birthday: undefined };
        
        const hasOtherChanges = JSON.stringify(formWithoutBirthday) !== JSON.stringify(savedWithoutBirthday);
        
        const hasBirthdayChanged = formBirthday !== savedBirthday;
        
        setHasUnsavedChanges(hasOtherChanges || hasBirthdayChanged);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, savedProfile]);
  
  useBeforeUnload(
    useCallback(
      (event) => {
        if (hasUnsavedChanges) {
          event.preventDefault();
          return "You have unsaved changes. Are you sure you want to leave?";
        }
      },
      [hasUnsavedChanges]
    )
  );

  function onSubmit(data: UserProfileValues) {
    // Set isLoadingProfile to true to prevent watch from triggering changes
    isLoadingProfile.current = true;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSavedProfile(data);
    setHasUnsavedChanges(false);
    
    // Update user activity with the new profile data
    updateUserProfile(data);
    
    console.log("User Profile Updated:", JSON.stringify(data, null, 2));
    
    toast({
      title: "Profile Saved",
      description: "Your profile has been saved successfully.",
    });
    
    // Reset isLoadingProfile after a short delay
    setTimeout(() => {
      isLoadingProfile.current = false;
    }, 100);
  }

  function handleReset(e?: React.MouseEvent<HTMLButtonElement>) {
    if (e) {
      e.preventDefault();
    }
    
    // Set isLoadingProfile to true to prevent watch from triggering changes
    isLoadingProfile.current = true;
    
    localStorage.removeItem(STORAGE_KEY);
    form.reset(defaultValues);
    setSavedProfile(null);
    setHasUnsavedChanges(false);
    
    // Update user activity to clear profile data
    updateUserProfile(null);
    
    console.log("User Profile Reset");
    
    toast({
      title: "Profile Reset",
      description: "Your profile has been cleared.",
    });
    
    // Reset isLoadingProfile after a short delay
    setTimeout(() => {
      isLoadingProfile.current = false;
    }, 100);
  }

  function handleSaveClick(e?: React.MouseEvent<HTMLButtonElement>) {
    if (e) {
      e.preventDefault();
    }
    if (!hasUnsavedChanges) {
      setShowSaveInfoDialog(true);
    } else {
      form.handleSubmit(onSubmit)();
    }
  }

  return {
    form,
    hasUnsavedChanges,
    showUnsavedChangesDialog,
    setShowUnsavedChangesDialog,
    showSaveInfoDialog,
    setShowSaveInfoDialog,
    handleReset,
    handleSaveClick,
    onSubmit
  };
}
