import { Link } from "wouter";
import { Eyebrow, FadeUp, SectionHeading } from "@/components/site/primitives";

// The four brand pillars, written as human sentences (brand guidelines)
export const VALUES = [
    { name: "Bold", line: "We back ourselves. No hedging and no over-promising, just honest confidence in our work." },
    { name: "Genuine", line: "We talk like people, not a corporate playbook. Real words, real relationships." },
    { name: "Premium", line: "Every output is considered. The quality of the work reflects the quality of the thinking." },
    { name: "Sharp", line: "Fast, precise and technically excellent. We care about the details you can't see." },
];

export default function About() {
    return (
        <section id="about" className="scroll-mt-24 py-28">
            <div className="container">
                <FadeUp className="grid lg:grid-cols-[1fr_1fr] gap-16">
                    <div>
                        <Eyebrow>Why DevEdge</Eyebrow>
                        <SectionHeading className="mt-5">
                            Small team.
                            <br />
                            <span className="text-primary">Full attention.</span>
                        </SectionHeading>
                        <div className="mt-8 space-y-5 text-[17px] leading-[1.7] text-foreground/85 max-w-xl">
                            <p>
                                We don't take on 50 clients at once. When you work with DevEdge, you actually get us: the people you talk to are
                                the people doing the work. No account managers, no farming out, no templates.
                            </p>
                            <p>
                                We'll tell you if something won't work, or if you don't need us at all. You're paying for honesty, not hype.
                            </p>
                            <p>
                                And everything we build is set up for an easy handover, so you stay because you want to, not because you're stuck.
                            </p>
                        </div>
                        <Link href="/about" className="mt-8 inline-block text-primary font-semibold hover:text-primary/80 transition-colors duration-150">
                            Our story →
                        </Link>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-px bg-[#D4B896] border border-[#D4B896] self-start">
                        {VALUES.map((v) => (
                            <div key={v.name} className="bg-background p-7">
                                <h3 className="font-display font-black text-[28px] tracking-tight text-primary">{v.name}</h3>
                                <p className="mt-2 text-[15px] leading-[1.7] text-muted-foreground">{v.line}</p>
                            </div>
                        ))}
                    </div>
                </FadeUp>
            </div>
        </section>
    );
}
