import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import NewsletterPopup from "@/components/newsletter/NewsletterPopup";
import TrackingScripts from "@/components/tracking/TrackingScripts";
import FloatingEditBar from "@/components/editor/FloatingEditBar";

const routeToSlug: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/contact": "contact",
  "/shop": "shop",
};

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Determine slug from known routes or dynamic /page/:slug
  let slug = routeToSlug[pathname] || "";
  if (!slug && pathname.startsWith("/page/")) {
    slug = pathname.replace("/page/", "");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <NewsletterPopup />
      <TrackingScripts />
      {slug && <FloatingEditBar slug={slug} />}
    </div>
  );
};

export default Layout;
