import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";

export default function PortalLogin() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      login(data.token, data.user);
      if (data.user.role === "admin") setLocation("/admin");
      else setLocation("/portal");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-primary/5 blur-[160px] rounded-full" />
        <div className="absolute top-1/3 right-[-10%] w-[400px] h-[400px] bg-primary/3 blur-[180px] rounded-full" />

        {/* Perspective grid floor */}
        <div className="absolute left-0 right-0 bottom-0" style={{ height: "65%", perspective: "700px" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(46,31,15,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(46,31,15,0.18) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              transform: "rotateX(62deg)",
              transformOrigin: "50% 100%",
              maskImage: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(201,123,58,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,123,58,0.12) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              transform: "rotateX(62deg)",
              transformOrigin: "50% 100%",
              maskImage: "radial-gradient(ellipse 55% 55% at 50% 100%, rgba(0,0,0,0.8) 0%, transparent 80%)",
            }}
          />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-background via-background/95 to-transparent" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 border-b border-border bg-background/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <img src="/images/logo-transparent.png" alt="DevEdge" className="h-7 w-auto" />
          <span className="font-display font-bold text-lg tracking-tight text-foreground">DevEdge</span>
        </a>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          Client Portal
        </span>
      </div>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="w-full max-w-sm"
        >
          {/* Heading */}
          <div className="mb-10">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease }}
              className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3"
            >
              <span className="w-6 h-px bg-primary inline-block" />
              Secure Access
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="mt-4 font-display font-black leading-none tracking-tight text-foreground"
              style={{ fontSize: "clamp(52px, 7vw, 80px)" }}
            >
              Client<br />
              <span className="text-primary">Portal.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease }}
              className="mt-4 text-sm text-muted-foreground leading-relaxed"
            >
              Sign in to manage your development tickets and track project progress.
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {error && (
              <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 px-4 py-3 font-mono text-[11px] tracking-wide">
                {error}
              </div>
            )}

            <div>
              <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="bg-card border-border h-11 rounded-none focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                Password
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-card border-border h-11 rounded-none focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm transition-colors duration-150 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  Sign in to Portal <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </motion.form>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease }}
            className="mt-8 pt-6 border-t border-border"
          >
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase flex items-center gap-2">
              <Lock className="w-3 h-3 shrink-0" />
              Invite-only access · DevEdge clients only
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
