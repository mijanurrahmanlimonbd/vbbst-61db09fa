import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ShoppingBag, MessageCircle, User, X, ShoppingCart, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import AuthModal from "@/components/auth/AuthModal";
import ChatMenu from "./ChatMenu";

const navLinks = [
  { label: "HOME", path: "/" },
  { label: "SHOP", path: "/shop" },
  { label: "BLOG", path: "/blog" },
  { label: "CONTACT US", path: "/contact" },
  { label: "ABOUT US", path: "/about" },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openCart, totalItems } = useCart();
  const [authOpen, setAuthOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const baseClasses = "flex-1 flex flex-col items-center justify-center transition-all duration-150 active:scale-110 relative";
  const inactiveClasses = "text-muted-foreground";
  const activeClasses = "text-primary";

  const Dot = () => (
    <span className="absolute top-1.5 w-[6px] h-[6px] rounded-full bg-primary" />
  );

  return (
    <>
      <ChatMenu open={chatOpen} onClose={() => setChatOpen(false)} position="mobile" />

      {/* Mobile slide-up menu */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed bottom-[60px] left-0 right-0 z-[9999] bg-background border-t border-border rounded-t-2xl lg:hidden"
            style={{ animation: "hero-fade-up 0.2s ease-out", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <div className="px-5 py-5 space-y-1">
              {/* Cart button */}
              <button
                onClick={() => { openCart(); setMenuOpen(false); }}
                className="flex items-center gap-3 w-full text-left text-sm font-medium text-foreground hover:text-primary transition-colors py-2.5 px-2 rounded-lg hover:bg-muted"
              >
                <ShoppingCart className="w-5 h-5" />
                Cart
                {totalItems > 0 && (
                  <span className="ml-auto w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              <div className="border-t border-border my-1" />

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block text-sm font-medium transition-colors py-2.5 px-2 rounded-lg hover:bg-muted ${
                    location.pathname === link.path ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex justify-between lg:hidden h-[60px] bg-background border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.06)] px-4"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={`${baseClasses} ${menuOpen ? activeClasses : inactiveClasses}`}
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" strokeWidth={2} /> : <Menu className="w-6 h-6" strokeWidth={2} />}
        </button>

        <Link
          to="/shop"
          className={`${baseClasses} ${isActive("/shop") ? activeClasses : inactiveClasses}`}
          aria-label="Shop"
        >
          {isActive("/shop") && <Dot />}
          <ShoppingBag className="w-6 h-6" strokeWidth={2} />
        </Link>

        <button
          onClick={() => setChatOpen((v) => !v)}
          className={`${baseClasses} text-[hsl(142,70%,49%)]`}
          aria-label="Chat support"
        >
          <MessageCircle className="w-6 h-6" strokeWidth={2} />
        </button>

        {user ? (
          <Link
            to="/dashboard"
            className={`${baseClasses} ${isActive("/dashboard") ? activeClasses : inactiveClasses}`}
            aria-label="My Account"
          >
            {isActive("/dashboard") && <Dot />}
            <User className="w-6 h-6" strokeWidth={2} />
          </Link>
        ) : (
          <button
            onClick={() => setAuthOpen(true)}
            className={`${baseClasses} ${inactiveClasses}`}
            aria-label="My Account"
          >
            <User className="w-6 h-6" strokeWidth={2} />
          </button>
        )}
      </nav>

      <div className="h-[60px] lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }} />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default MobileBottomNav;
