
import { useEffect } from "react";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      id: "restaurants",
      title: "Armani Restaurants",
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
      title: "Armani Hotels",
      description: "Immerse yourself in the world of Armani with our luxury accommodation.",
      image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/Armani-Hotel-Balcony",
      features: [
        "Rooms and suites designed by Giorgio Armani",
        "Signature Armani amenities",
        "Armani/SPA wellness experiences",
        "Distinguished locations in Dubai and Milan",
        "Personalized lifestyle manager service"
      ]
    },
    {
      id: "fiori",
      title: "Armani Fiori",
      description: "Elegant floral arrangements that embody the Armani aesthetic.",
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
      title: "Armani Dolci",
      description: "Indulge in sweet creations from the Armani universe.",
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
      title: "Armani Privé Clubs",
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
    <div className="py-20">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-serif mb-6">Armani Lifestyle Services</h1>
          <p className="text-lg text-muted">
            Beyond fashion, Armani extends its philosophy of elegance and sophistication to a complete lifestyle experience.
            Discover our exclusive services that embody the Armani vision of luxury living.
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
          <h2 className="text-3xl font-serif mb-6">Experience Armani Excellence</h2>
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
  );
};

export default ServicesPage;
