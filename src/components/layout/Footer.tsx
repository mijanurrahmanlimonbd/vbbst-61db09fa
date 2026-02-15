import { Link } from "react-router-dom";
import { Home, ShoppingBag, FileText, Users, Headphones, Shield, RefreshCw, HelpCircle, Lock, MapPin, MessageCircle, Send, Mail, Clock } from "lucide-react";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { useBranding } from "@/hooks/useBranding";

const Footer = () => {
  const { branding } = useBranding();

  const logoElement = branding.footer_logo ? (
    <img src={branding.footer_logo} alt={branding.site_title} className="h-8 max-w-[160px] object-contain" />
  ) : branding.header_logo ? (
    <img src={branding.header_logo} alt={branding.site_title} className="h-8 max-w-[160px] object-contain" />
  ) : (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">VS</div>
      <span className="text-lg font-bold text-foreground">VBB <span className="text-primary">STORE</span></span>
    </div>
  );

  const quickLinks = [
    { to: "/", label: "Homepage", icon: <Home className="w-4 h-4" /> },
    { to: "/shop", label: "All Products", icon: <ShoppingBag className="w-4 h-4" /> },
    { to: "/blog", label: "Latest Articles", icon: <FileText className="w-4 h-4" /> },
    { to: "/about", label: "About VBB STORE", icon: <Users className="w-4 h-4" /> },
    { to: "/contact", label: "Support & Contact", icon: <Headphones className="w-4 h-4" /> },
  ];

  const trustLinks = [
    { to: "/terms", label: "Terms of Service", icon: <Shield className="w-4 h-4" /> },
    { to: "/privacy", label: "Privacy Policy", icon: <Lock className="w-4 h-4" /> },
    { to: "/refund-policy", label: "Refund Policy", icon: <RefreshCw className="w-4 h-4" /> },
    { to: "/replacement-guarantee", label: "Replacement Guarantee", icon: <Shield className="w-4 h-4" /> },
    { to: "/faq", label: "FAQ", icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <footer className="bg-secondary/40 border-t border-border">
      {/* Newsletter */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-lg font-bold text-foreground mb-1">Join our Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">Get exclusive deals, tips & updates delivered to your inbox weekly.</p>
            <NewsletterForm variant="footer" />
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div>
            <div className="mb-4">{logoElement}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Trusted provider of verified Meta Business Managers and WhatsApp Business API accounts since 2020. Serving 10,000+ advertisers globally.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-1">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground px-2.5 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    {l.icon}
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Trust Center */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Trust Center</h4>
            <ul className="space-y-1">
              {trustLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground px-2.5 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    {l.icon}
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>Madergonj, Pirgonj, Rangpur, Bangladesh&nbsp;-&nbsp;5470</span>
              </div>
              <a href="https://wa.me/8801302669333" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground px-2.5 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4 text-[hsl(142,70%,45%)]" />
                +880 1302 669333
              </a>
              <a href="https://t.me/Verifiedbmbuy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground px-2.5 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                <Send className="w-4 h-4 text-[hsl(200,100%,40%)]" />
                @Verifiedbmbuy
              </a>
              <a href="mailto:info@verifiedbmbuy.com" className="flex items-center gap-2.5 text-sm text-muted-foreground px-2.5 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                info@verifiedbmbuy.com
              </a>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full mt-1">
                <Clock className="w-3.5 h-3.5" />
                Available 24/7
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {branding.site_title || "VBB STORE"}. All rights reserved. | Verified BM &amp; WhatsApp API Provider
        </div>
      </div>
    </footer>
  );
};

export default Footer;
