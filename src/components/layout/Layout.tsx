import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import NewsletterPopup from "@/components/newsletter/NewsletterPopup";
import TrackingScripts from "@/components/tracking/TrackingScripts";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <NewsletterPopup />
      <TrackingScripts />
    </div>
  );
};

export default Layout;
