
import React, { createContext, useContext, useState } from "react";

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

  const addProducts = (newProducts: FittingRoomProduct[]) => {
    setProducts(newProducts);
  };

  const clearProducts = () => {
    setProducts([]);
  };

  return (
    <FittingRoomContext.Provider value={{ products, addProducts, clearProducts }}>
      {children}
    </FittingRoomContext.Provider>
  );
};

export const useFittingRoom = () => useContext(FittingRoomContext);
