import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CategoryPageEnhancement } from "./CategoryPageEnhancement";
import { createRoot } from "react-dom/client";

export function AppEnhancement() {
  const location = useLocation();
  const path = location.pathname;
  
  useEffect(() => {
    // Check if we're on a category page
    const isCategoryPage = path.includes("/all-products") || path.includes("/categories");
    
    if (isCategoryPage) {
      // Give the main content a moment to render
      const timer = setTimeout(() => {
        const categoryContainer = document.querySelector(".category-content");
        if (categoryContainer) {
          // Remove any existing enhancement
          const existingEnhancement = document.getElementById("category-enhancement-container");
          if (existingEnhancement) {
            existingEnhancement.remove();
          }
          
          // Create a new enhancement container
          const enhancementContainer = document.createElement("div");
          enhancementContainer.id = "category-enhancement-container";
          
          // Insert it at the beginning of the category content
          if (categoryContainer.firstChild) {
            categoryContainer.insertBefore(enhancementContainer, categoryContainer.firstChild);
          } else {
            categoryContainer.appendChild(enhancementContainer);
          }
          
          // Use createRoot to render our enhancement
          const root = createRoot(enhancementContainer);
          root.render(<CategoryPageEnhancement />);
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
        // Clean up when route changes
        const enhancementContainer = document.getElementById("category-enhancement-container");
        if (enhancementContainer) {
          enhancementContainer.remove();
        }
      };
    }
  }, [path]);
  
  return null;
}
