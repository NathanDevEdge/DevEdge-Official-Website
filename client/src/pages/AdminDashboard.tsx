import { useState, useEffect, useRef } from "react";
import { useSearch } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Users, Building2, Plus, ChevronDown, ChevronRight, Mail, RotateCcw, X, Send, Paperclip } from "lucide-react";
import KanbanBoard from "@/components/KanbanBoard";
import TicketDetailPanel from "@/components/TicketDetailPanel";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Invite user form ──────────────────────────────────────────────────────────

function InviteUserForm({
  token,
  isSuperAdmin,
  orgId,
  orgName,
  orgs,
  onSuccess,
  onCancel,
}: {
  token: string | null;
  isSuperAdmin: boolean;
  orgId?: number;
  orgName?: string;
  orgs?: any[];
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [role, setRole]               = useState("user");
  const [selectedOrgId, setSelectedOrgId] = useState(orgId ?? "");
  const [sending, setSending]         = useState(false);
  const [error, setError]             = useState("");
  const [sent, setSent]               = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/invites", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({
          action: "create", name, email, role,
          org_id: isSuperAdmin ? selectedOrgId : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setTimeout(onSuccess, 2200);
      } else {
        setError(data.error || "Failed to send invite");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex items-center gap-3 py-3">
        <Send className="w-4 h-4 text-primary shrink-0" />
        <div>
          <p className="text-sm text-foreground font-medium">Invite sent to {email}</p>
          <p className="font-mono text-[10px] text-muted-foreground tracking-wide">They'll receive an email with a 48-hour link.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-destructive text-xs bg-destructive/10 border border-destructive/20 px-3 py-2 font-mono">
          {error}
        </div>
      )}
      {isSuperAdmin && orgs && !orgId && (
        <div>
          <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">Organisation</label>
          <select
            required
            className="w-full bg-input border border-border rounded-none h-11 px-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
          >
            <option value="">Select organisation...</option>
            {orgs?.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
      )}
      {orgName && (
        <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
          Inviting to: <span className="text-primary">{orgName}</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">Full Name</label>
          <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith"
            className="bg-input border-border h-11 rounded-none focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground" />
        </div>
        <div>
          <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">Email</label>
          <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com"
            className="bg-input border-border h-11 rounded-none focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground" />
        </div>
      </div>
      {isSuperAdmin && (
        <div>
          <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">Role</label>
          <select
            className="w-full bg-input border border-border rounded-none h-11 px-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
            value={role} onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      )}
      <div className="flex gap-3 pt-1">
        <Button type="submit" disabled={sending}
          className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 px-6 transition-colors duration-150 flex items-center gap-2">
          <Mail className="w-3 h-3" />
          {sending ? "Sending..." : "Send Invite"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}
          className="rounded-none border-border hover:border-primary hover:text-primary h-11 px-6 transition-colors duration-150">
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ── Pending invite row ────────────────────────────────────────────────────────

function PendingInviteRow({
  invite,
  token,
  onRefresh,
}: {
  invite: any;
  token: string | null;
  onRefresh: () => void;
}) {
  const [resending, setResending] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const resend = async () => {
    setResending(true);
    try {
      await fetch("/api/invites", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ action: "resend", invite_id: invite.id }),
      });
      onRefresh();
    } finally {
      setResending(false);
    }
  };

  const cancel = async () => {
    setCancelling(true);
    try {
      await fetch("/api/invites", {
        method:  "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ invite_id: invite.id }),
      });
      onRefresh();
    } finally {
      setCancelling(false);
    }
  };

  const daysLeft = Math.max(0, Math.ceil(
    (new Date(invite.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  ));

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0 group">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground font-medium truncate">{invite.name}</span>
          <span className={`font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 border shrink-0 ${
            invite.role === "admin"
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-foreground/5 text-muted-foreground border-border"
          }`}>{invite.role}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-mono text-[10px] text-muted-foreground tracking-wide">{invite.email}</span>
          <span className="font-mono text-[9px] text-muted-foreground/60">· {daysLeft}d left</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={resend}
          disabled={resending}
          title="Resend invite"
          className="p-1.5 text-muted-foreground hover:text-primary transition-colors duration-150 disabled:opacity-40"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={cancel}
          disabled={cancelling}
          title="Cancel invite"
          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors duration-150 disabled:opacity-40"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Org accordion (super admin only) ─────────────────────────────────────────

function OrgCard({
  org, users, invites, token, onRefresh, index = 0,
}: {
  org: any;
  users: any[];
  invites: any[];
  token: string | null;
  onRefresh: () => void;
  index?: number;
}) {
  const [expanded, setExpanded]     = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const ease = [0.16, 1, 0.3, 1] as const;

  const orgUsers   = users.filter((u) => u.organisation_id === org.id);
  const orgInvites = invites.filter((i) => i.organisation_id === org.id);

  const handleRoleChange = async (userId: number, newRole: string) => {
    await fetch("/api/admin", {
      method:  "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ action: "update_role", user_id: userId, role: newRole }),
    });
    onRefresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease }}
      className="bg-card border border-border"
    >
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-foreground/[0.02] transition-colors duration-150"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <Building2 className="w-4 h-4 text-primary shrink-0" />
          <div>
            <h3 className="font-display font-bold text-base text-foreground">{org.name}</h3>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wide mt-0.5">
              {org.user_count} {org.user_count === 1 ? "user" : "users"} · {org.ticket_count} {org.ticket_count === 1 ? "ticket" : "tickets"}
              {orgInvites.length > 0 && (
                <span className="text-primary"> · {orgInvites.length} pending invite{orgInvites.length > 1 ? "s" : ""}</span>
              )}
            </p>
          </div>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-5 space-y-4">

              {/* Users */}
              {orgUsers.length === 0 ? (
                <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">No users yet.</p>
              ) : (
                <div>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/60 mb-2">Members</p>
                  {orgUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <span className="font-medium text-sm text-foreground">{u.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground ml-3 tracking-wide">{u.email}</span>
                      </div>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-input border border-border rounded-none h-7 px-2 font-mono text-[10px] tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground cursor-pointer"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* Pending invites */}
              {orgInvites.length > 0 && (
                <div>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/60 mb-2">Pending Invites</p>
                  {orgInvites.map((inv) => (
                    <PendingInviteRow key={inv.id} invite={inv} token={token} onRefresh={onRefresh} />
                  ))}
                </div>
              )}

              {/* Invite form */}
              <AnimatePresence>
                {showInvite && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-border pt-4"
                  >
                    <InviteUserForm
                      token={token}
                      isSuperAdmin={true}
                      orgId={org.id}
                      orgName={org.name}
                      onSuccess={() => { setShowInvite(false); onRefresh(); }}
                      onCancel={() => setShowInvite(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {!showInvite && (
                <Button
                  onClick={() => setShowInvite(true)}
                  variant="outline"
                  className="rounded-none border-border hover:border-primary hover:text-primary h-8 px-4 text-xs font-mono tracking-wider uppercase transition-colors duration-150 flex items-center gap-2"
                >
                  <Mail className="w-3 h-3" /> Invite User
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const isSuperAdmin = user?.is_super_admin ?? false;
  const search = useSearch();

  const [tickets, setTickets]         = useState<any[]>([]);
  const [orgs, setOrgs]               = useState<any[]>([]);
  const [orgUsers, setOrgUsers]       = useState<any[]>([]);
  const [clients, setClients]         = useState<any[]>([]);
  const [invites, setInvites]         = useState<any[]>([]);
  const [devEdgeTeam, setDevEdgeTeam] = useState<any[]>([]);
  const [devEdgeInvites, setDevEdgeInvites] = useState<any[]>([]);
  const [superOrg, setSuperOrg]       = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [showDevEdgeInvite, setShowDevEdgeInvite] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) ?? null;

  const [filterOrgId, setFilterOrgId] = useState<string>("all");

  const [showAddOrg, setShowAddOrg]   = useState(false);
  const [showInvite, setShowInvite]   = useState(false);
  const [newOrgName, setNewOrgName]   = useState("");
  const [creatingOrg, setCreatingOrg] = useState(false);

  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketTitle, setTicketTitle]       = useState("");
  const [ticketDesc, setTicketDesc]         = useState("");
  const [ticketPriority, setTicketPriority] = useState("medium");
  const [ticketFiles, setTicketFiles]       = useState<File[]>([]);
  const [creatingTicket, setCreatingTicket] = useState(false);
  const ticketFileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [tRes, aRes] = await Promise.all([
        fetch("/api/tickets", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/admin",   { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const tData = await tRes.json();
      const aData = await aRes.json();
      if (tData.success) setTickets(tData.tickets);
      if (aData.success) {
        if (isSuperAdmin) {
          setOrgs(aData.orgs ?? []);
          setOrgUsers(aData.users ?? []);
          setInvites(aData.invites ?? []);
          setDevEdgeTeam(aData.devEdgeTeam ?? []);
          setDevEdgeInvites(aData.devEdgeInvites ?? []);
          setSuperOrg(aData.superOrg ?? null);
        } else {
          setClients(aData.clients ?? []);
          setInvites(aData.invites ?? []);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  // Deep-link: open ticket from ?ticket=123 once tickets are loaded
  useEffect(() => {
    if (tickets.length === 0) return;
    const params = new URLSearchParams(search);
    const id = parseInt(params.get("ticket") || "");
    if (id && !selectedTicketId) setSelectedTicketId(id);
  }, [tickets, search]);

  const openTicket = (ticket: any) => {
    setSelectedTicketId(ticket.id);
    window.history.replaceState({}, "", `?ticket=${ticket.id}`);
  };

  const closeTicket = () => {
    setSelectedTicketId(null);
    window.history.replaceState({}, "", window.location.pathname);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await fetch("/api/tickets", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ id, status }),
      });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingOrg(true);
    try {
      const res  = await fetch("/api/admin", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ action: "create_org", name: newOrgName }),
      });
      const data = await res.json();
      if (data.success) { setNewOrgName(""); setShowAddOrg(false); fetchData(); }
    } catch (e) { console.error(e); } finally { setCreatingOrg(false); }
  };

  const handleTicketFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const valid = files.filter((f) => f.size <= MAX_FILE_SIZE);
    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length) alert(`${oversized.map((f) => f.name).join(", ")} exceed the 10 MB limit and were not added.`);
    setTicketFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...valid.filter((f) => !names.has(f.name))];
    });
    e.target.value = "";
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingTicket(true);
    try {
      const res  = await fetch("/api/tickets", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ title: ticketTitle, description: ticketDesc, priority: ticketPriority }),
      });
      const data = await res.json();
      if (data.success) {
        const ticketId = data.ticket.id;
        for (const file of ticketFiles) {
          const fd = new FormData();
          fd.append("ticket_id", String(ticketId));
          fd.append("file", file);
          await fetch("/api/attachments", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
        }
        setTicketTitle(""); setTicketDesc(""); setTicketPriority("medium"); setTicketFiles([]);
        setShowTicketForm(false);
        fetchData();
      }
    } catch (e) { console.error(e); } finally { setCreatingTicket(false); }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    await fetch("/api/admin", {
      method:  "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ action: "update_role", user_id: userId, role: newRole }),
    });
    fetchData();
  };

  const ease = [0.16, 1, 0.3, 1] as const;

  const openCount       = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;

  const filteredTickets = filterOrgId === "all"
    ? tickets
    : tickets.filter((t) => String(t.organisation_id) === filterOrgId);

  const stats = isSuperAdmin
    ? [
        { label: "Open Tickets",  value: openCount,       icon: Ticket },
        { label: "In Progress",   value: inProgressCount, icon: Ticket },
        { label: "Organisations", value: orgs.length,     icon: Building2 },
        { label: "Total Users",   value: orgUsers.length, icon: Users },
      ]
    : [
        { label: "Open Tickets",  value: openCount,       icon: Ticket },
        { label: "In Progress",   value: inProgressCount, icon: Ticket },
        { label: "Team Members",  value: clients.length,  icon: Users },
      ];

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailPanel
            key={selectedTicket.id}
            ticket={selectedTicket}
            token={token!}
            currentUserId={user?.id ?? 0}
            isAdmin={true}
            onClose={closeTicket}
            onTicketUpdated={fetchData}
          />
        )}
      </AnimatePresence>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a href="/" className="flex items-center gap-2">
              <img src="/images/logo-transparent.png" alt="DevEdge" className="h-6 w-auto" />
              <span className="font-display font-bold text-base tracking-tight text-foreground">DevEdge</span>
            </a>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <span className="hidden sm:block font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block font-mono text-[10px] text-muted-foreground tracking-wide">{user?.name}</span>
            <Button variant="outline" onClick={logout}
              className="rounded-none border-border hover:border-primary hover:text-primary text-xs h-8 px-4 font-mono tracking-wider uppercase transition-colors duration-150">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Heading */}
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
            {isSuperAdmin ? "Super Admin" : "Admin"}<br />
            <span className="text-primary">Dashboard.</span>
          </h1>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-card border border-border p-5">
              <Icon className="w-4 h-4 text-primary mb-3" />
              <div className="font-display font-black text-4xl text-foreground leading-none mb-2">
                {loading ? "—" : value}
              </div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="mb-0 bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-0">
            <TabsTrigger value="tickets"
              className="rounded-none font-mono text-[11px] tracking-widest uppercase px-6 py-3 h-auto border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors duration-150">
              Tickets
            </TabsTrigger>
            <TabsTrigger value={isSuperAdmin ? "organisations" : "team"}
              className="rounded-none font-mono text-[11px] tracking-widest uppercase px-6 py-3 h-auto border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors duration-150">
              {isSuperAdmin ? "Organisations" : "Team"}
            </TabsTrigger>
            {isSuperAdmin && (
              <TabsTrigger value="devedge-team"
                className="rounded-none font-mono text-[11px] tracking-widest uppercase px-6 py-3 h-auto border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground hover:text-foreground transition-colors duration-150">
                DevEdge Team
              </TabsTrigger>
            )}
          </TabsList>

          {/* ── Tickets tab ───────────────────────────────────────────────── */}
          <TabsContent value="tickets" className="mt-6">
            <div className="flex items-center gap-4 mb-5">
              {isSuperAdmin && orgs.length > 0 && (
                <>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground shrink-0">Filter by org</span>
                  <select
                    className="bg-input border border-border rounded-none h-9 px-3 font-mono text-[10px] tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
                    value={filterOrgId}
                    onChange={(e) => setFilterOrgId(e.target.value)}
                  >
                    <option value="all">All Organisations</option>
                    {orgs.map((o) => <option key={o.id} value={String(o.id)}>{o.name}</option>)}
                  </select>
                </>
              )}
              <span className="font-mono text-[10px] text-muted-foreground ml-auto">
                {filteredTickets.length} tickets
              </span>
              <Button
                onClick={() => { setShowTicketForm(!showTicketForm); if (showTicketForm) setTicketFiles([]); }}
                className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-xs font-mono tracking-wider uppercase transition-colors duration-150 flex items-center gap-2 shrink-0"
              >
                {showTicketForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                {showTicketForm ? "Cancel" : "New Ticket"}
              </Button>
            </div>

            <AnimatePresence>
              {showTicketForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mb-6"
                >
                  <form onSubmit={handleCreateTicket} className="bg-card border border-border p-6 flex flex-col gap-4">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">New Ticket</span>
                    <Input
                      required
                      placeholder="Title"
                      value={ticketTitle}
                      onChange={(e) => setTicketTitle(e.target.value)}
                      className="rounded-none border-border bg-input h-11"
                    />
                    <Textarea
                      required
                      placeholder="Describe the issue or request..."
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                      className="rounded-none border-border bg-input min-h-[100px] resize-none"
                    />
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value)}
                      className="bg-input border border-border rounded-none h-11 px-3 font-mono text-[11px] tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="critical">Critical</option>
                    </select>

                    {/* Attachments */}
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                        Attachments <span className="text-muted-foreground/50 normal-case">(optional · 10 MB max)</span>
                      </label>
                      <input ref={ticketFileInputRef} type="file" multiple className="hidden" onChange={handleTicketFileSelect} />
                      <button
                        type="button"
                        onClick={() => ticketFileInputRef.current?.click()}
                        className="flex items-center gap-2 border border-dashed border-border hover:border-primary/50 px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors duration-150"
                      >
                        <Paperclip className="w-3 h-3" /> Add Files
                      </button>
                      {ticketFiles.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {ticketFiles.map((f) => (
                            <li key={f.name} className="flex items-center gap-3 bg-secondary/40 border border-border px-3 py-1.5">
                              <Paperclip className="w-3 h-3 text-muted-foreground shrink-0" />
                              <span className="font-mono text-[10px] text-foreground truncate flex-1">{f.name}</span>
                              <span className="font-mono text-[10px] text-muted-foreground shrink-0">{formatBytes(f.size)}</span>
                              <button
                                type="button"
                                onClick={() => setTicketFiles((prev) => prev.filter((p) => p.name !== f.name))}
                                className="text-muted-foreground hover:text-destructive transition-colors duration-150 shrink-0"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={creatingTicket}
                      className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-11 font-semibold text-sm self-start px-8"
                    >
                      {creatingTicket ? "Submitting..." : "Submit Ticket"}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
            {loading ? (
              <div className="py-20 text-center">
                <span className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase animate-pulse">Loading...</span>
              </div>
            ) : (
              <KanbanBoard
                tickets={filteredTickets}
                canEditTicket={() => true}
                showOrg={isSuperAdmin}
                onStatusChange={handleUpdateStatus}
                onTicketClick={openTicket}
              />
            )}
          </TabsContent>

          {/* ── Organisations tab (super admin) ───────────────────────────── */}
          <TabsContent value="organisations" className="mt-6">
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                Client Organisations
              </span>
              <div className="flex gap-3">
                <Button onClick={() => setShowAddOrg(true)}
                  className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-xs font-mono tracking-wider uppercase transition-colors duration-150 flex items-center gap-2">
                  <Plus className="w-3 h-3" /> New Organisation
                </Button>
              </div>
            </div>

            {/* New org inline form */}
            <AnimatePresence>
              {showAddOrg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mb-4"
                >
                  <form onSubmit={handleCreateOrg} className="bg-card border border-border p-6 flex items-end gap-4">
                    <div className="flex-1">
                      <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-2 block">
                        Organisation Name
                      </label>
                      <Input required value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)}
                        placeholder="Acme Corp"
                        className="bg-input border-border h-11 rounded-none focus-visible:ring-primary/30 text-foreground placeholder:text-muted-foreground" />
                    </div>
                    <Button type="submit" disabled={creatingOrg}
                      className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 font-semibold transition-colors duration-150">
                      {creatingOrg ? "Creating..." : "Create"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddOrg(false)}
                      className="rounded-none border-border hover:border-primary hover:text-primary h-11 px-4 transition-colors duration-150">
                      Cancel
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {orgs.length === 0 ? (
              <div className="py-20 border border-dashed border-border text-center">
                <Building2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase">No client organisations yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {orgs.map((org, i) => (
                  <OrgCard
                    key={org.id}
                    org={org}
                    users={orgUsers}
                    invites={invites}
                    token={token}
                    onRefresh={fetchData}
                    index={i}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Team tab (regular admin) ──────────────────────────────────── */}
          <TabsContent value="team" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Invite form */}
              <div className="md:col-span-1">
                <div className="bg-card border border-border p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <h3 className="font-display font-bold text-xl text-foreground">Invite User</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">Send an invite link to add a new team member.</p>
                  <AnimatePresence mode="wait">
                    {showInvite ? (
                      <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <InviteUserForm
                          token={token}
                          isSuperAdmin={false}
                          onSuccess={() => { setShowInvite(false); fetchData(); }}
                          onCancel={() => setShowInvite(false)}
                        />
                      </motion.div>
                    ) : (
                      <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Button
                          onClick={() => setShowInvite(true)}
                          className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 px-6 transition-colors duration-150 flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" /> Send Invite
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Team list */}
              <div className="md:col-span-2">
                {/* Active members */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Team Members</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{clients.length} active</span>
                </div>
                <div className="space-y-2 mb-8">
                  {clients.map((client, i) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05, ease }}
                      className="bg-card border border-border p-4 flex justify-between items-center group hover:border-primary/40 transition-colors duration-200"
                    >
                      <div>
                        <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors duration-150">
                          {client.name}
                        </h3>
                        <p className="font-mono text-[10px] text-muted-foreground tracking-wide mt-0.5">{client.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={client.role}
                          onChange={(e) => handleRoleChange(client.id, e.target.value)}
                          className="bg-input border border-border rounded-none h-8 px-2 font-mono text-[10px] tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground cursor-pointer"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase hidden sm:block">
                          {new Date(client.created_at).toLocaleDateString("en-AU", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  {clients.length === 0 && (
                    <div className="py-10 border border-dashed border-border text-center">
                      <p className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase">No team members yet.</p>
                    </div>
                  )}
                </div>

                {/* Pending invites */}
                {invites.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Pending Invites</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{invites.length}</span>
                    </div>
                    <div className="bg-card border border-border px-4">
                      {invites.map((inv) => (
                        <PendingInviteRow key={inv.id} invite={inv} token={token} onRefresh={fetchData} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ── DevEdge Team tab (super admin only) ──────────────────────── */}
          {isSuperAdmin && (
            <TabsContent value="devedge-team" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Invite form */}
                <div className="md:col-span-1">
                  <div className="bg-card border border-border p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <h3 className="font-display font-bold text-xl text-foreground">Invite to DevEdge</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">Add a new member to the DevEdge team.</p>
                    <AnimatePresence mode="wait">
                      {showDevEdgeInvite ? (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <InviteUserForm
                            token={token}
                            isSuperAdmin={true}
                            orgId={superOrg?.id}
                            orgName={superOrg?.name}
                            onSuccess={() => { setShowDevEdgeInvite(false); fetchData(); }}
                            onCancel={() => setShowDevEdgeInvite(false)}
                          />
                        </motion.div>
                      ) : (
                        <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <Button
                            onClick={() => setShowDevEdgeInvite(true)}
                            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 px-6 transition-colors duration-150 flex items-center gap-2"
                          >
                            <Mail className="w-4 h-4" /> Send Invite
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Team list */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Team Members</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{devEdgeTeam.length} members</span>
                  </div>
                  <div className="space-y-2 mb-8">
                    {devEdgeTeam.map((member, i) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05, ease }}
                        className="bg-card border border-border p-4 flex justify-between items-center group hover:border-primary/40 transition-colors duration-200"
                      >
                        <div>
                          <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors duration-150">
                            {member.name}
                          </h3>
                          <p className="font-mono text-[10px] text-muted-foreground tracking-wide mt-0.5">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                            disabled={member.id === user?.id}
                            className="bg-input border border-border rounded-none h-8 px-2 font-mono text-[10px] tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground cursor-pointer disabled:opacity-40 disabled:cursor-default"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase hidden sm:block">
                            {new Date(member.created_at).toLocaleDateString("en-AU", { month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pending invites */}
                  {devEdgeInvites.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Pending Invites</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{devEdgeInvites.length}</span>
                      </div>
                      <div className="bg-card border border-border px-4">
                        {devEdgeInvites.map((inv) => (
                          <PendingInviteRow key={inv.id} invite={inv} token={token} onRefresh={fetchData} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
