
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Category } from "@/types";
import { getCategories } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Loader } from "./ui-components";

interface CategoryNavProps {
  className?: string;
  limit?: number;
  onCategoryClick?: (category: Category) => void;
  activeCategory?: string;
}

export function CategoryNav({ 
  className, 
  limit = 10, 
  onCategoryClick,
  activeCategory 
}: CategoryNavProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(limit);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [limit]);

  if (loading) {
    return <Loader className="py-4" />;
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted">{error}</p>
      </div>
    );
  }

  // Function to get simplified category name
  const getSimpleCategoryName = (fullPath: string): string => {
    const parts = fullPath.split(" > ");
    return parts[parts.length - 1];
  };

  // Function to get URL-friendly category path
  const getCategoryPath = (fullPath: string): string => {
    return fullPath
      .split(" > ")
      .map(part => part.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
      .join("/");
  };

  const handleCategoryClick = (category: Category, event: React.MouseEvent) => {
    // Prevent default link behavior
    event.preventDefault();
    
    // If onCategoryClick prop exists, call it
    if (onCategoryClick) {
      onCategoryClick(category);
    }
    
    // Navigate to the category page
    const path = getCategoryPath(category.full_path);
    const categoryUrl = `/categories/${path}`;
    
    // Only navigate if we're going to a different URL to avoid unnecessary rerenders
    if (location.pathname !== categoryUrl) {
      console.log(`Navigating to: ${categoryUrl}`);
      navigate(categoryUrl);
    }
  };

  // Function to check if a category is active
  const isCategoryActive = (categoryPath: string): boolean => {
    if (!activeCategory) return false;
    
    // Convert both paths to a standardized format for comparison
    const normalizedActivePath = activeCategory.toLowerCase().replace(/\/$/, '');
    const normalizedCategoryPath = categoryPath.toLowerCase().replace(/\/$/, '');
    
    // Check if the active category is equal to or contains the category path
    return normalizedActivePath === normalizedCategoryPath || 
           normalizedActivePath.startsWith(normalizedCategoryPath + '/');
  };

  return (
    <div className={cn("space-y-1", className)}>
      {categories.map((category) => {
        const simpleName = getSimpleCategoryName(category.full_path);
        const path = getCategoryPath(category.full_path);
        const isActive = isCategoryActive(path);
        
        return (
          <CategoryItem
            key={category.full_path}
            name={simpleName}
            count={category.count}
            path={`/categories/${path}`}
            isActive={isActive}
            onClick={(e) => handleCategoryClick(category, e)}
          />
        );
      })}
    </div>
  );
}

interface CategoryItemProps {
  name: string;
  count: number;
  path: string;
  isActive?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

function CategoryItem({ name, count, path, isActive, onClick }: CategoryItemProps) {
  return (
    <a
      href={path}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-4 py-2 rounded-md transition-colors w-full text-left",
        isActive
          ? "bg-primary text-white font-medium"
          : "hover:bg-accent text-secondary"
      )}
    >
      <span>{name}</span>
      <span 
        className={cn(
          "text-xs rounded-full w-8 h-6 flex items-center justify-center",
          isActive 
            ? "bg-white/20 text-white" 
            : "bg-accent/80 text-secondary"
        )}
      >
        {count}
      </span>
    </a>
  );
}
