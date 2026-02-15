import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import ChatMenu from "./ChatMenu";

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

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

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-between lg:hidden h-[60px] bg-background border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.06)] px-4"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <Link
          to="/"
          className={`${baseClasses} ${isActive("/") ? activeClasses : inactiveClasses}`}
          aria-label="Home"
        >
          {isActive("/") && <Dot />}
          <Home className="w-6 h-6" strokeWidth={2} />
        </Link>

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
