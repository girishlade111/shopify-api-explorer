
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryNav } from "@/components/CategoryNav";
import { Section, EmptyState } from "@/components/ui-components";
import { searchProducts } from "@/lib/api";
import { Product, Category } from "@/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "@/components/SearchBar";
import { SlidersHorizontal, X } from "lucide-react";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const categoryFilter = searchParams.get("category") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const { toast } = useToast();
  
  const fetchSearchResults = async (page: number = 1) => {
    if (!searchQuery) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchProducts(
        searchQuery,
        categoryFilter || undefined,
        undefined,
        undefined,
        "relevance",
        "desc",
        page,
        12
      );
      
      if (page === 1) {
        setProducts(response.items);
      } else {
        setProducts(prev => [...prev, ...response.items]);
      }
      
      setTotalProducts(response.total);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
    } catch (error) {
      console.error("Search failed:", error);
      setError("Failed to load search results. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load search results. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSearchResults(1);
  }, [searchQuery, categoryFilter]);
  
  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchSearchResults(currentPage + 1);
    }
  };
  
  const handleCategoryClick = (category: Category) => {
    const categoryName = category.name.toLowerCase().replace(/\s+/g, "-");
    setSearchParams({
      query: searchQuery,
      category: categoryName,
    });
  };
  
  const clearCategoryFilter = () => {
    setSearchParams({ query: searchQuery });
  };

  return (
    <Layout>
      <Section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">
              Search Results
            </h1>
            <SearchBar
              placeholder="Refine your search..."
              autoFocus={false}
              className="w-full"
            />
          </div>
          
          <button
            onClick={() => setShowFilterSidebar(!showFilterSidebar)}
            className="md:hidden flex items-center gap-2 bg-accent px-4 py-2 rounded-md"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
        
        {searchQuery && (
          <div className="mb-8">
            <div className="text-lg">
              Showing results for <span className="font-semibold">"{searchQuery}"</span>
            </div>
            
            {categoryFilter && (
              <div className="mt-2 flex">
                <div className="bg-accent rounded-full px-3 py-1 text-sm inline-flex items-center">
                  Category: {categoryFilter.replace(/-/g, " ")}
                  <button
                    onClick={clearCategoryFilter}
                    className="ml-2 hover:text-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar - shown by default on desktop, toggleable on mobile */}
          <div 
            className={cn(
              "md:col-span-3",
              showFilterSidebar 
                ? "fixed inset-0 z-50 bg-white md:static md:bg-transparent md:z-auto p-6 md:p-0 overflow-auto" 
                : "hidden md:block"
            )}
          >
            {showFilterSidebar && (
              <div className="flex items-center justify-between mb-6 md:hidden">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button 
                  onClick={() => setShowFilterSidebar(false)}
                  className="p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            )}
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <CategoryNav 
                  activeCategory={categoryFilter}
                  onCategoryClick={handleCategoryClick}
                />
              </div>
              
              {/* Price Filter */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="min-price" className="text-sm text-muted block mb-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      id="min-price"
                      placeholder="$0"
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="max-price" className="text-sm text-muted block mb-1">
                      Max Price
                    </label>
                    <input
                      type="number"
                      id="max-price"
                      placeholder="$1000"
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent"
                    />
                  </div>
                </div>
                <button className="w-full bg-accent text-dark mt-4 py-2 rounded-md font-medium hover:bg-accent/80 transition-colors">
                  Apply Filter
                </button>
              </div>
              
              {showFilterSidebar && (
                <div className="md:hidden mt-6">
                  <button
                    onClick={() => setShowFilterSidebar(false)}
                    className="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-9">
            {/* Products count */}
            {!loading && !error && products.length > 0 && (
              <div className="text-sm text-muted mb-6">
                Showing {products.length} of {totalProducts} products
              </div>
            )}
            
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              onRetry={() => fetchSearchResults()}
              emptyTitle={`No results found for "${searchQuery}"`}
              emptyDescription="Try checking your spelling or using more general terms."
              cols={3}
            />
            
            {/* Load More Button */}
            {!loading && !error && products.length > 0 && currentPage < totalPages && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  className="bg-accent text-dark px-6 py-3 rounded-md font-medium hover:bg-accent/80 transition-colors"
                >
                  Load More Results
                </button>
              </div>
            )}
          </div>
        </div>
      </Section>
    </Layout>
  );
}
