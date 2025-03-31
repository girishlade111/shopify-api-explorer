
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function BeautySection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center mb-16 relative">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Beauty Collection</h2>
            <p className="text-gray-600 mb-8 text-lg">Indulge in our luxurious beauty collection, meticulously formulated with the finest ingredients to enhance your natural radiance.</p>
            <Link 
              to="/all-products/beauty" 
              className="inline-flex items-center bg-primary text-white px-8 py-3 uppercase text-sm tracking-wider hover:bg-transparent hover:text-primary transition-colors border border-primary"
            >
              Discover Beauty <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="md:w-1/2 relative z-10">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.selfridges.com/is/image/selfridges/250305_CLP_BEAUTY_BANNER_1_D?wid=1232&hei=528&fmt=webp&qlt=80,1&dpr=on,2&fit=crop" 
                alt="Beauty Collection" 
                className="w-full h-auto transform transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
          
          <div className="absolute -right-40 -bottom-40 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full z-0"></div>
          <div className="absolute -left-40 -top-40 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full z-0"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="border border-gray-200 p-8 text-center hover:border-primary transition-colors group">
            <div className="h-64 mb-6 overflow-hidden">
              <img 
                src="https://cdn.media.amplience.net/i/liberty/241224-Beauty-R2E3-Makeup-min?fmt=auto&qlt=default&w=800&h=1000" 
                alt="Makeup" 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <h3 className="text-2xl font-serif mb-3">Makeup</h3>
            <p className="text-gray-600 mb-6">Enhance your natural beauty with our premium makeup collection</p>
            <Link to="/all-products/beauty/makeup" className="text-primary flex items-center justify-center font-medium group-hover:underline">
              Shop Makeup <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="border border-gray-200 p-8 text-center hover:border-primary transition-colors group">
            <div className="h-64 mb-6 overflow-hidden">
              <img 
                src="https://cdn.media.amplience.net/i/liberty/250327-Beauty-R2E2-Skincare-min?fmt=auto&qlt=default&w=800&h=1000" 
                alt="Skincare" 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <h3 className="text-2xl font-serif mb-3">Skincare</h3>
            <p className="text-gray-600 mb-6">Luxurious skincare formulated with the finest ingredients</p>
            <Link to="/all-products/beauty/skincare" className="text-primary flex items-center justify-center font-medium group-hover:underline">
              Shop Skincare <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="border border-gray-200 p-8 text-center hover:border-primary transition-colors group">
            <div className="h-64 mb-6 overflow-hidden">
              <img 
                src="https://cdn.media.amplience.net/i/liberty/241224-Beauty-R2E1-Fragrance-min?fmt=auto&qlt=default&w=800&h=1000" 
                alt="Fragrance" 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <h3 className="text-2xl font-serif mb-3">Fragrance</h3>
            <p className="text-gray-600 mb-6">Captivating scents that leave a lasting impression</p>
            <Link to="/all-products/beauty/fragrance" className="text-primary flex items-center justify-center font-medium group-hover:underline">
              Shop Fragrance <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
