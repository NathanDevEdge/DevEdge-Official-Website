import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Ticket, X } from "lucide-react";

const statusConfig = {
  open: { label: "Open", classes: "bg-[#8B6914]/10 text-[#8B6914] border-[#8B6914]/20" },
  in_progress: { label: "In Progress", classes: "bg-primary/10 text-primary border-primary/30" },
  resolved: { label: "Resolved", classes: "bg-[#2d6a4f]/10 text-[#2d6a4f] border-[#2d6a4f]/20" },
};

export default function ClientPortal() {
  const { user, token, logout } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setTickets(data.tickets);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (data.success) {
        setTitle("");
        setDescription("");
        setShowForm(false);
        fetchTickets();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Portal Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a href="/" className="flex items-center gap-2">
              <img src="/images/logo-transparent.png" alt="DevEdge" className="h-6 w-auto" />
              <span className="font-display font-bold text-base tracking-tight text-foreground">DevEdge</span>
            </a>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <span className="hidden sm:block font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              Client Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block font-mono text-[10px] text-muted-foreground tracking-wide">
              {user?.name}
            </span>
            <Button
              variant="outline"
              onClick={logout}
              className="rounded-none border-border hover:border-primary hover:text-primary text-xs h-8 px-4 font-mono tracking-wider uppercase transition-colors duration-150"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 mb-3">
              <span className="w-6 h-px bg-primary inline-block" />
              Your Dashboard
            </span>
            <h1
              className="font-display font-black leading-none tracking-tight text-foreground"
              style={{ fontSize: "clamp(42px, 5vw, 68px)" }}
            >
              Support<br />
              <span className="text-primary">Tickets.</span>
            </h1>
          </div>

          <Button
            onClick={() => setShowForm(!showForm)}
            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 px-6 text-sm transition-colors duration-150 flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "New Ticket"}
          </Button>
        </motion.div>

        {/* New Ticket Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-card border border-border p-8">
                <h3 className="font-display font-bold text-xl text-foreground mb-1">Submit a Request</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Describe your request and the DevEdge team will be notified immediately.
                </p>
                <form onSubmit={handleCreateTicket} className="space-y-5">
                  <div>
                    <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                      Ticket Title
                    </label>
                    <Input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Brief summary of the request"
                      className="bg-input border-border h-11 rounded-none focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                      Detailed Description
                    </label>
                    <Textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide as much detail as possible..."
                      className="min-h-[120px] bg-input border-border rounded-none focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <Button
                      type="submit"
                      disabled={creating}
                      className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 px-6 transition-colors duration-150"
                    >
                      {creating ? "Submitting..." : "Submit Ticket"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="rounded-none border-border hover:border-primary hover:text-primary h-11 px-6 transition-colors duration-150"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tickets list */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              Active Tickets
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {tickets.length} total
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <span className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase animate-pulse">
                Loading...
              </span>
            </div>
          ) : tickets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 border border-dashed border-border text-center"
            >
              <Ticket className="w-7 h-7 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase">
                No open tickets. You're all caught up.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket, i) => {
                const status = statusConfig[ticket.status as keyof typeof statusConfig] ?? statusConfig.open;
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05, ease }}
                    className="bg-card border border-border p-6 hover:border-primary/40 transition-colors duration-200 group"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-150">
                          {ticket.title}
                        </h3>
                        <p className="font-mono text-[10px] text-muted-foreground tracking-wide mt-1">
                          {new Date(ticket.created_at).toLocaleDateString("en-AU", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1 border shrink-0 ${status.classes}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed border-t border-border pt-4">
                      {ticket.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
