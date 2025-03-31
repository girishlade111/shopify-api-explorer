
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function BrandsShowcase() {
  const brands = [
    {
      name: "Armani",
      logo: "https://brandslogos.com/wp-content/uploads/images/large/giorgio-armani-logo-black-and-white.png",
      link: "/brands/armani"
    },
    {
      name: "Prada",
      logo: "https://brandslogos.com/wp-content/uploads/images/large/prada-logo-black-and-white.png",
      link: "/brands/prada"
    },
    {
      name: "Gucci",
      logo: "https://brandslogos.com/wp-content/uploads/images/large/gucci-logo-black-and-white.png",
      link: "/brands/gucci"
    },
    {
      name: "Louis Vuitton",
      logo: "https://brandslogos.com/wp-content/uploads/images/large/louis-vuitton-logo-black-and-white.png",
      link: "/brands/louis-vuitton"
    },
    {
      name: "Burberry",
      logo: "https://brandslogos.com/wp-content/uploads/images/large/burberry-logo-black-and-white.png",
      link: "/brands/burberry"
    },
    {
      name: "Dior",
      logo: "https://brandslogos.com/wp-content/uploads/images/large/dior-logo-black-and-white.png",
      link: "/brands/dior"
    }
  ];

  return (
    <section className="py-24 bg-light">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-3">Featured Brands</h2>
            <p className="text-muted">Discover our curated selection of luxury designer brands</p>
          </div>
          
          <Link to="/brands" className="mt-6 md:mt-0 flex items-center text-primary hover:underline font-medium">
            View All Brands <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {brands.map((brand, index) => (
            <Link 
              key={index} 
              to={brand.link}
              className="group flex flex-col items-center justify-center p-6 bg-white shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="h-12 object-contain mb-4 opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-sm font-medium">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
