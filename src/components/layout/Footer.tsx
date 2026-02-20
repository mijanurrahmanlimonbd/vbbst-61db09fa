import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, ShoppingBag, FileText, Users, Headphones, Shield, RefreshCw, HelpCircle, Lock, MapPin, MessageCircle, Send, Mail, Clock } from "lucide-react";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { useBranding } from "@/hooks/useBranding";
import { supabase } from "@/integrations/supabase/client";

interface FooterProduct {
  slug: string;
  title: string;
}

interface FooterBlogPost {
  slug: string;
  title: string;
}

const Footer = () => {
  const { branding } = useBranding();
  const [products, setProducts] = useState<FooterProduct[]>([]);
  const [blogPosts, setBlogPosts] = useState<FooterBlogPost[]>([]);

  useEffect(() => {
    supabase.from("products").select("slug,title").order("sort_order").then(({ data }) => {
      if (data) setProducts(data);
    });
    supabase.from("blog_posts").select("slug,title").eq("status", "published").order("published_at", { ascending: false }).then(({ data }) => {
      if (data) setBlogPosts(data);
    });
  }, []);

  const logoElement = branding.footer_logo ? (
    <img src={branding.footer_logo} alt={branding.site_title} className="h-8 max-w-[160px] object-contain" loading="lazy" />
  ) : branding.header_logo ? (
    <img src={branding.header_logo} alt={branding.site_title} className="h-8 max-w-[160px] object-contain" loading="lazy" />
  ) : (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">V</div>
      <span className="text-lg font-bold text-foreground">Verified BM <span className="text-primary">services</span></span>
    </div>
  );

  const quickLinks = [
    { to: "/", label: "Homepage", icon: <Home className="w-4 h-4" /> },
    { to: "/shop", label: "All Products", icon: <ShoppingBag className="w-4 h-4" /> },
    { to: "/blog", label: "Latest Articles", icon: <FileText className="w-4 h-4" /> },
    { to: "/about", label: "About Us", icon: <Users className="w-4 h-4" /> },
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
              <a href="mailto:info@verifiedbmservices.com" className="flex items-center gap-2.5 text-sm text-muted-foreground px-2.5 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                info@verifiedbmservices.com
              </a>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full mt-1">
                <Clock className="w-3.5 h-3.5" />
                Available 24/7
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO-only sitemap — visually hidden from users, fully crawlable by search engines */}
      <div className="absolute w-px h-px overflow-hidden" style={{ clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
        {products.length > 0 && (
          <nav aria-label="Products sitemap">
            <h4>Products Site Map</h4>
            <ul>
              {products.map((p) => (
                <li key={p.slug}>
                  <Link to={`/product/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {blogPosts.length > 0 && (
          <nav aria-label="Blog sitemap">
            <h4>Blog Site Map</h4>
            <ul>
              {blogPosts.map((p) => (
                <li key={p.slug}>
                  <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {branding.site_title || "Verified BM services"}. All rights reserved. | Verified BM &amp; WhatsApp API Provider
        </div>
      </div>
    </footer>
  );
};

export default Footer;
