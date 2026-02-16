import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search, LogOut } from "lucide-react";
import { useBranding } from "@/hooks/useBranding";
import headerLogo from "@/assets/verified-bm-services-header.png";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import AuthModal from "@/components/auth/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "HOME", path: "/" },
  { label: "SHOP", path: "/shop" },
  { label: "BLOG", path: "/blog" },
  { label: "CONTACT US", path: "/contact" },
  { label: "ABOUT US", path: "/about" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { branding } = useBranding();
  const { user, profile, signOut } = useAuth();
  const { openCart, totalItems } = useCart();

  // Close mobile menu on route change (state syncing)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Click-outside listener for mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-mobile-menu]") || target.closest("[data-menu-toggle]")) return;
      setMobileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileOpen((prev) => !prev);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleAccountClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      navigate("/dashboard");
    } else {
      setAuthModalOpen(true);
    }
    setMobileOpen(false);
  }, [user, navigate]);

  const logoSrc = branding.header_logo || headerLogo;

  const logoElement = (
    <img
      src={logoSrc}
      alt={branding.site_title || "Verified BM services official logo"}
      width={180}
      height={38}
      loading="eager"
      fetchPriority="high"
      decoding="sync"
      className="h-9 w-auto max-w-[180px] object-contain"
    />
  );

  const userInitial = profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U";
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center shrink-0">
              {logoElement}
            </Link>

            <div className="hidden md:flex items-center justify-center flex-1 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-primary ${
                    location.pathname === link.path ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 min-w-[120px] justify-end">
              <button
                onClick={(e) => { e.stopPropagation(); setSearchOpen(!searchOpen); }}
                className="text-foreground hover:text-primary transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); openCart(); }}
                className="relative text-foreground hover:text-primary transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* User button */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={displayName}
                          className="w-8 h-8 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                          {userInitial}
                        </div>
                      )}
                      <span className="hidden sm:inline text-sm font-medium max-w-[100px] truncate">
                        {displayName}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      My Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      Admin Panel
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setAuthModalOpen(true); }}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              <button
                data-menu-toggle
                className="md:hidden text-foreground"
                onClick={toggleMenu}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-border bg-background px-4 py-3">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, blog posts…"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </form>
          </div>
        )}

        {/* Mobile menu overlay + slide-out */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div
              data-mobile-menu
              className="fixed top-16 left-0 right-0 z-[9999] bg-background border-b border-border md:hidden"
              style={{ animation: "hero-fade-up 0.2s ease-out" }}
            >
              <div className="px-4 py-4 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === link.path ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* My Account link inside mobile menu */}
                <button
                  onClick={handleAccountClick}
                  className="flex items-center gap-2 w-full text-left text-sm font-medium text-foreground hover:text-primary transition-colors pt-3 border-t border-border"
                >
                  <User className="w-4 h-4" />
                  {user ? "My Account" : "Sign In / Register"}
                </button>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
