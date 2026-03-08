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
    <p>Last updated: March 8, 2026</p>
    <p>ApniNivesh (owned and operated by <strong>Inspirex Technologies INC</strong>) is committed to protecting the privacy of its users. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data when you visit <strong>apninivesh.in</strong> and use our financial product comparison services.</p>
    
    <h2>1. Information We Collect</h2>
    <p><strong>Personal Information (provided by you):</strong></p>
    <ul>
      <li>Full name, email address, phone number, city of residence, and monthly salary range — collected via lead capture forms when you express interest in a financial product</li>
      <li>Company name and employment type — collected for loan eligibility assessments</li>
      <li>Contact form submissions including name, email, phone, and message content</li>
    </ul>
    <p><strong>Automatically Collected Information:</strong></p>
    <ul>
      <li>Device type, browser type, operating system, and user agent string</li>
      <li>IP address (stored as a one-way hash for fraud prevention — we do not store raw IP addresses)</li>
      <li>Pages visited, click events on product links, referral source, and session duration</li>
      <li>Cookies and tracking pixels from our affiliate partners (Cuelinks, EarnKaro)</li>
    </ul>

    <h2>2. How We Use Your Information</h2>
    <ul>
      <li>To connect you with relevant credit card, loan, and insurance products from our 15+ partner banks including HDFC Bank, ICICI Bank, SBI, Axis Bank, Kotak Mahindra Bank, IndusInd Bank, Yes Bank, AU Small Finance Bank, RBL Bank, and Bank of Baroda</li>
      <li>To process and forward your lead information to the specific bank or financial institution whose product you applied for</li>
      <li>To provide AI-powered product recommendations and eligibility assessments using our NiveshAI engine</li>
      <li>To send transactional communications about products you've expressed interest in</li>
      <li>To analyze platform usage patterns and improve our comparison algorithms</li>
      <li>To detect and prevent fraudulent activity, including duplicate lead submissions</li>
    </ul>

    <h2>3. Data Sharing & Third Parties</h2>
    <p>We share your personal information <strong>only</strong> in the following circumstances:</p>
    <ul>
      <li><strong>Partner Banks:</strong> When you click "Apply Now" or submit a lead form, your information is shared with the specific financial institution for processing your application</li>
      <li><strong>Affiliate Networks:</strong> Cuelinks (Publisher ID: 211481) and EarnKaro track click-through data using cookies for commission attribution. They do not receive your personal details</li>
      <li><strong>AI Service Providers:</strong> Product descriptions and recommendations are generated using Google Gemini and OpenAI models via secure API connections. No personally identifiable information is sent to AI providers</li>
      <li><strong>Analytics:</strong> Aggregated, anonymized usage data may be used for internal reporting</li>
    </ul>
    <p>We <strong>do not sell, rent, or trade</strong> your personal data to third-party marketers or data brokers.</p>

    <h2>4. Data Storage & Security</h2>
    <p>Your data is stored on secure cloud infrastructure with the following protections:</p>
    <ul>
      <li>TLS/HTTPS encryption for all data in transit</li>
      <li>Row-Level Security policies on all database tables</li>
      <li>IP addresses are hashed using one-way cryptographic functions before storage</li>
      <li>API keys and sensitive credentials are stored in encrypted vault storage, never in source code</li>
      <li>Admin access requires authenticated sessions with email verification</li>
    </ul>

    <h2>5. Data Retention</h2>
    <p>Lead data is retained for up to 24 months from the date of submission to facilitate follow-ups and for business analytics. Contact form messages are retained for 12 months. You may request deletion at any time.</p>

    <h2>6. Your Rights</h2>
    <p>Under applicable Indian data protection laws, you have the right to:</p>
    <ul>
      <li>Access your personal data held by us</li>
      <li>Request correction of inaccurate information</li>
      <li>Request deletion of your personal data</li>
      <li>Withdraw consent for marketing communications</li>
      <li>Lodge a complaint with the relevant data protection authority</li>
    </ul>
    <p>To exercise any of these rights, email us at <strong>support@apninivesh.in</strong> with the subject line "Data Request".</p>

    <h2>7. Children's Privacy</h2>
    <p>ApniNivesh is not intended for individuals under 18 years of age. We do not knowingly collect data from minors. Financial products listed require applicants to be at least 18-21 years old as per bank policies.</p>

    <h2>8. Contact</h2>
    <p><strong>Inspirex Technologies INC</strong><br />
    Email: support@apninivesh.in<br />
    Website: apninivesh.in</p>
  </PolicyLayout>
);

