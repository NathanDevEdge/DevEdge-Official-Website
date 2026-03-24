import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ClientPortal() {
  const { user, token, logout } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });
      const data = await res.json();
      if (data.success) {
        setTitle("");
        setDescription("");
        fetchTickets();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full opacity-50 mix-blend-screen animate-pulse duration-[8000ms]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8 space-y-8 pt-12">
        
        {/* Header */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-medium tracking-tight text-white mb-1">
              Client <span className="text-gradient">Portal</span>
            </h1>
            <p className="text-muted-foreground font-light">Welcome back, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={logout} className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all px-8">
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Ticket Form */}
          <div className="lg:col-span-1">
            <div className="glass-panel rounded-3xl p-8">
              <h3 className="text-2xl font-display font-medium text-white mb-2">New Ticket</h3>
              <p className="text-sm text-muted-foreground mb-8 font-light">Submit a development request directly to the DevEdge team.</p>
              
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">Ticket Title</label>
                  <Input 
                    required 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="Brief summary" 
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus:border-primary/50" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">Detailed Description</label>
                  <Textarea 
                    required 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="Provide information..." 
                    className="min-h-[160px] bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-primary/50 resize-none p-4" 
                  />
                </div>
                <Button type="submit" className="w-full h-12 mt-4 rounded-xl bg-white text-black hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 font-medium shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]" disabled={creating}>
                  {creating ? "Submitting Request..." : "Submit Ticket"}
                </Button>
              </form>
            </div>
          </div>

          {/* Tickets List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-display font-medium tracking-tight text-white flex items-center gap-3 px-2">
              Your Active Tickets
              <span className="text-xs font-mono bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                {tickets.length} TOTAL
              </span>
            </h2>
            
            {loading ? (
              <div className="text-white/50 animate-pulse font-light px-2">Loading tickets securely...</div>
            ) : tickets.length === 0 ? (
              <div className="glass-panel p-16 text-center rounded-3xl border-dashed border-white/10">
                <p className="text-muted-foreground font-light text-lg">No tickets found. You are all caught up!</p>
              </div>
            ) : (
              <div className="space-y-5">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="glass-panel p-6 rounded-3xl hover:border-primary/30 transition-colors duration-500 group">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                      <div>
                        <h3 className="text-xl font-medium text-white group-hover:text-primary transition-colors">{ticket.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 font-light">
                          Submitted on {new Date(ticket.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}
                        </p>
                      </div>
                      <span className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-full border ${
                        ticket.status === 'resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        ticket.status === 'in_progress' ? 'bg-primary/10 text-primary border-primary/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
                      <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed font-light">{ticket.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
