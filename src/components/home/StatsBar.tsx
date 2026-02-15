import { Shield, Award, Clock, Zap } from "lucide-react";

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatsBar = ({ stats }: { stats?: Stat[] }) => {
  const defaultStats: Stat[] = [
    { icon: <Shield className="w-6 h-6 text-primary" />, value: "100%", label: "Verified Accounts" },
    { icon: <Award className="w-6 h-6 text-primary" />, value: "A+ Rated", label: "Best Quality" },
    { icon: <Clock className="w-6 h-6 text-primary" />, value: "5+ Years", label: "On Market" },
    { icon: <Zap className="w-6 h-6 text-primary" />, value: "Instant", label: "Delivery" },
  ];

  const items = stats || defaultStats;

  return (
    <section className="border-y border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
