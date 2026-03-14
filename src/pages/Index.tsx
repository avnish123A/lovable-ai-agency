import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SEOHead from "@/components/SEOHead";
import PartnerBanks from "@/components/PartnerBanks";
import FeaturesSection from "@/components/FeaturesSection";
import TopCardsSection from "@/components/TopCardsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AISearch from "@/components/AISearch";
import ScrollProgress from "@/components/ScrollProgress";
import InteractiveWizard from "@/components/InteractiveWizard";
import { Calculator, Users, Building, Award, ArrowRight } from "lucide-react";

const Counter = ({ end, suffix = "", label, icon: Icon }: { end: number; suffix?: string; label: string; icon: any }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <p className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{count}{suffix}</p>
      <p className="text-xs font-medium text-muted-foreground mt-2">{label}</p>
    </motion.div>
  );
};

const toolLinks = [
  { label: "EMI Calculator", path: "/emi-calculator" },
  { label: "Budget Planner", path: "/tools/budget-planner" },
  { label: "Credit Card Finder", path: "/tools/card-finder" },
  { label: "Retirement Planner", path: "/tools/retirement-planner" },
  { label: "Tax Estimator", path: "/tools/tax-estimator" },
  { label: "Expense Tracker", path: "/tools/expense-tracker" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <SEOHead 
        title="ApniNivesh – Compare Best Credit Cards, Loans & Insurance in India" 
        description="Compare credit cards, personal loans & insurance from 15+ Indian banks. AI-powered recommendations, EMI calculators & eligibility checkers by Inspirex Technologies INC."
        canonical="https://apninivesh.in"
      />
      <Navbar />
      <HeroSection />

      <InteractiveWizard />
      
      {/* AI Smart Search */}
      <section className="py-20 border-y border-border">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10"
          >
            <span className="tag-mono mb-4 inline-block">AI-Powered Search</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
              Find Products in <span className="text-primary">Natural Language</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ask anything like "best cashback credit card" or "low interest personal loan" and our AI will find the perfect match
            </p>
          </motion.div>
          <AISearch />
        </div>
      </section>
      
      <PartnerBanks />

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Counter end={20} suffix="+" label="Financial Tools" icon={Calculator} />
            <Counter end={50000} suffix="+" label="Users Helped" icon={Users} />
            <Counter end={15} suffix="+" label="Partner Banks" icon={Building} />
            <Counter end={100} suffix="%" label="Free to Use" icon={Award} />
          </div>
        </div>
      </section>

      {/* Quick Tools */}
      <section className="py-16 border-y border-border overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground tracking-tight">Try Our Popular Tools</h2>
            <p className="text-muted-foreground text-sm">Free calculators to plan your finances</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {toolLinks.map((t, i) => (
              <motion.div
                key={t.path}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={t.path} className="px-5 py-2.5 rounded-full bg-card border border-border text-sm font-medium text-foreground hover:border-primary/30 hover:shadow-sm transition-all duration-300 ease-luxury inline-block">
                  {t.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Link to="/tools" className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-1.5">
                View All 20+ Tools <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

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
