
import { Layout } from "@/components/Layout";
import { useFittingRoom, FittingRoomProduct } from "@/contexts/FittingRoomContext";
import { formatPrice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FittingRoomIcon from "@/components/icons/FittingRoom";
import { ArrowLeft, ExternalLink, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function FittingRoomPage() {
  const { products, tabs, clearProducts } = useFittingRoom();
  const { addToCart } = useCart();
  const [viewType, setViewType] = useState<"grid" | "compare">("grid");
  const [activeTabId, setActiveTabId] = useState<string>(tabs.length > 0 ? tabs[0].id : "");

  const handleAddToCart = (productId: number, variantId: number) => {
    // We don't have the full product data here, so we create a minimal version
    const product = products.find(p => p.product_id === productId);
    if (!product) return;
    
    // Create minimal product and variant objects
    const minimalProduct = {
      id: product.product_id,
      title: product.title,
      images: [{ src: product.image_url }],
      handle: product.link.split('/products/')[1]?.split('?')[0] || '',
    };

    const minimalVariant = {
      id: product.variant_id,
      product_id: product.product_id,
      title: product.title,
      price: product.price.toString(),
    };

    addToCart(minimalProduct as any, minimalVariant as any, 1);
  };

  const renderProductGrid = (productSet: FittingRoomProduct[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productSet.map((product) => (
        <Card key={product.variant_id} className="overflow-hidden">
          <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
            <img
              src={product.image_url}
              alt={product.title}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-1">{product.title}</h3>
            <p className="font-semibold text-primary">{formatPrice(product.price.toString())}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Button variant="outline" className="flex-1" asChild>
              <a href={product.link} target="_blank" rel="noopener noreferrer">
                View Details
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button 
              className="flex-1"
              onClick={() => handleAddToCart(product.product_id, product.variant_id)}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderCompareTable = (productSet: FittingRoomProduct[]) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Product</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {productSet.map((product) => (
            <tr key={product.variant_id} className="border-b">
              <td className="p-4">
                <div className="w-20 h-20 overflow-hidden rounded">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              </td>
              <td className="p-4 font-medium">{product.title}</td>
              <td className="p-4 font-semibold text-primary">
                {formatPrice(product.price.toString())}
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={product.link} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleAddToCart(product.product_id, product.variant_id)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FittingRoomIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Virtual Fitting Room</h1>
          </div>
          <div className="flex gap-2">
            {products.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearProducts}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shopping
              </Link>
            </Button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FittingRoomIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your fitting room is empty</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Try asking the assistant to find clothing items for you to try on virtually.
            </p>
            <Button asChild>
              <Link to="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* View Type Selector */}
            <div className="flex justify-end">
              <Tabs value={viewType} onValueChange={(value) => setViewType(value as "grid" | "compare")}>
                <TabsList>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="compare">Compare</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Product Set Tabs */}
            <Tabs 
              value={activeTabId} 
              onValueChange={setActiveTabId}
              className="w-full"
            >
              <TabsList className="mb-6 flex flex-wrap">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex-grow">
                    {tab.name} ({tab.products.length})
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <div className="mb-4">
                    <p className="text-muted-foreground">
                      {tab.products.length} item{tab.products.length !== 1 ? "s" : ""} added {new Date(tab.timestamp).toLocaleString()}
                    </p>
                  </div>
                  
                  {viewType === "grid" ? renderProductGrid(tab.products) : renderCompareTable(tab.products)}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
}
