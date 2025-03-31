
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CartProvider } from "@/contexts/CartContext";
import { FittingRoomProvider } from "@/contexts/FittingRoomContext";
import { UserActivityProvider } from "@/contexts/UserActivityContext";
import { AppEnhancement } from "@/components/AppEnhancement";
import { ScrollToTop } from "@/components/ScrollToTop";
import Header from "./components/Header";
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
            <ScrollToTop />
            <UserActivityProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1 pt-[104px]">
                    <AppEnhancement />
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
                  </main>
                  {/* Footer moved here from Layout */}
                  <footer className="bg-black text-white mt-24">
                    <div className="container-wide py-16 md:py-24">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div>
                          <h3 className="font-serif text-2xl mb-6">ATELIER</h3>
                          <p className="text-gray-400 text-sm max-w-xs">
                            Discover the perfect blend of luxury and sophistication with our curated collections of fashion, beauty, and lifestyle products.
                          </p>
                          <div className="mt-8">
                            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Atelier. All rights reserved.</p>
                            <p className="text-xs text-gray-500 mt-1">123 Fashion Avenue, Milan, Italy</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-6 uppercase tracking-wider">Shop</h4>
                          <ul className="space-y-4">
                            <li><FooterLink to="/new-arrivals">New Arrivals</FooterLink></li>
                            <li><FooterLink to="/all-products/men">Men</FooterLink></li>
                            <li><FooterLink to="/all-products/women">Women</FooterLink></li>
                            <li><FooterLink to="/all-products/beauty">Beauty</FooterLink></li>
                            <li><FooterLink to="/all-products/food">Food</FooterLink></li>
                            <li><FooterLink to="/services">Services</FooterLink></li>
                            <li><FooterLink to="/all-products/sale">Sale</FooterLink></li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-6 uppercase tracking-wider">About</h4>
                          <ul className="space-y-4">
                            <li><FooterLink to="/about">Our Story</FooterLink></li>
                            <li><FooterLink to="/sustainability">Sustainability</FooterLink></li>
                            <li><FooterLink to="/careers">Careers</FooterLink></li>
                            <li><FooterLink to="/stores">Flagship Stores</FooterLink></li>
                            <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
                            <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-6 uppercase tracking-wider">Customer Care</h4>
                          <ul className="space-y-4">
                            <li><FooterLink to="/contact">Contact Us</FooterLink></li>
                            <li><FooterLink to="/faq">FAQ</FooterLink></li>
                            <li><FooterLink to="/shipping">Shipping & Returns</FooterLink></li>
                            <li><FooterLink to="/size-guide">Size Guide</FooterLink></li>
                          </ul>
                          
                          <div className="mt-12">
                            <h4 className="text-sm font-medium mb-6 uppercase tracking-wider">Connect With Us</h4>
                            <div className="flex space-x-4">
                              <IconButton aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                              </IconButton>
                              <IconButton aria-label="Twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                              </IconButton>
                              <IconButton aria-label="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                              </IconButton>
                              <IconButton aria-label="YouTube">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                              </IconButton>
                            </div>
                          </div>
                          
                          <div className="mt-12">
                            <h4 className="text-sm font-medium mb-4 uppercase tracking-wider">Newsletter</h4>
                            <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                            <div className="flex">
                              <input
                                type="email"
                                placeholder="Your email address"
                                className="bg-gray-900 border border-gray-800 text-white px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30"
                              />
                              <button className="bg-white text-black px-4 py-2 uppercase text-sm tracking-wider font-medium hover:bg-gray-200 transition-colors">
                                Subscribe
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-800 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex space-x-8 mb-8 md:mb-0">
                          <FooterLink to="/privacy">Privacy</FooterLink>
                          <FooterLink to="/terms">Terms</FooterLink>
                          <FooterLink to="/cookies">Cookie Policy</FooterLink>
                        </div>
                        <div className="flex items-center space-x-4">
                          <img src="https://via.placeholder.com/40x25" alt="Visa" className="h-6 opacity-50" />
                          <img src="https://via.placeholder.com/40x25" alt="Mastercard" className="h-6 opacity-50" />
                          <img src="https://via.placeholder.com/40x25" alt="American Express" className="h-6 opacity-50" />
                          <img src="https://via.placeholder.com/40x25" alt="PayPal" className="h-6 opacity-50" />
                        </div>
                      </div>
                    </div>
                  </footer>
                </div>
                <VoiceWidget />
              </TooltipProvider>
            </UserActivityProvider>
          </BrowserRouter>
        </FittingRoomProvider>
      </CartProvider>
    </WishlistProvider>
  </QueryClientProvider>
);

// Helper components for the footer
const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <a
    href={to}
    className="text-sm text-gray-400 hover:text-white transition-colors"
  >
    {children}
  </a>
);

interface IconButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  badgeCount?: number;
  [key: string]: any;
}

const IconButton = ({
  children,
  className,
  onClick,
  badgeCount,
  ...props
}: IconButtonProps) => (
  <button
    className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors ${className || ""}`}
    onClick={onClick}
    {...props}
  >
    {children}
    {badgeCount && badgeCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
        {badgeCount > 99 ? '99+' : badgeCount}
      </span>
    )}
  </button>
);

export default App;
