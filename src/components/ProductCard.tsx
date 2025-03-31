
import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { formatPrice, getProductThumbnail } from "@/lib/api";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
  featured?: boolean;
}

export function ProductCard({ product, className, featured = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const mainImage = getProductThumbnail(product);
  const secondaryImage = product.images && product.images.length > 1 ? product.images[1].src : mainImage;
  
  // Get the lowest price from variants
  const getProductPrice = (): string => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(variant => parseFloat(variant.price));
      const lowestPrice = Math.min(...prices);
      return formatPrice(lowestPrice.toString());
    }
    return 'Price unavailable';
  };
  
  // Check if product has multiple variants
  const hasVariants = product.variants && product.variants.length > 1;

  // Get default variant for quick add to cart
  const getDefaultVariant = () => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0];
    }
    return null;
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = getDefaultVariant();
    if (defaultVariant) {
      addToCart(product, defaultVariant, 1);
      toast({
        title: "Added to Cart",
        description: `${product.title} has been added to your cart`,
      });
    }
  };
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (productInWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.title} has been removed from your wishlist`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to Wishlist",
        description: `${product.title} has been added to your wishlist`,
      });
    }
  };
  
  const productInWishlist = isInWishlist(product.id);
  
  return (
    <div 
      className={cn(
        "group relative bg-white overflow-hidden transition-all duration-300",
        featured ? "shadow-soft hover:shadow-medium" : "hover:shadow-soft",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.handle}`} className="block">
        <div className={cn(
          "relative overflow-hidden aspect-[3/4]",
          !isImageLoaded && "bg-accent animate-pulse"
        )}>
          {/* Main Image */}
          <img
            src={mainImage}
            alt={product.title}
            className={cn(
              "w-full h-full object-cover object-center transition-opacity duration-500",
              !isImageLoaded && "opacity-0",
              isHovered ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Secondary Image (shown on hover) */}
          <img
            src={secondaryImage}
            alt={`${product.title} - alternate view`}
            className={cn(
              "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500",
              isHovered ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
          />
          
          {/* Quick actions overlay */}
          <div className={cn(
            "absolute top-0 right-0 p-3 flex flex-col gap-2 transition-all duration-300",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          )}>
            <button 
              className={cn(
                "w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center transition-colors",
                productInWishlist ? "text-primary" : "text-dark hover:text-primary"
              )}
              aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              onClick={handleWishlistToggle}
            >
              <Heart size={18} fill={productInWishlist ? "currentColor" : "none"} />
            </button>
            
            <button 
              className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-dark hover:text-primary transition-colors"
              aria-label="Quick view"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/products/${product.handle}`;
              }}
            >
              <Eye size={18} />
            </button>
          </div>
          
          {/* Product vendor badge */}
          {product.vendor && (
            <div className="absolute top-3 left-3">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-white/80 backdrop-blur-sm text-dark uppercase tracking-wider">
                {product.vendor}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4 text-center">
          <h3 className="font-medium text-dark text-sm uppercase tracking-wider mb-2 line-clamp-1">{product.title}</h3>
          
          <div className="flex items-center justify-center">
            <span className="font-light text-dark">{getProductPrice()}</span>
          </div>
        </div>
      </Link>
      
      {/* Add to cart button (shown on hover for desktop) */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 bg-white p-4 transform transition-transform duration-300 ease-in-out border-t border-gray-100",
        isHovered ? "translate-y-0" : "translate-y-full",
        "md:block hidden" // Only show on desktop
      )}>
        <button 
          className="w-full bg-primary text-white py-3 tracking-wider text-sm uppercase font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Bag
        </button>
      </div>
      
      {/* Mobile-only add to cart button */}
      <div className="md:hidden block p-4 pt-0">
        <button 
          className="w-full bg-primary text-white py-2 text-sm uppercase tracking-wider font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Bag
        </button>
      </div>
    </div>
  );
}
