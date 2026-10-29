// Prototype of the home page with the 3D layer in place (ROADMAP: Design & 3D layer, D2).
// Hidden test page: not linked, not pre-rendered, noindex. three.js only loads here.
import { lazy, Suspense, useEffect, useRef, useState, type RefObject } from "react";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import ContactModal from "@/components/ContactModal";
import Problem from "@/components/home/Problem";
import WhatWeDo from "@/components/home/WhatWeDo";
import SelectedWork from "@/components/home/SelectedWork";
import About from "@/components/home/About";
import Testimonials from "@/components/home/Testimonials";
import HowWeWork from "@/components/home/HowWeWork";
import FAQ from "@/components/home/FAQ";
import Close from "@/components/home/Close";
import { Eyebrow, FadeUp, SectionHeading } from "@/components/site/primitives";
import { STACK_LAYERS } from "@/data/stack";

const StackScene = lazy(() => import("@/components/three/StackScene"));
const ConnectsScene = lazy(() => import("@/components/three/ConnectsScene"));

const FLOW = [
    "Someone sees your ad on Meta or Google",
    "Lands on a fast page and fills in the form",
    "The lead lands in your CRM and a follow-up goes out",
    "Quote accepted, invoice raised automatically in Xero",
    "The sale is reported back, so the ads find more like them",
];

const hasWebGL = () => {
    try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
        return false;
    }
};

/** WebGL support, reduced-motion preference, and a flag that flips once the page has painted */
function use3D() {
    const [state, setState] = useState({ ready: false, webgl: true, reducedMotion: false });
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const id = requestAnimationFrame(() => setState({ ready: true, webgl: hasWebGL(), reducedMotion: mq.matches }));
        return () => cancelAnimationFrame(id);
    }, []);
    return state;
}

/** Only render 3D frames while the section is on screen */
function useOnScreen(ref: RefObject<HTMLElement | null>) {
    const [on, setOn] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "200px" });
        io.observe(el);
        return () => io.disconnect();
    }, [ref]);
    return on;
}

