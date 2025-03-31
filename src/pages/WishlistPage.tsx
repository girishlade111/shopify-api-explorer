
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();

  return (
    <div className="container-wide py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">My Wishlist</h1>
        
        {wishlist.length > 0 && (
          <Button 
            variant="outline" 
            onClick={clearWishlist}
            className="flex items-center gap-2 text-black"
          >
            <Trash2 size={16} />
            Clear Wishlist
          </Button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-accent/50 rounded-lg">
          <h2 className="text-xl font-medium mb-4">Your wishlist is empty</h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Browse our catalog and mark your favorite items to add them to your wishlist.
          </p>
          <Link to="/">
            <Button className="text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
