import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, ArrowLeft } from "lucide-react";

type Mode = "login" | "forgot";

export default function PortalLogin() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const [mode, setMode] = useState<Mode>("login");

  // Login state
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail]     = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent]       = useState(false);
  const [forgotError, setForgotError]     = useState("");

  const ease = [0.16, 1, 0.3, 1] as const;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res  = await fetch("/api/auth", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      login(data.token, data.user);
      if (data.user.role === "admin") setLocation("/admin");
      else setLocation("/portal");
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    try {
      await fetch("/api/password-reset", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action: "forgot", email: forgotEmail }),
      });
      setForgotSent(true);
    } catch {
      setForgotError("Something went wrong. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const switchToForgot = () => {
    setForgotEmail(email);
    setForgotSent(false);
    setForgotError("");
    setMode("forgot");
  };

  const switchToLogin = () => {
    setLoginError("");
    setMode("login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-primary/5 blur-[160px] rounded-full" />
        <div className="absolute top-1/3 right-[-10%] w-[400px] h-[400px] bg-primary/3 blur-[180px] rounded-full" />
        <div className="absolute left-0 right-0 bottom-0" style={{ height: "65%", perspective: "700px" }}>
          <div
            style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(to right, rgba(46,31,15,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(46,31,15,0.18) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              transform: "rotateX(62deg)", transformOrigin: "50% 100%",
              maskImage: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(to right, rgba(201,123,58,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,123,58,0.12) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              transform: "rotateX(62deg)", transformOrigin: "50% 100%",
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
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">

            {/* ── Login mode ──────────────────────────────────────────────── */}
            {mode === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease }}
              >
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
                    Client<br /><span className="text-primary">Portal.</span>
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

                <motion.form
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.18, ease }}
                  onSubmit={handleLogin}
                  className="space-y-5"
                >
                  {loginError && (
                    <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 px-4 py-3 font-mono text-[11px] tracking-wide">
                      {loginError}
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
                    disabled={loginLoading}
                    className="w-full h-11 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm transition-colors duration-150 flex items-center justify-center gap-2 mt-2"
                  >
                    {loginLoading ? "Authenticating..." : (
                      <>Sign in to Portal <ArrowRight className="w-4 h-4" /></>
                    )}
                  </Button>
                </motion.form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.35, ease }}
                  className="mt-8 pt-6 border-t border-border flex items-center justify-between"
                >
                  <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase flex items-center gap-2">
                    <Lock className="w-3 h-3 shrink-0" />
                    Invite-only access
                  </p>
                  <button
                    type="button"
                    onClick={switchToForgot}
                    className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase hover:text-primary transition-colors duration-150"
                  >
                    Forgot password?
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* ── Forgot password mode ────────────────────────────────────── */}
            {mode === "forgot" && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease }}
              >
                <div className="mb-10">
                  <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
                    <span className="w-6 h-px bg-primary inline-block" />
                    Account Recovery
                  </span>
                  <h1
                    className="mt-4 font-display font-black leading-none tracking-tight text-foreground"
                    style={{ fontSize: "clamp(40px, 6vw, 64px)" }}
                  >
                    Forgot<br /><span className="text-primary">Password.</span>
                  </h1>
                </div>

                <AnimatePresence mode="wait">
                  {forgotSent ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease }}
                      className="space-y-4"
                    >
                      <div className="bg-primary/10 border border-primary/20 px-4 py-4">
                        <p className="text-sm text-foreground leading-relaxed">
                          If an account exists for <span className="font-medium text-primary">{forgotEmail}</span>, a password reset link has been sent.
                        </p>
                        <p className="mt-2 font-mono text-[10px] text-muted-foreground tracking-wide">
                          Check your inbox — the link expires in 1 hour.
                        </p>
                      </div>
                      <button
                        onClick={switchToLogin}
                        className="w-full flex items-center justify-center gap-2 font-mono text-[10px] text-muted-foreground tracking-widest uppercase hover:text-primary transition-colors duration-150 pt-2"
                      >
                        <ArrowLeft className="w-3 h-3" /> Back to sign in
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleForgot}
                      className="space-y-5"
                    >
                      <p className="text-sm text-muted-foreground leading-relaxed -mt-4">
                        Enter your email address and we'll send you a link to reset your password.
                      </p>
                      {forgotError && (
                        <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 px-4 py-3 font-mono text-[11px] tracking-wide">
                          {forgotError}
                        </div>
                      )}
                      <div>
                        <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e: any) => setForgotEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="bg-card border-border h-11 rounded-none focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={forgotLoading}
                        className="w-full h-11 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm transition-colors duration-150 flex items-center justify-center gap-2"
                      >
                        {forgotLoading ? "Sending..." : (
                          <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                        )}
                      </Button>
                      <button
                        type="button"
                        onClick={switchToLogin}
                        className="w-full flex items-center justify-center gap-2 font-mono text-[10px] text-muted-foreground tracking-widest uppercase hover:text-primary transition-colors duration-150 pt-1"
                      >
                        <ArrowLeft className="w-3 h-3" /> Back to sign in
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
