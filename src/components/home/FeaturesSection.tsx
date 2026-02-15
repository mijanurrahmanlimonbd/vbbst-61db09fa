import { Headphones, Zap, RefreshCw } from "lucide-react";

const features = [
  {
    icon: <Headphones className="w-8 h-8 text-primary" />,
    title: "24/7 Support",
    subtitle: "Talk to a Real Person",
    description: "Got a question? Our team is available around the clock. You'll speak with someone who actually knows Business Managers inside and out.",
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Instant Delivery",
    subtitle: "No Waiting Around",
    description: "Pay, contact us, and get your account credentials right away. No delays, no back-and-forth — just fast, secure delivery.",
  },
  {
    icon: <RefreshCw className="w-8 h-8 text-primary" />,
    title: "7 Days Replacement",
    subtitle: "We've Got Your Back",
    description: "If something goes wrong with your account in the first 7 days (and it's not your doing), we'll replace it free of charge. Simple as that.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
              <p className="text-sm font-semibold text-primary mt-1">{feature.subtitle}</p>
              <p className="text-muted-foreground mt-4 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
