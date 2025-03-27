
import * as React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { getCategories } from "@/lib/api";
import { Category } from "@/types";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CategoryMenu() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(15);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  // Organize categories into main categories and subcategories
  const mainCategories = categories
    .filter(cat => !cat.full_path.includes(" > "))
    .slice(0, 6);

  const getSubcategories = (mainCategory: string) => {
    return categories.filter(
      cat => cat.full_path.startsWith(mainCategory + " > ") && 
      cat.full_path.split(" > ").length === 2
    );
  };

  if (loading) {
    return (
      <NavigationMenuItem>
        <Link to="/all-products" className={navigationMenuTriggerStyle()}>
          All Products
        </Link>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/all-products" className={navigationMenuTriggerStyle()}>
            All Products
          </Link>
        </NavigationMenuItem>
        
        {mainCategories.map(category => {
          const subcategories = getSubcategories(category.full_path);
          const categoryPath = `/all-products/${getCategoryPath(category.full_path)}`;
          
          if (subcategories.length === 0) {
            return (
              <NavigationMenuItem key={category.full_path}>
                <Link to={categoryPath} className={navigationMenuTriggerStyle()}>
                  {category.full_path}
                </Link>
              </NavigationMenuItem>
            );
          }
          
          return (
            <NavigationMenuItem key={category.full_path}>
              <NavigationMenuTrigger>{category.full_path}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[400px]">
                  <Link
                    to={categoryPath}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">View All {category.full_path}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Browse all products in {category.full_path} category
                    </p>
                  </Link>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {subcategories.map(subcat => {
                      const subcatPath = `/all-products/${getCategoryPath(subcat.full_path)}`;
                      const subcatName = getSimpleCategoryName(subcat.full_path);
                      
                      return (
                        <Link
                          key={subcat.full_path}
                          to={subcatPath}
                          className="flex items-center gap-1 select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{subcatName}</div>
                          <span className="ml-auto text-xs rounded-full bg-accent/80 px-2 py-1 text-muted-foreground">
                            {subcat.count}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
