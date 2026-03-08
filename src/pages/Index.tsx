import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PartnerBanks from "@/components/PartnerBanks";
import FeaturesSection from "@/components/FeaturesSection";
import FeaturedDeals from "@/components/FeaturedDeals";
import TopCardsSection from "@/components/TopCardsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <PartnerBanks />
      <FeaturesSection />
      <FeaturedDeals />
      <TopCardsSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
