
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

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
  lastUpdated: string;
}

interface UserActivityContextType {
  userActivity: UserActivity;
}

const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined);

export function UserActivityProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  
  const [userActivity, setUserActivity] = useState<UserActivity>({
    currentPage: location.pathname,
    cartItems: [],
    wishlistItems: [],
    lastUpdated: new Date().toISOString()
  });

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

  // Update user activity and log to console
  const updateUserActivity = (updates: Partial<UserActivity>) => {
    setUserActivity(prev => {
      const newActivity = {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      
      // Log the updated activity to console
      console.log("User Activity Updated:", JSON.stringify(newActivity, null, 2));
      
      return newActivity;
    });
  };

  return (
    <UserActivityContext.Provider value={{ userActivity }}>
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
