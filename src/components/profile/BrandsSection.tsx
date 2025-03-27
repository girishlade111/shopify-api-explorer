
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { UserProfileValues } from "@/hooks/useUserProfile";

interface BrandsSectionProps {
  form: UseFormReturn<UserProfileValues>;
}

export function BrandsSection({ form }: BrandsSectionProps) {
  return (
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
  );
}
