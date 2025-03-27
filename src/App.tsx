import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import SearchResults from "./pages/SearchResults";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import VoiceWidget from "./components/VoiceWidget";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WishlistProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products/:handle" element={<ProductDetail />} />
              <Route path="/all-products" element={<CategoryPage />} />
              <Route path="/all-products/:category/*" element={<CategoryPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/new-arrivals" element={<NewArrivalsPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/account" element={<NotFound />} /> {/* Temporarily using NotFound for account page */}
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/categories/:category/*" element={<CategoryPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <VoiceWidget />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </WishlistProvider>
  </QueryClientProvider>
);

export default App;
