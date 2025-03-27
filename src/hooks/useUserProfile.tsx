
import { useEffect, useState, useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useBeforeUnload } from "react-router-dom";

export const UserProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"], {
    required_error: "Please select a gender",
  }),
  location: z.string().min(1, "Location is required"),
  birthday: z.date().optional(),
  mailingList: z.boolean().default(false),
  clothingSize: z.string().min(1, "Clothing size is required"),
  shoeSize: z.string().min(1, "Shoe size is required"),
  favoriteColors: z.string().optional(),
  avoidColors: z.string().optional(),
  styleDescriptors: z.string().optional(),
  fashionInterests: z.string().optional(),
  lifestyle: z.string().optional(),
  preferredBrands: z.string().optional(),
  preferredCategories: z.string().optional(),
  specialNotes: z.string().optional(),
  budgetMin: z.string().min(1, "Minimum budget is required"),
  budgetMax: z.string().min(1, "Maximum budget is required"),
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
  
  const [savedProfile, setSavedProfile] = useState<UserProfileValues | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
  const [showSaveInfoDialog, setShowSaveInfoDialog] = useState(false);
  
  const form = useForm<UserProfileValues>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues,
  });

  useEffect(() => {
    const storedProfile = localStorage.getItem(STORAGE_KEY);
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        
        if (parsedProfile.birthday) {
          parsedProfile.birthday = new Date(parsedProfile.birthday);
        }
        
        form.reset(parsedProfile);
        setSavedProfile(parsedProfile);
      } catch (error) {
        console.error("Failed to parse saved profile", error);
      }
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSavedProfile(data);
    setHasUnsavedChanges(false);
    toast({
      title: "Profile Saved",
      description: "Your profile has been saved successfully.",
    });
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY);
    form.reset(defaultValues);
    setSavedProfile(null);
    setHasUnsavedChanges(false);
    toast({
      title: "Profile Reset",
      description: "Your profile has been cleared.",
    });
  }

  function handleSaveClick() {
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
