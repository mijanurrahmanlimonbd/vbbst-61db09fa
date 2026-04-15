import { Shield, Globe, Clock, Users } from "lucide-react";

const AboutSection = () => (
  <section className="py-16 bg-secondary/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold tracking-widest uppercase text-primary text-center">About Verified BM Shop</p>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mt-2">Your Trusted Partner in Meta Advertising</h2>

      <div className="max-w-3xl mx-auto mt-8 space-y-4 text-muted-foreground text-center">
        <p>Verified BM Shop started with a simple idea: advertisers need reliable, verified accounts without the hassle. We sell verified Facebook Business Managers, WhatsApp Business API accounts, Facebook Ads accounts, TikTok Ads, Google Ads, and reinstated profiles.</p>
        <p>Every account we sell comes with genuine documentation. We don't cut corners on verification — that's why our customers keep coming back.</p>
        <p>Over the past 5+ years, we've served more than 10,000 customers in 50+ countries. Whether you're a solo media buyer or an agency managing dozens of clients, we make it easy to get the accounts you need and start advertising right away.</p>
        <p className="text-sm">Verified BM Shop, Madergonj, Pirgonj, Rangpur, Bangladesh - 5470</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {[
          { icon: <Shield className="w-6 h-6 text-primary" />, value: "100%", label: "Verified Accounts" },
          { icon: <Globe className="w-6 h-6 text-primary" />, value: "50+", label: "Countries Served" },
          { icon: <Clock className="w-6 h-6 text-primary" />, value: "5+", label: "Years Experience" },
          { icon: <Users className="w-6 h-6 text-primary" />, value: "10K+", label: "Happy Customers" },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="flex justify-center mb-2">{s.icon}</div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
