
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function BeautySection() {
  const beautyCategories = [
    {
      name: "Skincare",
      image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/GA_2025_EA-SWY-Parfum_Pack-with-Ingredients_1x1_RVB-4000",
      link: "/all-products/beauty/skincare"
    },
    {
      name: "Makeup",
      image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1720778517/hp_story_beauty_06_double",
      link: "/all-products/beauty/makeup"
    },
    {
      name: "Fragrance",
      image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1720537033/GA_2025_PA-MLG-Fragrance-PDP-EDP-New-Visuel-Flacon.jpg",
      link: "/all-products/beauty/fragrance"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-3">Beauty</h2>
            <p className="text-muted">Experience luxury skincare, makeup and fragrances</p>
          </div>
          
          <Link to="/all-products/beauty" className="mt-6 md:mt-0 flex items-center text-primary hover:underline font-medium">
            View All Beauty <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {beautyCategories.map((category, index) => (
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
