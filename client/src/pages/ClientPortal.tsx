import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useSearch } from "wouter";
import KanbanBoard from "@/components/KanbanBoard";
import TicketDetailPanel from "@/components/TicketDetailPanel";
import { PRIORITY_OPTIONS, PRIORITY_CONFIG } from "@/lib/ticketPriority";

export default function ClientPortal() {
  const { user, token, logout } = useAuth();
  const search = useSearch();

  const [tickets, setTickets]           = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority]       = useState("medium");
  const [creating, setCreating]       = useState(false);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) ?? null;

  useEffect(() => { fetchTickets(); }, [token]);

  // Deep-link: open ticket from ?ticket=123 once tickets are loaded
  useEffect(() => {
    if (tickets.length === 0) return;
    const params = new URLSearchParams(search);
    const id = parseInt(params.get("ticket") || "");
    if (id && !selectedTicketId) setSelectedTicketId(id);
  }, [tickets, search]);

  const fetchTickets = async () => {
    try {
      const res  = await fetch("/api/tickets", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setTickets(data.tickets);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res  = await fetch("/api/tickets", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ title, description, priority }),
      });
      const data = await res.json();
      if (data.success) {
        setTitle(""); setDescription(""); setPriority("medium");
        setShowForm(false);
        fetchTickets();
      }
    } catch (e) { console.error(e); }
    finally { setCreating(false); }
  };

  const openTicket = (ticket: any) => {
    setSelectedTicketId(ticket.id);
    window.history.replaceState({}, "", `?ticket=${ticket.id}`);
  };

  const closeTicket = () => {
    setSelectedTicketId(null);
    window.history.replaceState({}, "", window.location.pathname);
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await fetch("/api/tickets", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ id, status }),
      });
      fetchTickets();
    } catch (e) { console.error(e); }
  };

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailPanel
            key={selectedTicket.id}
            ticket={selectedTicket}
            token={token!}
            currentUserId={user?.id ?? 0}
            isAdmin={false}
            onClose={closeTicket}
            onTicketUpdated={fetchTickets}
          />
        )}
      </AnimatePresence>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
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
            <span className="hidden sm:block font-mono text-[10px] text-muted-foreground tracking-wide">{user?.name}</span>
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

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
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
              Support<br /><span className="text-primary">Tickets.</span>
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

        {/* New ticket form */}
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-2">
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
                        Priority
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-input border border-border rounded-none h-11 px-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
                      >
                        {PRIORITY_OPTIONS.map((p) => (
                          <option key={p} value={p}>{PRIORITY_CONFIG[p].label} — {PRIORITY_CONFIG[p].sla}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Priority description hint */}
                  <p className="font-mono text-[10px] text-muted-foreground tracking-wide -mt-2">
                    {PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG]?.description}
                  </p>

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

        {/* Kanban board */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              Ticket Board
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
          ) : (
            <KanbanBoard
              tickets={tickets}
              canEditTicket={(ticket) => ticket.client_id === user?.id}
              onStatusChange={handleStatusChange}
              onTicketClick={openTicket}
            />
          )}
        </div>
      </div>
    </div>
  );
}
