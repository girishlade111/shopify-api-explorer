
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function WomensSection() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-3">Women's Collection</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Timeless elegance meets contemporary design in our women's collection, crafted for the modern woman</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="group relative overflow-hidden">
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src="https://assets.armani.com/image/upload/v1737391559/SS25_AX_ADV_FASHION_GLOBAL_MW_03_1080x1350.jpg" 
                alt="Ready-to-Wear" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-2xl font-serif mb-2">Ready-to-Wear</h3>
              <p className="text-white/80 mb-4 max-w-xs">Sophisticated silhouettes that seamlessly transition from day to evening</p>
              <Link 
                to="/all-products/women/ready-to-wear" 
                className="inline-flex items-center text-white bg-primary/20 backdrop-blur-sm px-4 py-2 border border-white/30 hover:bg-primary/40 transition-colors"
              >
                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="group relative overflow-hidden">
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src="https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1728403167/HP_STORY_WOMENS_SPRING_SUMMER_2025_06.jpg" 
                alt="Evening" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-2xl font-serif mb-2">Evening</h3>
              <p className="text-white/80 mb-4 max-w-xs">Exquisite evening wear designed to make a statement at every special occasion</p>
              <Link 
                to="/all-products/women/evening" 
                className="inline-flex items-center text-white bg-primary/20 backdrop-blur-sm px-4 py-2 border border-white/30 hover:bg-primary/40 transition-colors"
              >
                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="group relative overflow-hidden">
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src="https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1736688632/2025_SS_GALLERY_WOMENS_21.jpg" 
                alt="Accessories" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-2xl font-serif mb-2">Accessories</h3>
              <p className="text-white/80 mb-4 max-w-xs">Refined accessories that add the perfect finishing touch to every ensemble</p>
              <Link 
                to="/all-products/women/accessories" 
                className="inline-flex items-center text-white bg-primary/20 backdrop-blur-sm px-4 py-2 border border-white/30 hover:bg-primary/40 transition-colors"
              >
                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            to="/all-products/women" 
            className="inline-block border border-primary bg-primary text-white px-8 py-3 uppercase text-sm tracking-wider hover:bg-transparent hover:text-primary transition-colors"
          >
            View All Womenswear
          </Link>
        </div>
      </div>
    </section>
  );
}
