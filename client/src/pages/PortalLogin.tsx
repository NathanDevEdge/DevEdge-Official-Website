import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      login(data.token, data.user);
      
      if (data.user.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/portal");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full opacity-50 mix-blend-screen animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full opacity-50 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-3xl relative z-10 border-white/5">
        <div>
          <a href="/" className="flex justify-center mb-6">
             <img src="/images/logo-transparent.png" alt="DevEdge Logo" className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity" />
          </a>
          <h2 className="mt-2 text-center text-4xl font-display font-medium tracking-tight text-white">
            Client <span className="text-gradient">Portal</span>
          </h2>
          <p className="mt-3 text-center text-sm text-muted-foreground font-light">
            Sign in to manage your development tickets
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{error}</div>}
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">Email address</label>
              <Input
                type="email"
                required
                className="block w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus:border-primary/50 focus:ring-primary/50 transition-colors"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="client@devedge.com.au"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">Password</label>
              <Input
                type="password"
                required
                className="block w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus:border-primary/50 focus:ring-primary/50 transition-colors"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full h-12 rounded-xl bg-white text-black hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 font-medium text-base shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]" disabled={loading}>
              {loading ? "Authenticating..." : "Sign in to Portal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
