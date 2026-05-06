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
  const [comments, setComments]           = useState<Comment[]>([]);
  const [commentText, setCommentText]     = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // @mention autocomplete
  const [mentionableUsers, setMentionableUsers] = useState<{id: number; name: string}[]>([]);
  const [mentionQuery, setMentionQuery]         = useState<string | null>(null);
  const [mentionIndex, setMentionIndex]         = useState(0);

  // Attachments
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading]     = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete ticket
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting]           = useState(false);

  const ticketId = ticket?.id;

  // Seed state when ticket changes
  useEffect(() => {
    if (!ticket) return;
    setTitle(ticket.title ?? "");
    setDescription(ticket.description ?? "");
    setStatus(ticket.status ?? "open");
    setPriority(ticket.priority ?? "medium");
    setIsDirty(false);
    setConfirmDelete(false);
    setMentionQuery(null);
    fetchComments();
    fetchAttachments();
    fetchMentionableUsers();
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

  const fetchMentionableUsers = useCallback(async () => {
    if (!ticketId) return;
    try {
      const res = await fetch(`/api/comments?mentionables=1&ticket_id=${ticketId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setMentionableUsers(data.users);
    } catch (e) { console.error(e); }
  }, [ticketId, token]);

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

  const insertMention = (user: {id: number; name: string}) => {
    const textarea = commentInputRef.current;
    if (!textarea) return;
    const cursor = textarea.selectionStart ?? commentText.length;
    const before = commentText.slice(0, cursor);
    const after  = commentText.slice(cursor);
    const match  = before.match(/@([A-Za-z][A-Za-z0-9_-]*)$/);
    if (!match) return;
    const insertAt = cursor - match[0].length;
    const newText  = commentText.slice(0, insertAt) + `@${user.name} ` + after;
    setCommentText(newText);
    setMentionQuery(null);
    setTimeout(() => {
      textarea.focus();
      const pos = insertAt + user.name.length + 2;
      textarea.setSelectionRange(pos, pos);
    }, 0);
  };

  const handleDeleteTicket = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: ticketId }),
      });
      const data = await res.json();
      if (data.success) { onClose(); onTicketUpdated(); }
    } catch (e) { console.error(e); } finally { setDeleting(false); }
  };

  if (!ticket) return null;

  const priority_ = PRIORITY_CONFIG[priority];
  const status_ = STATUS_CONFIG[status];
  const canEdit = isAdmin || ticket.client_id === currentUserId;
  const canDelete = isAdmin || ticket.client_id === currentUserId;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 36 }}
        className="fixed right-0 top-0 h-full w-full max-w-[640px] bg-background border-l border-border z-[70] flex flex-col overflow-hidden"
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
          <div className="flex items-center gap-2 shrink-0">
            {canDelete && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                title="Delete ticket"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            {canDelete && confirmDelete && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] tracking-widest uppercase text-destructive">Delete?</span>
                <button
                  onClick={handleDeleteTicket}
                  disabled={deleting}
                  className="font-mono text-[9px] tracking-widest uppercase bg-destructive text-white px-2.5 py-1 hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors px-2 py-1 border border-border"
                >
                  Cancel
                </button>
              </div>
            )}
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
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
                <div className="relative">
                  {/* @mention dropdown */}
                  {mentionQuery !== null && (() => {
                    const filtered = mentionableUsers.filter(u => {
                      const q = mentionQuery.toLowerCase();
                      return u.name.toLowerCase().startsWith(q) ||
                        u.name.toLowerCase().split(" ").some(p => p.startsWith(q));
                    });
                    if (filtered.length === 0) return null;
                    return (
                      <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border shadow-lg z-10 max-h-48 overflow-y-auto">
                        {filtered.map((u, i) => (
                          <button
                            key={u.id}
                            type="button"
                            onMouseDown={e => { e.preventDefault(); insertMention(u); }}
                            className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors duration-100 ${i === mentionIndex ? "bg-primary/10 text-primary" : "hover:bg-secondary/60 text-foreground"}`}
                          >
                            <span className="w-5 h-5 bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                              <span className="font-mono text-[8px] text-primary font-bold uppercase">{u.name.charAt(0)}</span>
                            </span>
                            <span className="text-sm font-medium">{u.name}</span>
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                  <Textarea
                    ref={commentInputRef}
                    value={commentText}
                    onChange={e => {
                      const val = e.target.value;
                      setCommentText(val);
                      const cursor = e.target.selectionStart ?? val.length;
                      const before = val.slice(0, cursor);
                      const match = before.match(/@([A-Za-z][A-Za-z0-9_-]*)$/);
                      if (match) { setMentionQuery(match[1]); setMentionIndex(0); }
                      else setMentionQuery(null);
                    }}
                    onKeyDown={e => {
                      const filtered = mentionQuery !== null
                        ? mentionableUsers.filter(u => {
                            const q = mentionQuery.toLowerCase();
                            return u.name.toLowerCase().startsWith(q) ||
                              u.name.toLowerCase().split(" ").some(p => p.startsWith(q));
                          })
                        : [];
                      if (filtered.length > 0) {
                        if (e.key === "ArrowDown") { e.preventDefault(); setMentionIndex(i => Math.min(i + 1, filtered.length - 1)); return; }
                        if (e.key === "ArrowUp")   { e.preventDefault(); setMentionIndex(i => Math.max(i - 1, 0)); return; }
                        if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); insertMention(filtered[mentionIndex]); return; }
                        if (e.key === "Escape") { setMentionQuery(null); return; }
                      }
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handlePostComment();
                    }}
                    placeholder="Add a comment… Use @Name to notify someone"
                    className="rounded-none border-border bg-input min-h-[80px] resize-none text-sm"
                  />
                </div>
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
