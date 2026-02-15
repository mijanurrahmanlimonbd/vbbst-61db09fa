const testimonials = [
  {
    quote: "Best verified BM provider I've ever used. Account was delivered in minutes and works flawlessly. Scaled our ad spend 5x within the first week. Highly recommend Verified BM services!",
    name: "James W.",
    role: "Agency buyer • USA",
    initial: "J",
  },
  {
    quote: "Purchased 3 verified BMs for our agency. All came with genuine documentation and high trust scores. The team was professional and supportive throughout.",
    name: "Aisha K.",
    role: "Digital Marketer • UAE",
    initial: "A",
  },
  {
    quote: "The WhatsApp API account was set up perfectly. Customer support was incredibly helpful throughout the process. Our customer engagement increased by 300%.",
    name: "Markus S.",
    role: "E-commerce Owner • Germany",
    initial: "M",
  },
];

const TestimonialsSection = () => (
  <section className="py-16 bg-secondary/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold tracking-widest uppercase text-primary text-center">Testimonials</p>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mt-2">Customer Success Stories</h2>
      <p className="text-muted-foreground text-center mt-4">Thousands of advertisers trust Verified BM services. Here's what they have to say.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-8 hover:shadow-md transition-shadow">
            <p className="text-muted-foreground italic text-sm leading-relaxed">"{t.quote}"</p>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {t.initial}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
