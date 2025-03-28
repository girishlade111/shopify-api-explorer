
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, ProductVariant } from "@/types";
import { toast } from "sonner";

export interface CartItem {
  id: string; // Unique ID for cart item (product.id + variant.id)
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  isInCart: (productId: number, variantId: number) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    const cartItemId = `${product.id}-${variant.id}`;
    const existingItem = cart.find(item => item.id === cartItemId);

    if (existingItem) {
      // Update quantity if item already exists
      updateQuantity(cartItemId, existingItem.quantity + quantity);
    } else {
      // Add new item
      setCart(prev => [
        ...prev,
        {
          id: cartItemId,
          product,
          variant,
          quantity
        }
      ]);
      toast.success("Added to cart", {
        description: `${product.title} (${variant.title}) has been added to your cart.`,
      });
    }
  };

  const removeFromCart = (cartItemId: string) => {
    const itemToRemove = cart.find(item => item.id === cartItemId);
    
    if (itemToRemove) {
      setCart(prev => prev.filter(item => item.id !== cartItemId));
      
      toast.info("Removed from cart", {
        description: `${itemToRemove.product.title} has been removed from your cart.`,
      });
    }
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }

    setCart(prev => 
      prev.map(item => 
        item.id === cartItemId 
          ? { ...item, quantity } 
          : item
      )
    );

    const item = cart.find(item => item.id === cartItemId);
    if (item) {
      toast.success("Cart updated", {
        description: `${item.product.title} quantity updated to ${quantity}.`,
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    toast.info("Cart cleared", {
      description: "All items have been removed from your cart.",
    });
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (parseFloat(item.variant.price) * item.quantity);
    }, 0);
  };

  const isInCart = (productId: number, variantId: number) => {
    return cart.some(item => 
      item.product.id === productId && item.variant.id === variantId
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
