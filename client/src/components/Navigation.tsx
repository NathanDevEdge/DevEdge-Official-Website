import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import ContactModal from "@/components/ContactModal";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
      <nav
        className={cn(
          "w-full max-w-7xl transition-all duration-300 border",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-white/8 shadow-[0_4px_30px_rgba(0,0,0,0.6)] py-3 px-6"
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
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer"
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
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full mt-2 left-0 right-0 max-w-[calc(100vw-32px)] mx-auto bg-background/95 backdrop-blur-2xl border border-white/8 p-6 flex flex-col gap-4 shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-medium text-foreground py-2 border-b border-white/5 last:border-0"
              >
                {link.name}
              </Link>
            ))}
            <ContactModal
              buttonText="Get in Touch"
              triggerClassName="w-full mt-2 bg-primary hover:bg-primary/90 text-[#1A1008] font-semibold rounded-none h-11 transition-colors duration-150"
            />
          </div>
        )}
      </nav>
    </div>
  );
}
