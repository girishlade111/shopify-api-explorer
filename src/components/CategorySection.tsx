
import { Link } from "react-router-dom";

interface CategorySectionProps {
  className?: string;
}

export function CategorySection({ className }: CategorySectionProps) {
  const categories = [
    {
      name: "Mens",
      image: "https://cdn.media.amplience.net/i/liberty/250213-Homepage-R2E8-Mens-min?fmt=auto&qlt=default&w=800&h=1000",
      link: "/all-products/men"
    },
    {
      name: "Womens",
      image: "https://cdn.media.amplience.net/i/liberty/250213-Homepage-R2E2-Dresses-min?fmt=auto&qlt=default&w=800&h=1000",
      link: "/all-products/women"
    },
    {
      name: "Beauty",
      image: "https://images.selfridges.com/is/image/selfridges/250310_CLP_BEAUTY_BANNER_2_D1?wid=1232&hei=528&fmt=webp&qlt=80,1&dpr=on,2&fit=crop",
      link: "/all-products/beauty"
    },
    {
      name: "Food",
      image: "https://images.selfridges.com/is/image/selfridges/240417_JACKSON_BOXER_CORNER_RESTAURANT_ASSET_UPDATE?wid=1920&fmt=jpg&fit=constrain&qlt=95,1",
      link: "/all-products/food"
    },
    {
      name: "Services",
      image: "https://images.selfridges.com/is/image/selfridges/2209_HP_Event_03?wid=402&hei=301&fmt=webp&qlt=80,1&dpr=on,2&fit=crop",
      link: "/services"
    }
  ];

  return (
    <section className={`py-24 ${className}`}>
      <div className="container-wide">
        <h2 className="text-4xl md:text-5xl font-serif mb-2 text-center">Explore Our Categories</h2>
        <p className="text-gray-500 mb-16 text-center">Discover our curated collections for every aspect of luxury living</p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <CategoryCard 
              key={index} 
              name={category.name} 
              image={category.image} 
              link={category.link} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  name: string;
  image: string;
  link: string;
}

function CategoryCard({ name, image, link }: CategoryCardProps) {
  return (
    <Link to={link} className="category-card group block relative overflow-hidden aspect-[4/5]">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
      
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
      />
      
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <h3 className="text-white text-2xl md:text-3xl font-serif tracking-wide">
          {name}
        </h3>
      </div>
    </Link>
  );
}
