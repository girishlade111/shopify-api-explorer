
import { Hero } from "@/components/Hero";
import { NewArrivals } from "@/components/NewArrivals";
import { CategorySection } from "@/components/CategorySection";
import { ServicesSection } from "@/components/ServicesSection";
import { Separator } from "@/components/ui/separator";
import { BestSellers } from "@/components/BestSellers";
import { PersonalizedRecommendations } from "@/components/PersonalizedRecommendations";
import { BeautySection } from "@/components/BeautySection";
import { MensSection } from "@/components/MensSection";
import { WomensSection } from "@/components/WomensSection";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <NewArrivals />
      <Separator className="max-w-screen-lg mx-auto" />
      <CategorySection />
      <Separator className="max-w-screen-lg mx-auto" />
      <MensSection />
      <Separator className="max-w-screen-lg mx-auto" />
      <WomensSection />
      <Separator className="max-w-screen-lg mx-auto" />
      <BestSellers />
      <Separator className="max-w-screen-lg mx-auto" />
      <PersonalizedRecommendations />
      <Separator className="max-w-screen-lg mx-auto" />
      <BeautySection />
      <Separator className="max-w-screen-lg mx-auto" />
      <ServicesSection />
    </div>
  );
};

export default Index;
