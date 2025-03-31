
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function MensSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Image Side */}
          <div className="w-full md:w-1/2">
            <div className="relative overflow-hidden">
              <img 
                src="https://images.prismic.io/end-features/Z-UxJndAxsiBv-DI_19-03-25_MW-Curates__BrandPage_2400x1350.jpg" 
                alt="Men's Collection" 
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          </div>
          
          {/* Content Side */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="space-y-1">
              <p className="text-gray-500 uppercase tracking-wider text-sm">New Collection</p>
              <h2 className="text-3xl md:text-4xl font-serif">Men's FW24</h2>
            </div>
            
            <p className="text-gray-600 max-w-lg">
              Sophistication redefined through impeccable craftsmanship and timeless design. 
              Discover our latest menswear collection featuring contemporary classics for the modern man.
            </p>
            
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Link to="/all-products/men/tailoring" className="inline-flex items-center text-primary hover:underline">
                  Tailoring <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link to="/all-products/men/casual" className="inline-flex items-center text-primary hover:underline">
                  Casual <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link to="/all-products/men/accessories" className="inline-flex items-center text-primary hover:underline">
                  Accessories <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link to="/all-products/men/shoes" className="inline-flex items-center text-primary hover:underline">
                  Shoes <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              
              <Link 
                to="/all-products/men" 
                className="inline-block bg-black text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-primary transition-colors"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
