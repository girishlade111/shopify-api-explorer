
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CategoryHeroProps {
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

export function CategoryHero({
  title,
  description,
  image,
  ctaText = "Shop Now",
  ctaLink = "#",
  className
}: CategoryHeroProps) {
  return (
    <div className={`relative w-full h-[400px] md:h-[500px] overflow-hidden ${className}`}>
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
        <div className="container-wide">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">{title}</h1>
            <p className="text-white/80 text-lg mb-8">{description}</p>
            
            <Link 
              to={ctaLink} 
              className="inline-flex items-center px-8 py-3 bg-white text-primary hover:bg-white/90 transition-colors text-sm uppercase tracking-wider font-medium"
            >
              {ctaText} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
