import { Link } from "react-router-dom";
import { Home, ChevronRight, Facebook, Instagram, Youtube, Send, MessageCircle } from "lucide-react";

interface PageHeaderProps {
  breadcrumb: string;
  subtitle: string;
  title: string;
  description: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  showCTAs?: boolean;
  showSocials?: boolean;
}

const PageHeader = ({ breadcrumb, subtitle, title, description, showSearch, searchValue, onSearchChange, showCTAs, showSocials }: PageHeaderProps) => {
  return (
    <section className="bg-primary text-primary-foreground py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-primary-foreground/80 mb-6">
          <Link to="/" className="flex items-center gap-1 hover:text-primary-foreground"><Home className="w-4 h-4" /> Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium">{breadcrumb}</span>
        </div>

        <p className="text-sm font-semibold tracking-widest uppercase text-primary-foreground/80 mb-4">{subtitle}</p>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto text-center mt-2">{description}</p>

        {showCTAs && (
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="https://wa.me/8801302669333" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-foreground text-primary font-medium hover:bg-primary-foreground/90 transition-colors">
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
            <a href="https://t.me/Verifiedbmbuy" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary-foreground/30 text-primary-foreground font-medium hover:bg-primary-foreground/10 transition-colors">
              <Send className="w-5 h-5" /> Message on Telegram
            </a>
          </div>
        )}

        {showSocials && (
          <div className="flex justify-center gap-3 mt-8">
            {[
              { href: "https://www.facebook.com/verifiedbmbuy", icon: <Facebook className="w-5 h-5" />, bg: "bg-[hsl(220,46%,48%)]" },
              { href: "https://www.instagram.com/verifiedbmbuy", icon: <Instagram className="w-5 h-5" />, bg: "bg-[hsl(340,75%,54%)]" },
              { href: "https://x.com/verifiedbmbuy", icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, bg: "bg-foreground" },
              { href: "https://www.youtube.com/@verifiedbmbuy", icon: <Youtube className="w-5 h-5" />, bg: "bg-[hsl(0,100%,50%)]" },
              { href: "https://t.me/Verifiedbmbuy", icon: <Send className="w-5 h-5" />, bg: "bg-[hsl(200,100%,40%)]" },
              { href: "https://wa.me/8801302669333", icon: <MessageCircle className="w-5 h-5" />, bg: "bg-[hsl(142,70%,45%)]" },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 ${s.bg} rounded-full flex items-center justify-center text-primary-foreground hover:opacity-80 transition-opacity`}>
                {s.icon}
              </a>
            ))}
          </div>
        )}

        {showSearch && (
          <div className="mt-8 max-w-lg mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchValue || ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
