
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { getProducts } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        // In a real app, you would have a dedicated endpoint for best sellers
        // For now, we'll use the regular products endpoint and sort by popularity
        const response = await getProducts(1, 8, "popularity", "desc");
        setProducts(response.items);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
        setError("Failed to load best sellers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current: container } = scrollContainerRef;
      const scrollAmount = container.clientWidth * 0.7;
      
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <section className="py-24 w-full">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif mb-2">Best Sellers</h2>
          <p className="text-gray-500">Our most popular items loved by our customers</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-accent rounded-lg animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-3 text-sm uppercase tracking-wider"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-6 snap-x scrollbar-hide"
            >
              {products.map(product => (
                <div 
                  key={product.id} 
                  className="min-w-[280px] w-[280px] sm:min-w-[300px] sm:w-[300px] flex-shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            <div className="hidden md:block">
              <button 
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-medium flex items-center justify-center text-dark hover:text-primary transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-medium flex items-center justify-center text-dark hover:text-primary transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            to="/all-products" 
            className="inline-block border border-primary text-primary px-8 py-3 uppercase text-sm tracking-wider hover:bg-primary hover:text-white transition-colors"
          >
            View All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
