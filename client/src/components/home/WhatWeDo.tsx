import { Link } from "wouter";
import { Eyebrow, FadeUp, SectionHeading } from "@/components/site/primitives";
import { GROUP_LABELS, JOURNEY, servicesByGroup, type ServiceGroup } from "@/data/services";

export default function WhatWeDo() {
    return (
        <section id="what-we-do" className="scroll-mt-24 py-28">
            <div className="container">
                <FadeUp>
                    <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-end">
                        <div>
                            <Eyebrow>What we do</Eyebrow>
                            <SectionHeading className="mt-5">
                                We build it.
                                <br />
                                <span className="text-primary">Then we grow it.</span>
                            </SectionHeading>
                        </div>
                        <p className="text-muted-foreground text-[17px] leading-[1.7] max-w-lg">
                            Seven services, one team, built to work together. Start with the piece you need now, and add the rest when it
                            makes sense.
                        </p>
                    </div>

                    {/* The connected journey */}
                    <ol className="mt-14 grid grid-cols-2 md:grid-cols-5 border-y border-[#D4B896]">
                        {JOURNEY.map((j, i) => (
                            <li
                                key={j.step}
                                className={`py-6 pr-4 ${i > 0 ? "md:border-l md:pl-5" : ""} border-[#D4B896]`}
                            >
                                <span className="font-mono text-[11px] text-primary tracking-widest">{j.step}</span>
                                <p className="mt-1 font-display font-black text-[24px] tracking-tight">{j.label}</p>
                                <p className="mt-1 text-[13px] leading-[1.5] text-muted-foreground">{j.body}</p>
                            </li>
                        ))}
                    </ol>

                    {/* Services, grouped */}
                    <div className="mt-16 grid lg:grid-cols-2 gap-12">
                        {(["build", "grow"] as ServiceGroup[]).map((group) => (
                            <div key={group}>
                                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground mb-4">{GROUP_LABELS[group]}</p>
                                <div className="border-t border-[#D4B896]">
                                    {servicesByGroup(group).map((s) => (
                                        <Link key={s.slug} href={`/services/${s.slug}`}>
                                            <div className="group flex items-start justify-between gap-6 py-5 border-b border-[#D4B896]">
                                                <div>
                                                    <h3 className="font-display font-black text-[26px] tracking-tight group-hover:text-primary transition-colors duration-150">
                                                        {s.name}
                                                    </h3>
                                                    <p className="mt-1 text-[14px] leading-[1.6] text-muted-foreground">{s.short}</p>
                                                </div>
                                                <span className="text-primary text-xl pt-1 transition-transform duration-150 group-hover:translate-x-1">→</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/services"
                        className="inline-block mt-10 font-mono text-[12px] tracking-[0.18em] uppercase text-primary hover:text-primary/80"
                    >
                        How it all fits together →
                    </Link>
                </FadeUp>
            </div>
        </section>
    );
}
