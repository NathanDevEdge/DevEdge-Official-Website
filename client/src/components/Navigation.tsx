import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import ContactModal from "@/components/ContactModal";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import { HOME_SECTIONS, NAV_LINKS, PORTAL_LOGIN_HREF } from "@/lib/site";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("/#") && location === "/") {
      e.preventDefault();
      const hash = href.substring(1);
      const element = document.getElementById(HOME_SECTIONS[hash] ?? hash.slice(1));
      element?.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", href);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full mt-4 px-4">
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "w-full max-w-7xl transition-all duration-300 border",
          isScrolled || isMobileMenuOpen
            ? "bg-[#F5E6D5]/92 backdrop-blur-xl border-[#D4B896] shadow-[0_8px_40px_rgba(46,31,15,0.12)] py-3 px-6"
            : "bg-transparent border-transparent py-4 px-2"
        )}
      >
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center" aria-label="DevEdge home">
            <BrandLogo size="lg" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-mono text-[12px] tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer uppercase"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href={PORTAL_LOGIN_HREF}
              className="font-mono text-[12px] tracking-wider text-muted-foreground hover:text-primary transition-colors duration-150 uppercase pl-6 border-l border-[#D4B896]"
            >
              Client Login
            </Link>
            <ContactModal
              buttonText="Start a Project"
              triggerClassName="bg-primary hover:bg-primary/90 text-[#1A1008] font-semibold rounded-none px-5 h-9 text-sm transition-colors duration-150"
            />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-[#D4B896] flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="font-mono text-[12px] tracking-wider text-muted-foreground hover:text-foreground py-3 uppercase transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href={PORTAL_LOGIN_HREF}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-mono text-[12px] tracking-wider text-muted-foreground hover:text-primary py-3 uppercase transition-colors duration-150"
                >
                  Client Login
                </Link>
                <div className="mt-3 pt-3 border-t border-[#D4B896]">
                  <ContactModal
                    buttonText="Start a Project"
                    triggerClassName="w-full bg-primary hover:bg-primary/90 text-[#1A1008] font-semibold rounded-none h-11 transition-colors duration-150"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
