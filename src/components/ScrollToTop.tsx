
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Use requestAnimationFrame to ensure the scroll happens after the DOM has updated
    const scrollToTop = () => {
      // Force scroll to top with both methods
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    // Execute immediately
    scrollToTop();
    
    // Also schedule with requestAnimationFrame for reliability
    requestAnimationFrame(() => {
      scrollToTop();
    });
    
    // And with a small timeout as a final fallback
    setTimeout(() => {
      scrollToTop();
    }, 50);
    
  }, [pathname]);
  
  return null;
}
