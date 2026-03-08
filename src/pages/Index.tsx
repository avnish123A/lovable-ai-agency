import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PartnerBanks from "@/components/PartnerBanks";
import FeaturesSection from "@/components/FeaturesSection";

import TopCardsSection from "@/components/TopCardsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AISearch from "@/components/AISearch";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      {/* AI Smart Search Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Search
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Find Products in Natural Language
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ask anything like "best cashback credit card" or "low interest personal loan" and our AI will find the perfect match
            </p>
          </div>
          <AISearch />
        </div>
      </section>
      
      <PartnerBanks />
      <FeaturesSection />
      
      <TopCardsSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
