import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/site/PageHero";
import { Eyebrow, FadeUp } from "@/components/site/primitives";
import { SITE } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/schema";

const NEXT_STEPS = [
    "We reply within one business day, usually sooner.",
    "A free conversation about what you need. No pitch, no pressure.",
    "If we're a good fit, you get a clear, fixed quote. If we're not, we'll tell you.",
];

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO
                title="Contact DevEdge | Start a Project"
                description="Tell us about your project. Websites, apps, CRM & ERP systems or marketing: we reply within one business day, and the first conversation is free."
                jsonLd={breadcrumbSchema([
                    { name: "Home", path: "/" },
                    { name: "Contact", path: "/contact" },
                ])}
            />
            <Navigation />

            <PageHero
                crumbs={[{ label: "Home", href: "/" }]}
                eyebrow="Contact"
                title={
                    <>
                        Let's talk about
                        <br />
                        <span className="text-primary">what you need.</span>
                    </>
                }
                tagline="Tell us what's going on: the problem, the idea, or the thing that's slowing you down. We'll come back with an honest view of what will actually work."
            />

            <section className="container pb-28">
                <FadeUp className="grid lg:grid-cols-[2fr_3fr] gap-16 items-start">
                    <div className="space-y-12">
                        <div>
                            <Eyebrow>Talk to us directly</Eyebrow>
                            <div className="mt-6 space-y-4">
                                <a href={`mailto:${SITE.email}`} className="block font-display font-black text-[28px] tracking-tight hover:text-primary transition-colors duration-150">
                                    {SITE.email}
                                </a>
                                <a href={SITE.phoneHref} className="block font-display font-black text-[28px] tracking-tight hover:text-primary transition-colors duration-150">
                                    {SITE.phone}
                                </a>
                                <p className="text-muted-foreground text-[15px]">Monday to Friday, 9am to 5pm. Working with businesses across Australia.</p>
                            </div>
                        </div>

                        <div>
                            <Eyebrow>What happens next</Eyebrow>
                            <ol className="mt-6 space-y-5">
                                {NEXT_STEPS.map((step, i) => (
                                    <li key={step} className="flex gap-4">
                                        <span className="font-mono text-[11px] text-primary tracking-widest pt-1">{String(i + 1).padStart(2, "0")}</span>
                                        <span className="text-[15px] leading-[1.7] text-foreground/85">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="bg-[#EDD9C0] border-l-2 border-primary p-6">
                            <p className="text-[15px] leading-[1.7]">
                                <strong>Already a client?</strong> Raise and track requests in the{" "}
                                <a href="/portal/login" className="text-primary hover:text-primary/80 font-semibold">
                                    client portal
                                </a>
                                .
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#FBEFD9] border border-[#D4B896] p-8 md:p-10">
                        <h2 className="font-display font-black text-[32px] tracking-tight mb-1">Start a project</h2>
                        <p className="text-muted-foreground text-[15px] mb-8">A few details and we'll be in touch.</p>
                        <ContactForm />
                    </div>
                </FadeUp>
            </section>

            <Footer />
        </div>
    );
}
