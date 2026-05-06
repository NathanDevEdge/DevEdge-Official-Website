import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Paperclip, Send, Trash2, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { STATUS_CONFIG, STATUS_OPTIONS, type TicketStatus } from "@/lib/ticketStatus";
import { PRIORITY_CONFIG, PRIORITY_OPTIONS, type TicketPriority } from "@/lib/ticketPriority";

interface Comment {
  id: number;
  content: string;
  author_name: string;
  author_id: number;
  created_at: string;
}

interface Attachment {
  id: number;
  original_name: string;
  mime_type: string;
  size: number;
  uploader_name: string;
  created_at: string;
}

interface Props {
  ticket: any | null;
  token: string;
  currentUserId: number;
  isAdmin: boolean;
  onClose: () => void;
  onTicketUpdated: () => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-AU", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function renderMentions(text: string) {
  return text.split(/(@[A-Za-z][A-Za-z0-9_-]*)/g).map((part, i) =>
    part.startsWith("@")
      ? <span key={i} className="text-primary font-semibold">{part}</span>
      : <span key={i}>{part}</span>
  );
}

export default function TicketDetailPanel({ ticket, token, currentUserId, isAdmin, onClose, onTicketUpdated }: Props) {
  // Editable fields
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus]           = useState<TicketStatus>("open");
  const [priority, setPriority]       = useState<TicketPriority>("medium");
  const [isDirty, setIsDirty]         = useState(false);
  const [saving, setSaving]           = useState(false);

  // Comments
  const [comments, setComments]       = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading]     = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ticketId = ticket?.id;

  // Seed state when ticket changes
  useEffect(() => {
    if (!ticket) return;
    setTitle(ticket.title ?? "");
    setDescription(ticket.description ?? "");
    setStatus(ticket.status ?? "open");
    setPriority(ticket.priority ?? "medium");
    setIsDirty(false);
    fetchComments();
    fetchAttachments();
  }, [ticketId]);

  // Dirty tracking
  useEffect(() => {
    if (!ticket) return;
    setIsDirty(
      title !== ticket.title ||
      description !== ticket.description ||
      status !== ticket.status ||
      priority !== ticket.priority
    );
  }, [title, description, status, priority]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const fetchComments = useCallback(async () => {
    if (!ticketId) return;
    try {
      const res = await fetch(`/api/comments?ticket_id=${ticketId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setComments(data.comments);
    } catch (e) { console.error(e); }
  }, [ticketId, token]);

  const fetchAttachments = useCallback(async () => {
    if (!ticketId) return;
    try {
      const res = await fetch(`/api/attachments?ticket_id=${ticketId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setAttachments(data.attachments);
    } catch (e) { console.error(e); }
  }, [ticketId, token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: ticketId, title, description, status, priority }),
      });
      const data = await res.json();
      if (data.success) { setIsDirty(false); onTicketUpdated(); }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setPostingComment(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ticket_id: ticketId, content: commentText.trim() }),
      });
      const data = await res.json();
      if (data.success) { setCommentText(""); setComments(prev => [...prev, data.comment]); }
    } catch (e) { console.error(e); } finally { setPostingComment(false); }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File exceeds 10 MB limit.");
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("ticket_id", String(ticketId));
      const res = await fetch("/api/attachments", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (data.success) setAttachments(prev => [...prev, data.attachment]);
    } catch (e) { console.error(e); } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDownload = async (att: Attachment) => {
    try {
      const res = await fetch(`/api/attachments/file/${att.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = att.original_name; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { console.error(e); }
  };

  const handleDeleteAttachment = async (id: number) => {
    if (!confirm("Delete this attachment?")) return;
    try {
      await fetch(`/api/attachments/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setAttachments(prev => prev.filter(a => a.id !== id));
    } catch (e) { console.error(e); }
  };

  if (!ticket) return null;

  const priority_ = PRIORITY_CONFIG[priority];
  const status_ = STATUS_CONFIG[status];
  const canEdit = isAdmin || ticket.client_id === currentUserId;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        className="fixed right-0 top-0 h-full w-full max-w-[640px] bg-background border-l border-border z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div>
            <span className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground block mb-1">
              Ticket #{ticket.id}
            </span>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 border ${priority_.classes}`}>
                {priority_.label}
              </span>
              <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 border ${status_.classes}`}>
                {status_.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-6">

            {/* ── Details ──────────────────────────────────────────────── */}
            <section>
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground flex items-center gap-3 mb-4">
                <span className="w-5 h-px bg-border inline-block" /> Details
              </span>

              <div className="space-y-3">
                {canEdit ? (
                  <Input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="rounded-none border-border bg-input h-11 font-display font-bold text-base"
                    placeholder="Ticket title"
                  />
                ) : (
                  <h2 className="font-display font-black text-xl text-foreground leading-tight">{title}</h2>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {/* Status */}
                  <div className="relative">
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value as TicketStatus)}
                      disabled={!canEdit}
                      className="w-full appearance-none bg-input border border-border rounded-none h-10 pl-3 pr-8 font-mono text-[10px] tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground disabled:opacity-60 disabled:cursor-default"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                  </div>

                  {/* Priority */}
                  <div className="relative">
                    <select
                      value={priority}
                      onChange={e => setPriority(e.target.value as TicketPriority)}
                      disabled={!isAdmin}
                      className="w-full appearance-none bg-input border border-border rounded-none h-10 pl-3 pr-8 font-mono text-[10px] tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground disabled:opacity-60 disabled:cursor-default"
                    >
                      {PRIORITY_OPTIONS.map(p => (
                        <option key={p} value={p}>{PRIORITY_CONFIG[p].label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {canEdit ? (
                  <Textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="rounded-none border-border bg-input min-h-[120px] resize-none text-sm leading-relaxed"
                    placeholder="Description"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{description}</p>
                )}

                <AnimatePresence>
                  {isDirty && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-6 text-xs font-mono tracking-wider uppercase"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <div className="border-t border-border" />

            {/* ── Attachments ──────────────────────────────────────────── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground flex items-center gap-3">
                  <span className="w-5 h-px bg-border inline-block" /> Attachments
                  {attachments.length > 0 && (
                    <span className="text-foreground">({attachments.length})</span>
                  )}
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                >
                  <Paperclip className="w-3 h-3" />
                  {uploading ? "Uploading..." : "Attach File"}
                </button>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
              </div>

              {attachments.length === 0 ? (
                <p className="font-mono text-[10px] text-muted-foreground/50 tracking-wide">No attachments yet</p>
              ) : (
                <div className="space-y-2">
                  {attachments.map(att => (
                    <div key={att.id} className="flex items-center gap-3 bg-secondary/40 border border-border px-3 py-2 group">
                      <Paperclip className="w-3 h-3 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground font-mono truncate">{att.original_name}</p>
                        <p className="font-mono text-[9px] text-muted-foreground tracking-wide">
                          {formatBytes(att.size)} · {att.uploader_name} · {formatDate(att.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => handleDownload(att)} className="text-muted-foreground hover:text-primary transition-colors p-1">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        {(isAdmin || att.uploader_name === ticket.client_name) && (
                          <button onClick={() => handleDeleteAttachment(att.id)} className="text-muted-foreground hover:text-red-500 transition-colors p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="border-t border-border" />

            {/* ── Comments ─────────────────────────────────────────────── */}
            <section>
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground flex items-center gap-3 mb-4">
                <span className="w-5 h-px bg-border inline-block" /> Comments
                {comments.length > 0 && <span className="text-foreground">({comments.length})</span>}
              </span>

              {comments.length === 0 ? (
                <p className="font-mono text-[10px] text-muted-foreground/50 tracking-wide mb-4">No comments yet</p>
              ) : (
                <div className="space-y-4 mb-4">
                  {comments.map(c => (
                    <div key={c.id} className={`flex gap-3 ${c.author_id === currentUserId ? "flex-row-reverse" : ""}`}>
                      <div className="shrink-0 w-7 h-7 bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <span className="font-mono text-[9px] text-primary font-bold uppercase">
                          {c.author_name.charAt(0)}
                        </span>
                      </div>
                      <div className={`flex-1 ${c.author_id === currentUserId ? "items-end" : "items-start"} flex flex-col`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[9px] text-muted-foreground tracking-wide">{c.author_name}</span>
                          <span className="font-mono text-[9px] text-muted-foreground/50">{formatDate(c.created_at)}</span>
                        </div>
                        <div className={`bg-card border border-border px-3 py-2.5 text-sm leading-relaxed text-foreground whitespace-pre-wrap max-w-[85%] ${c.author_id === currentUserId ? "border-primary/20 bg-primary/5" : ""}`}>
                          {renderMentions(c.content)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={commentsEndRef} />
                </div>
              )}

              {/* Comment input */}
              <div className="space-y-2">
                <Textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handlePostComment(); }}
                  placeholder={"Add a comment… Use @Name to notify someone"}
                  className="rounded-none border-border bg-input min-h-[80px] resize-none text-sm"
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-muted-foreground/50 tracking-wide">⌘↵ to post</span>
                  <Button
                    onClick={handlePostComment}
                    disabled={!commentText.trim() || postingComment}
                    className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-4 text-xs font-mono tracking-wider uppercase flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    {postingComment ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </section>

            {/* Bottom padding */}
            <div className="h-4" />
          </div>
        </div>
      </motion.div>
    </>
  );
}
