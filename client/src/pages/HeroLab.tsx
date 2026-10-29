// Prototype of the "exploded Stack" home hero (ROADMAP: Design & 3D layer, D2).
// Hidden test page: not linked, not pre-rendered, noindex. three.js only loads here.
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import { STACK_LAYERS } from "@/data/stack";

const StackScene = lazy(() => import("@/components/three/StackScene"));

const hasWebGL = () => {
    try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
        return false;
    }
};

export default function HeroLab() {
    const [, navigate] = useLocation();
    const track = useRef<HTMLElement>(null);
    const progressRef = useRef(0);
    const [ready, setReady] = useState(false); // 3D starts after first paint
    const [webgl, setWebgl] = useState(true);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [active, setActive] = useState(true);
    const [followScroll, setFollowScroll] = useState(true);
    const [manual, setManual] = useState(0);
    const [scrollHint, setScrollHint] = useState(1);
    const [panelOpen, setPanelOpen] = useState(() => typeof window === "undefined" || window.innerWidth >= 640);

    useEffect(() => {
        setWebgl(hasWebGL());
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);
        const onChange = () => setReducedMotion(mq.matches);
        mq.addEventListener("change", onChange);
        const id = requestAnimationFrame(() => setReady(true));
        return () => (mq.removeEventListener("change", onChange), cancelAnimationFrame(id));
    }, []);

    // Scroll through the tall hero section → explode progress 0..1
    useEffect(() => {
        const onScroll = () => {
            const el = track.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
            if (followScroll) progressRef.current = Math.min(1, p / 0.8);
            setScrollHint(Math.max(0, 1 - p * 6));
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [followScroll]);

    useEffect(() => {
        if (!followScroll) progressRef.current = manual;
    }, [manual, followScroll]);

    // Only render frames while the hero is on screen
    useEffect(() => {
        const el = track.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const show3D = ready && webgl;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEO title="Hero prototype | DevEdge Lab" description="Internal prototype." noindex />
            <Navigation />

            <section ref={track} className="relative" style={{ height: reducedMotion ? "100vh" : "280vh" }}>
                <div className="sticky top-0 h-screen overflow-hidden">
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

                    {/* 3D drawing: right side on desktop, lower half on mobile */}
                    <div className="absolute inset-x-0 bottom-0 h-[50vh] lg:inset-y-0 lg:left-[38%] lg:right-0 lg:h-auto lg:top-16">
                        {show3D ? (
                            <Suspense fallback={null}>
                                <StackScene progressRef={progressRef} reducedMotion={reducedMotion} active={active} onSelect={(slug) => navigate(`/services/${slug}`)} />
                            </Suspense>
                        ) : (
                            ready && (
                                <div className="h-full flex items-center justify-center font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
                                    Static drawing fallback (designed in D3)
                                </div>
                            )
                        )}
                    </div>

                    {/* Text stays real HTML and paints first (LCP) */}
                    <div className="container relative z-10 pt-28 lg:pt-0 lg:h-full lg:flex lg:items-center pointer-events-none">
                        <div className="max-w-[520px] pointer-events-auto">
                            <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
                                <span className="w-8 h-px bg-primary inline-block" />
                                Websites · Apps · Systems · Growth
                            </span>
                            <h1
                                className="mt-5 font-display font-black leading-[0.88] tracking-tight text-foreground"
                                style={{ fontSize: "clamp(52px, 7vw, 104px)" }}
                            >
                                We build
                                <br />
                                things that
                                <br />
                                actually <span className="text-primary">work.</span>
                            </h1>
                            <p className="mt-6 text-[16px] lg:text-[17px] text-muted-foreground max-w-[420px] leading-relaxed">
                                Seven services, one team. Every part is built to work with the others.
                            </p>
                            <div className="mt-8 hidden sm:flex flex-wrap gap-3">
                                <ContactModal
                                    buttonText="Start a Project"
                                    triggerClassName="bg-primary text-[#1A1008] hover:bg-primary/90 font-semibold px-8 h-12 rounded-none text-[15px] transition-colors duration-150"
                                />
                            </div>
                        </div>
                    </div>

                    {!reducedMotion && (
                        <div
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground pointer-events-none"
                            style={{ opacity: scrollHint }}
                        >
                            Scroll to take it apart ↓
                        </div>
                    )}
                </div>
            </section>

            {/* Accessible / no-3D equivalent of the drawing */}
            <section className="container py-24">
                <h2 className="font-display font-black text-[40px] tracking-tight">What's in the stack</h2>
                <ol className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#D4B896] border border-[#D4B896]">
                    {STACK_LAYERS.map((l, i) => (
                        <li key={l.slug} className="bg-background p-6">
                            <span className="font-mono text-[11px] text-primary tracking-widest">{String(i + 1).padStart(2, "0")}</span>
                            <a href={`/services/${l.slug}`} className="block mt-2 font-display font-bold text-[22px] hover:text-primary">
                                {l.name}
                            </a>
                        </li>
                    ))}
                </ol>
            </section>

            <Footer />

            {/* Review controls (prototype only) */}
            {panelOpen ? (
                <div className="fixed bottom-4 right-4 z-50 bg-[#1A1008] text-[#F5E6D5] p-4 w-[240px] font-mono text-[11px] tracking-wide shadow-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-[#C97B3A] uppercase tracking-[0.18em]">Lab controls</span>
                        <button type="button" onClick={() => setPanelOpen(false)} className="text-[#A89070] hover:text-[#F5E6D5]" aria-label="Hide lab controls">✕</button>
                    </div>
                    <label className="mt-3 flex items-center gap-2">
                        <input type="checkbox" checked={followScroll} onChange={(e) => setFollowScroll(e.target.checked)} />
                        Follow scroll
                    </label>
                    <label className="mt-3 block">
                        Explode (manual)
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={manual}
                            disabled={followScroll}
                            onChange={(e) => setManual(+e.target.value)}
                            className="w-full mt-1"
                        />
                    </label>
                    <div className="mt-2 text-[#A89070]">{reducedMotion ? "Reduced motion: static" : webgl ? "WebGL on" : "No WebGL: fallback"}</div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setPanelOpen(true)}
                    className="fixed bottom-4 right-4 z-50 bg-[#1A1008] text-[#C97B3A] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em]"
                >
                    Lab
                </button>
            )}
        </div>
    );
}
