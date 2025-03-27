
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { Loader, EmptyState } from "./ui-components";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  cols?: 2 | 3 | 4;
}

export function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting your search or filter to find what you're looking for.",
  className,
  cols = 3,
}: ProductGridProps) {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Apply transition effect when products change
  useEffect(() => {
    if (products !== displayProducts && !loading) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayProducts(products);
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [products, loading, displayProducts]);

  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  if (loading) {
    return (
      <div className={cn("grid gap-6 md:gap-8", gridCols[cols], className)}>
        {[...Array(cols * 2)].map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="aspect-[3/4] bg-accent rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="rounded-full bg-red-100 p-3 mx-auto mb-4 w-max">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
        <p className="text-muted mb-6 max-w-md mx-auto">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={
          onRetry && (
            <button
              onClick={onRetry}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          )
        }
      />
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6 md:gap-8 transition-opacity duration-300",
        isTransitioning ? "opacity-50" : "opacity-100",
        gridCols[cols],
        className
      )}
    >
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
