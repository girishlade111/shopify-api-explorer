
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function MensSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-[#111] -z-10"></div>
      
      {/* Hero Image and Content */}
      <div className="container-wide mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-white space-y-6 order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight">Men's Collection FW24</h2>
            <p className="text-white/80 text-lg max-w-md">
              Sophistication redefined through impeccable craftsmanship and timeless design. Discover our latest menswear collection.
            </p>
            <div className="pt-4">
              <Link 
                to="/all-products/men" 
                className="inline-block bg-white text-primary px-8 py-4 text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
              >
                Explore Collection
              </Link>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src="https://images.prismic.io/end-features/Z-UxJndAxsiBv-DI_19-03-25_MW-Curates__BrandPage_2400x1350.jpg" 
                alt="Men's Collection" 
                className="w-full h-[450px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Categories */}
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-lg flex flex-col items-center text-center hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-primary/10">
              <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.3817 10.0903L20.3695 10.1276L18.9892 14.6126C18.4201 16.4914 18.1356 17.4309 17.4125 17.9699C16.6894 18.509 15.7112 18.509 13.7548 18.509H13.7539H10.2461C8.28838 18.509 7.30951 18.509 6.58597 17.9699C5.86243 17.4308 5.57799 16.491 5.00911 14.6114L3.6308 10.1276L3.6187 10.0903C3.40675 9.3735 3.32451 9.0227 3.41214 8.72265C3.49977 8.4226 3.74171 8.18362 4.22559 7.70565L10.9142 1.07452C11.237 0.754448 11.3984 0.594414 11.5823 0.539147C11.766 0.483879 11.9615 0.483879 12.1453 0.539147C12.3293 0.594414 12.4907 0.754449 12.8134 1.07447L19.4752 7.70567C19.9588 8.18343 20.2006 8.42232 20.288 8.72224C20.3755 9.0222 20.2936 9.37309 20.0824 10.0881L20.3817 10.0903ZM8.50251 20.2128C8.95 20.9193 9.67483 21.4471 10.6148 21.7247C11.5548 22.0023 12.7003 22.0008 14.0208 21.7193C12.7004 22.0008 11.5548 22.0023 10.6149 21.7247C9.67492 21.4471 8.95 20.9193 8.50251 20.2128Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-2xl font-serif mb-4">Tailoring</h3>
            <p className="text-gray-600 mb-6">Meticulously crafted suits and formalwear that embody elegance and precision.</p>
            <Link to="/all-products/men/tailoring" className="text-primary flex items-center font-medium hover:underline mt-auto">
              Discover <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-lg flex flex-col items-center text-center hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-primary/10">
              <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7L10 3L21 7M3 7V17L10 21M3 7L10 11M10 21L21 17V7M10 21V11M21 7L10 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-2xl font-serif mb-4">Casual</h3>
            <p className="text-gray-600 mb-6">Refined casual pieces that blend comfort with sophisticated style for everyday luxury.</p>
            <Link to="/all-products/men/casual" className="text-primary flex items-center font-medium hover:underline mt-auto">
              Discover <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-lg flex flex-col items-center text-center hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-primary/10">
              <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5455 9.92543C15.9195 9.26103 16.2313 8.66151 16.4236 8.20521C17.3573 5.98947 16.434 3.44077 14.1769 2.40112C11.9199 1.36148 9.65341 2.4395 8.65871 4.52093C6.75657 3.2157 4.21918 3.40739 2.81989 5.44535C1.42059 7.48331 1.85975 10.142 3.77629 11.594C4.6461 12.253 6.41534 13.2242 7.69294 13.7926M19.8054 17.8631C20.7084 16.6331 21.233 15.1428 20.8368 13.9496C20.3359 12.439 18.8487 11.5544 17.2643 11.5544C17.1995 9.354 15.1159 7.60326 12.9524 8.02225C11.0636 8.3857 10.0447 10.0383 10.0447 11.5544C7.89659 11.0144 6.4665 13.0297 6.95743 14.883C7.49702 16.9508 9.44397 17.7364 10.6402 17.693L19.8054 17.8631ZM12.13 18.4555C10.7486 19.6233 7.56117 22.4408 7.56117 22.4408" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-2xl font-serif mb-4">Accessories</h3>
            <p className="text-gray-600 mb-6">Expertly crafted accessories that add the perfect finishing touch to every ensemble.</p>
            <Link to="/all-products/men/accessories" className="text-primary flex items-center font-medium hover:underline mt-auto">
              Discover <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/all-products/men" 
            className="inline-block bg-white text-primary px-8 py-3 uppercase text-sm tracking-wider hover:bg-primary hover:text-white transition-colors border border-white"
          >
            View All Menswear
          </Link>
        </div>
      </div>
    </section>
  );
}
