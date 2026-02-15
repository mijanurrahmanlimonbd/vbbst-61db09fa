import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import NewsletterPopup from "@/components/newsletter/NewsletterPopup";
import TrackingScripts from "@/components/tracking/TrackingScripts";
import FloatingEditBar from "@/components/editor/FloatingEditBar";
import { useEditMode } from "@/contexts/EditModeContext";

const routeToSlug: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/contact": "contact",
  "/shop": "shop",
};

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { isEditMode } = useEditMode();

  // Determine slug from known routes or dynamic /page/:slug
  let slug = routeToSlug[pathname] || "";
  if (!slug && pathname.startsWith("/page/")) {
    slug = pathname.replace("/page/", "");
  }

  // Prevent accidental navigation in edit mode
  useEffect(() => {
    if (!isEditMode) return;
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      // Allow toolbar/edit bar clicks
      if (target.closest("[data-edit-toolbar]")) return;
      // Allow external links
      const href = target.getAttribute("href");
      if (href?.startsWith("http") || href?.startsWith("mailto:") || href?.startsWith("tel:")) return;
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [isEditMode]);

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
