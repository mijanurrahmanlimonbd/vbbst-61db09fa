import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const fallback = [
  { id: "1", client_name: "James W.", job_title: "Agency buyer • USA", rating: 5, testimonial_text: "Best verified BM provider I've ever used. Account was delivered in minutes and works flawlessly.", avatar_url: null },
  { id: "2", client_name: "Aisha K.", job_title: "Digital Marketer • UAE", rating: 5, testimonial_text: "Purchased 3 verified BMs for our agency. All came with genuine documentation and high trust scores.", avatar_url: null },
  { id: "3", client_name: "Markus S.", job_title: "E-commerce Owner • Germany", rating: 5, testimonial_text: "The WhatsApp API account was set up perfectly. Customer support was incredibly helpful throughout the process.", avatar_url: null },
];

const TestimonialsSection = () => {
  const { data: items, isLoading } = useQuery({
    queryKey: ["testimonials-home"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("status", "approved")
        .order("sort_order");
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const display = isLoading ? [] : (items && items.length > 0 ? items : fallback);

  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold tracking-widest uppercase text-primary text-center">Testimonials</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mt-2">Customer Success Stories</h2>
        <p className="text-muted-foreground text-center mt-4">Thousands of advertisers trust Verified BM services. Here's what they have to say.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-8 space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center gap-3 mt-6">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </div>
              ))
            : display.map((t) => (
                <div key={t.id} className="bg-card border border-border rounded-xl p-8 hover:shadow-md transition-shadow">
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={`w-4 h-4 ${i <= t.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/20"}`} />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic text-sm leading-relaxed">"{t.testimonial_text}"</p>
                  <div className="flex items-center gap-3 mt-6">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt={t.client_name} loading="lazy" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        {t.client_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.client_name}</p>
                      {t.job_title && <p className="text-xs text-muted-foreground">{t.job_title}</p>}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
