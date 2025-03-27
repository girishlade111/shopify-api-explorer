
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ProductGrid } from "@/components/ProductGrid";
import { Section, SectionHeader } from "@/components/ui-components";
import { getNewArrivals } from "@/lib/api";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchNewArrivals = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getNewArrivals(page, 12);
      
      if (page === 1) {
        setProducts(response.items);
      } else {
        setProducts(prev => [...prev, ...response.items]);
      }
      
      setTotalPages(response.pages);
      setCurrentPage(response.page);
    } catch (error) {
      console.error("Failed to fetch new arrivals:", error);
      setError("Failed to load new arrivals. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load new arrivals. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchNewArrivals(currentPage + 1);
    }
  };

  return (
    <Layout>
      <Section>
        <SectionHeader
          title="New Arrivals"
          subtitle="Discover our latest additions to the collection"
          center
          className="mb-8"
        />
        
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={() => fetchNewArrivals()}
          cols={4}
        />
        
        {!loading && !error && products.length > 0 && currentPage < totalPages && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              className="bg-accent text-dark px-6 py-3 rounded-md font-medium hover:bg-accent/80 transition-colors"
            >
              Load More Products
            </button>
          </div>
        )}
        
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted mb-4">No products found.</p>
          </div>
        )}
      </Section>
    </Layout>
  );
}
