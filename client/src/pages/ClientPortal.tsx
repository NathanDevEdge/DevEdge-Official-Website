import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white dark:bg-zinc-900/50 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Client Portal</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={logout}>Sign Out</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="bg-white dark:bg-zinc-900/50">
              <CardHeader>
                <CardTitle>Open New Ticket</CardTitle>
                <CardDescription>Submit a new development request or issue.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Title</label>
                    <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief summary" className="bg-white dark:bg-zinc-950" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide details..." className="min-h-[120px] bg-white dark:bg-zinc-950" />
                  </div>
                  <Button type="submit" className="w-full h-10" disabled={creating}>
                    {creating ? "Submitting..." : "Submit Ticket"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Tickets</h2>
            {loading ? (
              <p className="text-gray-500">Loading tickets...</p>
            ) : tickets.length === 0 ? (
              <Card className="p-8 text-center bg-zinc-50 dark:bg-zinc-900/20 border-dashed">
                <p className="text-gray-500">No tickets found. Create your first one!</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {tickets.map(ticket => (
                  <Card key={ticket.id} className="bg-white dark:bg-zinc-900/50">
                    <CardHeader className="py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{ticket.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          ticket.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
