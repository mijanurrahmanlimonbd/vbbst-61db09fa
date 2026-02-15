import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
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

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Buy Verified Business Manager"
        description="Buy verified BM, WhatsApp API, Facebook Ads accounts from VBB STORE. Instant delivery, 7-day guarantee, 24/7 support. Trusted by 10,000+ advertisers."
      />
      <HeroSection />
      <StatsBar />
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
