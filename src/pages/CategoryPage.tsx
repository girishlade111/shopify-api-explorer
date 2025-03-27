
import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryNav } from "@/components/CategoryNav";
import { Section } from "@/components/ui-components";
import { getCategories, getProductsByCategory } from "@/lib/api";
import { Category, Product } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronDown, SlidersHorizontal, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  const location = useLocation();
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
  const [categoryFullName, setCategoryFullName] = useState<string>("");
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  // Get the full path from URL
  const getFullPathFromUrl = (): string => {
    // Remove leading/trailing slashes and split by '/'
    const path = location.pathname
      .replace(/^\/categories\//, '')
      .replace(/\/$/, '');
    
    return path;
  };

  // Format path segments for display
  const formatPathSegment = (segment: string): string => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Create breadcrumb path segments
  const getBreadcrumbSegments = (): { label: string, path: string }[] => {
    const fullPath = getFullPathFromUrl();
    const segments = fullPath.split('/');
    
    return segments.map((segment, index) => {
      const path = '/categories/' + segments.slice(0, index + 1).join('/');
      return {
        label: formatPathSegment(segment),
        path
      };
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories(100);
        setAllCategories(categories);
        
        // Now that we have categories, find the matching one
        if (category) {
          const urlPath = getFullPathFromUrl();
          const urlSegments = urlPath.split('/');
          const lastSegment = urlSegments[urlSegments.length - 1];
          
          // Try to find an exact match for the last segment
          const matchedCategory = categories.find(cat => {
            const catSegments = cat.full_path
              .toLowerCase()
              .split(' > ')
              .map(seg => seg.replace(/[^a-z0-9]+/g, '-'));
            
            return catSegments.includes(lastSegment);
          });
          
          if (matchedCategory) {
            console.log("Found matching category:", matchedCategory.full_path);
            setCategoryFullName(matchedCategory.full_path);
          } else {
            console.error("Could not find matching category in:", categories);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    
    fetchCategories();
  }, [category]);

  useEffect(() => {
    if (location.pathname.includes('/categories/')) {
      const path = getFullPathFromUrl();
      const segments = path.split('/');
      setCategoryPath(segments);
    }
  }, [location.pathname]);
  
  const fetchProducts = async (page: number = 1) => {
    if (!category) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (categoryFullName) {
        console.log("Fetching products for category full name:", categoryFullName);
        
        const response = await getProductsByCategory(
          categoryFullName,
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
      } else {
        const segments = getFullPathFromUrl().split('/');
        const lastSegment = segments[segments.length - 1];
        const categoryName = formatPathSegment(lastSegment);
        
        console.log("Fallback: Fetching products for category name:", categoryName);
        
        const response = await getProductsByCategory(
          categoryName,
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
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if (category) {
      fetchProducts(1);
    }
  }, [category, selectedSort, categoryFullName]);
  
  const loadMore = () => {
    if (currentPage < totalPages) {
      fetchProducts(currentPage + 1);
    }
  };

  const breadcrumbSegments = getBreadcrumbSegments();
  const categoryTitle = breadcrumbSegments.length > 0 
    ? breadcrumbSegments[breadcrumbSegments.length - 1].label 
    : "Products";

  return (
    <Layout>
      <div className="container-wide py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            
            {breadcrumbSegments.map((segment, index) => (
              <BreadcrumbItem key={segment.path}>
                {index === breadcrumbSegments.length - 1 ? (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={segment.path}>
                      {segment.label}
                    </BreadcrumbLink>
                  </>
                )}
                {index < breadcrumbSegments.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <Section>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold">
            {categoryTitle}
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
                <CategoryNav activeCategory={getFullPathFromUrl()} />
              </div>
              
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
          
          <div className="md:col-span-9">
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
