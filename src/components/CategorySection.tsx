
import { Link } from "react-router-dom";

interface CategorySectionProps {
  className?: string;
}

export function CategorySection({ className }: CategorySectionProps) {
  const categories = [
    {
      name: "Mens",
      image: "https://images.prismic.io/end-features/Z-UxJndAxsiBv-DI_19-03-25_MW-Curates__BrandPage_2400x1350.jpg",
      link: "/all-products/men"
    },
    {
      name: "Womens",
      image: "https://assets.armani.com/image/upload/v1737391559/SS25_AX_ADV_FASHION_GLOBAL_MW_03_1080x1350.jpg",
      link: "/all-products/women"
    },
    {
      name: "Beauty",
      image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/GA_2025_EA-SWY-Parfum_Pack-with-Ingredients_1x1_RVB-4000",
      link: "/all-products/beauty"
    },
    {
      name: "Food",
      image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/Armani-Dolci-Ramadan-01",
      link: "/all-products/food"
    },
    {
      name: "Services",
      image: "https://assets.armani.com/image/upload/v1728401835/ARMANI_RESTAURANT_FALL_WINTER_2024.jpg",
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
