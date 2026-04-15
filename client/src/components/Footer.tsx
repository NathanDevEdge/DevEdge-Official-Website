import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0D0804] border-t border-white/8 pt-20 pb-10">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6">
              <img src="/images/logo-transparent.png" alt="DevEdge" className="h-8 w-auto" />
              <span className="font-display font-bold text-xl tracking-tight text-foreground">DevEdge</span>
            </a>
            <p className="text-muted-foreground text-sm max-w-sm mb-2 leading-relaxed">
              We build things that actually work.
            </p>
            <p className="text-muted-foreground text-sm max-w-sm mb-8 leading-relaxed">
              Custom software, web platforms, and backend systems
              for businesses that need results.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/devedge-solutions"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/NathanDevEdge"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:nathan@devedge.com.au"
                className="w-9 h-9 border border-white/10 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-6">Company</h4>
            <ul className="space-y-4">
              {[
                { label: "About", href: "/#about" },
                { label: "Services", href: "/#services" },
                { label: "Work", href: "/projects" },
                { label: "Client Portal", href: "/portal/login" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-6">Legal</h4>
            <ul className="space-y-4">
              {["Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} DevEdge · Software & Systems
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            Built by us. Obviously.
          </div>
        </div>
      </div>
    </footer>
  );
}
