import { MessageCircle, Send, Mail, Facebook } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-shrink-0">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-secondary rounded-2xl flex items-center justify-center border border-border shadow-lg">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground text-3xl font-bold">VS</span>
                </div>
                <span className="text-2xl font-bold text-foreground">VBB STORE</span>
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
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

            <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
