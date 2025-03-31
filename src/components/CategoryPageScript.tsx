
import { useEffect } from "react";
import { CategoryPageEnhancement } from "./CategoryPageEnhancement";

export function CategoryPageScript() {
  useEffect(() => {
    // Find the main container and inject our enhancement at the top
    const categoryContainer = document.querySelector(".category-content");
    if (categoryContainer) {
      // Create a div to hold our enhancement
      const enhancementContainer = document.createElement("div");
      enhancementContainer.id = "category-enhancement-container";
      
      // Insert it at the beginning of the category content
      if (categoryContainer.firstChild) {
        categoryContainer.insertBefore(enhancementContainer, categoryContainer.firstChild);
      } else {
        categoryContainer.appendChild(enhancementContainer);
      }
      
      // Use ReactDOM to render our enhancement
      const root = document.getElementById("category-enhancement-container");
      if (root) {
        const ReactDOM = require("react-dom");
        ReactDOM.render(<CategoryPageEnhancement />, root);
      }
    }
    
    // Cleanup when component unmounts
    return () => {
      const enhancementContainer = document.getElementById("category-enhancement-container");
      if (enhancementContainer) {
        enhancementContainer.remove();
      }
    };
  }, []);
  
  return null;
}
