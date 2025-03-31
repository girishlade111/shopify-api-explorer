
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CategorySubNavProps {
  categories: Array<{
    name: string;
    path: string;
  }>;
  currentCategory?: string;
  className?: string;
}

export function CategorySubNav({ categories, currentCategory, className }: CategorySubNavProps) {
  return (
    <div className={`bg-white sticky top-16 z-30 shadow-sm ${className}`}>
      <div className="container-wide overflow-x-auto py-2">
        <div className="flex justify-center space-x-6 min-w-max mx-auto">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className={cn(
                "text-sm whitespace-nowrap transition-colors hover:text-primary py-2",
                currentCategory === category.name
                  ? "font-semibold text-primary border-b-2 border-primary"
                  : "text-secondary"
              )}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
