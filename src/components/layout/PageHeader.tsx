import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { usePageHero } from "@/hooks/usePageHero";

interface PageHeaderProps {
  breadcrumb: string;
  title: string;
  subtitle?: string;
  description?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  showCTAs?: boolean;
  showSocials?: boolean;
}

const PageHeader = ({
  breadcrumb,
  title,
  subtitle,
  description,
  showSearch,
  searchValue,
  onSearchChange,
}: PageHeaderProps) => {
  const { settings } = usePageHero();
  const hasImage = !!settings.image;

  return (
    <section
      className="relative min-h-[350px] md:min-h-[450px] flex items-center justify-center text-center"
      style={
        hasImage
          ? {
              backgroundImage: `url(${settings.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Overlay or solid fallback */}
      <div
        className="absolute inset-0"
        style={
          hasImage
            ? { backgroundColor: `rgba(0,0,0,${settings.overlay / 100})` }
            : undefined
        }
      >
        {!hasImage && <div className="absolute inset-0 bg-primary" />}
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumbs */}
        <div className="flex items-center justify-center gap-2 text-sm text-primary-foreground/80 mb-6">
          <Link to="/" className="flex items-center gap-1 hover:text-primary-foreground">
            <Home className="w-4 h-4" /> Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-primary-foreground">{breadcrumb}</span>
        </div>

        {subtitle && (
          <p className="text-sm font-semibold tracking-widest uppercase text-primary-foreground/80 mb-4">
            {subtitle}
          </p>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
          {title}
        </h1>

        {description && (
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mt-4">
            {description}
          </p>
        )}

        {showSearch && (
          <div className="mt-8 max-w-lg mx-auto">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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
