import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PolicyLayout = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-foreground">{title}</h1>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:font-heading [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export const PrivacyPolicy = () => (
  <PolicyLayout title="Privacy Policy">
    <p>Last updated: March 2026</p>
    <p>Kriyapay (operated by Inspirex Technologies) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.</p>
    <h2>Information We Collect</h2>
    <p>We collect information you provide directly, including your name, email address, phone number, city, and salary range when you submit a lead form. We also collect usage data such as pages visited, clicks, and device information through analytics tools.</p>
    <h2>How We Use Your Information</h2>
    <ul>
      <li>To connect you with relevant financial products from our partner banks</li>
      <li>To personalize your experience and show relevant offers</li>
      <li>To improve our platform and services</li>
      <li>To communicate updates about offers you've expressed interest in</li>
    </ul>
    <h2>Data Sharing</h2>
    <p>We share your information only with the specific banking partner whose product you apply for. We do not sell your data to third parties. Our affiliate partners (such as Cuelinks) may collect anonymized click data for tracking purposes.</p>
    <h2>Data Security</h2>
    <p>We use industry-standard security measures including HTTPS encryption and secure database storage to protect your information.</p>
    <h2>Your Rights</h2>
    <p>You may request access to, correction of, or deletion of your personal data by contacting us at support@kriyapay.co.in.</p>
    <h2>Contact</h2>
    <p>Inspirex Technologies<br />Email: support@kriyapay.co.in</p>
  </PolicyLayout>
);

export const TermsConditions = () => (
  <PolicyLayout title="Terms & Conditions">
    <p>Last updated: March 2026</p>
    <p>By using Kriyapay (kriyapay.co.in), you agree to these terms. Please read them carefully.</p>
    <h2>Service Description</h2>
    <p>Kriyapay is a financial product comparison platform. We display credit card, loan, and insurance offers from partner banks and financial institutions. We do not directly provide any financial products or services.</p>
    <h2>User Responsibilities</h2>
    <ul>
      <li>You must provide accurate information when using our services</li>
      <li>You must be at least 18 years old to use our platform</li>
      <li>You are responsible for any applications you submit through our platform</li>
    </ul>
    <h2>Accuracy of Information</h2>
    <p>While we strive to display accurate and up-to-date information, product terms, interest rates, and fees may change. Always verify details directly with the financial institution before applying.</p>
    <h2>Intellectual Property</h2>
    <p>All content, design, and functionality on Kriyapay is owned by Inspirex Technologies and protected by intellectual property laws.</p>
    <h2>Limitation of Liability</h2>
    <p>Kriyapay is not liable for any decisions you make based on information displayed on our platform. We are a comparison service, not a financial advisor.</p>
  </PolicyLayout>
);

export const AffiliateDisclosure = () => (
  <PolicyLayout title="Affiliate Disclosure">
    <p>Last updated: March 2026</p>
    <p>Kriyapay participates in affiliate marketing programs. This means we may earn a commission when you click on certain links and apply for or purchase financial products through our platform.</p>
    <h2>How It Works</h2>
    <p>When you click "Apply Now" on any product listing, you may be redirected to the bank or financial institution's website through an affiliate tracking link. If you complete an application or purchase, we may receive a referral fee.</p>
    <h2>Our Commitment</h2>
    <ul>
      <li>Affiliate relationships do not influence our product rankings or recommendations</li>
      <li>We display products based on relevance and user benefit</li>
      <li>Commission amounts do not affect the price you pay — you get the same terms directly from the bank</li>
    </ul>
    <h2>Partners</h2>
    <p>We work with affiliate networks including Cuelinks to manage our partnerships with banks and financial institutions across India.</p>
  </PolicyLayout>
);

export const Disclaimer = () => (
  <PolicyLayout title="Disclaimer">
    <p>Last updated: March 2026</p>
    <h2>Not Financial Advice</h2>
    <p>The information provided on Kriyapay is for general informational purposes only and should not be considered as financial advice. We are a comparison platform, not a licensed financial advisor.</p>
    <h2>Product Information</h2>
    <p>Product details including interest rates, fees, rewards, and eligibility criteria are sourced from our partner banks and affiliate networks. These may change without notice. Always confirm details with the respective financial institution.</p>
    <h2>AI-Generated Content</h2>
    <p>Some product descriptions on our platform are generated using artificial intelligence. While we strive for accuracy, AI-generated content may occasionally contain inaccuracies. We recommend verifying all information before making financial decisions.</p>
    <h2>No Guarantees</h2>
    <p>Kriyapay does not guarantee approval of any financial product. Eligibility and approval decisions are made solely by the respective banks and financial institutions.</p>
  </PolicyLayout>
);

export const CookiePolicy = () => (
  <PolicyLayout title="Cookie Policy">
    <p>Last updated: March 2026</p>
    <p>Kriyapay uses cookies and similar tracking technologies to improve your browsing experience and for analytics and affiliate tracking.</p>
    <h2>Types of Cookies We Use</h2>
    <ul>
      <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
      <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
      <li><strong>Affiliate Tracking Cookies:</strong> Used by our affiliate partners (e.g., Cuelinks) to track referrals and attribute commissions</li>
    </ul>
    <h2>Third-Party Cookies</h2>
    <p>Our affiliate partners may set cookies to track clicks and conversions. These cookies are governed by the respective third party's privacy policy.</p>
    <h2>Managing Cookies</h2>
    <p>You can control cookies through your browser settings. Disabling cookies may affect the functionality of certain features on our website.</p>
  </PolicyLayout>
);
