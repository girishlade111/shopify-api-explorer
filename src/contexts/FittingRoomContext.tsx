
import React, { createContext, useContext, useState, useEffect } from "react";

export interface FittingRoomProduct {
  title: string;
  price: number;
  image_url: string;
  link: string;
  product_id: number;
  variant_id: number;
}

interface FittingRoomContextType {
  products: FittingRoomProduct[];
  addProducts: (products: FittingRoomProduct[]) => void;
  clearProducts: () => void;
}

const FittingRoomContext = createContext<FittingRoomContextType>({
  products: [],
  addProducts: () => {},
  clearProducts: () => {},
});

export const FittingRoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<FittingRoomProduct[]>([]);

  // Load products from localStorage on initial render
  useEffect(() => {
    const storedProducts = localStorage.getItem('fittingRoomProducts');
    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
      } catch (error) {
        console.error("Error parsing stored products:", error);
      }
    }
  }, []);

  const addProducts = (newProducts: FittingRoomProduct[]) => {
    // Save to state
    setProducts(newProducts);
    
    // Save to localStorage
    localStorage.setItem('fittingRoomProducts', JSON.stringify(newProducts));
  };

  const clearProducts = () => {
    setProducts([]);
    localStorage.removeItem('fittingRoomProducts');
  };

  return (
    <FittingRoomContext.Provider value={{ products, addProducts, clearProducts }}>
      {children}
    </FittingRoomContext.Provider>
  );
};

export const useFittingRoom = () => useContext(FittingRoomContext);
