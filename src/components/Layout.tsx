
import { useState, useEffect, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { cn } from "@/lib/utils";
import { ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu when route changes
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
    toast({
      title: "Account",
      description: "Account page is currently under development.",
    });
  };

  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;

  return (
    <div className="flex min-h-screen flex-col">
      <header 
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200",
          scrolled 
            ? "bg-white/80 backdrop-blur-md border-b border-gray-200/80 shadow-sm" 
            : "bg-transparent"
        )}
      >
        <div className="container-wide flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold tracking-tight">STORE</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink to="/categories/clothing-tops">Tops</NavLink>
              <NavLink to="/categories/dresses">Dresses</NavLink>
              <NavLink to="/categories/sweaters">Sweaters</NavLink>
              <NavLink to="/new-arrivals">New Arrivals</NavLink>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="w-64">
              <SearchBar />
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleWishlistClick}
                className="relative p-2 hover:text-primary transition-colors rounded-full"
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
                onClick={handleCartClick}
                className="relative p-2 hover:text-primary transition-colors rounded-full"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
              
              <button 
                onClick={handleAccountClick}
                className="p-2 hover:text-primary transition-colors rounded-full"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <button 
            className="md:hidden"
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
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white pt-16 animate-fade-in">
            <div className="container-wide py-6 flex flex-col space-y-6">
              <SearchBar />
              
              <nav className="flex flex-col space-y-4">
                <MobileNavLink to="/categories/clothing-tops">Tops</MobileNavLink>
                <MobileNavLink to="/categories/dresses">Dresses</MobileNavLink>
                <MobileNavLink to="/categories/sweaters">Sweaters</MobileNavLink>
                <MobileNavLink to="/new-arrivals">New Arrivals</MobileNavLink>
              </nav>
              
              <div className="flex space-x-4 pt-4 border-t border-gray-100">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={handleWishlistClick}
                >
                  <Heart className="h-5 w-5" />
                  <span>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={handleCartClick}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
                  onClick={handleAccountClick}
                >
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1">{children}</main>
      
      <footer className="bg-accent mt-24">
        <div className="container-wide py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">STORE</h3>
              <p className="text-muted text-sm">
                Discover the perfect blend of fashion and functionality with our curated collection.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Shop</h4>
              <ul className="space-y-2">
                <li><FooterLink to="/new-arrivals">New Arrivals</FooterLink></li>
                <li><FooterLink to="/categories/clothing-tops">Tops</FooterLink></li>
                <li><FooterLink to="/categories/dresses">Dresses</FooterLink></li>
                <li><FooterLink to="/categories/sweaters">Sweaters</FooterLink></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2">
                <li><FooterLink to="/about">About Us</FooterLink></li>
                <li><FooterLink to="/contact">Contact</FooterLink></li>
                <li><FooterLink to="/careers">Careers</FooterLink></li>
                <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Connect</h4>
              <div className="flex space-x-4">
                <IconButton aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </IconButton>
                <IconButton aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </IconButton>
                <IconButton aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </IconButton>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="bg-white border border-gray-200 rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-muted text-sm">
            <p>© {new Date().getFullYear()} STORE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const NavLink = ({ to, children }: { to: string; children: ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md relative",
        isActive 
          ? "text-primary bg-primary/5" 
          : "text-dark hover:bg-accent/60"
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 mx-auto w-1/2 h-0.5 bg-primary rounded-full" />
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
        "text-lg font-medium p-3 rounded-md transition-colors",
        isActive ? "text-primary bg-primary/5" : "text-dark hover:bg-accent"
      )}
    >
      {children}
    </Link>
  );
};

const FooterLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link
    to={to}
    className="text-sm text-muted hover:text-primary transition-colors"
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
      "flex items-center justify-center hover:text-primary rounded-full transition-colors p-2 relative",
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
