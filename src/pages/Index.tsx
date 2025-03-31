
import { Hero } from "@/components/Hero";
import { NewArrivals } from "@/components/NewArrivals";
import { CategorySection } from "@/components/CategorySection";
import { ServicesSection } from "@/components/ServicesSection";
import { Separator } from "@/components/ui/separator";
import { BrandsShowcase } from "@/components/BrandsShowcase";
import { MagazineSection } from "@/components/MagazineSection";
import { InstagramFeed } from "@/components/InstagramFeed";
import { SeasonalHighlights } from "@/components/SeasonalHighlights";
import { SubscribeSection } from "@/components/SubscribeSection";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <NewArrivals />
      <Separator className="max-w-screen-lg mx-auto" />
      <CategorySection />
      <Separator className="max-w-screen-lg mx-auto" />
      <BrandsShowcase />
      <Separator className="max-w-screen-lg mx-auto" />
      <ServicesSection />
      <Separator className="max-w-screen-lg mx-auto" />
      <SeasonalHighlights />
      <Separator className="max-w-screen-lg mx-auto" />
      <MagazineSection />
      <Separator className="max-w-screen-lg mx-auto" />
      <InstagramFeed />
      <SubscribeSection />
    </div>
  );
};

export default Index;
