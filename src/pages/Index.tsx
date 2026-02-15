import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import FeaturesSection from "@/components/home/FeaturesSection";
import ProductsSection from "@/components/home/ProductsSection";
import BenefitsGrid from "@/components/home/BenefitsGrid";
import ServicesSection from "@/components/home/ServicesSection";
import WhyVBBStore from "@/components/home/WhyVBBStore";
import ScaleUpCTA from "@/components/home/ScaleUpCTA";
import TopAdvertisers from "@/components/home/TopAdvertisers";
import KeyAdvantages from "@/components/home/KeyAdvantages";
import PortfolioSection from "@/components/home/PortfolioSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import AboutSection from "@/components/home/AboutSection";
import ContactMapSection from "@/components/home/ContactMapSection";
import BuyVerifiedBMGuide from "@/components/home/BuyVerifiedBMGuide";

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
        title="Buy Verified BM and WhatsApp Business API"
        description="Buy verified BM, WhatsApp API, Facebook Ads accounts from VBB STORE. Instant delivery, 7-day guarantee, 24/7 support. Trusted by 10,000+ advertisers."
      />
      <JsonLdSchema
        pageTitle="Buy Verified Business Manager | VBB STORE"
        pageDescription="Buy verified BM, WhatsApp API, Facebook Ads accounts from VBB STORE. Instant delivery, 7-day guarantee, 24/7 support."
        faqs={homeFaqs}
      />
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
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
    </Layout>
  );
};

export default Index;
