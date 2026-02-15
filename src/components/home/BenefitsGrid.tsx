import { Shield, TrendingUp, Users, Unlock, Globe, Clock, DollarSign, Lock, BarChart3, Target, Share2, Ban, MessageSquare, Bot, Eye, ShieldCheck, Smartphone, Users2, Bell, Inbox, BadgeCheck, FileText, Headphones, ImageIcon } from "lucide-react";

const verifiedBMBenefits = [
  { icon: <Shield className="w-6 h-6 text-primary" />, title: "Higher Trust Score", desc: "Verified BMs are far less likely to get flagged or banned — Meta treats them differently." },
  { icon: <TrendingUp className="w-6 h-6 text-primary" />, title: "Better Ad Results", desc: "Higher trust means your ads get delivered more often, at lower costs. Your ROI goes up." },
  { icon: <Users className="w-6 h-6 text-primary" />, title: "Run Multiple Ad Accounts", desc: "One verified BM lets you manage several ad accounts — great for testing or running client campaigns." },
  { icon: <Unlock className="w-6 h-6 text-primary" />, title: "Unlock Premium Tools", desc: "Get access to Meta features that aren't available to unverified accounts." },
  { icon: <Globe className="w-6 h-6 text-primary" />, title: "Advertise Anywhere", desc: "No country restrictions. Run campaigns in any market you want." },
  { icon: <Clock className="w-6 h-6 text-primary" />, title: "Faster Ad Approvals", desc: "Meta reviews your ads quicker when they know you're a verified business." },
  { icon: <DollarSign className="w-6 h-6 text-primary" />, title: "Higher Spend Limits", desc: "Verified accounts can spend significantly more per day — no more hitting ceilings." },
  { icon: <Lock className="w-6 h-6 text-primary" />, title: "Better Security", desc: "Extra layers of protection keep your ad accounts and data safe from unauthorized access." },
  { icon: <BarChart3 className="w-6 h-6 text-primary" />, title: "Detailed Analytics", desc: "Access reporting tools that give you deeper insights into your campaign performance." },
  { icon: <Target className="w-6 h-6 text-primary" />, title: "Multiple Pixels", desc: "Set up and manage several pixels for more precise audience tracking and retargeting." },
  { icon: <Share2 className="w-6 h-6 text-primary" />, title: "Easy Asset Sharing", desc: "Share pages, pixels, and ad accounts between agencies and clients without headaches." },
  { icon: <Ban className="w-6 h-6 text-primary" />, title: "Fewer Restrictions", desc: "Verified accounts deal with far fewer random bans and limitations from Meta." },
];

const whatsappBenefits = [
  { icon: <MessageSquare className="w-6 h-6 text-primary" />, title: "Bulk Messaging", desc: "Send thousands of messages, order updates, and promos — all from one dashboard." },
  { icon: <Bot className="w-6 h-6 text-primary" />, title: "Chatbot Ready", desc: "Hook up AI chatbots to handle customer questions while you sleep." },
  { icon: <Eye className="w-6 h-6 text-primary" />, title: "Track Everything", desc: "See who opened your messages, who replied, and how your campaigns perform." },
  { icon: <ShieldCheck className="w-6 h-6 text-primary" />, title: "Fully Encrypted", desc: "WhatsApp's end-to-end encryption keeps every business conversation private." },
  { icon: <Smartphone className="w-6 h-6 text-primary" />, title: "Use Multiple Devices", desc: "Your whole team can manage conversations from different devices at the same time." },
  { icon: <Users2 className="w-6 h-6 text-primary" />, title: "Reach 2B+ Users", desc: "WhatsApp is used in 180+ countries. Your customers are already there." },
  { icon: <Bell className="w-6 h-6 text-primary" />, title: "Real-Time Alerts", desc: "Send instant order confirmations, shipping updates, and payment receipts." },
  { icon: <Inbox className="w-6 h-6 text-primary" />, title: "Team Inbox", desc: "Assign chats to team members so nothing falls through the cracks." },
  { icon: <BadgeCheck className="w-6 h-6 text-primary" />, title: "Green Badge Verified", desc: "Get the official green checkmark that tells customers you're the real deal." },
  { icon: <FileText className="w-6 h-6 text-primary" />, title: "Message Templates", desc: "Use pre-approved templates for consistent, compliant outreach at scale." },
  { icon: <Headphones className="w-6 h-6 text-primary" />, title: "Always-On Support", desc: "Combine automated flows with live agents for round-the-clock customer care." },
  { icon: <ImageIcon className="w-6 h-6 text-primary" />, title: "Rich Media", desc: "Send images, videos, documents, and interactive buttons — not just plain text." },
];

const BenefitsGrid = ({ type }: { type: "bm" | "whatsapp" }) => {
  const isBM = type === "bm";
  const benefits = isBM ? verifiedBMBenefits : whatsappBenefits;

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary text-center">
          {isBM ? "Why Verified BM?" : "WhatsApp API"}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mt-2">
          {isBM ? "Why Smart Advertisers Use Verified BMs" : "Why Businesses Need WhatsApp API"}
        </h2>
        <p className="text-muted-foreground text-center mt-4 max-w-2xl mx-auto">
          {isBM
            ? "If you're serious about Meta ads, a verified BM isn't optional — it's the foundation."
            : "Your customers are on WhatsApp. Meet them where they already are."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {benefits.map((b, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">{b.icon}</div>
              <h3 className="font-bold text-foreground">{b.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsGrid;
