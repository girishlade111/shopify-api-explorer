import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryFilters } from "@/components/CategoryFilters";
import { SectionHeader } from "@/components/ui-components";
import { Product } from "@/types";
import { getProductsByCategory } from "@/lib/api";
import { LoadingState, ErrorState } from "@/components/ui-components";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

  return (
    <section className="category-content py-6">
      {loading && <LoadingState />}
      
      {!loading && error && <ErrorState error={error} onRetry={fetchProducts} />}
      
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
                    <React.Fragment key={index}>
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
                    </React.Fragment>
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
