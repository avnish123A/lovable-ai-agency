import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import CreditCards from "./pages/CreditCards";
import Loans from "./pages/Loans";
import Cashback from "./pages/Cashback";
import EMICalculator from "./pages/EMICalculator";
import EligibilityChecker from "./pages/EligibilityChecker";
import FinanceDeals from "./pages/FinanceDeals";
import DealDetail from "./pages/DealDetail";
import { PrivacyPolicy, TermsConditions, AffiliateDisclosure, Disclaimer, CookiePolicy } from "./pages/PolicyPages";
import CompareProducts from "./pages/CompareProducts";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import KriyaAIChatbot from "./components/KriyaAIChatbot";

const queryClient = new QueryClient();

const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...pageTransition}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/credit-cards" element={<CreditCards />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/cashback" element={<Cashback />} />
          <Route path="/emi-calculator" element={<EMICalculator />} />
          <Route path="/eligibility" element={<EligibilityChecker />} />
          <Route path="/finance-deals" element={<FinanceDeals />} />
          <Route path="/deal/:id" element={<DealDetail />} />
          <Route path="/compare" element={<CompareProducts />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
        <KriyaAIChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
