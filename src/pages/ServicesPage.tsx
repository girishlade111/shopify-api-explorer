
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CategoryHero } from "../components/CategoryHero";
import { CategorySubNav } from "../components/CategorySubNav";

const ServicesPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const serviceCategories = [
    { name: "All Services", path: "/services" },
    { name: "Restaurants", path: "/services#restaurants" },
    { name: "Hotels", path: "/services#hotels" },
    { name: "Fiori", path: "/services#fiori" },
    { name: "Private Shopping", path: "/services#private-shopping" },
    { name: "Dolci", path: "/services#dolci" },
    { name: "Clubs", path: "/services#clubs" }
  ];

  const services = [
    {
      id: "restaurants",
      title: "Atelier Restaurants",
      description: "Experience culinary excellence in an atmosphere of unparalleled elegance.",
      image: "https://assets.armani.com/image/upload/v1728401835/ARMANI_RESTAURANT_FALL_WINTER_2024.jpg",
      features: [
        "Michelin-starred dining experiences",
        "Seasonal menus featuring the finest ingredients",
        "Private dining rooms for special events",
        "Expert sommelier selections",
        "Global locations in fashion capitals"
      ]
    },
    {
      id: "hotels",
      title: "Atelier Hotels",
      description: "Immerse yourself in the world of luxury with our exclusive accommodation.",
      image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/Armani-Hotel-Balcony",
      features: [
        "Rooms and suites designed by master artisans",
        "Signature amenities",
        "Wellness experiences",
        "Distinguished locations in Dubai and Milan",
        "Personalized lifestyle manager service"
      ]
    },
    {
      id: "fiori",
      title: "Atelier Fiori",
      description: "Elegant floral arrangements that embody our aesthetic.",
      image: "https://assets.armani.com/image/upload/v1727108228/Armani_Fiori_Floral_Collections_038.jpg",
      features: [
        "Bespoke floral arrangements",
        "Signature vases and containers",
        "Event decoration services",
        "Corporate gifting options",
        "Seasonal collections"
      ]
    },
    {
      id: "private-shopping",
      title: "Private Shopping",
      description: "A personalized shopping experience with dedicated attention.",
      image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/Armani_Prive_Club_Milano_2",
      features: [
        "One-on-one styling consultations",
        "Exclusive access to new collections",
        "Private fitting rooms",
        "Refreshments during your appointment",
        "After-hours shopping by appointment"
      ]
    },
    {
      id: "dolci",
      title: "Atelier Dolci",
      description: "Indulge in sweet creations from our artisanal kitchens.",
      image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/Armani-Dolci-Ramadan-01",
      features: [
        "Handcrafted pralines and chocolates",
        "Seasonal gift boxes",
        "Special occasion confectionery",
        "Corporate gifting programs",
        "Signature packaging"
      ]
    },
    {
      id: "clubs",
      title: "Atelier Privé Clubs",
      description: "Experience exclusive nightlife in the world's most vibrant cities.",
      image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/Armani_Clubs_2555x1437",
      features: [
        "VIP table service",
        "World-renowned DJs and performers",
        "Bespoke cocktail menus",
        "Exclusive member events",
        "Private event hosting"
      ]
    }
  ];

  return (
    <div>
      <div className="relative w-full h-[650px] md:h-[700px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        >
          <source
            src="https://sitecore-cd.shangri-la.com/MediaFiles/6/1/B/{61BCB4CD-38C4-48F8-B868-CE84CE1F3A58}202401_SLLN_Hero-Video_1920x1080.mp4"
            type="video/mp4"
          />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent flex items-center justify-center">
          <div className="container-wide text-center">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4 text-center">Atelier Lifestyle Services</h1>
              <p className="text-white/80 text-lg mb-8 text-center">Beyond fashion, experience the complete luxury lifestyle with our exclusive offerings</p>
              
              <div className="flex justify-center">
                <a 
                  href="#restaurants" 
                  className="inline-flex items-center px-8 py-3 bg-white text-primary hover:bg-white/90 transition-colors text-sm uppercase tracking-wider font-medium"
                >
                  Explore Services
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CategorySubNav 
        categories={serviceCategories} 
        currentCategory="All Services"
        className="mb-10"
      />
      
      <div className="py-10">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Exclusive Lifestyle Experiences</h2>
            <p className="text-lg text-muted">
              Beyond fashion, we extend our philosophy of elegance and sophistication to a complete lifestyle experience.
              Discover our exclusive services that embody our vision of luxury living.
            </p>
          </div>

          <div className="space-y-24">
            {services.map((service, index) => (
              <div key={service.id} id={service.id} className="scroll-mt-24">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${index % 2 !== 0 ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={index % 2 !== 0 ? 'lg:col-start-2' : ''}>
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  
                  <div className={`${index % 2 !== 0 ? 'lg:col-start-1' : ''} lg:p-12`}>
                    <h2 className="text-4xl font-serif mb-4">{service.title}</h2>
                    <p className="text-muted text-lg mb-8">{service.description}</p>
                    
                    <ul className="space-y-3 mb-10">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link 
                      to={`/services/${service.id}`} 
                      className="inline-block border border-primary text-primary px-8 py-3 uppercase text-sm tracking-wider hover:bg-primary hover:text-white transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
                
                {index < services.length - 1 && (
                  <div className="my-20 border-b border-gray-200"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-20 py-16 bg-light text-center">
            <h2 className="text-3xl font-serif mb-6">Experience Atelier Excellence</h2>
            <p className="text-lg text-muted max-w-3xl mx-auto mb-10">
              To book any of our exclusive services or for more information, please contact our dedicated concierge team.
            </p>
            <Link 
              to="/contact" 
              className="inline-block bg-primary text-white px-10 py-4 uppercase text-sm tracking-wider hover:bg-primary/90 transition-colors"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
