
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { UserProfileValues } from "@/hooks/useUserProfile";

interface ShoppingPreferencesSectionProps {
  form: UseFormReturn<UserProfileValues>;
}

export function ShoppingPreferencesSection({ form }: ShoppingPreferencesSectionProps) {
  return (
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
  );
}
