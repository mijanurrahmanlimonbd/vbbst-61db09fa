import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ProductsSection from "@/components/home/ProductsSection";

// Lazy-load below-the-fold sections
const BenefitsGrid = lazy(() => import("@/components/home/BenefitsGrid"));
const ServicesSection = lazy(() => import("@/components/home/ServicesSection"));
const WhyVBBStore = lazy(() => import("@/components/home/WhyVBBStore"));
const ScaleUpCTA = lazy(() => import("@/components/home/ScaleUpCTA"));
const TopAdvertisers = lazy(() => import("@/components/home/TopAdvertisers"));
const KeyAdvantages = lazy(() => import("@/components/home/KeyAdvantages"));
const PortfolioSection = lazy(() => import("@/components/home/PortfolioSection"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const AboutSection = lazy(() => import("@/components/home/AboutSection"));
const ContactMapSection = lazy(() => import("@/components/home/ContactMapSection"));
const BuyVerifiedBMGuide = lazy(() => import("@/components/home/BuyVerifiedBMGuide"));

const homeFaqs = [
  { question: "What exactly is a Verified Business Manager?", answer: "A Verified Business Manager is a Meta-approved account that has passed identity and business verification using legitimate company documents." },
  { question: "How fast will I get my account?", answer: "Most accounts are delivered within 1-4 hours after payment confirmation. Many are delivered within minutes." },
  { question: "What payment methods do you accept?", answer: "We accept USDT (TRC20), Bitcoin (BTC), and Ethereum (ETH)." },
  { question: "What if my account stops working?", answer: "We offer a 7-day free replacement guarantee. If your account has any issues within 7 days, we'll replace it at no cost." },
  { question: "Is buying a verified BM safe?", answer: "Absolutely. Every account we sell comes with genuine verification documents and is created through Meta's official verification process." },
];

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Buy Verified BM And WhatsApp API"
        description="Buy verified BM, WhatsApp API, Facebook Ads accounts from Verified BM services. Instant delivery, 7-day guarantee, 24/7 support. Trusted by 10,000+ advertisers."
      />
      <JsonLdSchema
        pageTitle="Buy Verified Business Manager | Verified BM services"
        pageDescription="Buy verified BM, WhatsApp API, Facebook Ads accounts from Verified BM services. Instant delivery, 7-day guarantee, 24/7 support."
        faqs={homeFaqs}
      />
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <Suspense fallback={null}>
        <BenefitsGrid type="bm" />
        <BenefitsGrid type="whatsapp" />
        <ServicesSection />
        <WhyVBBStore />
        <ScaleUpCTA />
        <TopAdvertisers />
        <KeyAdvantages />
        <PortfolioSection />
        <TestimonialsSection />
        <FAQSection />
        <AboutSection />
        <ContactMapSection />
        <BuyVerifiedBMGuide />
      </Suspense>
    </Layout>
  );
};

export default Index;
