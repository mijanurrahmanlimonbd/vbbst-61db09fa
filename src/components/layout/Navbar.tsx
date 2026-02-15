import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Blog", path: "/blog" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">VS</div>
            <span className="text-lg font-bold text-foreground tracking-tight">VBB <span className="text-primary">STORE</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path || (link.path === "/blog" && location.pathname.startsWith("/blog"))
                    ? "text-primary"
                    : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {searchOpen ? (
              <form action="/blog" method="get" className="flex items-center gap-2" onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `/blog?search=${encodeURIComponent(searchQuery)}`;
              }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="w-40 sm:w-56 px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-foreground hover:text-primary transition-colors" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
            )}
            <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
