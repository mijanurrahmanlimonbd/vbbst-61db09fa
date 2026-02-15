import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What exactly is a Verified Business Manager?", a: "A Verified Business Manager is a Meta-approved account that has passed identity and business verification using legitimate company documents. It earns the highest trust level from Meta, unlocking premium advertising features, higher spend limits, and better ad delivery." },
  { q: "How does the verification work?", a: "Meta verifies the business identity using real company registration documents, tax IDs, and other official paperwork. Our accounts have already completed this process, so you get a fully verified BM ready to use immediately." },
  { q: "What's the WhatsApp Business API?", a: "The WhatsApp Business API is an enterprise-level messaging platform that allows businesses to send bulk messages, set up chatbots, integrate with CRM systems, and manage customer communications at scale." },
  { q: "How fast will I get my account?", a: "Most accounts are delivered within 1-4 hours after payment confirmation. Many are delivered within minutes." },
  { q: "What payment methods do you accept?", a: "We accept USDT (TRC20), Bitcoin (BTC), and Ethereum (ETH). Cryptocurrency payments ensure fast, secure, and private transactions." },
  { q: "What if my account stops working?", a: "We offer a 7-day free replacement guarantee. If your account has any issues within 7 days of purchase (that aren't caused by your actions), we'll replace it at no cost." },
  { q: "Can I use a verified BM for any niche?", a: "Yes, verified BMs work for all advertising niches supported by Meta's advertising policies. However, you must comply with Meta's advertising guidelines." },
  { q: "How many ad accounts can I run?", a: "The number of ad accounts depends on the BM tier you purchase. BM 1 supports 1 ad account, BM 3 supports 3, BM 5 supports 5, and BM 10 supports 10 ad accounts." },
  { q: "Is buying a verified BM safe?", a: "Absolutely. Every account we sell comes with genuine verification documents and is created through Meta's official verification process. We've served over 10,000 customers with a stellar track record." },
  { q: "Do you offer bulk pricing?", a: "Yes! We offer volume discounts for agencies and resellers ordering 10 or more accounts. Contact us on WhatsApp or Telegram for custom pricing." },
  { q: "Do you sell TikTok and Google Ads accounts?", a: "Yes, we offer verified TikTok Agency Ad Accounts and Google Ads accounts, ready to use with high spending limits and faster approvals." },
  { q: "Can I get a reinstated Facebook profile?", a: "Yes, we offer reinstated Facebook profiles with clean records and full functionality. These are recovered profiles that have been restored to good standing." },
  { q: "How do I reach support after buying?", a: "Our support team is available 24/7 via WhatsApp (+880 1302 669333), Telegram (@Verifiedbmbuy), and email. We typically respond within minutes." },
  { q: "What trust score do your BMs have?", a: "Our verified BMs have the highest trust score possible from Meta (99.9%), which means fewer bans, better ad delivery, and higher spend limits." },
  { q: "Can I start running ads immediately?", a: "Yes! All our accounts come ready to use. Simply log in, set up your payment method, create your ad campaign, and start advertising right away." },
  { q: "Do your WhatsApp API accounts get the green badge?", a: "Yes, our WhatsApp Business API accounts are eligible for the official green checkmark verification, which builds trust with your customers." },
  { q: "What happens if my account gets restricted?", a: "If your account gets restricted within the 7-day guarantee period due to no fault of your own, we'll replace it for free. Our team can also help troubleshoot restriction issues." },
  { q: "Can I use the account from any country?", a: "Yes, our verified accounts work globally. You can run campaigns targeting any country or region without geographic restrictions." },
  { q: "Do accounts come with documentation?", a: "Every account comes with complete verification documents including business registration, tax information, and all paperwork used in the Meta verification process." },
  { q: "How long have you been doing this?", a: "VBB STORE has been operating since 2019, with over 5 years of experience serving more than 10,000 customers across 50+ countries." },
];

const FAQSection = () => (
  <section className="py-16 bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold tracking-widest uppercase text-primary text-center">FAQ</p>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mt-2">Got Questions? We've Got Answers.</h2>
      <p className="text-muted-foreground text-center mt-4">Here's everything people usually ask before buying.</p>

      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
        {faqs.map((faq, i) => (
          <Accordion key={i} type="single" collapsible>
            <AccordionItem value={`faq-${i}`} className="bg-card border border-border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold text-foreground py-2 text-sm">
                <span className="truncate block">{faq.q}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm pb-2">{faq.a}</AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  </section>
);

export default FAQSection;
