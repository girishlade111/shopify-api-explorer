
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Search, Sparkles, Heart } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchBar } from "@/components/SearchBar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { wishlist } = useWishlist();
  const { getCartCount } = useCart();
  
  // Check if we're on the homepage
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const cartCount = getCartCount();
  const wishlistCount = wishlist.length;

  const mainCategories = [
    { name: "MENS", path: "/all-products/men" },
    { name: "WOMENS", path: "/all-products/women" },
    { name: "BEAUTY", path: "/all-products/beauty" },
    { name: "FOOD", path: "/all-products/food" },
    { name: "SERVICES", path: "/services" },
  ];

  return (
    <>
      <header 
        className="fixed w-full z-50 transition-all duration-300"
        style={{ 
          backgroundColor: isScrolled ? "white" : "transparent",
          padding: isScrolled ? "0.5rem 0" : "1.25rem 0"
        }}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button 
              className={`lg:hidden ${isScrolled ? "text-black" : "text-white"}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:translate-x-0">
              <Link to="/" className="block">
                <h1 className={`font-serif text-3xl md:text-4xl tracking-tight ${isScrolled ? "text-black" : "text-white"}`}>ATELIER</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8 items-center mx-auto">
              {mainCategories.map((category) => (
                <Link 
                  key={category.name}
                  to={category.path}
                  className={`nav-link text-sm uppercase tracking-wider font-medium ${
                    isScrolled ? "text-black" : "text-white"
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <button 
                aria-label="Search" 
                className={isScrolled ? "text-black" : "text-white"}
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </button>

              <Link 
                to="/fitting-room" 
                aria-label="AI Fitting Room" 
                className={isScrolled ? "text-black" : "text-white"}
              >
                <Sparkles className="w-5 h-5" />
              </Link>

              <Link 
                to="/wishlist" 
                className={`hidden md:block relative ${isScrolled ? "text-black" : "text-white"}`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link 
                to="/account" 
                className={`hidden md:block ${isScrolled ? "text-black" : "text-white"}`}
              >
                <User className="w-5 h-5" />
              </Link>

              <Link 
                to="/cart" 
                className={`relative ${isScrolled ? "text-black" : "text-white"}`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white absolute top-full left-0 w-full h-screen animate-fade-in">
            <div className="container-wide py-6">
              <nav className="flex flex-col space-y-6">
                {mainCategories.map((category) => (
                  <Link 
                    key={category.name}
                    to={category.path}
                    className="text-xl font-serif py-2 border-b border-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link 
                  to="/account" 
                  className="text-xl font-serif py-2 border-b border-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Account
                </Link>
                <Link 
                  to="/wishlist" 
                  className="text-xl font-serif py-2 border-b border-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <div className="p-6">
            <SearchBar autoFocus={true} placeholder="Search for products, brands, and more..." />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
