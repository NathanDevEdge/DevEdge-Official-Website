import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        fetch("/api/admin", { headers: { Authorization: `Bearer ${token}` } })
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id, status })
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.success) {
        setName(""); setEmail(""); setPassword("");
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

  return (
    <div className="min-h-screen bg-black relative overflow-hidden text-foreground">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full opacity-50 mix-blend-screen animate-pulse duration-[8000ms]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8 space-y-8 pt-12">
        <div className="glass-panel p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-medium tracking-tight text-white mb-1">
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-muted-foreground font-light">Supercharge your workflow. Manage clients and tickets.</p>
          </div>
          <Button variant="outline" onClick={logout} className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all px-8">
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="mb-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-1">
            <TabsTrigger value="tickets" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">All Tickets</TabsTrigger>
            <TabsTrigger value="clients" className="rounded-xl data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">Manage Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-5">
            {loading ? <div className="text-white/50 animate-pulse font-light px-2">Loading system records...</div> : tickets.length === 0 ? <div className="glass-panel p-16 text-center rounded-3xl border-dashed border-white/10"><p className="text-muted-foreground font-light text-lg">No active tickets.</p></div> : (
              tickets.map(ticket => (
                <div key={ticket.id} className="glass-panel p-6 rounded-3xl hover:border-primary/30 transition-colors duration-500 group">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
                    <div>
                      <h3 className="text-xl font-medium text-white group-hover:text-primary transition-colors">{ticket.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 font-light">
                        From: <span className="text-white/80">{ticket.client_name}</span> ({ticket.client_email}) on {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <select 
                        className="w-full md:w-auto bg-black/50 border border-white/10 rounded-xl py-2 px-4 font-medium tracking-wide uppercase text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 text-white transition-all"
                        value={ticket.status}
                        onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
                    <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed font-light">{ticket.description}</p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="clients">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              <div className="md:col-span-1">
                <div className="glass-panel rounded-3xl p-8">
                  <h3 className="text-2xl font-display font-medium text-white mb-2">New Client</h3>
                  <p className="text-sm text-muted-foreground mb-8 font-light">Provision a new portal account for a client.</p>

                  <form onSubmit={handleCreateClient} className="space-y-5">
                    <div>
                      <label className="text-sm font-medium text-white/80 mb-2 block">Company / Name</label>
                      <Input required value={name} onChange={e => setName(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-xl focus:border-primary/50" placeholder="Acme Corp" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white/80 mb-2 block">Email</label>
                      <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-xl focus:border-primary/50" placeholder="ceo@acme.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white/80 mb-2 block">Password</label>
                      <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11 rounded-xl focus:border-primary/50" placeholder="••••••••" />
                    </div>
                    <Button type="submit" className="w-full h-12 mt-4 rounded-xl bg-white text-black hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 font-medium shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]" disabled={creating}>
                      {creating ? "Provisioning..." : "Provision Client"}
                    </Button>
                  </form>
                </div>
              </div>

              <div className="md:col-span-2 space-y-5">
                <h2 className="text-2xl font-display font-medium tracking-tight text-white flex items-center gap-3 px-2">
                  Client Directory
                  <span className="text-xs font-mono bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                    {clients.length} ACCOUNTS
                  </span>
                </h2>
                
                {clients.map(client => (
                  <div key={client.id} className="glass-panel p-6 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center group hover:border-primary/30 transition-all duration-500">
                    <div>
                      <h3 className="text-xl font-medium text-white group-hover:text-primary transition-colors">{client.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 font-light">
                        {client.email}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
                      JOINED {new Date(client.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
