import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { MaintenanceProvider, useMaintenanceMode } from "@/contexts/MaintenanceContext";
import { ComingSoonProvider, useComingSoonMode } from "@/contexts/ComingSoonContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NiveshAIChatbot from "./components/NiveshAIChatbot";
import MaintenancePage from "./pages/Maintenance";

// Lazy load pages
const CreditCards = lazy(() => import("./pages/CreditCards"));
const Loans = lazy(() => import("./pages/Loans"));
const Insurance = lazy(() => import("./pages/Insurance"));
const BankAccounts = lazy(() => import("./pages/BankAccounts"));
const DematAccounts = lazy(() => import("./pages/DematAccounts"));
const FixedDeposits = lazy(() => import("./pages/FixedDeposits"));
const Cashback = lazy(() => import("./pages/Cashback"));
const CashbackTracker = lazy(() => import("./pages/CashbackTracker"));
const EMICalculator = lazy(() => import("./pages/EMICalculator"));
const EligibilityChecker = lazy(() => import("./pages/EligibilityChecker"));
const CompareProducts = lazy(() => import("./pages/CompareProducts"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FinanceTools = lazy(() => import("./pages/FinanceTools"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const ComingSoonPage = lazy(() => import("./pages/ComingSoon"));
const FinanceDeals = lazy(() => import("./pages/FinanceDeals"));
const DealDetail = lazy(() => import("./pages/DealDetail"));
const CompoundInterestCalc = lazy(() => import("./pages/tools/CompoundInterestCalc"));
const HomeLoanCalc = lazy(() => import("./pages/tools/HomeLoanCalc"));
const PersonalLoanCalc = lazy(() => import("./pages/tools/PersonalLoanCalc"));
const InterestRateCalc = lazy(() => import("./pages/tools/InterestRateCalc"));
const SavingsCalc = lazy(() => import("./pages/tools/SavingsCalc"));
const InvestmentReturnCalc = lazy(() => import("./pages/tools/InvestmentReturnCalc"));
const FinancialGoalPlanner = lazy(() => import("./pages/tools/FinancialGoalPlanner"));
const BudgetPlanner = lazy(() => import("./pages/tools/BudgetPlanner"));
const DebtPayoffCalc = lazy(() => import("./pages/tools/DebtPayoffCalc"));
const TaxEstimator = lazy(() => import("./pages/tools/TaxEstimator"));
const CreditScoreGuide = lazy(() => import("./pages/tools/CreditScoreGuide"));
const CashbackCalc = lazy(() => import("./pages/tools/CashbackCalc"));
const RewardPointsCalc = lazy(() => import("./pages/tools/RewardPointsCalc"));
const CreditCardFinder = lazy(() => import("./pages/tools/CreditCardFinder"));
const CreditScoreSimulator = lazy(() => import("./pages/tools/CreditScoreSimulator"));
const ExpenseTracker = lazy(() => import("./pages/tools/ExpenseTracker"));
const RetirementPlanner = lazy(() => import("./pages/tools/RetirementPlanner"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCreditCards = lazy(() => import("./pages/admin/AdminCreditCards"));
const AdminLoans = lazy(() => import("./pages/admin/AdminLoans"));
const AdminInsurance = lazy(() => import("./pages/admin/AdminInsurance"));
const AdminBankAccounts = lazy(() => import("./pages/admin/AdminBankAccounts"));
const AdminDemat = lazy(() => import("./pages/admin/AdminDemat"));
const AdminFixedDeposits = lazy(() => import("./pages/admin/AdminFixedDeposits"));
const AdminCashback = lazy(() => import("./pages/admin/AdminCashback"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminAITools = lazy(() => import("./pages/admin/AdminAITools"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminAPIKeys = lazy(() => import("./pages/admin/AdminAPIKeys"));
const AdminContactSettings = lazy(() => import("./pages/admin/AdminContactSettings"));
const AdminSubscribers = lazy(() => import("./pages/admin/AdminSubscribers"));

const PrivacyPolicy = lazy(() => import("./pages/PolicyPages").then(m => ({ default: m.PrivacyPolicy })));
const TermsConditions = lazy(() => import("./pages/PolicyPages").then(m => ({ default: m.TermsConditions })));
const AffiliateDisclosure = lazy(() => import("./pages/PolicyPages").then(m => ({ default: m.AffiliateDisclosure })));
const Disclaimer = lazy(() => import("./pages/PolicyPages").then(m => ({ default: m.Disclaimer })));
const CookiePolicy = lazy(() => import("./pages/PolicyPages").then(m => ({ default: m.CookiePolicy })));
const CashbackPolicy = lazy(() => import("./pages/PolicyPages").then(m => ({ default: m.CashbackPolicy })));
const RefundPolicy = lazy(() => import("./pages/PolicyPages").then(m => ({ default: m.RefundPolicy })));
const KYCPolicy = lazy(() => import("./pages/PolicyPages").then(m => ({ default: m.KYCPolicy })));

const queryClient = new QueryClient();

const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const Loading = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full"
    />
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-sm text-muted-foreground font-medium"
    >
      Loading...
    </motion.p>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const { isMaintenanceMode, settings, loading } = useMaintenanceMode();
  const { isComingSoonMode, settings: csSettings, loading: csLoading } = useComingSoonMode();

  // Show loading while contexts fetch settings (prevents flash of normal content)
  if ((loading || csLoading) && !isAdmin) {
    return <Loading />;
  }

  // Show coming soon page for all public routes when enabled
  if (isComingSoonMode && !isAdmin) {
    return (
      <Suspense fallback={<Loading />}>
        <ComingSoonPage />
      </Suspense>
    );
  }

  if (isMaintenanceMode && !isAdmin) {
    return <MaintenancePage message={settings.message} estimatedTime={settings.estimated_time} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...pageTransition}>
        <Suspense fallback={<Loading />}>
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/credit-cards" element={<CreditCards />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/bank-accounts" element={<BankAccounts />} />
            <Route path="/demat-accounts" element={<DematAccounts />} />
            <Route path="/fixed-deposits" element={<FixedDeposits />} />
            <Route path="/cashback" element={<Cashback />} />
            <Route path="/emi-calculator" element={<EMICalculator />} />
            <Route path="/eligibility" element={<EligibilityChecker />} />
            <Route path="/compare" element={<CompareProducts />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tools" element={<FinanceTools />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/finance-deals" element={<FinanceDeals />} />
            <Route path="/finance-deals/:dealId" element={<DealDetail />} />
            <Route path="/tools/compound-interest" element={<CompoundInterestCalc />} />
            <Route path="/tools/home-loan" element={<HomeLoanCalc />} />
            <Route path="/tools/personal-loan" element={<PersonalLoanCalc />} />
            <Route path="/tools/interest-rate" element={<InterestRateCalc />} />
            <Route path="/tools/savings" element={<SavingsCalc />} />
            <Route path="/tools/investment-return" element={<InvestmentReturnCalc />} />
            <Route path="/tools/goal-planner" element={<FinancialGoalPlanner />} />
            <Route path="/tools/budget-planner" element={<BudgetPlanner />} />
            <Route path="/tools/debt-payoff" element={<DebtPayoffCalc />} />
            <Route path="/tools/tax-estimator" element={<TaxEstimator />} />
            <Route path="/tools/credit-score" element={<CreditScoreGuide />} />
            <Route path="/tools/cashback-calc" element={<CashbackCalc />} />
            <Route path="/tools/reward-points" element={<RewardPointsCalc />} />
            <Route path="/tools/card-finder" element={<CreditCardFinder />} />
            <Route path="/tools/credit-score-simulator" element={<CreditScoreSimulator />} />
            <Route path="/tools/expense-tracker" element={<ExpenseTracker />} />
            <Route path="/tools/retirement-planner" element={<RetirementPlanner />} />
            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="credit-cards" element={<AdminCreditCards />} />
              <Route path="loans" element={<AdminLoans />} />
              <Route path="insurance" element={<AdminInsurance />} />
              <Route path="bank-accounts" element={<AdminBankAccounts />} />
              <Route path="demat" element={<AdminDemat />} />
              <Route path="fixed-deposits" element={<AdminFixedDeposits />} />
              <Route path="cashback" element={<AdminCashback />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="subscribers" element={<AdminSubscribers />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="contact-settings" element={<AdminContactSettings />} />
              <Route path="ai-tools" element={<AdminAITools />} />
              <Route path="api-keys" element={<AdminAPIKeys />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            {/* Legal */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/track-cashback" element={<CashbackTracker />} />
            <Route path="/cashback-policy" element={<CashbackPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/kyc-policy" element={<KYCPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};
const ChatbotWrapper = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const { isMaintenanceMode, loading } = useMaintenanceMode();
  const { isComingSoonMode, loading: csLoading } = useComingSoonMode();
  if (!isAdmin && (isMaintenanceMode || isComingSoonMode || loading || csLoading)) return null;
  return <NiveshAIChatbot />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MaintenanceProvider>
            <ComingSoonProvider>
              <AnimatedRoutes />
              <ChatbotWrapper />
            </ComingSoonProvider>
          </MaintenanceProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
