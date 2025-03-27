import { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryNav } from "@/components/CategoryNav";
import { Section } from "@/components/ui-components";
import { getCategories, getProductsByCategory, getProducts } from "@/lib/api";
import { Category, Product } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
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
  const { "*": categoryPath } = useParams<{ "*": string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [categoryFullName, setCategoryFullName] = useState<string>("");
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  const fullPathFromUrl = categoryPath || "";
  const isRootCategory = !fullPathFromUrl;

  const formatPathSegment = (segment: string): string => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getBreadcrumbSegments = (): { label: string, path: string }[] => {
    if (!fullPathFromUrl) return [];
    
    const segments = fullPathFromUrl.split('/');
    
    return segments.map((segment, index) => {
      const path = '/categories/' + segments.slice(0, index + 1).join('/');
      return {
        label: formatPathSegment(segment),
        path
      };
    });
  };

  const findMatchingCategory = (categories: Category[], urlPath: string): Category | undefined => {
    if (!urlPath) return undefined;
    
    const urlSegments = urlPath.split('/');
    const lastSegment = urlSegments[urlSegments.length - 1];
    
    console.log(`Looking for category matching: ${lastSegment}`);
    
    return categories.find(cat => {
      const catSegments = cat.full_path
        .toLowerCase()
        .split(' > ')
        .map(seg => seg.replace(/[^a-z0-9]+/g, '-'));
      
      return catSegments.includes(lastSegment);
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories(100);
        setAllCategories(categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    if (allCategories.length > 0 && fullPathFromUrl) {
      const matchedCategory = findMatchingCategory(allCategories, fullPathFromUrl);
      
      if (matchedCategory) {
        console.log("Found matching category:", matchedCategory.full_path);
        setCategoryFullName(matchedCategory.full_path);
      } else {
        console.error("Could not find matching category for path:", fullPathFromUrl);
        setCategoryFullName("");
      }
    }
  }, [allCategories, fullPathFromUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (isRootCategory) {
          console.log("Fetching all products (no specific category)");
          const response = await getProducts(
            currentPage,
            12,
            selectedSort.value,
            selectedSort.order
          );
          
          if (currentPage === 1) {
            setProducts(response.items);
          } else {
            setProducts(prev => [...prev, ...response.items]);
          }
          
          setTotalProducts(response.total);
          setTotalPages(response.pages);
          setCurrentPage(response.page);
        } else if (categoryFullName) {
          console.log("Fetching products for category full name:", categoryFullName);
          
          const response = await getProductsByCategory(
            categoryFullName,
            currentPage,
            12,
            selectedSort.value,
            selectedSort.order
          );
          
          if (currentPage === 1) {
            setProducts(response.items);
          } else {
            setProducts(prev => [...prev, ...response.items]);
          }
          
          setTotalProducts(response.total);
          setTotalPages(response.pages);
          setCurrentPage(response.page);
        } else if (fullPathFromUrl) {
          const segments = fullPathFromUrl.split('/');
          const lastSegment = segments[segments.length - 1];
          const categoryName = formatPathSegment(lastSegment);
          
          console.log("Fallback: Fetching products for category name:", categoryName);
          
          const response = await getProductsByCategory(
            categoryName,
            currentPage,
            12,
            selectedSort.value,
            selectedSort.order
          );
          
          if (currentPage === 1) {
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
    
    fetchProducts();
  }, [categoryFullName, fullPathFromUrl, currentPage, selectedSort, isRootCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFullName, fullPathFromUrl, selectedSort]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleCategoryClick = (category: Category) => {
    console.log("Category clicked in CategoryPage:", category.full_path);
    setCategoryFullName(category.full_path);
    
    const path = category.full_path
      .split(" > ")
      .map(part => part.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
      .join("/");
      
    navigate(`/all-products/${path}`);
  };

  const breadcrumbSegments = getBreadcrumbSegments();
  const pageTitle = isRootCategory ? "All Products" : 
    (breadcrumbSegments.length > 0 ? breadcrumbSegments[breadcrumbSegments.length - 1].label : "Products");

  useEffect(() => {
    if (location.pathname === "/categories") {
      navigate("/all-products", { replace: true });
    } 
    else if (location.pathname.startsWith("/categories/")) {
      const newPath = location.pathname.replace("/categories/", "/all-products/");
      navigate(newPath, { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <Layout>
      <div className="container-wide py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {!isRootCategory && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/all-products">All Products</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            
            {breadcrumbSegments.map((segment, index) => (
              <BreadcrumbItem key={segment.path}>
                <BreadcrumbSeparator />
                {index === breadcrumbSegments.length - 1 ? (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={segment.path.replace("/categories/", "/all-products/")}>
                      {segment.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <Section>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold">
            {pageTitle}
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
                <CategoryNav 
                  activeCategory={fullPathFromUrl}
                  onCategoryClick={handleCategoryClick}
                />
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
              onRetry={() => {
                setCurrentPage(1);
                setCategoryFullName(categoryFullName);
              }}
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
