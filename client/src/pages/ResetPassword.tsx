import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";

export default function ResetPassword() {
  const [, setLocation] = useLocation();

  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const [email, setEmail]           = useState("");
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError] = useState("");

  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);

  const ease = [0.16, 1, 0.3, 1] as const;

  useEffect(() => {
    if (!token) {
      setTokenError("No reset token found.");
      setTokenLoading(false);
      return;
    }
    fetch(`/api/password-reset?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setEmail(data.email);
        else setTokenError(data.error || "Invalid or expired reset link.");
      })
      .catch(() => setTokenError("Failed to validate reset link."))
      .finally(() => setTokenLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res  = await fetch("/api/password-reset", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action: "reset", token, password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setLocation("/portal/login"), 3000);
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-primary/5 blur-[160px] rounded-full" />
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
          Password Reset
        </span>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        {tokenLoading ? (
          <span className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase animate-pulse">
            Verifying link...
          </span>
        ) : tokenError ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="w-full max-w-sm text-center"
          >
            <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h2 className="font-display font-black text-2xl text-foreground mb-2">Link expired</h2>
            <p className="text-sm text-muted-foreground mb-6">{tokenError}</p>
            <Button
              onClick={() => setLocation("/portal/login")}
              variant="outline"
              className="rounded-none border-border hover:border-primary hover:text-primary h-10 px-6 font-mono text-xs tracking-widest uppercase"
            >
              Back to sign in
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="w-full max-w-sm"
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease }}
                  className="text-center"
                >
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h2 className="font-display font-black text-3xl text-foreground mb-2">
                    Password updated.
                  </h2>
                  <p className="text-sm text-muted-foreground mb-1">You can now sign in with your new password.</p>
                  <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase animate-pulse">
                    Redirecting to sign in...
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form">
                  {/* Heading */}
                  <div className="mb-10">
                    <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3">
                      <span className="w-6 h-px bg-primary inline-block" />
                      Security
                    </span>
                    <h1
                      className="mt-4 font-display font-black leading-none tracking-tight text-foreground"
                      style={{ fontSize: "clamp(42px, 6vw, 68px)" }}
                    >
                      New<br />
                      <span className="text-primary">Password.</span>
                    </h1>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      Setting a new password for <span className="text-foreground font-medium">{email}</span>.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="text-destructive text-sm bg-destructive/10 border border-destructive/20 px-4 py-3 font-mono text-[11px] tracking-wide">
                        {error}
                      </div>
                    )}
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                        New Password
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
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                        Confirm Password
                      </label>
                      <Input
                        type="password"
                        required
                        value={confirm}
                        onChange={(e: any) => setConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="bg-card border-border h-11 rounded-none focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-11 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm transition-colors duration-150 flex items-center justify-center gap-2 mt-2"
                    >
                      {submitting ? "Updating password..." : (
                        <>Update Password <ArrowRight className="w-4 h-4" /></>
                      )}
                    </Button>
                  </form>

                  <button
                    onClick={() => setLocation("/portal/login")}
                    className="mt-6 w-full font-mono text-[10px] text-muted-foreground tracking-widest uppercase hover:text-foreground transition-colors duration-150 text-center"
                  >
                    ← Back to sign in
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
