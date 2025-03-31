
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
    <div className={`bg-white border-b border-gray-100 sticky top-16 z-20 ${className}`}>
      <div className="container-wide overflow-x-auto">
        <div className="flex space-x-6 py-4 min-w-max">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className={cn(
                "text-sm whitespace-nowrap transition-colors hover:text-primary",
                currentCategory === category.name
                  ? "font-semibold text-primary border-b-2 border-primary pb-1"
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
