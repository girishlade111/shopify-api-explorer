
import { useState, useEffect, Fragment } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryFilters } from "@/components/CategoryFilters";
import { SectionHeader } from "@/components/ui-components";
import { Product } from "@/types";
import { getProductsByCategory } from "@/lib/api";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loader2 } from "lucide-react";

interface BreadcrumbItemType {
  label: string;
  path: string;
}

export default function CategoryPage() {
  const location = useLocation();
  const { category } = useParams<{ category?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemType[]>([]);
  
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Type error fixed: API expects a string category and filter object
      const productsData = await getProductsByCategory(category || "all-products", filters);
      setProducts(productsData);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [category, filters]);
  
  useEffect(() => {
    // Construct breadcrumbs based on the current route
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    const newBreadcrumbs: BreadcrumbItemType[] = [
      { label: 'All Products', path: '/all-products' }
    ];
    
    let currentPath = '/all-products';
    
    if (category) {
      newBreadcrumbs.push({ label: category, path: `${currentPath}/${category}` });
    }
    
    setBreadcrumbs(newBreadcrumbs);
  }, [location.pathname, category]);

  // Determine if we should show breadcrumbs based on the path
  const shouldShowBreadcrumbs = () => {
    if (location.pathname.includes('/women') || 
        location.pathname.includes('/beauty') || 
        location.pathname.includes('/men') || 
        location.pathname.includes('/food')) {
      return false;
    }
    return true;
  };
  
  const handleFiltersChange = (newFilters: { [key: string]: string[] }) => {
    setFilters(newFilters);
  };

  // Custom LoadingState component since it wasn't available
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted">Loading products...</p>
    </div>
  );

  // Custom ErrorState component with correct props
  const ErrorState = ({ title, description, onRetry }: { 
    title: string;
    description?: string;
    onRetry?: () => void;
  }) => (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
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
          className="h-8 w-8 text-red-500"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      {description && <p className="text-muted mb-6 max-w-md">{description}</p>}
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

  return (
    <section className="category-content py-6">
      {loading && <LoadingState />}
      
      {!loading && error && (
        <ErrorState 
          title="Something went wrong"
          description={error}
          onRetry={fetchProducts} 
        />
      )}
      
      {!loading && !error && (
        <>
          {shouldShowBreadcrumbs() && (
            <div className="container-wide py-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  {breadcrumbs.map((breadcrumb, index) => (
                    <Fragment key={index}>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbItem>
                          <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                        </BreadcrumbItem>
                      ) : (
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link to={breadcrumb.path}>{breadcrumb.label}</Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      )}
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}
          
          <div className="container-wide">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <aside className="md:col-span-1">
                <CategoryFilters onChange={handleFiltersChange} />
              </aside>
              <div className="md:col-span-3">
                <ProductGrid products={products} loading={loading} error={error} onRetry={fetchProducts} cols={3} />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