function StackHero() {
    const [, navigate] = useLocation();
    const ref = useRef<HTMLElement>(null);
    const onScreen = useOnScreen(ref);
    const { ready, webgl, reducedMotion } = use3D();

    return (
        <section ref={ref} id="top" className="relative overflow-hidden pt-28 lg:pt-0 lg:min-h-screen lg:flex lg:items-center">
            {/* Drafting-paper grid */}
            <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden
                style={{
                    backgroundImage:
                        "linear-gradient(to right, rgba(46,31,15,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(46,31,15,0.06) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    maskImage: "radial-gradient(ellipse 70% 70% at 65% 55%, black 30%, transparent 85%)",
                }}
            />
            <div className="container relative z-10 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:gap-4 items-center">
                {/* Text stays real HTML and paints first (LCP) */}
                <div className="lg:py-32">
                    <Eyebrow>Websites · Apps · Systems · Growth</Eyebrow>
                    <h1 className="mt-6 font-display font-black leading-[0.88] tracking-tight text-foreground" style={{ fontSize: "clamp(56px, 7vw, 104px)" }}>
                        We build
                        <br />
                        things that
                        <br />
                        actually <span className="text-primary">work.</span>
                    </h1>
                    <p className="mt-7 text-[17px] text-muted-foreground max-w-[420px] leading-relaxed">
                        Websites, apps, business systems and marketing for Australian businesses that need results, not just deliverables.
                    </p>
                    <div className="mt-9 flex flex-wrap gap-3">
                        <ContactModal
                            buttonText="Start a Project"
                            triggerClassName="bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-8 h-12 rounded-none text-[15px] transition-colors duration-150"
                        />
                        <button
                            onClick={() => document.getElementById("what-we-do")?.scrollIntoView({ behavior: "smooth" })}
                            className="inline-flex items-center gap-2 px-8 h-12 border border-[#D4B896] text-foreground hover:border-primary hover:text-primary text-[15px] font-medium transition-colors duration-150"
                        >
                            See How It Works <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* The Stack: plays on its own */}
                <div className="relative h-[68vh] min-h-[440px] lg:h-[84vh] lg:max-h-[860px]">
                    {ready && webgl && (
                        <Suspense fallback={null}>
                            <StackScene reducedMotion={reducedMotion} active={onScreen} onSelect={(slug) => navigate(`/services/${slug}`)} />
                        </Suspense>
                    )}
                    <ol className="sr-only">
                        {STACK_LAYERS.map((l) => (
                            <li key={l.slug}>{l.name}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}

function HowItConnects() {
    const ref = useRef<HTMLElement>(null);
    const onScreen = useOnScreen(ref);
    const { ready, webgl, reducedMotion } = use3D();

    return (
        <section ref={ref} id="how-it-connects" className="relative py-24 bg-[#F0DDC6] overflow-hidden">
            <div className="container">
                <FadeUp className="grid lg:grid-cols-[1fr_1fr] gap-10 items-end">
                    <div>
                        <Eyebrow>How it connects</Eyebrow>
                        <SectionHeading className="mt-5">
                            One lead.
                            <br />
                            <span className="text-primary">No copy and paste.</span>
                        </SectionHeading>
                    </div>
                    <p className="text-muted-foreground text-[17px] leading-[1.7] max-w-lg">
                        When the ads, the website and your business systems are built by the same team, a customer moves from first click to
                        paid invoice without anyone retyping a thing. And every sale makes the next ad smarter.
                    </p>
                </FadeUp>
            </div>
            <div className="container mt-6">
                <div className="relative h-[760px] sm:h-[460px] lg:h-[520px]">
                    {ready && webgl && (
                        <Suspense fallback={null}>
                            <ConnectsScene reducedMotion={reducedMotion} active={onScreen} />
                        </Suspense>
                    )}
                    <ol className="sr-only">
                        {FLOW.map((f) => (
                            <li key={f}>{f}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}

export default function HeroLab() {
    const [notesOpen, setNotesOpen] = useState(false);
    return (
        <div className="bg-background text-foreground font-sans selection:bg-primary/20">
            <SEO title="Home with 3D | DevEdge Lab" description="Internal prototype." noindex />
            <Navigation />

            <main>
                <StackHero />
                <Problem />
                <WhatWeDo />
                <HowItConnects />
                <SelectedWork />
                <About />
                <Testimonials />
                <HowWeWork />
                <FAQ />
                <Close />
            </main>

            <Footer />
            <MobileCTA />

            {/* Prototype notes (lab only) */}
            {notesOpen ? (
                <div className="fixed bottom-20 lg:bottom-4 right-4 z-50 bg-[#1A1008] text-[#F5E6D5] p-4 w-[260px] font-mono text-[11px] leading-relaxed shadow-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-[#C97B3A] uppercase tracking-[0.18em]">Lab · 3D moments</span>
                        <button type="button" onClick={() => setNotesOpen(false)} className="text-[#A89070] hover:text-[#F5E6D5]" aria-label="Hide notes">
                            ✕
                        </button>
                    </div>
                    <ol className="mt-3 space-y-2">
                        <li>
                            <a href="#top" className="text-[#F5E6D5] hover:text-[#C97B3A]">01 Hero: the Stack</a>
                            <div className="text-[#A89070]">Opens and closes on its own. Hover a layer to hold it open.</div>
                        </li>
                        <li>
                            <a href="#how-it-connects" className="text-[#F5E6D5] hover:text-[#C97B3A]">02 How it connects</a>
                            <div className="text-[#A89070]">A lead travels ad → website → CRM → Xero → report, then loops back.</div>
                        </li>
                    </ol>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setNotesOpen(true)}
                    className="fixed bottom-20 lg:bottom-4 right-4 z-50 bg-[#1A1008] text-[#C97B3A] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em]"
                >
                    Lab
                </button>
            )}
        </div>
    );
}
