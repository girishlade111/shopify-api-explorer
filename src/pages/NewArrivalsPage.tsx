
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { ProductGrid } from "@/components/ProductGrid";
import { Section, SectionHeader } from "@/components/ui-components";
import { getNewArrivals } from "@/lib/api";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
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

  // Filter products based on active tab
  const getFilteredProducts = () => {
    if (activeTab === "all") return products;
    
    // These are mock filters - in a real app you'd have category data from the API
    const categoryFilters: Record<string, (product: Product) => boolean> = {
      "tops": (product) => product.category?.toLowerCase().includes("top") || false,
      "dresses": (product) => product.category?.toLowerCase().includes("dress") || false,
      "bottoms": (product) => product.category?.toLowerCase().includes("bottom") || 
                             product.category?.toLowerCase().includes("pant") || 
                             product.category?.toLowerCase().includes("skirt") || false,
      "accessories": (product) => product.category?.toLowerCase().includes("accessory") ||
                                 product.category?.toLowerCase().includes("accessoire") || 
                                 product.category?.toLowerCase().includes("jewelry") || false,
    };
    
    return products.filter(categoryFilters[activeTab] || (() => true));
  };

  const filteredProducts = getFilteredProducts();

  return (
    <Layout>
      <Section>
        <SectionHeader
          title="New Arrivals"
          subtitle="Discover our latest additions to the collection"
          center
          className="mb-8"
        />
        
        <Tabs defaultValue="all" className="w-full mb-8" onValueChange={setActiveTab}>
          <div className="flex justify-center">
            <TabsList className="bg-accent/50 p-1 rounded-lg">
              <TabsTrigger 
                value="all" 
                className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="tops" 
                className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                Tops
              </TabsTrigger>
              <TabsTrigger 
                value="dresses" 
                className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                Dresses
              </TabsTrigger>
              <TabsTrigger 
                value="bottoms" 
                className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                Bottoms
              </TabsTrigger>
              <TabsTrigger 
                value="accessories" 
                className="px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
              >
                Accessories
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-6">
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={() => fetchNewArrivals()}
              cols={4}
            />
          </TabsContent>
          
          <TabsContent value="tops" className="mt-6">
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={() => fetchNewArrivals()}
              cols={4}
            />
          </TabsContent>
          
          <TabsContent value="dresses" className="mt-6">
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={() => fetchNewArrivals()}
              cols={4}
            />
          </TabsContent>
          
          <TabsContent value="bottoms" className="mt-6">
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={() => fetchNewArrivals()}
              cols={4}
            />
          </TabsContent>
          
          <TabsContent value="accessories" className="mt-6">
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={() => fetchNewArrivals()}
              cols={4}
            />
          </TabsContent>
        </Tabs>
        
        {!loading && !error && filteredProducts.length > 0 && currentPage < totalPages && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              className="bg-accent text-dark px-6 py-3 rounded-md font-medium hover:bg-accent/80 transition-colors"
            >
              Load More Products
            </button>
          </div>
        )}
        
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted mb-4">No products found in this category.</p>
            <button
              onClick={() => setActiveTab("all")}
              className="bg-primary text-white px-4 py-2 rounded-md"
            >
              View All Products
            </button>
          </div>
        )}
      </Section>
    </Layout>
  );
}
