import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactModal from "@/components/ContactModal";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "/#services" },
    { name: "Projects", href: "/#projects" },
    { name: "About", href: "/#about" },
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/#faq" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If we're on the homepage and clicking a hash link, smooth scroll
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
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full mt-4 transition-all duration-500 px-4">
      <nav
        className={cn(
          "w-full max-w-7xl transition-all duration-500 rounded-full border",
          isScrolled
            ? "bg-background/60 backdrop-blur-2xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3 px-6"
            : "bg-transparent border-transparent py-4 px-2"
        )}
      >
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="text-2xl font-display font-bold tracking-tighter flex items-center gap-2">
            <img src="/images/logo-transparent.png" alt="DevEdge Logo" className="h-8 w-auto" />
            DevEdge
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {link.name}
              </Link>
            ))}
            <ContactModal buttonText="Get in Touch" triggerClassName="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full px-6" />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full mt-2 left-0 right-0 max-w-[calc(100vw-32px)] mx-auto bg-background/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-lg font-medium text-foreground py-2 border-b border-white/5 last:border-0"
              >
                {link.name}
              </Link>
            ))}
            <ContactModal buttonText="Get in Touch" triggerClassName="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full h-12" />
          </div>
        )}
      </nav>
    </div>
  );
}
