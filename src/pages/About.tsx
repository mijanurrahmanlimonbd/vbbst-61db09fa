import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import { Clock, Users, Globe, Star, Shield, Zap, Headphones, RefreshCw, DollarSign, TrendingUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    { icon: <Clock className="w-6 h-6 text-primary" />, title: "5+ Years of Experience", desc: "Providing verified Meta advertising accounts since 2019 with a proven track record." },
    { icon: <Users className="w-6 h-6 text-primary" />, title: "10,000+ Customers", desc: "Satisfied customers worldwide with a 4.9/5 satisfaction rating." },
    { icon: <RefreshCw className="w-6 h-6 text-primary" />, title: "7-Day Guarantee", desc: "Free replacement guarantee on all eligible products, no questions asked." },
    { icon: <Zap className="w-6 h-6 text-primary" />, title: "Instant Delivery", desc: "Delivery within 1–4 hours after payment confirmation." },
    { icon: <Headphones className="w-6 h-6 text-primary" />, title: "24/7 Support", desc: "Customer support via WhatsApp, Telegram, and email around the clock." },
    { icon: <DollarSign className="w-6 h-6 text-primary" />, title: "Secure Payments", desc: "Cryptocurrency payments including USDT, Bitcoin, and Ethereum." },
  ];

  const whyReasons = [
    { icon: <Shield className="w-6 h-6 text-primary" />, title: "Real Documentation", desc: "Every account comes with genuine docs — no shortcuts, no fakes." },
    { icon: <Globe className="w-6 h-6 text-primary" />, title: "Worldwide Support", desc: "Doesn't matter where you are. We support customers across every time zone." },
    { icon: <Zap className="w-6 h-6 text-primary" />, title: "Same-Day Delivery", desc: "Once payment clears, you get your credentials within minutes." },
    { icon: <RefreshCw className="w-6 h-6 text-primary" />, title: "7-Day Guarantee", desc: "Account stopped working? We'll replace it free within 7 days. No questions." },
    { icon: <Headphones className="w-6 h-6 text-primary" />, title: "Actual Human Support", desc: "You'll talk to real people on WhatsApp, Telegram, or email. Not bots." },
    { icon: <TrendingUp className="w-6 h-6 text-primary" />, title: "Instant Scalability", desc: "From solo media buyers to agencies — we scale with your needs." },
  ];

  const testimonials = [
    { quote: "Best verified BM provider I've ever used. Account was delivered in minutes and works flawlessly. Scaled our ad spend 5x within the first week. Highly recommend VBB STORE!", name: "James W.", role: "Agency buyer • USA", initial: "J" },
    { quote: "Purchased 3 verified BMs for our agency. All came with genuine documentation and high trust scores. The team was professional and supportive throughout.", name: "Aisha K.", role: "Digital Marketer • UAE", initial: "A" },
    { quote: "The WhatsApp API account was set up perfectly. Customer support was incredibly helpful throughout the process. Our customer engagement increased by 300%.", name: "Markus S.", role: "E-commerce Owner • Germany", initial: "M" },
  ];

  return (
    <Layout>
      <PageHeader
        breadcrumb="About Us"
        subtitle="ABOUT US"
        title="Who We Are"
        description="Trusted by advertisers worldwide since day one."
        showSocials
      />

      {/* Stats */}
      <section className="border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Clock className="w-6 h-6 text-primary" />, value: "5+", label: "Years Experience" },
              { icon: <Users className="w-6 h-6 text-primary" />, value: "10K+", label: "Happy Customers" },
              { icon: <Globe className="w-6 h-6 text-primary" />, value: "50+", label: "Countries Served" },
              { icon: <Star className="w-6 h-6 text-primary" />, value: "4.9/5", label: "Satisfaction Rating" },
            ].map((s, i) => (
              <div key={i}>
                <div className="flex justify-center mb-2">{s.icon}</div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">About VBB STORE — Your Trusted Source to Buy Verified BM</h2>
          <p className="text-muted-foreground mt-6">VBB STORE has been the leading provider of verified Facebook Business Manager accounts, WhatsApp Business API accounts, and premium digital advertising accounts since 2019. Based in Bangladesh, we serve over 10,000 advertisers across 50+ countries, helping them scale their Meta advertising campaigns with confidence and reliability.</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center">What Sets VBB STORE Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {features.map((f, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="font-bold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-center mt-8 max-w-3xl mx-auto">Whether you're a solo media buyer looking for a single verified BM or an agency needing multiple accounts with advanced features, VBB STORE has the right solution for your advertising needs. Contact us today to learn more about our products and services.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
            <p className="text-muted-foreground mt-4">Provide advertisers with the highest-quality verified BM accounts and digital advertising tools at competitive prices, backed by exceptional customer support. Every account we sell is verified through Meta's official process using legitimate business documents, ensuring the highest trust level and compliance.</p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
            <p className="text-muted-foreground mt-4">To become the world's most trusted marketplace for verified digital advertising accounts, empowering advertisers everywhere to scale their campaigns with confidence, reliability, and world-class support.</p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary">Our Story</p>
          <h2 className="text-3xl font-bold text-foreground mt-2">Your Trusted Partner in Meta Advertising</h2>
          <div className="space-y-4 mt-6 text-muted-foreground">
            <p>VBB STORE started with a simple idea: advertisers need reliable, verified accounts without the hassle. We sell verified Facebook Business Managers, WhatsApp Business API accounts, Facebook Ads accounts, TikTok Ads, Google Ads, and reinstated profiles.</p>
            <p>Every account we sell comes with genuine documentation. We don't cut corners on verification — that's why our customers keep coming back.</p>
            <p>Over the past 5+ years, we've served more than 10,000 customers in 50+ countries. Whether you're a solo media buyer or an agency managing dozens of clients, we make it easy to get the accounts you need and start advertising right away.</p>
          </div>
          <p className="text-sm text-muted-foreground mt-6">VBB STORE, Madergonj, Pirgonj, Rangpur, Bangladesh - 5470</p>
        </div>
      </section>

      {/* Why */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary text-center">Why VBB Store?</p>
          <h2 className="text-3xl font-bold text-foreground text-center mt-2">Why People Keep Coming Back</h2>
          <p className="text-muted-foreground text-center mt-2">We're not the only ones selling verified BMs — but we're the ones people trust.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {whyReasons.map((r, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">{r.icon}</div>
                <h3 className="font-bold text-foreground">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary text-center">Testimonials</p>
          <h2 className="text-3xl font-bold text-foreground text-center mt-2">Customer Success Stories</h2>
          <p className="text-muted-foreground text-center mt-4">Thousands of advertisers trust VBB STORE. Here's what they have to say.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-8">
                <p className="text-muted-foreground italic text-sm leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">{t.initial}</div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to Get Started?</h2>
          <p className="text-muted-foreground mt-4">Whether you need a single verified BM or agency-level accounts, we've got you covered.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="https://wa.me/8801302669333" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[hsl(142,70%,45%)] text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
