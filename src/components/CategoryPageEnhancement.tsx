
import { useLocation } from "react-router-dom";
import { CategoryHero } from "./CategoryHero";
import { CategorySubNav } from "./CategorySubNav";

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
          image: "https://images.selfridges.com/is/image/selfridges/250314_CLP_MW_BANNER_1_D?wid=1232&hei=528&fmt=webp&qlt=80,1&dpr=on,2&fit=crop",
          ctaText: "Shop Men's Collection",
          ctaLink: "/all-products/men"
        },
        subNav: [
          { name: "All Categories", path: "/all-products/men" },
          { name: "Tops and T-shirts", path: "/all-products/men/tops-tshirts" },
          { name: "Coats and Jackets", path: "/all-products/men/coats-jackets" },
          { name: "Trainers and Sweats", path: "/all-products/men/trainers-sweats" },
          { name: "Jeans", path: "/all-products/men/jeans" },
          { name: "Swimwear", path: "/all-products/men/swimwear" },
          { name: "Technology", path: "/all-products/men/technology" },
          { name: "Shoes", path: "/all-products/men/shoes" }
        ]
      };
    } else if (path.includes("/women")) {
      return {
        hero: {
          title: "Women's Collection",
          description: "Elegant silhouettes that celebrate feminine grace",
          image: "https://images.selfridges.com/is/image/selfridges/250301_WW_CLP_UPDATE_BANNER_1_D?wid=1232&hei=528&fmt=webp&qlt=80,1&dpr=on,2&fit=crop",
          ctaText: "Shop Women's Collection",
          ctaLink: "/all-products/women"
        },
        subNav: [
          { name: "All", path: "/all-products/women" },
          { name: "New In", path: "/all-products/women/new-in" },
          { name: "Dresses", path: "/all-products/women/dresses" },
          { name: "Coats & Jackets", path: "/all-products/women/coats-jackets" },
          { name: "Denim", path: "/all-products/women/denim" },
          { name: "Bags", path: "/all-products/women/bags" },
          { name: "Sportswear", path: "/all-products/women/sportswear" },
          { name: "Knitwear", path: "/all-products/women/knitwear" },
          { name: "Jewelry", path: "/all-products/women/jewelry" },
          { name: "Tops", path: "/all-products/women/tops" },
          { name: "Shoes", path: "/all-products/women/shoes" }
        ]
      };
    } else if (path.includes("/beauty")) {
      return {
        hero: {
          title: "Beauty",
          description: "Experience luxury skincare, makeup and fragrances",
          image: "https://cdn.media.amplience.net/i/liberty/250331-Beauty-R1-Hero-The-Best-New-Beauty-min_1?fmt=auto&qlt=default&metadata=true$poieg$&w=3840&sm=c&poi={$this.metadata.pointOfInterest.x},{$this.metadata.pointOfInterest.y},{$this.metadata.pointOfInterest.w},{$this.metadata.pointOfInterest.h}&scaleFit=poi",
          ctaText: "Shop Beauty Collection",
          ctaLink: "/all-products/beauty"
        },
        subNav: [
          { name: "All Categories", path: "/all-products/beauty" },
          { name: "Skincare", path: "/all-products/beauty/skincare" },
          { name: "Makeup", path: "/all-products/beauty/makeup" },
          { name: "Fragrance", path: "/all-products/beauty/fragrance" },
          { name: "Haircare", path: "/all-products/beauty/haircare" },
          { name: "Body Care", path: "/all-products/beauty/body-care" },
          { name: "Home Fragrances", path: "/all-products/beauty/home-fragrances" }
        ]
      };
    } else if (path.includes("/food")) {
      return {
        hero: {
          title: "Food & Dining",
          description: "Exquisite culinary experiences for the discerning palate",
          image: "https://images.selfridges.com/is/image/selfridges/250217_CLP_FOOD_BANNER_1_D?wid=1232&hei=528&fmt=webp&qlt=80,1&dpr=on,2&fit=crop",
          ctaText: "Explore Culinary Collection",
          ctaLink: "/all-products/food"
        },
        subNav: [
          { name: "All Products", path: "/all-products/food" },
          { name: "Bakery", path: "/all-products/food/bakery" },
          { name: "Cheese & Dairy", path: "/all-products/food/cheese-dairy" },
          { name: "Pantry", path: "/all-products/food/pantry" },
          { name: "Fruits & Vegetables", path: "/all-products/food/fruits-vegetables" },
          { name: "Wines & Spirits", path: "/all-products/food/wines-spirits" }
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
  
  // Extract the current subcategory from the path if any
  const getCurrentSubcategory = () => {
    if (!categoryContent.subNav) return undefined;
    
    const pathSegments = path.split('/');
    if (pathSegments.length <= 3) {
      // We're at the main category level, so highlight "All"
      return categoryContent.subNav[0].name;
    }
    
    const subCategorySlug = pathSegments[3];
    const matchingSubNav = categoryContent.subNav.find(item => {
      const itemSlug = item.path.split('/').pop();
      return itemSlug === subCategorySlug;
    });
    
    return matchingSubNav?.name;
  };
  
  return (
    <>
      <CategoryHero 
        title={categoryContent.hero.title}
        description={categoryContent.hero.description}
        image={categoryContent.hero.image}
        ctaText={categoryContent.hero.ctaText}
        ctaLink={categoryContent.hero.ctaLink}
      />
      {categoryContent.subNav && (
        <CategorySubNav 
          categories={categoryContent.subNav} 
          currentCategory={getCurrentSubcategory()}
          className="mb-6"
        />
      )}
    </>
  );
}
