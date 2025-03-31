
import { Link } from "react-router-dom";

export function SeasonalHighlights() {
  return (
    <section className="py-24">
      <div className="container-wide">
        <h2 className="text-4xl md:text-5xl font-serif mb-2 text-center">Summer Highlights</h2>
        <p className="text-muted mb-16 text-center">Discover our favorite selections for the summer season</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
            
            <img 
              src="https://assets.armani.com/image/upload/v1738145290/SS25_EA_ADV_GLOBAL_FASHION_M_01_1080_x_1350.jpg" 
              alt="Mens Summer Collection" 
              className="w-full h-[500px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            
            <div className="absolute bottom-10 left-10 z-20">
              <h3 className="text-white text-3xl md:text-4xl font-serif mb-3">Men's Summer Collection</h3>
              <p className="text-white/80 mb-6 max-w-xs">Refined elegance and contemporary style for the modern man</p>
              <Link 
                to="/all-products/men/summer" 
                className="bg-white text-primary px-8 py-3 inline-block uppercase text-sm tracking-wider hover:bg-white/90 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
          
          <div className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
            
            <img 
              src="https://assets.armani.com/image/upload/v1737391559/SS25_AX_ADV_FASHION_GLOBAL_MW_03_1080x1350.jpg" 
              alt="Womens Summer Collection" 
              className="w-full h-[500px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            
            <div className="absolute bottom-10 left-10 z-20">
              <h3 className="text-white text-3xl md:text-4xl font-serif mb-3">Women's Summer Collection</h3>
              <p className="text-white/80 mb-6 max-w-xs">Effortless sophistication and timeless beauty for summer days</p>
              <Link 
                to="/all-products/women/summer" 
                className="bg-white text-primary px-8 py-3 inline-block uppercase text-sm tracking-wider hover:bg-white/90 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
