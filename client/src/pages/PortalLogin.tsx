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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900/50 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Client Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your development tickets
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900/50">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
              <Input
                type="email"
                required
                className="mt-1 block w-full bg-white dark:bg-zinc-950"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="client@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <Input
                type="password"
                required
                className="mt-1 block w-full bg-white dark:bg-zinc-950"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
