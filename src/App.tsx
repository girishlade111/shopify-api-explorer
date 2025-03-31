
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CartProvider } from "@/contexts/CartContext";
import { FittingRoomProvider } from "@/contexts/FittingRoomContext";
import { UserActivityProvider } from "@/contexts/UserActivityContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import SearchResults from "./pages/SearchResults";
import NewArrivalsPage from "./pages/NewArrivalsPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import FittingRoomPage from "./pages/FittingRoomPage";
import UserProfilePage from "./pages/UserProfilePage";
import ServicesPage from "./pages/ServicesPage";
import VoiceWidget from "./components/VoiceWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WishlistProvider>
      <CartProvider>
        <FittingRoomProvider>
          <BrowserRouter>
            <UserActivityProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Layout>
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
                    <Route path="/fitting-room" element={<FittingRoomPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route path="/account" element={<UserProfilePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/categories" element={<CategoryPage />} />
                    <Route path="/categories/:category/*" element={<CategoryPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
                <VoiceWidget />
              </TooltipProvider>
            </UserActivityProvider>
          </BrowserRouter>
        </FittingRoomProvider>
      </CartProvider>
    </WishlistProvider>
  </QueryClientProvider>
);

export default App;
