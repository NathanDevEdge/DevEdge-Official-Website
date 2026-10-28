import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import BrandLogo from "@/components/BrandLogo";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-[#1A1008] text-[#F5E6D5] flex flex-col overflow-hidden">
      <Helmet>
        <title>Page not found | DevEdge</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Ember corner brackets */}
      <div className="pointer-events-none absolute top-6 left-6 w-14 h-14 border-t-2 border-l-2 border-[#C97B3A]" />
      <div className="pointer-events-none absolute bottom-6 right-6 w-14 h-14 border-b-2 border-r-2 border-[#C97B3A]" />

      <header className="px-12 md:px-16 pt-14">
        <Link href="/" className="inline-flex">
          <BrandLogo variant="light" />
        </Link>
      </header>

      <main className="flex-1 flex items-center px-12 md:px-16">
        <div className="max-w-[1280px] w-full mx-auto">
          <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.24em] uppercase text-[#A89070]">
            <span className="w-8 h-px bg-[#C97B3A]" />
            404 · Page not found
          </p>

          <h1 className="mt-5 font-display font-extrabold uppercase text-[56px] md:text-[88px] leading-[0.94] tracking-[-0.02em] max-w-[720px]">
            This page <span className="text-[#C97B3A]">doesn't exist.</span>
          </h1>

          <p className="mt-6 max-w-[520px] text-lg leading-[1.7] text-[#A89070]">
            Either it moved or the link's wrong. Either way, here's the way back.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-[#C97B3A] text-[#1A1008] font-semibold px-7 py-3.5 hover:bg-[#b8692e] transition-colors"
            >
              Back to home
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center border border-[#C97B3A] text-[#C97B3A] font-semibold px-7 py-3.5 hover:bg-[#C97B3A]/10 transition-colors"
            >
              See our work
            </Link>
          </div>
        </div>
      </main>

      <footer className="px-12 md:px-16 pb-12 font-mono text-[11px] tracking-[0.12em] text-[#A89070]">
        devedge.com.au
      </footer>
    </div>
  );
}
