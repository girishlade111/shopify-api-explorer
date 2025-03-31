
import { Hero } from "@/components/Hero";
import { NewArrivals } from "@/components/NewArrivals";
import { CategorySection } from "@/components/CategorySection";
import { ServicesSection } from "@/components/ServicesSection";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <NewArrivals />
      <Separator className="max-w-screen-lg mx-auto" />
      <CategorySection />
      <Separator className="max-w-screen-lg mx-auto" />
      <ServicesSection />
    </div>
  );
};

export default Index;
