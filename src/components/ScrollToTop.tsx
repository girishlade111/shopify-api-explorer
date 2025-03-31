
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Force scroll to top with both methods for maximum compatibility
    window.scrollTo(0, 0);
    
    // Also use the smooth version as backup
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, [pathname]);
  
  return null;
}
