
import { FormField, FormItem, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { UserProfileValues } from "@/hooks/useUserProfile";

interface SpecialNotesSectionProps {
  form: UseFormReturn<UserProfileValues>;
}

export function SpecialNotesSection({ form }: SpecialNotesSectionProps) {
  return (
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
  );
}