export const TermsConditions = () => (
  <PolicyLayout title="Terms & Conditions">
    <p>Last updated: March 8, 2026</p>
    <p>These Terms & Conditions ("Terms") govern your use of the ApniNivesh platform at <strong>apninivesh.in</strong>, owned and operated by <strong>Inspirex Technologies INC</strong>. By accessing or using our services, you agree to be bound by these Terms.</p>

    <h2>1. About ApniNivesh</h2>
    <p>ApniNivesh is a financial product comparison and lead generation platform. We aggregate credit card, personal loan, and insurance product information from 15+ Indian banks and financial institutions. We operate as an <strong>affiliate and lead generation partner</strong> — we do not directly issue, underwrite, or guarantee any financial product.</p>

    <h2>2. Eligibility</h2>
    <ul>
      <li>You must be at least 18 years of age to use our platform</li>
      <li>You must be an Indian resident or NRI eligible for Indian financial products</li>
      <li>You must provide truthful, accurate, and complete information when submitting any form</li>
    </ul>

    <h2>3. Services Provided</h2>
    <ul>
      <li>Comparison of credit cards, loans, and insurance products from partner banks</li>
      <li>AI-powered product recommendations via NiveshAI (powered by Google Gemini and OpenAI)</li>
      <li>EMI calculators, eligibility checkers, and financial planning tools</li>
      <li>Cashback offer aggregation and deal tracking</li>
      <li>Lead submission to partner banks on your behalf</li>
    </ul>

    <h2>4. User Responsibilities</h2>
    <ul>
      <li>You are solely responsible for the accuracy of information you provide in lead forms and applications</li>
      <li>You must not submit false, misleading, or fraudulent information</li>
      <li>You must not use automated tools (bots, scrapers) to access our platform</li>
      <li>You acknowledge that submitting a lead does not guarantee product approval — all decisions are made by the respective financial institution</li>
    </ul>

    <h2>5. Product Information Accuracy</h2>
    <p>While we make every effort to display accurate and current product information (interest rates, fees, rewards, eligibility criteria), these details are sourced from official bank websites, partner APIs, and affiliate networks. Product terms may change without prior notice. <strong>Always verify the latest terms directly with the bank before applying.</strong></p>

    <h2>6. AI-Generated Content</h2>
    <p>ApniNivesh uses artificial intelligence (Google Gemini, OpenAI GPT models) to generate product descriptions, benefits summaries, eligibility assessments, and terms & conditions summaries. AI-generated content is derived from official bank data but may contain simplifications or minor inaccuracies. It does not constitute financial advice.</p>

    <h2>7. Intellectual Property</h2>
    <p>All content, design, branding, source code, algorithms, and functionality on ApniNivesh is the exclusive property of Inspirex Technologies INC and is protected under applicable intellectual property laws. Bank logos, product names, and trademarks belong to their respective owners and are used for identification purposes only.</p>

    <h2>8. Limitation of Liability</h2>
    <p>Inspirex Technologies INC and ApniNivesh shall not be held liable for:</p>
    <ul>
      <li>Any financial decisions made based on information displayed on our platform</li>
      <li>Rejection or approval of any financial product application</li>
      <li>Any losses arising from reliance on AI-generated content</li>
      <li>Technical issues, downtime, or data loss beyond our reasonable control</li>
      <li>Actions of third-party banks, affiliate networks, or financial institutions</li>
    </ul>

    <h2>9. Governing Law</h2>
    <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from the use of ApniNivesh shall be subject to the exclusive jurisdiction of courts in India.</p>

    <h2>10. Contact</h2>
    <p><strong>Inspirex Technologies INC</strong><br />
    Email: support@apninivesh.in<br />
    Website: apninivesh.in</p>
  </PolicyLayout>
);

