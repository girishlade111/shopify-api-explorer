
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FilterGroup {
  name: string;
  options: {
    id: string;
    label: string;
    count?: number;
  }[];
}

const FILTER_GROUPS: FilterGroup[] = [
  {
    name: "Brand",
    options: [
      { id: "brand-1", label: "Adidas", count: 42 },
      { id: "brand-2", label: "Nike", count: 36 },
      { id: "brand-3", label: "Puma", count: 24 },
      { id: "brand-4", label: "Reebok", count: 18 },
      { id: "brand-5", label: "Under Armour", count: 14 },
    ],
  },
  {
    name: "Size",
    options: [
      { id: "size-1", label: "XS", count: 10 },
      { id: "size-2", label: "S", count: 24 },
      { id: "size-3", label: "M", count: 36 },
      { id: "size-4", label: "L", count: 28 },
      { id: "size-5", label: "XL", count: 12 },
    ],
  },
  {
    name: "Color",
    options: [
      { id: "color-1", label: "Black", count: 32 },
      { id: "color-2", label: "White", count: 28 },
      { id: "color-3", label: "Blue", count: 24 },
      { id: "color-4", label: "Red", count: 18 },
      { id: "color-5", label: "Green", count: 12 },
    ],
  },
  {
    name: "Price",
    options: [
      { id: "price-1", label: "Under $25", count: 15 },
      { id: "price-2", label: "$25 to $50", count: 25 },
      { id: "price-3", label: "$50 to $100", count: 30 },
      { id: "price-4", label: "$100 to $200", count: 20 },
      { id: "price-5", label: "Over $200", count: 10 },
    ],
  },
];

interface CategoryFiltersProps {
  onChange: (filters: { [key: string]: string[] }) => void;
}

export function CategoryFilters({ onChange }: CategoryFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string[] }>({});

  const handleFilterChange = (group: string, optionId: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev };
      
      // Initialize group array if it doesn't exist
      if (!updatedFilters[group]) {
        updatedFilters[group] = [];
      }
      
      // Add or remove the option based on checked status
      if (checked) {
        updatedFilters[group] = [...updatedFilters[group], optionId];
      } else {
        updatedFilters[group] = updatedFilters[group].filter(id => id !== optionId);
      }
      
      // Remove empty groups
      if (updatedFilters[group].length === 0) {
        delete updatedFilters[group];
      }
      
      // Notify parent component
      onChange(updatedFilters);
      
      return updatedFilters;
    });
  };

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="px-5 py-4">
        <CardTitle className="text-lg">Filter By</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="multiple" defaultValue={["Brand", "Size"]} className="w-full">
          {FILTER_GROUPS.map((group) => (
            <AccordionItem value={group.name} key={group.name} className="border-0">
              <AccordionTrigger className="px-5 py-3 hover:no-underline hover:bg-accent">
                <span className="font-medium">{group.name}</span>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-3">
                <div className="space-y-2 px-5">
                  {group.options.map((option) => (
                    <div className="flex items-center space-x-2" key={option.id}>
                      <Checkbox 
                        id={option.id} 
                        checked={selectedFilters[group.name]?.includes(option.id) || false}
                        onCheckedChange={(checked) => 
                          handleFilterChange(group.name, option.id, checked === true)
                        }
                      />
                      <Label 
                        htmlFor={option.id} 
                        className="flex justify-between w-full text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                        {option.count !== undefined && (
                          <span className="text-muted-foreground">{option.count}</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
              <Separator />
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
