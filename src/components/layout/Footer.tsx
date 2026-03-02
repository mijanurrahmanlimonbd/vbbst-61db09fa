import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, MessageCircle, Send, Mail, Clock } from "lucide-react";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { useBranding } from "@/hooks/useBranding";
import { useMenuItems } from "@/hooks/useMenuItems";
import { supabase } from "@/integrations/supabase/client";
import DynamicIcon from "@/components/shared/DynamicIcon";

interface FooterProduct { slug: string; title: string; }
interface FooterBlogPost { slug: string; title: string; }

const FOOTER_KEYS = [
  "footer_description", "contact_address", "contact_phone",
  "contact_telegram", "contact_email", "footer_copyright_text",
];

const Footer = () => {
  const { branding } = useBranding();
  const [products, setProducts] = useState<FooterProduct[]>([]);
  const [blogPosts, setBlogPosts] = useState<FooterBlogPost[]>([]);
  const [footerSettings, setFooterSettings] = useState<Record<string, string>>({});
  const { data: dbQuickLinks } = useMenuItems("footer-quick");
  const { data: dbTrustLinks } = useMenuItems("footer-trust");

  useEffect(() => {
    supabase.from("products").select("slug,title").order("sort_order").then(({ data }) => {
      if (data) setProducts(data);
    });
    supabase.from("blog_posts").select("slug,title").eq("status", "published").order("published_at", { ascending: false }).then(({ data }) => {
      if (data) setBlogPosts(data);
    });
    supabase.from("site_settings").select("key, value").in("key", FOOTER_KEYS).then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((r) => { map[r.key] = r.value; });
        setFooterSettings(map);
      }
    });
  }, []);

  const desc = footerSettings.footer_description || "Trusted provider of verified Meta Business Managers and WhatsApp Business API accounts since 2020. Serving 10,000+ advertisers globally.";
  const address = footerSettings.contact_address || "Madergonj, Pirgonj, Rangpur, Bangladesh\u00a0-\u00a05470";
  const phone = footerSettings.contact_phone || "+880 1302 669333";
  const telegram = footerSettings.contact_telegram || "Verifiedbmbuy";
  const email = footerSettings.contact_email || "info@verifiedbmservices.com";
  const copyrightRaw = footerSettings.footer_copyright_text || `© {year} ${branding.site_title || "Verified BM services"}. All rights reserved. | Verified BM & WhatsApp API Provider`;
  const copyright = copyrightRaw.replace(/\{year\}/g, String(new Date().getFullYear()));

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

  const defaultQuickLinks = [
    { to: "/", label: "Homepage" }, { to: "/shop", label: "All Products" },
    { to: "/blog", label: "Latest Articles" }, { to: "/about", label: "About Us" },
    { to: "/contact", label: "Support & Contact" },
  ];
  const defaultTrustLinks = [
    { to: "/terms", label: "Terms of Service" }, { to: "/privacy", label: "Privacy Policy" },
    { to: "/refund-policy", label: "Refund Policy" }, { to: "/replacement-guarantee", label: "Replacement Guarantee" },
    { to: "/faq", label: "FAQ" },
  ];

  const quickLinks = dbQuickLinks && dbQuickLinks.length > 0
    ? dbQuickLinks.map(m => ({ to: m.url, label: m.label, iconName: m.icon_name }))
    : defaultQuickLinks.map(l => ({ ...l, iconName: null as string | null }));
  const trustLinks = dbTrustLinks && dbTrustLinks.length > 0
    ? dbTrustLinks.map(m => ({ to: m.url, label: m.label, iconName: m.icon_name }))
    : defaultTrustLinks.map(l => ({ ...l, iconName: null as string | null }));

  return (
    <footer className="bg-secondary/40 border-t border-border relative">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">{logoElement}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-1">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="flex items-center gap-2.5 text-sm text-muted-foreground px-2.5 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                    {l.iconName && <DynamicIcon name={l.iconName} className="w-4 h-4 text-muted-foreground shrink-0" />}
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Products */}
          {products.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Our Products</h4>
              <ul className="space-y-1">
                {products.slice(0, 8).map((p) => (
                  <li key={p.slug}>
                    <Link to={`/product/${p.slug}`} className="text-sm text-muted-foreground px-2.5 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors block truncate">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 4: Trust Center */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Trust Center</h4>
            <ul className="space-y-1">
              {trustLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="flex items-center gap-2.5 text-sm text-muted-foreground px-2.5 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                    {l.iconName && <DynamicIcon name={l.iconName} className="w-4 h-4 text-muted-foreground shrink-0" />}
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>{address}</span>
              </div>
              <a href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground px-2.5 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4 text-[hsl(142,70%,45%)]" />
                {phone}
              </a>
              <a href={`https://t.me/${telegram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-muted-foreground px-2.5 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                <Send className="w-4 h-4 text-[hsl(200,100%,40%)]" />
                @{telegram}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-2.5 text-sm text-muted-foreground px-2.5 py-2 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                {email}
              </a>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full mt-1">
                <Clock className="w-3.5 h-3.5" />
                Available 24/7
              </div>
            </div>
          </div>
        </div>

        {/* Blog links row for internal linking */}
        {blogPosts.length > 0 && (
          <div className="mt-10 pt-8 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Latest Articles</h4>
            <div className="flex flex-wrap gap-2">
              {blogPosts.slice(0, 10).map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="text-xs text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>


      {/* Copyright */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center text-xs text-muted-foreground">
          {copyright}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
