import { Eyebrow, FadeUp, SectionHeading } from "@/components/site/primitives";

const PROBLEMS = [
    {
        title: "Five suppliers. Nobody owns the result.",
        body: "A web designer, a developer, a CRM consultant and a marketing agency, each doing their bit and pointing at the others when it doesn't work.",
    },
    {
        title: "Leads go missing in the gaps.",
        body: "The website form goes to an inbox, the CRM doesn't get updated, and quotes still live in spreadsheets. Customers slip through.",
    },
    {
        title: "Nobody knows what's working.",
        body: "Money goes into ads and SEO, but no one can say which of it turned into paying customers.",
    },
];

export default function Problem() {
    return (
        <section id="problem" className="scroll-mt-24 bg-[#1A1008] py-28">
            <div className="container">
                <FadeUp>
                    <Eyebrow light>The problem</Eyebrow>
                    <SectionHeading light className="mt-5 max-w-3xl">
                        Your website, systems and marketing should work together.{" "}
                        <span className="text-[#C97B3A]">Usually they don't.</span>
                    </SectionHeading>
                    <div className="mt-16 grid md:grid-cols-3 gap-px bg-[#2E1F0F] border border-[#2E1F0F]">
                        {PROBLEMS.map((p, i) => (
                            <div key={p.title} className="bg-[#1A1008] p-8">
                                <span className="font-mono text-[11px] text-[#664422] tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                                <h3 className="mt-3 font-display font-black text-[26px] leading-tight text-[#F5E6D5] tracking-tight">{p.title}</h3>
                                <p className="mt-4 text-[15px] leading-[1.7] text-[#A89070]">{p.body}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-12 max-w-2xl text-[19px] leading-[1.6] text-[#F5E6D5]">
                        DevEdge is one team for all of it. We build the systems, bring in the customers, and prove what's working, so
                        nothing gets lost in between.
                    </p>
                </FadeUp>
            </div>
        </section>
    );
}
