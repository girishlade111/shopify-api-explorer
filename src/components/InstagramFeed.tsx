
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

export function InstagramFeed() {
  const instagramPosts = [
    {
      image: "https://assets.armani.com/image/upload/v1731335294/GA_Man_SS25_Insta.jpg",
      link: "https://instagram.com",
    },
    {
      image: "https://assets.armani.com/image/upload/v1731335294/GA_Woman_SS25_Insta.jpg",
      link: "https://instagram.com",
    },
    {
      image: "https://assets.armani.com/image/upload/v1732521753/Insta_GA_Hotel_Sunset.jpg",
      link: "https://instagram.com",
    },
    {
      image: "https://assets.armani.com/image/upload/v1732521753/Insta_GA_beauty.jpg",
      link: "https://instagram.com",
    },
    {
      image: "https://assets.armani.com/image/upload/v1732521753/Insta_GA_Fiori.jpg",
      link: "https://instagram.com",
    },
    {
      image: "https://assets.armani.com/image/upload/v1730501453/Armani_Casa_Summer_Home_Decor.jpg",
      link: "https://instagram.com",
    }
  ];

  return (
    <section className="py-24 bg-light">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif mb-3">Follow Us @atelier</h2>
          <p className="text-muted">Get inspired and share your style with us on Instagram</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {instagramPosts.map((post, index) => (
            <a 
              key={index} 
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative overflow-hidden aspect-square"
            >
              <img 
                src={post.image} 
                alt="Instagram post" 
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Instagram className="w-8 h-8 text-white" />
              </div>
            </a>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:underline font-medium"
          >
            <Instagram className="w-5 h-5 mr-2" />
            Follow us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
