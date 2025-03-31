
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { NewArrivals } from "@/components/NewArrivals";
import { Section, SectionHeader, Loader, EmptyState, ErrorState } from "@/components/ui-components";
import { getProductByHandle, formatPrice } from "@/lib/api";
import { Product, ProductVariant } from "@/types";
import { cn } from "@/lib/utils";
import { Heart, Share2, ShoppingBag, ChevronRight } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getProductByHandle(handle);
        setProduct(data);
        
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].src);
        }
        
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    
    addToCart(product, selectedVariant, quantity);
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    
    addToWishlist(product);
  };

  const shareProduct = () => {
    if (!product) return;
    
    // This is a placeholder for share functionality
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert("Link copied to clipboard");
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-tight py-16">
          <Loader />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container-tight py-16">
          <ErrorState
            title="Product Not Found"
            description={error || "The product you're looking for does not exist or has been removed."}
            action={
              <Link
                to="/"
                className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Back to Home
              </Link>
            }
          />
        </div>
      </Layout>
    );
  }

  const { title, body_html, vendor, images, variants, options } = product;
  const productInWishlist = isInWishlist(product.id);
  
  const getBreadcrumbs = () => {
    if (!product.product_category) return [];
    
    const parts = product.product_category.split(" > ");
    return parts.map((part, index) => {
      const path = parts
        .slice(0, index + 1)
        .join(" > ")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      
      return {
        name: part,
        path: `/categories/${path}`,
      };
    });
  };
  
  const breadcrumbs = getBreadcrumbs();

  return (
    <Layout>
      <div className="container-wide py-4">
        <nav className="flex items-center text-sm text-muted">
          <Link to="/" className="hover:text-primary">Home</Link>
          
          {breadcrumbs && breadcrumbs.length > 0 && breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center">
              <ChevronRight className="h-3 w-3 mx-2" />
              {index === breadcrumbs.length - 1 ? (
                <span className="text-dark">{crumb.name}</span>
              ) : (
                <Link to={crumb.path} className="hover:text-primary">
                  {crumb.name}
                </Link>
              )}
            </div>
          ))}
          
          {breadcrumbs && breadcrumbs.length > 0 && (
            <>
              <ChevronRight className="h-3 w-3 mx-2" />
              <span className="text-dark line-clamp-1">{title}</span>
            </>
          )}
        </nav>
      </div>
      
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="aspect-square bg-accent/30 rounded-lg overflow-hidden">
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt={title}
                  className="w-full h-full object-contain p-4"
                />
              )}
            </div>
            
            {images && images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image.src)}
                    className={cn(
                      "aspect-square bg-accent/30 rounded border-2 overflow-hidden",
                      selectedImage === image.src
                        ? "border-primary"
                        : "border-transparent hover:border-gray-200"
                    )}
                  >
                    <img
                      src={image.src}
                      alt={`${title} - view ${image.position}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {vendor && (
              <div className="text-sm text-muted">
                {vendor}
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl font-semibold">{title}</h1>
            
            {selectedVariant && (
              <div className="text-2xl font-semibold">
                {formatPrice(selectedVariant.price)}
                
                {selectedVariant.compare_at_price && (
                  <span className="ml-2 text-muted line-through text-lg">
                    {formatPrice(selectedVariant.compare_at_price)}
                  </span>
                )}
              </div>
            )}
            
            {options && options.length > 0 && (
              <div className="space-y-4">
                {options.map((option) => (
                  <div key={option.id}>
                    <h3 className="text-sm font-medium mb-2">{option.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {option.values && option.values.map((value) => {
                        const variantWithOption = variants?.find(
                          (v) =>
                            v[`option${option.position}` as keyof ProductVariant] === value
                        );
                        
                        const isSelected = selectedVariant 
                          ? selectedVariant[`option${option.position}` as keyof ProductVariant] === value
                          : false;
                        
                        return (
                          <button
                            key={value}
                            onClick={() => variantWithOption && setSelectedVariant(variantWithOption)}
                            className={cn(
                              "px-4 py-2 rounded border text-sm font-medium transition-colors",
                              isSelected
                                ? "bg-dark text-white border-dark"
                                : "bg-white text-dark border-gray-200 hover:border-dark"
                            )}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-l-md"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 h-10 border-y border-gray-200 text-center focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-r-md"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-white py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </button>
              
              <button
                onClick={handleAddToWishlist}
                className={cn(
                  "w-12 h-12 border border-gray-200 rounded-md flex items-center justify-center transition-colors",
                  productInWishlist ? "text-primary" : "text-dark hover:text-primary"
                )}
              >
                <Heart className="h-5 w-5" fill={productInWishlist ? "currentColor" : "none"} />
              </button>
              
              <button
                onClick={shareProduct}
                className="w-12 h-12 border border-gray-200 rounded-md flex items-center justify-center text-dark hover:text-primary transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <div 
                className="text-dark prose prose-sm max-w-none" 
                dangerouslySetInnerHTML={{ __html: body_html || 'No description available.' }}
              />
            </div>
          </div>
        </div>
      </Section>
      
      <Section>
        <SectionHeader
          title="You might also like"
          subtitle="Products similar to this one"
          align="center"
        />
        <NewArrivals />
      </Section>
    </Layout>
  );
}
