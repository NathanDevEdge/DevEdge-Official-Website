import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does a typical project take?",
    answer: "It depends on the scope. A landing page might take 2–3 weeks, while a full branding and website package could take 6–10. We'll give you a clear timeline before we begin."
  },
  {
    question: "What if I don't know exactly what I need?",
    answer: "No problem. We'll help you figure it out. Whether it's a quick call or a deeper discovery session, we'll guide you through it."
  },
  {
    question: "Do I need to start with a full project, or can we begin small?",
    answer: "Absolutely. You can book a single service or bundle multiple—whatever fits your goals and timeline."
  },
  {
    question: "How do payments work?",
    answer: "For projects, we usually split payments into 2 or 3 milestones. For monthly plans, billing is done upfront each month. Everything is clear and agreed upon before we start."
  },
  {
    question: "Do you provide ongoing support after the project?",
    answer: "Absolutely. Once your project goes live, we don't just disappear. We can stay involved to monitor performance, make improvements, or add new features as your business grows. Whether you need a quick fix, continued development, or a long-term partner, we'll be there to support you beyond the launch."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 relative">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-primary font-mono text-sm tracking-wider uppercase mb-2 block">[07 FAQ]</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Smarter decisions start with <span className="text-gradient">clear answers.</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-white/5 bg-card/20 rounded-2xl px-6">
              <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
