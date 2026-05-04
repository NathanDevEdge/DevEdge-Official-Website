import ContactModal from "@/components/ContactModal";

/**
 * MobileCTA — Fixed persistent CTA bar at the bottom of the viewport.
 * Visible on mobile only (hidden on lg+ breakpoint).
 * Always floats above content so the user can convert from any slide.
 */
export default function MobileCTA() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1008]/90 backdrop-blur-sm border-t border-[#2E1F0F]">
      <ContactModal
        buttonText="Start a Project →"
        triggerClassName="w-full h-14 bg-transparent text-primary font-mono text-[13px] tracking-[0.15em] uppercase hover:bg-primary/10 transition-colors duration-150 rounded-none"
      />
    </div>
  );
}
