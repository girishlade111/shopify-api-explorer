import { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate, useBeforeUnload } from "react-router-dom";

const UserProfileSchema = z.object({
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

type UserProfileValues = z.infer<typeof UserProfileSchema>;

const STORAGE_KEY = "user-profile";

const defaultValues: UserProfileValues = {
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

export default function UserProfilePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="non-binary" />
                            </FormControl>
                            <FormLabel className="font-normal">Non-binary</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="prefer-not-to-say" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Prefer not to say
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City/Region" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Birthday</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mailingList"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Mailing List</FormLabel>
                        <FormDescription>
                          Receive updates about new products and promotions
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Shopping Preferences</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Size</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clothingSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clothing</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., M, 42, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shoeSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shoe Size</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., US 9" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Color Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="favoriteColors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Favorite Colors</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List your favorite colors, separated by commas"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Example: Blue, Black, Green
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="avoidColors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Avoid Colors</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List colors you don't like, separated by commas"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Example: Yellow, Pink, Orange
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Style</h3>
                  <FormField
                    control={form.control}
                    name="styleDescriptors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Style Descriptors</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your style (e.g., Casual, Modern, Bohemian)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Budget Range</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="budgetMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budgetMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To ($)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Interests</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fashionInterests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fashion Interests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What fashion categories or styles interest you most?"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Example: Streetwear, Minimalist, Athleisure
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lifestyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lifestyle</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What hobbies or activities do you enjoy?"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Example: Hiking, Yoga, Reading
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Favorite Brands</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="preferredBrands"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Brands</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List your favorite brands, separated by commas"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredCategories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Categories</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List product categories you shop for most frequently"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Example: Dresses, Sneakers, Accessories
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Special Notes</h2>
              <FormField
                control={form.control}
                name="specialNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information about your preferences or needs"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share any other details that would help us serve you better
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
          </form>
        </Form>
      </div>

      <Dialog open={showSaveInfoDialog} onOpenChange={setShowSaveInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Changes to Save</DialogTitle>
            <DialogDescription>
              There are no changes to save. Make changes to your profile first.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSaveInfoDialog(false)}>
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
            <AlertDialogCancel onClick={() => setShowUnsavedChangesDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                form.handleSubmit(onSubmit)();
                setShowUnsavedChangesDialog(false);
              }}
            >
              Save
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                setShowUnsavedChangesDialog(false);
                setHasUnsavedChanges(false);
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
