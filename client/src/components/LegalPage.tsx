import type { ReactNode } from "react";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function LegalPage({
  title,
  description,
  path,
  updated,
  children,
}: {
  title: string;
  description: string;
  path: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title={`${title} | DevEdge`} description={description} url={`https://devedge.com.au${path}`} />
      <Navigation />

      <main className="container max-w-3xl pt-40 pb-24">
        <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.24em] uppercase text-muted-foreground">
          <span className="w-8 h-px bg-primary" />
          Last updated {updated}
        </p>
        <h1 className="mt-5 font-display font-black uppercase text-[48px] md:text-[64px] leading-[0.94] tracking-[-0.02em]">
          {title}
        </h1>

        <div
          className="mt-12 prose prose-stone max-w-none
            prose-headings:font-display prose-headings:font-black prose-headings:text-foreground prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-12
            prose-p:text-muted-foreground prose-p:text-[16px] prose-p:leading-[1.7]
            prose-li:text-muted-foreground prose-li:leading-[1.7]
            prose-strong:text-foreground
            prose-a:text-primary hover:prose-a:text-primary/80"
        >
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
