
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { UserProfileValues } from "@/hooks/useUserProfile";

interface UserActivity {
  currentPage: string;
  cartItems: {
    id: string;
    productId: number;
    variantId: number;
    title: string;
    quantity: number;
    price: number;
  }[];
  wishlistItems: {
    productId: number;
    title: string;
  }[];
  userProfile: UserProfileValues | null;
  lastUpdated: string;
}

interface UserActivityContextType {
  userActivity: UserActivity;
  updateUserProfile: (profile: UserProfileValues | null) => void;
}

const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined);

const STORAGE_KEY = "user-profile";

export function UserActivityProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const isUpdatingProfile = useRef(false);
  const previousActivityRef = useRef<UserActivity | null>(null);
  
  // Initialize user profile from localStorage
  const initializeUserProfile = (): UserProfileValues | null => {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEY);
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        
        // Convert birthday string back to Date object if it exists
        if (parsedProfile.birthday) {
          parsedProfile.birthday = new Date(parsedProfile.birthday);
        }
        
        return parsedProfile;
      }
    } catch (error) {
      console.error("Failed to parse saved profile", error);
    }
    return null;
  };
  
  const [userActivity, setUserActivity] = useState<UserActivity>({
    currentPage: location.pathname,
    cartItems: [],
    wishlistItems: [],
    userProfile: initializeUserProfile(),
    lastUpdated: new Date().toISOString()
  });

  // Set initial previous activity
  useEffect(() => {
    previousActivityRef.current = userActivity;
  }, []);

  // Track page changes
  useEffect(() => {
    updateUserActivity({
      currentPage: location.pathname
    });
  }, [location.pathname]);

  // Track cart changes
  useEffect(() => {
    const cartItems = cart.map(item => ({
      id: item.id,
      productId: item.product.id,
      variantId: item.variant.id,
      title: item.product.title,
      quantity: item.quantity,
      price: parseFloat(item.variant.price)
    }));
    
    updateUserActivity({ cartItems });
  }, [cart]);

  // Track wishlist changes
  useEffect(() => {
    const wishlistItems = wishlist.map(item => ({
      productId: item.id,
      title: item.title
    }));
    
    updateUserActivity({ wishlistItems });
  }, [wishlist]);

  // Check if activity has actually changed
  const hasActivityChanged = (newActivity: Partial<UserActivity>, prevActivity: UserActivity): boolean => {
    for (const key in newActivity) {
      const typedKey = key as keyof UserActivity;
      
      // Skip lastUpdated comparison
      if (typedKey === 'lastUpdated') continue;
      
      // For objects, compare JSON strings
      if (
        typeof newActivity[typedKey] === 'object' && 
        newActivity[typedKey] !== null
      ) {
        const newValue = JSON.stringify(newActivity[typedKey]);
        const prevValue = JSON.stringify(prevActivity[typedKey]);
        if (newValue !== prevValue) return true;
      } 
      // For primitive values, direct comparison
      else if (newActivity[typedKey] !== prevActivity[typedKey]) {
        return true;
      }
    }
    return false;
  };

  // Update user activity and log to console only if there are actual changes
  const updateUserActivity = (updates: Partial<UserActivity>) => {
    // Skip if we're currently in the middle of a userProfile update that was triggered internally
    if (isUpdatingProfile.current && 'userProfile' in updates) {
      return;
    }
    
    setUserActivity(prev => {
      const newActivity = {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      
      // Check if there's an actual change
      const hasChanged = previousActivityRef.current ? 
        hasActivityChanged(updates, previousActivityRef.current) : true;
      
      // Only log if there's an actual change
      if (hasChanged) {
        console.log("User Activity Updated:", JSON.stringify(newActivity, null, 2));
        previousActivityRef.current = newActivity;
      }
      
      return newActivity;
    });
  };

  // Function to update user profile with proper synchronization
  const updateUserProfile = (profile: UserProfileValues | null) => {
    // Set the flag to prevent duplicate updates
    isUpdatingProfile.current = true;
    
    // Update the user activity with the new profile data
    updateUserActivity({ userProfile: profile });
    
    // Reset the flag after a short delay to allow state updates to complete
    setTimeout(() => {
      isUpdatingProfile.current = false;
    }, 100);
  };

  return (
    <UserActivityContext.Provider value={{ userActivity, updateUserProfile }}>
      {children}
    </UserActivityContext.Provider>
  );
}

export function useUserActivity() {
  const context = useContext(UserActivityContext);
  if (context === undefined) {
    throw new Error("useUserActivity must be used within a UserActivityProvider");
  }
  return context;
}
