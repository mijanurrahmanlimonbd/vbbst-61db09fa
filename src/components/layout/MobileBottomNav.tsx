import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden h-[60px] bg-background border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <Link
          to="/"
          className={`flex-1 flex items-center justify-center transition-colors ${
            isActive("/") ? "text-primary" : "text-muted-foreground"
          }`}
          aria-label="Home"
        >
          <Home className="w-6 h-6" />
        </Link>

        <Link
          to="/shop"
          className={`flex-1 flex items-center justify-center transition-colors ${
            isActive("/shop") ? "text-primary" : "text-muted-foreground"
          }`}
          aria-label="Shop"
        >
          <ShoppingBag className="w-6 h-6" />
        </Link>

        <a
          href="https://wa.me/8801302669333"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center text-muted-foreground transition-colors"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        {user ? (
          <Link
            to="/dashboard"
            className={`flex-1 flex items-center justify-center transition-colors ${
              isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
            }`}
            aria-label="My Account"
          >
            <User className="w-6 h-6" />
          </Link>
        ) : (
          <button
            onClick={() => setAuthOpen(true)}
            className="flex-1 flex items-center justify-center text-muted-foreground transition-colors"
            aria-label="My Account"
          >
            <User className="w-6 h-6" />
          </button>
        )}
      </nav>

      {/* Spacer so page content isn't hidden behind the bar */}
      <div className="h-[60px] lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }} />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default MobileBottomNav;