export const AffiliateDisclosure = () => (
  <PolicyLayout title="Affiliate Disclosure">
    <p>Last updated: March 8, 2026</p>
    <p>ApniNivesh, operated by <strong>Inspirex Technologies INC</strong>, participates in affiliate marketing programs to monetize our financial product comparison platform. This disclosure explains how our affiliate relationships work and how they may affect your experience.</p>

    <h2>1. How We Earn Revenue</h2>
    <p>ApniNivesh earns revenue through the following channels:</p>
    <ul>
      <li><strong>Cost Per Lead (CPL):</strong> When you submit your details through a lead form for a credit card, loan, or insurance product, and the partner bank receives your application, we may earn a referral fee</li>
      <li><strong>Cost Per Action (CPA):</strong> When you click "Apply Now" and complete an application or purchase on the bank's website, we may earn a commission through our affiliate tracking partners</li>
      <li><strong>Click Tracking:</strong> Some affiliate links generate revenue based on qualified click-throughs to partner websites</li>
    </ul>

    <h2>2. Our Affiliate Partners</h2>
    <ul>
      <li><strong>Cuelinks</strong> (Publisher ID: 211481) — India's leading content monetization platform. Cuelinks automatically converts qualifying outbound links to affiliate links and tracks conversions</li>
      <li><strong>EarnKaro</strong> — Affiliate network providing tracking links for select financial products and e-commerce deals</li>
      <li><strong>Direct Bank Partnerships</strong> — We maintain direct affiliate relationships with select banks for lead generation</li>
    </ul>

    <h2>3. Impact on Rankings & Recommendations</h2>
    <p><strong>Our commitment to transparency:</strong></p>
    <ul>
      <li>Affiliate commission rates <strong>do not</strong> influence product rankings on our comparison pages</li>
      <li>AI-powered recommendations (NiveshAI) are based on user-provided criteria (salary, spending habits, preferences) — not commission potential</li>
      <li>Products are ranked by relevance, user ratings, and feature match — not affiliate revenue</li>
      <li>We display both affiliate and non-affiliate products to provide comprehensive comparisons</li>
    </ul>

    <h2>4. No Extra Cost to You</h2>
    <p>Using our affiliate links does not add any extra cost, fee, or charge to your transaction. You receive the <strong>same terms, rates, and offers</strong> as you would by going directly to the bank's website. Our commission is paid by the bank or affiliate network, not by you.</p>

    <h2>5. Identifying Affiliate Links</h2>
    <p>Links that redirect through Cuelinks or EarnKaro tracking domains are affiliate links. "Apply Now" buttons on product pages typically contain affiliate tracking parameters. We aim to clearly label sponsored or promoted content where applicable.</p>

    <h2>6. Contact</h2>
    <p>For questions about our affiliate relationships, email <strong>support@apninivesh.in</strong>.</p>
  </PolicyLayout>
);

export const Disclaimer = () => (
  <PolicyLayout title="Disclaimer">
    <p>Last updated: March 8, 2026</p>
    <p>This disclaimer applies to all content and services provided on <strong>apninivesh.in</strong>, owned and operated by <strong>Inspirex Technologies INC</strong>.</p>

    <h2>1. Not Financial Advice</h2>
    <p>ApniNivesh is a <strong>financial product comparison platform</strong>, not a licensed financial advisor, broker, or intermediary registered with SEBI, IRDAI, or RBI. The information, tools, calculators, and AI-generated content on this platform are for <strong>general informational purposes only</strong> and should not be construed as personalized financial advice. Always consult a certified financial planner or directly contact the bank before making financial decisions.</p>

    <h2>2. Product Information</h2>
    <p>Product details displayed on ApniNivesh — including but not limited to interest rates, annual fees, joining fees, reward points, cashback rates, eligibility criteria, and processing fees — are sourced from:</p>
    <ul>
      <li>Official bank websites (HDFC Bank, ICICI Bank, SBI, Axis Bank, Kotak Mahindra Bank, etc.)</li>
      <li>Affiliate network feeds (Cuelinks, EarnKaro)</li>
      <li>Publicly available product documentation</li>
    </ul>
    <p>These details are subject to change by the respective financial institutions <strong>without prior notice to ApniNivesh</strong>. We update information regularly but cannot guarantee real-time accuracy at all times.</p>

    <h2>3. AI-Generated Content Disclaimer</h2>
    <p>ApniNivesh uses artificial intelligence models (Google Gemini, OpenAI GPT) to generate:</p>
    <ul>
      <li>Product descriptions and benefit summaries</li>
      <li>Terms & conditions summaries (marked with *asterisks for regulatory references)</li>
      <li>Eligibility assessments and personalized recommendations</li>
      <li>Chatbot responses via NiveshAI</li>
    </ul>
    <p>While AI content is based on official bank data, it may contain <strong>simplifications, generalizations, or occasional inaccuracies</strong>. AI-generated content is not a substitute for reading official product terms from the bank. ApniNivesh is not liable for decisions made based on AI-generated content.</p>

    <h2>4. No Guarantee of Approval</h2>
    <p>Submitting a lead or application through ApniNivesh does not guarantee approval of any financial product. Credit card approvals, loan disbursements, and insurance policy issuances are <strong>solely at the discretion of the respective bank or financial institution</strong> based on their internal credit assessment, KYC verification, and underwriting criteria.</p>

    <h2>5. Third-Party Links</h2>
    <p>ApniNivesh contains links to third-party websites (bank portals, affiliate networks, payment platforms like Razorpay, PhonePe, Paytm). We are not responsible for the content, privacy practices, or terms of service of these external websites. Clicking on "Apply Now" or affiliate links will redirect you to the bank's or partner's website.</p>

    <h2>6. Calculator & Tool Accuracy</h2>
    <p>Financial tools on ApniNivesh (EMI Calculator, Eligibility Checker, Budget Planner, Compound Interest Calculator, etc.) provide <strong>estimated results</strong> based on the inputs you provide. Actual loan EMIs, interest amounts, and eligibility may differ based on the bank's assessment. These tools are for indicative purposes only.</p>

    <h2>7. Limitation of Liability</h2>
    <p>Inspirex Technologies INC, its directors, employees, and affiliates shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of ApniNivesh, including but not limited to financial losses, data breaches by third parties, or reliance on information provided on this platform.</p>

    <h2>8. Contact</h2>
    <p><strong>Inspirex Technologies INC</strong><br />
    Email: support@apninivesh.in<br />
    Website: apninivesh.in</p>
  </PolicyLayout>
);

