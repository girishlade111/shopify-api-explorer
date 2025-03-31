
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CategoryHeroProps {
  title: string;
  description: string;
  image?: string;
  videoSrc?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

export function CategoryHero({
  title,
  description,
  image,
  videoSrc,
  ctaText = "Shop Now",
  ctaLink = "#",
  className
}: CategoryHeroProps) {
  return (
    <div className={`relative w-full h-[650px] md:h-[700px] overflow-hidden mt-[104px] ${className}`}>
      {videoSrc ? (
        <video 
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center justify-center">
        <div className="container-wide text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 text-center">{title}</h1>
            <p className="text-white/80 text-lg mb-8 text-center">{description}</p>
            
            <div className="flex justify-center">
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
    </div>
  );
}
