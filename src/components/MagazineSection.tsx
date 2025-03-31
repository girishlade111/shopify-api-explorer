
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function MagazineSection() {
  const articles = [
    {
      title: "The Art of Italian Craftsmanship",
      excerpt: "Discover the meticulous attention to detail behind our luxury products.",
      image: "https://assets.armani.com/image/upload/v1725961095/Armani-Resort_2025-GALLERY-02-1.jpg",
      category: "Style",
      date: "June 21, 2023",
      link: "/magazine/italian-craftsmanship"
    },
    {
      title: "Summer 2025 Fashion Trends",
      excerpt: "Explore the season's most anticipated styles and innovative designs.",
      image: "https://assets.armani.com/image/upload/v1730501453/Armani_Casa_Summer_Home_Decor.jpg",
      category: "Trends",
      date: "May 15, 2023",
      link: "/magazine/summer-trends"
    },
    {
      title: "Sustainable Luxury: Our Commitment",
      excerpt: "How we're reimagining luxury with environmental responsibility.",
      image: "https://assets.armani.com/image/upload/v1724667559/sustainability_page_armani_EA.jpg",
      category: "Sustainability",
      date: "April 22, 2023",
      link: "/magazine/sustainable-luxury"
    }
  ];

  return (
    <section className="py-24">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-3">The Magazine</h2>
            <p className="text-muted">Stories, interviews and guides from the world of luxury</p>
          </div>
          
          <Link to="/magazine" className="mt-6 md:mt-0 flex items-center text-primary hover:underline font-medium">
            View All Articles <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Link 
              key={index} 
              to={article.link}
              className="group block"
            >
              <div className="overflow-hidden mb-6">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full aspect-[16/9] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              <div className="flex items-center text-sm text-muted mb-3 space-x-4">
                <span>{article.category}</span>
                <span className="w-1 h-1 rounded-full bg-muted inline-block"></span>
                <span>{article.date}</span>
              </div>
              
              <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
              <p className="text-muted">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
