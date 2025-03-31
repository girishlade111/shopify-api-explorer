
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  image: string;
  link: string;
}

interface CategoryFeaturesProps {
  features: Feature[];
  className?: string;
}

export function CategoryFeatures({ features, className }: CategoryFeaturesProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col h-full bg-white shadow-soft hover:shadow-medium transition-shadow">
              <div className="overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-serif mb-2">{feature.title}</h3>
                <p className="text-muted mb-6 flex-grow">{feature.description}</p>
                
                <Link to={feature.link} className="mt-auto inline-flex items-center text-primary hover:underline">
                  Discover <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
