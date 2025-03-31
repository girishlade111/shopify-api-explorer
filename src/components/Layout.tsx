import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { cn } from "@/lib/utils";
import { ShoppingBag, Heart, User, Menu, X, Sparkles, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "./ui/separator";
import FittingRoom from "./icons/FittingRoom";
import { Dialog, DialogContent } from "./ui/dialog";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { wishlist } = useWishlist();
  const { getCartCount } = useCart();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleWishlistClick = () => {
    navigate("/wishlist");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleAccountClick = () => {
    navigate("/account");
  };

  const handleFittingRoomClick = () => {
    navigate("/fitting-room");
  };
  
  const handleSearchClick = () => {
    setSearchDialogOpen(true);
  };

  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;

  return (
    <div className="flex min-h-screen flex-col">
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled 
            ? "bg-white border-b border-gray-200 text-dark py-2" 
            : "bg-transparent text-white py-4"
        }`}
      >
        <div className="container-wide flex items-center justify-between">
          {/* Left Section - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className={`font-serif text-3xl sm:text-4xl tracking-tight ${!scrolled ? "text-white" : ""}`}>ATELIER</span>
            </Link>
          </div>
          
          {/* Center Section - Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink to="/all-products/men">MENS</NavLink>
            <NavLink to="/all-products/women">WOMENS</NavLink>
            <NavLink to="/all-products/beauty">BEAUTY</NavLink>
            <NavLink to="/all-products/food">FOOD</NavLink>
            <NavLink to="/services">SERVICES</NavLink>
          </nav>
          
          {/* Right Section - Icons */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={handleSearchClick}
              className={`p-2 transition-colors rounded-full ${
                scrolled ? "hover:text-primary" : "text-white hover:text-white/80"
              }`}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <button 
              onClick={handleFittingRoomClick}
              className={`p-2 transition-colors rounded-full ${
                scrolled ? "hover:text-primary" : "text-white hover:text-white/80"
              }`}
              aria-label="AI Fitting Room"
            >
              <Sparkles className="h-5 w-5" />
            </button>
            
            <button 
              onClick={handleWishlistClick}
              className={`relative p-2 transition-colors rounded-full ${
                scrolled ? "hover:text-primary" : "text-white hover:text-white/80"
              }`}
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            
            <button 
              onClick={handleAccountClick}
              className={`p-2 transition-colors rounded-full ${
                scrolled ? "hover:text-primary" : "text-white hover:text-white/80"
              }`}
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </button>
            
            <button 
              onClick={handleCartClick}
              className={`relative p-2 transition-colors rounded-full ${
                scrolled ? "hover:text-primary" : "text-white hover:text-white/80"
              }`}
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
          
          <button 
            className={`lg:hidden ${!scrolled ? "text-white" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white pt-16 animate-fade-in">
            <div className="container-wide py-6 flex flex-col space-y-6">
              <div className="flex items-center justify-center pb-4">
                <button 
                  onClick={handleSearchClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                >
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </button>
              </div>
              
              <nav className="flex flex-col space-y-4">
                <MobileNavLink to="/all-products/men">MENS</MobileNavLink>
                <MobileNavLink to="/all-products/women">WOMENS</MobileNavLink>
                <MobileNavLink to="/all-products/beauty">BEAUTY</MobileNavLink>
                <MobileNavLink to="/all-products/food">FOOD</MobileNavLink>
                <MobileNavLink to="/services">SERVICES</MobileNavLink>
                <MobileNavLink to="/new-arrivals">NEW ARRIVALS</MobileNavLink>
                <MobileNavLink to="/all-products">ALL PRODUCTS</MobileNavLink>
              </nav>
              
              <div className="flex flex-col space-y-4 pt-4 border-t border-gray-100">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={handleFittingRoomClick}
                >
                  <Sparkles className="h-5 w-5" />
                  <span>AI Fitting Room</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={handleWishlistClick}
                >
                  <Heart className="h-5 w-5" />
                  <span>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={handleAccountClick}
                >
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={handleCartClick}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1">{children}</main>
      
      {/* Search Dialog */}
      <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <div className="p-6">
            <SearchBar autoFocus={true} placeholder="Search for products, brands, and more..." />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Footer */}
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
  );
}

// Navigation link component with transparent/scrolled state awareness
const NavLink = ({ to, children }: { to: string; children: ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <Link
      to={to}
      className={cn(
        "text-sm tracking-wider transition-colors relative px-1 py-1",
        scrolled ? "font-normal" : "font-medium",
        isActive 
          ? scrolled ? "text-primary" : "text-white" 
          : scrolled ? "text-dark hover:text-primary" : "text-white hover:text-white/80"
      )}
    >
      {children}
      {isActive && (
        <span className={`absolute bottom-0 left-0 right-0 h-[1px] ${scrolled ? 'bg-primary' : 'bg-white'}`} />
      )}
    </Link>
  );
};

const MobileNavLink = ({ to, children }: { to: string; children: ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link
      to={to}
      className={cn(
        "text-lg font-light p-3 tracking-wider transition-colors",
        isActive ? "text-primary" : "text-dark hover:text-primary"
      )}
    >
      {children}
    </Link>
  );
};

const FooterLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link
    to={to}
    className="text-sm text-gray-400 hover:text-white transition-colors"
  >
    {children}
  </Link>
);

interface IconButtonProps {
  children: ReactNode;
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
    className={cn(
      "flex items-center justify-center w-10 h-10 rounded-full border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors",
      className
    )}
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
