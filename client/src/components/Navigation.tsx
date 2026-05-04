import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import ContactModal from "@/components/ContactModal";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "/#services" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/#about" },
    { name: "FAQ", href: "/#faq" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && location === "/") {
      e.preventDefault();
      const element = document.querySelector(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
      }
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full mt-4 px-4">
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "w-full max-w-7xl transition-all duration-300 border",
          isScrolled
            ? "bg-[#F5E6D5]/92 backdrop-blur-xl border-[#D4B896] shadow-[0_8px_40px_rgba(46,31,15,0.12)] py-3 px-6"
            : "bg-transparent border-transparent py-4 px-2"
        )}
      >
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo-transparent.png" alt="DevEdge" className="h-8 w-auto" />
            <span className="font-display font-bold text-xl tracking-tight text-foreground">DevEdge</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-mono text-[12px] tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer uppercase"
              >
                {link.name}
              </Link>
            ))}
            <ContactModal
              buttonText="Get in Touch"
              triggerClassName="bg-primary hover:bg-primary/90 text-[#1A1008] font-semibold rounded-none px-5 h-9 text-sm transition-colors duration-150"
            />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
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
              <div className="mt-4 pt-4 border-t border-[#2E1F0F] flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="font-mono text-[12px] tracking-wider text-muted-foreground hover:text-foreground py-3 uppercase transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="mt-3 pt-3 border-t border-[#2E1F0F]">
                  <ContactModal
                    buttonText="Get in Touch"
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
