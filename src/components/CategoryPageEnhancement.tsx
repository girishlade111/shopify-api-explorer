
import { useLocation } from "react-router-dom";
import { CategoryHero } from "./CategoryHero";
import { CategoryFeatures } from "./CategoryFeatures";

export function CategoryPageEnhancement() {
  const location = useLocation();
  const path = location.pathname;
  
  // Define the category content based on the current path
  const getCategoryContent = () => {
    if (path.includes("/men")) {
      return {
        hero: {
          title: "Men's Collection",
          description: "Sophisticated designs crafted with precision and style",
          image: "/lovable-uploads/700a4d2f-11f9-4118-afd4-06d83f12fafb.png",
          ctaText: "Shop Men's Collection",
          ctaLink: "/all-products/men"
        },
        features: [
          {
            title: "Spring/Summer 2025",
            description: "Discover the latest seasonal collection with lightweight fabrics and contemporary silhouettes.",
            image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1720778497/2025_SS_GALLERY_MENS_11",
            link: "/all-products/men/spring-summer"
          },
          {
            title: "Tailoring",
            description: "Impeccably crafted suits and formalwear that define the modern gentleman's wardrobe.",
            image: "https://images.prismic.io/end-features/Z-UxJndAxsiBv-DI_19-03-25_MW-Curates__BrandPage_2400x1350.jpg",
            link: "/all-products/men/tailoring"
          },
          {
            title: "Accessories",
            description: "Complete your look with our curated selection of premium accessories.",
            image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1720778487/2025_SS_GALLERY_MENS_14",
            link: "/all-products/men/accessories"
          }
        ]
      };
    } else if (path.includes("/women")) {
      return {
        hero: {
          title: "Women's Collection",
          description: "Elegant silhouettes that celebrate feminine grace",
          image: "https://assets.armani.com/image/upload/v1737391559/SS25_AX_ADV_FASHION_GLOBAL_MW_03_1080x1350.jpg",
          ctaText: "Shop Women's Collection",
          ctaLink: "/all-products/women"
        },
        features: [
          {
            title: "Spring/Summer 2025",
            description: "The latest seasonal collection with fluid lines and sophisticated details.",
            image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1728403167/HP_STORY_WOMENS_SPRING_SUMMER_2025_06.jpg",
            link: "/all-products/women/spring-summer"
          },
          {
            title: "Evening Wear",
            description: "Stunning gowns and elegant evening attire for special occasions.",
            image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1736688634/2025_SS_GALLERY_WOMENS_01.jpg",
            link: "/all-products/women/evening"
          },
          {
            title: "Accessories",
            description: "Elevate your ensemble with our selection of luxurious accessories.",
            image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1736688632/2025_SS_GALLERY_WOMENS_21.jpg",
            link: "/all-products/women/accessories"
          }
        ]
      };
    } else if (path.includes("/beauty")) {
      return {
        hero: {
          title: "Beauty",
          description: "Experience luxury skincare, makeup and fragrances",
          image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/GA_2025_EA-SWY-Parfum_Pack-with-Ingredients_1x1_RVB-4000",
          ctaText: "Shop Beauty Collection",
          ctaLink: "/all-products/beauty"
        },
        features: [
          {
            title: "Skincare",
            description: "Advanced formulations that nourish and revitalize your skin.",
            image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1720778517/hp_story_beauty_06_double",
            link: "/all-products/beauty/skincare"
          },
          {
            title: "Makeup",
            description: "Effortless beauty and radiance with our premium makeup collection.",
            image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1720778528/hp_story_beauty_07_double",
            link: "/all-products/beauty/makeup"
          },
          {
            title: "Fragrance",
            description: "Captivating scents that leave a lasting impression.",
            image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/v1720537033/GA_2025_PA-MLG-Fragrance-PDP-EDP-New-Visuel-Flacon.jpg",
            link: "/all-products/beauty/fragrance"
          }
        ]
      };
    } else if (path.includes("/food")) {
      return {
        hero: {
          title: "Food & Dining",
          description: "Exquisite culinary experiences for the discerning palate",
          image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/Armani-Dolci-Ramadan-01",
          ctaText: "Explore Culinary Collection",
          ctaLink: "/all-products/food"
        },
        features: [
          {
            title: "Gourmet Selection",
            description: "Indulge in our premium selection of artisanal foods and delicacies.",
            image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/Armani-Dolci-Ramadan-03",
            link: "/all-products/food/gourmet"
          },
          {
            title: "Dining Experience",
            description: "Discover our elegant dining venues offering exquisite menus and impeccable service.",
            image: "https://assets.armani.com/image/upload/v1728401835/ARMANI_RESTAURANT_FALL_WINTER_2024.jpg",
            link: "/all-products/food/dining"
          },
          {
            title: "Gifts & Hampers",
            description: "Perfect presents for food enthusiasts, beautifully packaged and presented.",
            image: "https://assets.armani.com/image/upload/f_auto,q_auto,ar_4:5,w_768,c_lfill/Armani-Dolci-Ramadan-02",
            link: "/all-products/food/gifts"
          }
        ]
      };
    }
    
    // Default content for other categories
    return null;
  };
  
  const categoryContent = getCategoryContent();
  
  if (!categoryContent) {
    return null;
  }
  
  return (
    <>
      <CategoryHero 
        title={categoryContent.hero.title}
        description={categoryContent.hero.description}
        image={categoryContent.hero.image}
        ctaText={categoryContent.hero.ctaText}
        ctaLink={categoryContent.hero.ctaLink}
      />
      <CategoryFeatures features={categoryContent.features} className="mb-12" />
    </>
  );
}
