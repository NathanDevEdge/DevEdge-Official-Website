import { Link } from "wouter";
import ContactModal from "@/components/ContactModal";
import { Eyebrow, FadeUp } from "@/components/site/primitives";

/** Dark closing call-to-action used at the bottom of marketing pages */
export default function CtaBand({
    eyebrow = "Got a complex problem? Good.",
    heading = (
        <>
            That's where we do
            <br />
            our best work.
        </>
    ),
    body = "First conversation is always free. No pitch, no pressure, just an honest look at what you need.",
    secondary = { label: "See our work →", href: "/projects" },
}: {
    eyebrow?: string;
    heading?: React.ReactNode;
    body?: string;
    secondary?: { label: string; href: string } | null;
}) {
    return (
        <section className="relative bg-[#1A1008] overflow-hidden py-24">
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#C97B3A]/8 blur-[120px] rounded-full" />
            </div>
            <FadeUp className="container relative z-10 text-center">
                <Eyebrow light className="justify-center mb-6">{eyebrow}</Eyebrow>
                <h2
                    className="font-display font-black text-[#F5E6D5] leading-[0.88] tracking-tight mb-6"
                    style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}
                >
                    {heading}
                </h2>
                <p className="text-[#A89070] text-[17px] leading-relaxed mb-10 max-w-md mx-auto">{body}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <ContactModal
                        buttonText="Start a Project"
                        triggerClassName="bg-[#C97B3A] text-[#1A1008] hover:bg-[#b8692e] font-semibold px-8 h-12 rounded-none text-[15px] transition-colors duration-150"
                    />
                    {secondary && (
                        <Link
                            href={secondary.href}
                            className="inline-flex items-center gap-2 px-8 h-12 border border-[#2E1F0F] hover:border-[#C97B3A] text-[#A89070] hover:text-[#C97B3A] text-[15px] font-medium transition-colors duration-150"
                        >
                            {secondary.label}
                        </Link>
                    )}
                </div>
            </FadeUp>
        </section>
    );
}
