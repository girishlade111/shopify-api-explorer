
import React, { createContext, useContext, useState, useEffect } from "react";

export interface FittingRoomProduct {
  title: string;
  price: number;
  image_url: string;
  link: string;
  product_id: number;
  variant_id: number;
}

interface FittingRoomTab {
  id: string;
  name: string;
  products: FittingRoomProduct[];
  timestamp: number;
}

interface FittingRoomContextType {
  products: FittingRoomProduct[];
  tabs: FittingRoomTab[];
  addProducts: (products: FittingRoomProduct[]) => void;
  clearProducts: () => void;
}

const FittingRoomContext = createContext<FittingRoomContextType>({
  products: [],
  tabs: [],
  addProducts: () => {},
  clearProducts: () => {},
});

export const FittingRoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<FittingRoomProduct[]>([]);
  const [tabs, setTabs] = useState<FittingRoomTab[]>([]);

  // Load products and tabs from localStorage on initial render
  useEffect(() => {
    const storedProducts = localStorage.getItem('fittingRoomProducts');
    const storedTabs = localStorage.getItem('fittingRoomTabs');
    
    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
      } catch (error) {
        console.error("Error parsing stored products:", error);
      }
    }
    
    if (storedTabs) {
      try {
        const parsedTabs = JSON.parse(storedTabs);
        setTabs(parsedTabs);
      } catch (error) {
        console.error("Error parsing stored tabs:", error);
      }
    }
  }, []);

  const addProducts = (newProducts: FittingRoomProduct[]) => {
    if (newProducts.length === 0) return;
    
    // Keep existing products in state
    setProducts(prevProducts => [...prevProducts, ...newProducts]);
    
    // Create a new tab for these products
    const newTab: FittingRoomTab = {
      id: `tab-${Date.now()}`,
      name: `Set ${tabs.length + 1}`,
      products: newProducts,
      timestamp: Date.now()
    };
    
    // Place the new tab at the beginning of the array (newest first)
    const updatedTabs = [newTab, ...tabs];
    setTabs(updatedTabs);
    
    // Save to localStorage
    localStorage.setItem('fittingRoomProducts', JSON.stringify([...products, ...newProducts]));
    localStorage.setItem('fittingRoomTabs', JSON.stringify(updatedTabs));
  };

  const clearProducts = () => {
    setProducts([]);
    setTabs([]);
    localStorage.removeItem('fittingRoomProducts');
    localStorage.removeItem('fittingRoomTabs');
  };

  return (
    <FittingRoomContext.Provider value={{ products, tabs, addProducts, clearProducts }}>
      {children}
    </FittingRoomContext.Provider>
  );
};

export const useFittingRoom = () => useContext(FittingRoomContext);
