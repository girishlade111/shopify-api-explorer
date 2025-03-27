
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { getProducts } from "@/lib/api";
import { cn } from "@/lib/utils";

export function Hero() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await getProducts(1, 5);
        setFeaturedProducts(response.items);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (featuredProducts.length > 0) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
          setIsAnimating(false);
        }, 500);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  if (loading || featuredProducts.length === 0) {
    return (
      <div className="w-full h-[70vh] bg-accent animate-pulse flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const currentProduct = featuredProducts[currentIndex];
  const imageUrl = currentProduct.images && currentProduct.images.length > 0
    ? currentProduct.images[0].src
    : 'https://placehold.co/1200x800/f5f5f7/1d1d1f?text=No+Image';

  return (
    <div className="relative w-full h-[85vh] overflow-hidden bg-accent">
      <div 
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
          isAnimating ? "opacity-0" : "opacity-100"
        )}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      <div className="relative h-full container-wide flex flex-col justify-center">
        <div className="max-w-xl">
          <h1 
            className={cn(
              "text-white text-5xl md:text-6xl font-bold tracking-tight mb-4 transition-all duration-500",
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}
          >
            {currentProduct.title}
          </h1>
          
          <p 
            className={cn(
              "text-white/90 text-lg mb-8 line-clamp-3 transition-all duration-500 delay-100",
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}
          >
            {stripHtml(currentProduct.body_html)}
          </p>
          
          <div 
            className={cn(
              "flex space-x-4 transition-all duration-500 delay-200",
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}
          >
            <Link
              to={`/products/${currentProduct.handle}`}
              className="bg-white text-dark px-6 py-3 rounded-md font-medium hover:bg-white/90 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              to="/new-arrivals"
              className="bg-transparent border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
            >
              Explore More
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function stripHtml(html: string): string {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
}
