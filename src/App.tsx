
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Layout } from '@/components/Layout';
import Header from '@/components/Header';
import Index from '@/pages/Index';
import ProductDetail from '@/pages/ProductDetail';
import SearchResults from '@/pages/SearchResults';
import CategoryPage from '@/pages/CategoryPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import NotFound from '@/pages/NotFound';
import WishlistPage from '@/pages/WishlistPage';
import UserProfilePage from '@/pages/UserProfilePage';
import FittingRoomPage from '@/pages/FittingRoomPage';
import NewArrivalsPage from '@/pages/NewArrivalsPage';
import ServicesPage from '@/pages/ServicesPage';
import ChatPage from '@/pages/ChatPage';

import { UserActivityProvider } from '@/contexts/UserActivityContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { FittingRoomProvider } from '@/contexts/FittingRoomContext';

import { ScrollToTop } from '@/components/ScrollToTop';
import VoiceWidget from '@/components/VoiceWidget';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CartProvider>
          <WishlistProvider>
            <FittingRoomProvider>
              <UserActivityProvider>
                <ScrollToTop />
                <Header />
                <Routes>
                  <Route element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="product/:id" element={<ProductDetail />} />
                    <Route path="search" element={<SearchResults />} />
                    <Route path="category/:id" element={<CategoryPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                    <Route path="profile" element={<UserProfilePage />} />
                    <Route path="fitting-room" element={<FittingRoomPage />} />
                    <Route path="new-arrivals" element={<NewArrivalsPage />} />
                    <Route path="services" element={<ServicesPage />} />
                    <Route path="chat" element={<ChatPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
                <VoiceWidget />
              </UserActivityProvider>
            </FittingRoomProvider>
          </WishlistProvider>
        </CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
