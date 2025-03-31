
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
                src="https://cdn.media.amplience.net/i/liberty/250206-Womens-R2E2-Dresses-min?fmt=auto&qlt=default&w=800&h=1000" 
                alt="Dresses" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-2xl font-serif mb-2">Dresses</h3>
              <p className="text-white/80 mb-4 max-w-xs">Elegant dresses for every occasion from casual to formal</p>
              <Link 
                to="/all-products/women/dresses" 
                className="inline-flex items-center text-white bg-primary/20 backdrop-blur-sm px-4 py-2 border border-white/30 hover:bg-primary/40 transition-colors"
              >
                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="group relative overflow-hidden">
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src="https://cdn.media.amplience.net/i/liberty/250320-Womens-R2E4-Coats-And-Jackets-min?fmt=auto&qlt=default&w=800&h=1000" 
                alt="Coats & Jackets" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-2xl font-serif mb-2">Coats & Jackets</h3>
              <p className="text-white/80 mb-4 max-w-xs">Premium outerwear to keep you stylish in any weather</p>
              <Link 
                to="/all-products/women/coats-jackets" 
                className="inline-flex items-center text-white bg-primary/20 backdrop-blur-sm px-4 py-2 border border-white/30 hover:bg-primary/40 transition-colors"
              >
                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="group relative overflow-hidden">
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src="https://cdn.media.amplience.net/i/liberty/241211-Womens-R2E6-Tops?fmt=auto&qlt=default&w=800&h=1000" 
                alt="Tops" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-2xl font-serif mb-2">Tops</h3>
              <p className="text-white/80 mb-4 max-w-xs">Versatile tops to complete any outfit with style</p>
              <Link 
                to="/all-products/women/tops" 
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
