const metrics = [
  { value: "99.9%", title: "Maximum Trust Score", desc: "Meta gives verified BMs the highest trust level. That means fewer bans, fewer headaches.", bar: 99.9, label: "99.9% Maximum" },
  { value: "10x", title: "Scale from Day One", desc: "No warm-up period. Start running big campaigns immediately with higher spend limits.", bar: 100, label: "10x Scale" },
  { value: "50+", title: "Premium Meta Tools", desc: "Access advanced APIs, analytics, and features that regular accounts can't touch.", bar: 80, label: "50+ Premium" },
  { value: "3x", title: "Better Ad Delivery", desc: "Meta's algorithm favors verified accounts. You get better placements, lower costs, higher ROAS.", bar: 75, label: "3x Better" },
  { value: "100%", title: "Protected Assets", desc: "Enhanced security keeps your ad accounts, client data, and creative assets safe.", bar: 100, label: "100% Protected" },
  { value: "A+", title: "Professional Credibility", desc: "Partners and clients take you seriously when you operate from a verified business identity.", bar: 95, label: "A+ Professional" },
];

const TopAdvertisers = () => (
  <section className="py-16 bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold tracking-widest uppercase text-primary text-center">Top Advertisers</p>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mt-2">Why the Best Media Buyers Use Verified BMs</h2>
      <p className="text-muted-foreground text-center mt-4">A verified BM isn't a nice-to-have. For top advertisers, it's the competitive edge.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {metrics.map((m, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-primary">{m.value}</p>
            <h3 className="font-bold text-foreground mt-2">{m.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{m.desc}</p>
            <div className="mt-4">
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${m.bar}%` }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TopAdvertisers;
