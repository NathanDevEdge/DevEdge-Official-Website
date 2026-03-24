import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
        alert("Client created successfully!");
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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white dark:bg-zinc-900/50 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage clients and tickets</p>
          </div>
          <Button variant="outline" onClick={logout}>Sign Out</Button>
        </div>

        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="tickets">All Tickets</TabsTrigger>
            <TabsTrigger value="clients">Manage Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            {loading ? <p>Loading...</p> : tickets.length === 0 ? <p>No tickets yet.</p> : (
              tickets.map(ticket => (
                <Card key={ticket.id} className="bg-white dark:bg-zinc-900/50">
                  <CardHeader className="py-4">
                    <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                      <div>
                        <CardTitle className="text-lg">{ticket.title}</CardTitle>
                        <CardDescription className="mt-1">
                          From: {ticket.client_name} ({ticket.client_email}) on {new Date(ticket.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <select 
                          className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          value={ticket.status}
                          onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)}
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="clients">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <Card className="bg-white dark:bg-zinc-900/50">
                  <CardHeader>
                    <CardTitle>Create Client</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateClient} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Name</label>
                        <Input required value={name} onChange={e => setName(e.target.value)} className="bg-white dark:bg-zinc-950" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Email</label>
                        <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white dark:bg-zinc-950" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Password</label>
                        <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-white dark:bg-zinc-950" />
                      </div>
                      <Button type="submit" className="w-full" disabled={creating}>
                        {creating ? "Creating..." : "Create Client"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Clients List</h2>
                {clients.map(client => (
                  <Card key={client.id} className="bg-white dark:bg-zinc-900/50">
                    <CardHeader className="py-4">
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      <CardDescription>{client.email} • Joined {new Date(client.created_at).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
