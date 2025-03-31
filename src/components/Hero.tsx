
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Hero() {
  // Define hero slides with luxury fashion images from Armani
  const heroSlides = [
    {
      image: "https://assets.armani.com/image/upload/v1741168552/GA-SS25-Crossbrand-Homepage.jpg",
      title: "Spring/Summer 2025",
      subtitle: "The new collection has arrived",
      buttonText: "Shop the Collection",
      buttonLink: "/new-arrivals",
      alignment: "center"
    },
    {
      image: "https://assets.armani.com/image/upload/v1738145290/SS25_EA_ADV_GLOBAL_FASHION_M_01_1080_x_1350.jpg",
      title: "Mens Fashion",
      subtitle: "Elevate your wardrobe with our sophisticated menswear",
      buttonText: "Explore Collection",
      buttonLink: "/all-products/men",
      alignment: "center"
    },
    {
      image: "https://assets.armani.com/image/upload/v1737391559/SS25_AX_ADV_FASHION_GLOBAL_MW_03_1080x1350.jpg",
      title: "Tailored Perfection",
      subtitle: "Discover the art of Italian craftsmanship",
      buttonText: "Shop Now",
      buttonLink: "/all-products/women",
      alignment: "center"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const getTextAlignmentClass = (alignment: string) => {
    switch (alignment) {
      case "left":
        return "text-left items-start";
      case "right":
        return "text-right items-end";
      default:
        return "text-center items-center";
    }
  };

  const getGradientClass = (alignment: string) => {
    switch (alignment) {
      case "left":
        return "bg-gradient-to-r from-black/70 to-transparent";
      case "right":
        return "bg-gradient-to-l from-black/70 to-transparent";
      default:
        return "bg-gradient-to-t from-black/70 via-transparent to-black/20";
    }
  };

  return (
    <div className="relative w-full h-[100vh] overflow-hidden bg-black">
      {heroSlides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className={`absolute inset-0 ${getGradientClass(slide.alignment)}`} />
        </div>
      ))}

      <div className="relative h-full container-wide flex flex-col justify-center items-center">
        <div className={`max-w-xl flex flex-col ${getTextAlignmentClass(heroSlides[currentSlide].alignment)} mx-auto transition-all duration-700 ${isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight mb-4">
            {heroSlides[currentSlide].title}
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-md">
            {heroSlides[currentSlide].subtitle}
          </p>
          
          <div>
            <Link
              to={heroSlides[currentSlide].buttonLink}
              className="bg-white text-primary px-8 py-3 text-sm tracking-wider uppercase font-medium hover:bg-white/90 transition-colors inline-block"
            >
              {heroSlides[currentSlide].buttonText}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Indicator dots */}
      <div className="hero-dots">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
