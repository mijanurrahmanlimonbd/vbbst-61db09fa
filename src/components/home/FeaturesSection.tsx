import { memo } from "react";
import { Headphones, Zap, RefreshCw } from "lucide-react";

const features = [
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "Talk to a Real Person",
    description: "Got a question? Our team is available around the clock. You'll speak with someone who actually knows Business Managers inside and out.",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    subtitle: "No Waiting Around",
    description: "Pay, contact us, and get your account credentials right away. No delays, no back-and-forth — just fast, secure delivery.",
  },
  {
    icon: RefreshCw,
    title: "7 Days Replacement",
    subtitle: "We've Got Your Back",
    description: "If something goes wrong with your account in the first 7 days (and it's not your doing), we'll replace it free of charge. Simple as that.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="pt-3 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-hero-fade-up"
                style={{ animationDelay: `${0.1 + i * 0.15}s` }}
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm font-semibold text-primary mt-1">{feature.subtitle}</p>
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(FeaturesSection);
