
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { NewArrivals } from "@/components/NewArrivals";
import { ProductGrid } from "@/components/ProductGrid";
import { CategoryNav } from "@/components/CategoryNav";
import { SectionHeader, Section } from "@/components/ui-components";
import { getProducts, getCategories } from "@/lib/api";
import { Product, Category } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Clock, Truck, Shield } from "lucide-react";

export default function Index() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await getProducts(1, 6);
        setTrendingProducts(response.items);
      } catch (error) {
        console.error("Failed to fetch trending products:", error);
        setError("Failed to load trending products. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load trending products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, [toast]);

  return (
    <Layout>
      <Hero />
      
      <NewArrivals />
      
      <Section className="w-full">
        <div className="container-wide">
          <SectionHeader 
            title="Trending Products" 
            subtitle="Our most popular items based on sales"
            center
          />
          
          <ProductGrid 
            products={trendingProducts} 
            loading={loading} 
            error={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </Section>
      
      <Section className="bg-accent w-full">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<ShoppingBag className="h-8 w-8" />}
              title="Curated Selection"
              description="Handpicked products from top designers around the world."
            />
            <FeatureCard 
              icon={<Clock className="h-8 w-8" />}
              title="Fast Delivery"
              description="Get your order delivered within 2-3 business days."
            />
            <FeatureCard 
              icon={<Truck className="h-8 w-8" />}
              title="Free Shipping"
              description="Free shipping on all orders over $50."
            />
            <FeatureCard 
              icon={<Shield className="h-8 w-8" />}
              title="Secure Payment"
              description="Your payment information is always safe with us."
            />
          </div>
        </div>
      </Section>
      
      <Section className="w-full">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-3">
              <h3 className="text-xl font-semibold mb-4">Shop by Category</h3>
              <CategoryNav />
            </div>
            
            <div className="lg:col-span-9">
              <div className="relative h-[500px] rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                  alt="Shop collection" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent flex flex-col justify-end p-8">
                  <span className="text-white/80 text-sm uppercase tracking-wider mb-2">
                    Summer Collection
                  </span>
                  <h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
                    New Season Arrivals
                  </h2>
                  <p className="text-white/90 mb-6 max-w-md">
                    Discover our latest collection featuring stunning designs for the upcoming season.
                  </p>
                  <a 
                    href="/new-arrivals"
                    className="bg-white text-dark px-6 py-3 rounded-md inline-block font-medium hover:bg-white/90 transition-colors max-w-max"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
      
      <Section className="bg-dark text-white w-full">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join Our Community
              </h2>
              <p className="text-white/80 mb-6">
                Subscribe to our newsletter for the latest updates, exclusive offers, and first access to new arrivals.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white/10 border border-white/20 rounded-l-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                />
                <button className="bg-primary text-white px-6 py-3 rounded-r-md hover:bg-primary/90 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Help & Info</h3>
                <ul className="space-y-2">
                  <li><FooterLink href="/about">About Us</FooterLink></li>
                  <li><FooterLink href="/contact">Contact Us</FooterLink></li>
                  <li><FooterLink href="/shipping">Shipping & Returns</FooterLink></li>
                  <li><FooterLink href="/faq">FAQs</FooterLink></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <SocialButton aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </SocialButton>
                  <SocialButton aria-label="Twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </SocialButton>
                  <SocialButton aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </SocialButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white rounded-lg p-6 shadow-soft flex flex-col items-center text-center transition-transform hover:scale-105">
    <div className="bg-primary/10 rounded-full p-4 mb-4">
      <div className="text-primary">{icon}</div>
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted text-sm">{description}</p>
  </div>
);

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <a href={href} className="text-white/70 hover:text-white transition-colors">
    {children}
  </a>
);

const SocialButton = ({ children, ...props }: { children: React.ReactNode, [key: string]: any }) => (
  <button 
    className="bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-full"
    {...props}
  >
    {children}
  </button>
);
