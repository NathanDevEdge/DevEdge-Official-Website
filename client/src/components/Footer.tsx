import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <a href="/" className="text-2xl font-display font-bold tracking-tighter flex items-center gap-2 mb-6">
             <img src="/images/logo-transparent.png" alt="DevEdge Logo" className="h-8 w-auto" />              DevEdge
            </a>
            <p className="text-muted-foreground max-w-sm mb-8">
              Linking Ideas to Execution. We build digital solutions that drive real business growth.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:hello@devedge.com.au" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-primary transition-colors">Services</a></li>
              <li><a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">Projects</a></li>
              <li><a href="/portal/login" className="text-muted-foreground hover:text-primary transition-colors">Client Portal</a></li>
              <li><a href="#blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DevEdge Solutions. All rights reserved.
          </div>
          <div className="text-sm text-muted-foreground">
            Designed & Built by DevEdge
          </div>
        </div>
      </div>
    </footer>
  );
}
