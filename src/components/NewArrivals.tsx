
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { getNewArrivals } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { SectionHeader } from "./ui-components";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await getNewArrivals(1, 8);
        setProducts(response.items);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
        setError("Failed to load new arrivals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
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
    <section className="py-16 w-full">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-8">
          <SectionHeader 
            title="New Arrivals" 
            subtitle="Our latest products, hot off the press" 
          />
          
          <Link 
            to="/new-arrivals" 
            className="hidden md:inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
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
              className="bg-primary text-white px-4 py-2 rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="relative">
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-4 pb-6 snap-x scrollbar-hide"
            >
              {products.map(product => (
                <div 
                  key={product.id} 
                  className="min-w-[220px] w-[220px] sm:min-w-[240px] sm:w-[240px] md:min-w-[260px] md:w-[260px] flex-shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            <div className="hidden md:block">
              <button 
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-medium flex items-center justify-center text-dark hover:text-primary transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-medium flex items-center justify-center text-dark hover:text-primary transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Link 
            to="/new-arrivals" 
            className="inline-block bg-accent text-dark px-6 py-3 rounded-md font-medium hover:bg-accent/80 transition-colors"
          >
            View All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
