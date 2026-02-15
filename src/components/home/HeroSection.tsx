import { memo, useState, useEffect } from "react";
import { Shield, Award, Clock, Truck, Star, MessageCircle, Send, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import vbbLogo from "@/assets/vbb-logo.png";

const stats = [
  { icon: Shield, label: "Verified Accounts", value: "100%" },
  { icon: Award, label: "Best Quality", value: "A+ Rated" },
  { icon: Clock, label: "On Market", value: "5+ Years" },
  { icon: Truck, label: "Delivery", value: "Instant" },
];

const HeroSection = () => {
  const [neonActive, setNeonActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setNeonActive(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main two-column layout */}
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">
          {/* Left — Logo with rotating border */}
          <div
            className="flex shrink-0 items-center justify-center lg:w-auto animate-hero-fade-left"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="relative">
              <div className="relative rounded-3xl p-[2px] shadow-2xl shadow-primary/10 overflow-hidden">
                <div
                  className="absolute inset-[-50%] animate-border-rotate will-change-transform"
                  style={{
                    background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(22 90% 55%), hsl(var(--primary)), hsl(22 90% 55%))",
                  }}
                />
                <img
                  src={vbbLogo}
                  alt="Buy Verified BM - VBB Store"
                  className="relative h-52 w-52 rounded-[21px] object-cover sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-80 lg:w-80 bg-secondary"
                  fetchPriority="high"
                  width={320}
                  height={320}
                />
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
            {/* Badge */}
            <div className="animate-hero-fade-right" style={{ animationDelay: "0.15s" }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
                <Star className="h-3.5 w-3.5 fill-primary" />
                Best Verified Business Manager 2026
                <span className="h-1.5 w-1.5 rounded-full bg-[hsl(142,70%,45%)] animate-pulse" />
              </div>
            </div>

            {/* H1 */}
            <div
              className="mb-5 animate-hero-fade-right"
              style={{ animationDelay: "0.25s" }}
            >
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] lg:text-[2.85rem] xl:text-[3.25rem]">
                Buy Verified BM
              </h1>
              <span className="mt-3 block text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] lg:text-[2.85rem] xl:text-[3.25rem]">
                And WhatsApp Business API
              </span>
            </div>

            {/* Description */}
            <p
              className="mb-8 text-sm text-muted-foreground md:text-base leading-relaxed text-justify animate-hero-fade-right"
              style={{ animationDelay: "0.35s" }}
            >
              We sell verified Facebook Business Managers and WhatsApp Business API accounts — the real deal, with proper documentation. Need Facebook Ads, TikTok Ads, Google Ads accounts, or reinstated profiles? We've got those too. Every account is legit, secure, and ready to use. Over 10,000 advertisers trust us because we deliver what we promise, fast.
            </p>

            {/* Contact buttons with neon glow */}
            <div
              className="flex flex-wrap items-center gap-3 lg:gap-4 w-full animate-hero-fade-right"
              style={{ animationDelay: "0.45s" }}
            >
              <a href="https://wa.me/8801302669333" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px]">
                <div className="neon-btn-wrap bg-[hsl(142,50%,30%)]">
                  {neonActive && <div className="absolute inset-[-50%] animate-border-rotate will-change-transform z-0" style={{ background: "conic-gradient(from 0deg, white 0%, white 40%, hsl(142,80%,65%) 46%, white 50%, hsl(142,80%,65%) 54%, white 60%, white 100%)" }} />}
                  <Button size="lg" className="relative z-[2] w-full h-12 rounded-[9px] px-6 font-bold bg-[hsl(142,50%,30%)] hover:bg-[hsl(142,50%,25%)] text-white transition-all">
                    <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                  </Button>
                </div>
              </a>
              <a href="https://t.me/Verifiedbmbuy" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px]">
                <div className="neon-btn-wrap bg-[hsl(200,70%,30%)]">
                  {neonActive && <div className="absolute inset-[-50%] animate-border-rotate will-change-transform z-0" style={{ background: "conic-gradient(from 0deg, white 0%, white 40%, hsl(200,100%,70%) 46%, white 50%, hsl(200,100%,70%) 54%, white 60%, white 100%)" }} />}
                  <Button size="lg" className="relative z-[2] w-full h-12 rounded-[9px] px-6 font-bold bg-[hsl(200,70%,30%)] hover:bg-[hsl(200,70%,25%)] text-white transition-all">
                    <Send className="mr-2 h-4 w-4" /> Telegram
                  </Button>
                </div>
              </a>
              <a href="http://m.me/101736778209833" target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px]">
                <div className="neon-btn-wrap bg-primary">
                  {neonActive && <div className="absolute inset-[-50%] animate-border-rotate will-change-transform z-0" style={{ background: "conic-gradient(from 0deg, white 0%, white 40%, hsl(220,100%,80%) 46%, white 50%, hsl(220,100%,80%) 54%, white 60%, white 100%)" }} />}
                  <Button size="lg" className="relative z-[2] w-full h-12 rounded-[9px] px-6 font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all">
                    <Facebook className="mr-2 h-4 w-4" /> Facebook
                  </Button>
                </div>
              </a>
              <a href="mailto:info@verifiedbmbuy.com" className="flex-1 min-w-[120px]">
                <div className="neon-btn-wrap bg-destructive">
                  {neonActive && <div className="absolute inset-[-50%] animate-border-rotate will-change-transform z-0" style={{ background: "conic-gradient(from 0deg, white 0%, white 40%, hsl(0,100%,75%) 46%, white 50%, hsl(0,100%,75%) 54%, white 60%, white 100%)" }} />}
                  <Button size="lg" className="relative z-[2] w-full h-12 rounded-[9px] px-6 font-bold bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-all">
                    <Mail className="mr-2 h-4 w-4" /> Email
                  </Button>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 animate-hero-fade-up"
          style={{ animationDelay: "0.55s" }}
        >
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              </div>
              <span className="text-lg font-bold text-foreground">{value}</span>
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);
