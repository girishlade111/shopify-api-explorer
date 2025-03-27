
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryNav } from "@/components/CategoryNav";
import { Section } from "@/components/ui-components";
import { getProductsByCategory } from "@/lib/api";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronDown, SlidersHorizontal, ChevronRight } from "lucide-react";

type SortOption = {
  label: string;
  value: string;
  order: "asc" | "desc";
};

const sortOptions: SortOption[] = [
  { label: "Newest", value: "created_at", order: "desc" },
  { label: "Price: Low to High", value: "price", order: "asc" },
  { label: "Price: High to Low", value: "price", order: "desc" },
  { label: "Alphabetical: A-Z", value: "title", order: "asc" },
  { label: "Alphabetical: Z-A", value: "title", order: "desc" },
];

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [categoryPath, setCategoryPath] = useState<string[]>([]);
  
  useEffect(() => {
    if (category) {
      // Create breadcrumb from URL
      const parts = category.split("/");
      setCategoryPath(parts);
    }
  }, [category]);
  
  const fetchProducts = async (page: number = 1) => {
    if (!category) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get the category in the format the API expects (spaces instead of hyphens)
      // For the API, we need to convert from URL format to the format expected by the API
      // Example: clothing-tops -> clothing tops
      let categoryForApi: string;
      
      // Check if this is a nested category path
      if (category.includes("/")) {
        // If it's a full path, we just need the last part for the API
        const parts = category.split("/");
        const lastPart = parts[parts.length - 1].replace(/-/g, " ");
        categoryForApi = lastPart;
      } else {
        // Simple category
        categoryForApi = category.replace(/-/g, " ");
      }
      
      console.log("Fetching products for category:", categoryForApi);
      
      const response = await getProductsByCategory(
        categoryForApi,
        page,
        12,
        selectedSort.value,
        selectedSort.order
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
      console.error("Failed to fetch products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts(1);
  }, [category, selectedSort]);
  
  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchProducts(currentPage + 1);
    }
  };
  
  const getCategoryName = (path: string): string => {
    return path.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="container-wide py-4">
        <nav className="flex items-center text-sm text-muted">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3 mx-2" />
          
          {categoryPath.map((part, index) => (
            <div key={part} className="flex items-center">
              {index > 0 && <ChevronRight className="h-3 w-3 mx-2" />}
              <span className="text-dark">{getCategoryName(part)}</span>
            </div>
          ))}
        </nav>
      </div>
      
      <Section>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold">
            {categoryPath.length > 0 ? getCategoryName(categoryPath[categoryPath.length - 1]) : "Products"}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 text-sm"
              >
                Sort by: <span className="font-medium">{selectedSort.label}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showSortDropdown && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-medium border border-gray-100 py-2 z-10 min-w-[200px]">
                  {sortOptions.map(option => (
                    <button
                      key={option.label}
                      onClick={() => {
                        setSelectedSort(option);
                        setShowSortDropdown(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors",
                        option.value === selectedSort.value && option.order === selectedSort.order
                          ? "text-primary font-medium"
                          : "text-dark"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowFilterSidebar(!showFilterSidebar)}
              className="md:hidden flex items-center gap-2 bg-accent px-4 py-2 rounded-md"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>
        
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
                <CategoryNav activeCategory={category} />
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
              onRetry={() => fetchProducts()}
              cols={3}
            />
            
            {/* Load More Button */}
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
          </div>
        </div>
      </Section>
    </Layout>
  );
}
