
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const UserProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"], {
    required_error: "Please select a gender",
  }),
  location: z.string().min(1, "Location is required"),
  clothingSize: z.string().min(1, "Clothing size is required"),
  shoeSize: z.string().min(1, "Shoe size is required"),
  favoriteColors: z.string().optional(),
  avoidColors: z.string().optional(),
  styleDescriptors: z.string().optional(),
  budgetMin: z.string().min(1, "Minimum budget is required"),
  budgetMax: z.string().min(1, "Maximum budget is required"),
});

type UserProfileValues = z.infer<typeof UserProfileSchema>;

const STORAGE_KEY = "user-profile";

export default function UserProfilePage() {
  const { toast } = useToast();
  
  const form = useForm<UserProfileValues>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: {
      name: "",
      gender: "prefer-not-to-say",
      location: "",
      clothingSize: "",
      shoeSize: "",
      favoriteColors: "",
      avoidColors: "",
      styleDescriptors: "",
      budgetMin: "",
      budgetMax: "",
    },
  });

  useEffect(() => {
    // Load saved profile from localStorage on component mount
    const savedProfile = localStorage.getItem(STORAGE_KEY);
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        form.reset(parsedProfile);
      } catch (error) {
        console.error("Failed to parse saved profile", error);
      }
    }
  }, [form]);

  function onSubmit(data: UserProfileValues) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    toast({
      title: "Profile Saved",
      description: "Your profile has been saved successfully.",
    });
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY);
    form.reset({
      name: "",
      gender: "prefer-not-to-say",
      location: "",
      clothingSize: "",
      shoeSize: "",
      favoriteColors: "",
      avoidColors: "",
      styleDescriptors: "",
      budgetMin: "",
      budgetMax: "",
    });
    toast({
      title: "Profile Reset",
      description: "Your profile has been cleared.",
    });
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl py-10">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button type="submit">Save Profile</Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </div>
    </Layout>
  );
}