export const CookiePolicy = () => (
  <PolicyLayout title="Cookie Policy">
    <p>Last updated: March 8, 2026</p>
    <p>This Cookie Policy explains how <strong>ApniNivesh</strong> (operated by Inspirex Technologies INC) uses cookies and similar tracking technologies on <strong>apninivesh.in</strong>.</p>

    <h2>1. What Are Cookies</h2>
    <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences, track your interactions, and enable certain functionality.</p>

    <h2>2. Types of Cookies We Use</h2>
    <ul>
      <li><strong>Essential Cookies:</strong> Required for core platform functionality including authentication, form submissions, and session management. These cannot be disabled</li>
      <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with ApniNivesh — which pages are most visited, which products get the most clicks, and where users drop off. This data is aggregated and anonymized</li>
      <li><strong>Affiliate Tracking Cookies:</strong> Set by our affiliate partners to attribute commissions:
        <ul>
          <li><strong>Cuelinks</strong> (Publisher ID: 211481) — Sets cookies to track click-throughs from ApniNivesh to bank websites. Cookie duration: typically 30-90 days depending on the merchant program</li>
          <li><strong>EarnKaro</strong> — Sets cookies for tracking conversions on linked products. Cookie duration varies by campaign</li>
        </ul>
      </li>
      <li><strong>Preference Cookies:</strong> Store your theme preference (light/dark mode), recently viewed products, and comparison selections</li>
    </ul>

    <h2>3. Third-Party Cookies</h2>
    <p>The following third parties may set cookies when you use ApniNivesh:</p>
    <ul>
      <li><strong>Cuelinks (cdn0.cuelinks.com)</strong> — Affiliate link conversion and tracking</li>
      <li><strong>EarnKaro (ekaro.in)</strong> — Smart link tracking and attribution</li>
    </ul>
    <p>Each third party's use of cookies is governed by their own privacy and cookie policies.</p>

    <h2>4. Cookie Duration</h2>
    <ul>
      <li><strong>Session Cookies:</strong> Deleted when you close your browser — used for active session management</li>
      <li><strong>Persistent Cookies:</strong> Remain on your device for a set period (typically 30-90 days) — used for affiliate tracking and returning user recognition</li>
    </ul>

    <h2>5. Managing Cookies</h2>
    <p>You can control and manage cookies through your browser settings:</p>
    <ul>
      <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
      <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
      <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
      <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
    </ul>
    <p><strong>Note:</strong> Disabling cookies may prevent affiliate links from working correctly and may affect certain features like theme preferences and comparison tools.</p>

    <h2>6. Contact</h2>
    <p>For questions about our use of cookies, contact us at <strong>support@apninivesh.in</strong>.</p>
  </PolicyLayout>
);
