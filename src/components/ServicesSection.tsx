
import { Link } from "react-router-dom";
export function ServicesSection() {
  return <section className="py-24 bg-light">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <img src="https://assets.armani.com/image/upload/v1728401835/ARMANI_RESTAURANT_FALL_WINTER_2024.jpg" alt="Atelier Restaurants" className="w-full h-auto object-cover" />
          </div>
          
          <div className="lg:pl-12">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Atelier Restaurants</h2>
            <p className="text-muted text-lg mb-8 max-w-xl">
              Experience the epitome of culinary excellence at our signature restaurants.
              Indulge in exquisite dishes prepared by world-renowned chefs in an
              atmosphere of unparalleled elegance and sophistication.
            </p>
            
            <Link to="/services/restaurants" className="inline-block border border-primary text-primary px-8 py-3 uppercase text-sm tracking-widest hover:bg-primary hover:text-white transition-colors">
              Discover Dining
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24">
          <ServiceCard title="Private Shopping" description="Enjoy a personalized shopping experience with our dedicated stylists in a private suite." image="https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/Armani_Prive_Club_Milano_2" link="/services/private-shopping" />
          
          <ServiceCard title="Atelier Hotels" description="Immerse yourself in ultimate luxury at our exclusive hotels in iconic destinations worldwide." image="https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/Armani-Hotel-Balcony" link="/services/hotels" />
          
          <ServiceCard title="Atelier Fiori" description="Discover elegant floral arrangements that embody the Atelier aesthetic for your home or special events." image="https://assets.armani.com/image/upload/v1727108228/Armani_Fiori_Floral_Collections_038.jpg" link="/services/fiori" />
        </div>
      </div>
    </section>;
}
interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}
function ServiceCard({
  title,
  description,
  image,
  link
}: ServiceCardProps) {
  return <Link to={link} className="group block">
      <div className="overflow-hidden">
        <img src={image} alt={title} className="w-full h-80 object-cover object-center transition-transform duration-700 group-hover:scale-105" />
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-serif mb-2">{title}</h3>
        <p className="text-muted mb-4">{description}</p>
        <span className="text-primary text-sm uppercase tracking-wider font-medium group-hover:underline">
          Discover More
        </span>
      </div>
    </Link>;
}
