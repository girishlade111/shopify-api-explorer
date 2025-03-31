
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Define a robust scroll reset function
    const scrollToTop = () => {
      // Methods to force scroll to top
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    // Execute immediately
    scrollToTop();
    
    // Execute again after a short delay to handle any race conditions
    setTimeout(scrollToTop, 0);
    
    // Use requestAnimationFrame for next frame rendering
    requestAnimationFrame(scrollToTop);
    
    // Final fallback with a slightly longer timeout
    setTimeout(scrollToTop, 100);
  }, [pathname]);
  
  return null;
}
