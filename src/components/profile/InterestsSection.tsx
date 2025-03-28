
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { UserProfileValues } from "@/hooks/useUserProfile";

interface InterestsSectionProps {
  form: UseFormReturn<UserProfileValues>;
}

export function InterestsSection({ form }: InterestsSectionProps) {
  return (
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
  );
}
