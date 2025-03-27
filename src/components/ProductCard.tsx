
import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { formatPrice, getProductThumbnail } from "@/lib/api";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
  className?: string;
  featured?: boolean;
}

export function ProductCard({ product, className, featured = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  
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
  
  const handleAddToCart = () => {
    const defaultVariant = getDefaultVariant();
    if (defaultVariant) {
      addToCart(product, defaultVariant, 1);
    }
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };
  
  const productInWishlist = isInWishlist(product.id);
  
  return (
    <div 
      className={cn(
        "group relative bg-white rounded-lg overflow-hidden transition-all duration-300",
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
              "w-full h-full object-cover object-center transition-opacity duration-300",
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
              "absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300",
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
                "w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center transition-colors",
                productInWishlist ? "text-primary" : "text-dark hover:text-primary"
              )}
              aria-label={productInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              onClick={handleAddToWishlist}
            >
              <Heart size={18} fill={productInWishlist ? "currentColor" : "none"} />
            </button>
            <Link 
              to={`/products/${product.handle}`}
              className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center text-dark hover:text-primary transition-colors"
              aria-label="Quick view"
            >
              <Eye size={18} />
            </Link>
          </div>
          
          {/* Product vendor badge */}
          {product.vendor && (
            <div className="absolute top-3 left-3">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-white/80 backdrop-blur-sm rounded text-dark">
                {product.vendor}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-dark mb-1 line-clamp-2">{product.title}</h3>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold text-dark">{getProductPrice()}</span>
            
            {hasVariants && (
              <span className="text-xs text-muted">
                {product.variants.length} variants
              </span>
            )}
          </div>
        </div>
      </Link>
      
      {/* Add to cart button (shown on hover for desktop) */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 transform transition-transform duration-300 ease-in-out",
        isHovered ? "translate-y-0" : "translate-y-full",
        "md:block hidden" // Only show on desktop
      )}>
        <button 
          className="w-full bg-primary text-white py-2 rounded font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Cart
        </button>
      </div>
      
      {/* Mobile-only add to cart button */}
      <div className="md:hidden block p-4 pt-0">
        <button 
          className="w-full bg-primary text-white py-2 rounded font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
