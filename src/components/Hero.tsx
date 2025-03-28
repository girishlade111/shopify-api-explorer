
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Hero() {
  // Using a summery floral image for the hero background
  const heroImage = "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2076&q=80";

  return (
    <div className="relative w-full h-[85vh] overflow-hidden bg-accent">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      <div className="relative h-full container-wide flex flex-col justify-center">
        <div className="max-w-xl">
          <h1 className="text-white text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Summer Collection
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl mb-8">
            Discover Our New Arrivals
          </p>
          
          <div className="flex space-x-4">
            <Link
              to="/new-arrivals"
              className="bg-white text-dark px-6 py-3 rounded-md font-medium hover:bg-white/90 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              to="/all-products"
              className="bg-transparent border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
            >
              Explore More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
