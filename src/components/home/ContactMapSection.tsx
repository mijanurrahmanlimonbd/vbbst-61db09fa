import { MapPin, Globe, MessageCircle, Send, Mail } from "lucide-react";

const ContactMapSection = () => (
  <section className="py-16 bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold tracking-widest uppercase text-primary text-center">Find Us</p>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mt-2">Get in Touch Anytime</h2>
      <p className="text-muted-foreground text-center mt-4 max-w-2xl mx-auto">
        Verified BM services operates as a global digital business from Madergonj, Pirgonj, Rangpur, Bangladesh. Reach us through any of the channels below — we're available 24/7.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <div>
          <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" /> Store Address
          </h3>
          <p className="text-muted-foreground mb-6">Verified BM services, Madergonj, Pirgonj, Rangpur, Bangladesh - 5470</p>

          <div className="space-y-4">
            {[
              { icon: <Globe className="w-5 h-5 text-primary" />, label: "Online Store", desc: "vbbstore.verifiedbmbuy.com – Shop 24/7 from anywhere in the world", href: "https://vbbstore.verifiedbmbuy.com/" },
              { icon: <MessageCircle className="w-5 h-5 text-primary" />, label: "WhatsApp", desc: "+880 1302 669333 – Chat with us anytime", href: "https://wa.me/8801302669333" },
              { icon: <Send className="w-5 h-5 text-primary" />, label: "Telegram", desc: "@Verifiedbmbuy – Message us on Telegram", href: "https://t.me/Verifiedbmbuy" },
              { icon: <Mail className="w-5 h-5 text-primary" />, label: "Email", desc: "info@vbbstore.verifiedbmbuy.com", href: "mailto:info@vbbstore.verifiedbmbuy.com" },
            ].map((c, i) => (
              <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
                {c.icon}
                <div>
                  <p className="font-semibold text-foreground">{c.label}</p>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="font-semibold text-foreground">Available 24/7</p>
            <p className="text-sm text-muted-foreground">We're online round the clock — reach out anytime, any day</p>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-border h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14382.073642373!2d89.3!3d25.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDQ4JzAwLjAiTiA4OcKwMTgnMDAuMCJF!5e0!3m2!1sen!2sbd!4v1600000000000!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Verified BM services Location"
          />
        </div>
      </div>
    </div>
  </section>
);

export default ContactMapSection;
