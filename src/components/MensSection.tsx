
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function MensSection() {
  const mensCategories = [
    {
      name: "Tailoring",
      image: "https://images.prismic.io/end-features/Z-UxJndAxsiBv-DI_19-03-25_MW-Curates__BrandPage_2400x1350.jpg",
      link: "/all-products/men/tailoring"
    },
    {
      name: "Casual",
      image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1720778497/2025_SS_GALLERY_MENS_11",
      link: "/all-products/men/casual"
    },
    {
      name: "Accessories",
      image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1720778487/2025_SS_GALLERY_MENS_14",
      link: "/all-products/men/accessories"
    }
  ];

  return (
    <section className="py-24 bg-light">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-3">Men's Collection</h2>
            <p className="text-muted">Sophisticated designs crafted with precision and style</p>
          </div>
          
          <Link to="/all-products/men" className="mt-6 md:mt-0 flex items-center text-primary hover:underline font-medium">
            View All Menswear <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mensCategories.map((category, index) => (
            <Link 
              key={index}
              to={category.link}
              className="group overflow-hidden block relative"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
              
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-white text-2xl font-serif mb-2">{category.name}</h3>
                <span className="inline-flex items-center text-white text-sm group-hover:underline">
                  Explore Collection <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
