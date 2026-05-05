import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Ticket, Users, UserPlus } from "lucide-react";

const statusConfig = {
  open: { label: "Open", classes: "bg-[#8B6914]/10 text-[#8B6914] border-[#8B6914]/20" },
  in_progress: { label: "In Progress", classes: "bg-primary/10 text-primary border-primary/30" },
  resolved: { label: "Resolved", classes: "bg-[#2d6a4f]/10 text-[#2d6a4f] border-[#2d6a4f]/20" },
};

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    try {
      const [tRes, cRes] = await Promise.all([
        fetch("/api/tickets", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const tData = await tRes.json();
      const cData = await cRes.json();
      if (tData.success) setTickets(tData.tickets);
      if (cData.success) setClients(cData.clients);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await fetch("/api/tickets", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setName("");
        setEmail("");
        setPassword("");
        fetchData();
      } else {
        alert(data.error || "Failed to create client");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const ease = [0.16, 1, 0.3, 1] as const;
  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;

  const stats = [
    { label: "Open Tickets", value: openCount, icon: Ticket },
    { label: "In Progress", value: inProgressCount, icon: Ticket },
    { label: "Total Clients", value: clients.length, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a href="/" className="flex items-center gap-2">
              <img src="/images/logo-transparent.png" alt="DevEdge" className="h-6 w-auto" />
              <span className="font-display font-bold text-base tracking-tight text-foreground">DevEdge</span>
            </a>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <span className="hidden sm:block font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              Admin
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
          className="mb-10"
        >
          <span className="font-mono text-[11px] text-primary tracking-[0.18em] uppercase inline-flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-primary inline-block" />
            Operations
          </span>
          <h1
            className="font-display font-black leading-none tracking-tight text-foreground"
            style={{ fontSize: "clamp(42px, 5vw, 68px)" }}
          >
            Admin<br />
            <span className="text-primary">Dashboard.</span>
          </h1>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-card border border-border p-5">
              <Icon className="w-4 h-4 text-primary mb-3" />
              <div className="font-display font-black text-4xl text-foreground leading-none mb-2">
                {loading ? "—" : value}
              </div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="mb-0 bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-0">
            <TabsTrigger
              value="tickets"
              className="rounded-none font-mono text-[11px] tracking-widest uppercase px-6 py-3 h-auto border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              All Tickets
            </TabsTrigger>
            <TabsTrigger
              value="clients"
              className="rounded-none font-mono text-[11px] tracking-widest uppercase px-6 py-3 h-auto border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              Manage Clients
            </TabsTrigger>
          </TabsList>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="mt-6 space-y-3">
            {loading ? (
              <div className="py-20 text-center">
                <span className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase animate-pulse">
                  Loading...
                </span>
              </div>
            ) : tickets.length === 0 ? (
              <div className="py-20 border border-dashed border-border text-center">
                <p className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase">
                  No tickets found.
                </p>
              </div>
            ) : (
              tickets.map((ticket, i) => {
                const status = statusConfig[ticket.status as keyof typeof statusConfig] ?? statusConfig.open;
                return (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04, ease }}
                    className="bg-card border border-border p-6 hover:border-primary/40 transition-colors duration-200 group"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-150">
                          {ticket.title}
                        </h3>
                        <p className="font-mono text-[10px] text-muted-foreground tracking-wide mt-1">
                          {ticket.client_name} · {ticket.client_email} ·{" "}
                          {new Date(ticket.created_at).toLocaleDateString("en-AU")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1 border hidden sm:block ${status.classes}`}>
                          {status.label}
                        </span>
                        <select
                          className="bg-input border border-border rounded-none py-2 px-3 font-mono text-[10px] tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition-all cursor-pointer"
                          value={ticket.status}
                          onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)}
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed border-t border-border pt-4">
                      {ticket.description}
                    </p>
                  </motion.div>
                );
              })
            )}
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Create Client Form */}
              <div className="md:col-span-1">
                <div className="bg-card border border-border p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <UserPlus className="w-4 h-4 text-primary" />
                    <h3 className="font-display font-bold text-xl text-foreground">New Client</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Provision a new portal account for a client.
                  </p>
                  <form onSubmit={handleCreateClient} className="space-y-5">
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                        Company / Name
                      </label>
                      <Input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Acme Corp"
                        className="bg-input border-border h-11 rounded-none focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                        Email
                      </label>
                      <Input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ceo@acme.com"
                        className="bg-input border-border h-11 rounded-none focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                        Password
                      </label>
                      <Input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-input border-border h-11 rounded-none focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={creating}
                      className="w-full h-11 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-colors duration-150"
                    >
                      {creating ? "Provisioning..." : "Provision Client"}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Client List */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                    Client Directory
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {clients.length} accounts
                  </span>
                </div>
                <div className="space-y-3">
                  {clients.map((client, i) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05, ease }}
                      className="bg-card border border-border p-5 flex justify-between items-center group hover:border-primary/40 transition-colors duration-200"
                    >
                      <div>
                        <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors duration-150">
                          {client.name}
                        </h3>
                        <p className="font-mono text-[10px] text-muted-foreground tracking-wide mt-1">
                          {client.email}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase shrink-0">
                        Joined{" "}
                        {new Date(client.created_at).toLocaleDateString("en-AU", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
