import { useState } from "react";
import { MessageCircle, Send, Mail, Facebook } from "lucide-react";
import { motion } from "framer-motion";
import vbbLogo from "@/assets/vbb-logo.png";

const HeroSection = () => {
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Animated Logo */}
          <motion.div
            className="flex-shrink-0"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, duration: 0.8 }}
          >
            <motion.div
              className="relative w-56 h-56 md:w-72 md:h-72 rounded-2xl flex items-center justify-center bg-secondary shadow-md overflow-hidden"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{ opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  boxShadow: "0 0 30px 8px hsl(var(--primary) / 0.25), 0 0 60px 16px hsl(22 90% 55% / 0.12)",
                }}
              />
              <img
                src={vbbLogo}
                alt="VBB STORE - Verified Business Manager Provider"
                className={`relative z-10 w-4/5 h-4/5 object-contain transition-opacity duration-500 ${logoLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setLogoLoaded(true)}
                fetchPriority="high"
              />
              {!logoLoaded && (
                <div className="absolute z-10 text-center">
                  <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-foreground text-2xl font-bold">VS</span>
                  </div>
                  <span className="text-xl font-bold text-foreground">VBB STORE</span>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Content – slides in from right */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary text-sm text-foreground mb-6">
              <span className="text-[hsl(45,93%,47%)]">★</span>
              Best Verified Business Manager 2026
              <span className="w-2 h-2 rounded-full bg-[hsl(142,70%,45%)]"></span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Buy Verified BM<br />And WhatsApp Business API
            </h1>

            <p className="mt-6 text-muted-foreground text-lg max-w-2xl">
              We sell verified Facebook Business Managers and WhatsApp Business API accounts — the real deal, with proper documentation. Need Facebook Ads, TikTok Ads, Google Ads accounts, or reinstated profiles? We've got those too. Every account is legit, secure, and ready to use. Over 10,000 advertisers trust us because we deliver what we promise, fast.
            </p>

            <motion.div
              className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
            >
              <a href="https://wa.me/8801302669333" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[hsl(142,70%,45%)] text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </a>
              <a href="https://t.me/Verifiedbmbuy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[hsl(200,100%,40%)] text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                <Send className="w-5 h-5" /> Telegram
              </a>
              <a href="http://m.me/101736778209833" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                <Facebook className="w-5 h-5" /> Facebook
              </a>
              <a href="mailto:info@verifiedbmbuy.com" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[hsl(0,72%,51%)] text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                <Mail className="w-5 h-5" /> Email
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
