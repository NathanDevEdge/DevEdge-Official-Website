import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { STATUS_CONFIG, STATUS_OPTIONS, type TicketStatus } from "@/lib/ticketStatus";
import { PRIORITY_CONFIG, type TicketPriority } from "@/lib/ticketPriority";

// ── Kanban card ───────────────────────────────────────────────────────────────

function KanbanCard({
  ticket,
  canEdit,
  showOrg,
  onStatusChange,
  index,
}: {
  ticket: any;
  canEdit: boolean;
  showOrg: boolean;
  onStatusChange: (id: number, status: string) => void;
  index: number;
}) {
  const priority = PRIORITY_CONFIG[ticket.priority as TicketPriority] ?? PRIORITY_CONFIG.medium;
  const currentStatusIndex = STATUS_OPTIONS.indexOf(ticket.status as TicketStatus);
  const ease = [0.16, 1, 0.3, 1] as const;

  const movePrev = () => {
    if (currentStatusIndex > 0) onStatusChange(ticket.id, STATUS_OPTIONS[currentStatusIndex - 1]);
  };
  const moveNext = () => {
    if (currentStatusIndex < STATUS_OPTIONS.length - 1) onStatusChange(ticket.id, STATUS_OPTIONS[currentStatusIndex + 1]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03, ease }}
      className={`bg-card border border-border border-t-2 ${priority.borderClass} hover:border-primary/30 transition-colors duration-200 group`}
    >
      <div className="p-4">
        {/* Top row: priority + date */}
        <div className="flex items-center justify-between mb-3">
          <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 border ${priority.classes}`}>
            {priority.label}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground tracking-wide">
            {new Date(ticket.created_at).toLocaleDateString("en-AU", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-sm text-foreground group-hover:text-primary transition-colors duration-150 leading-tight mb-1">
          {ticket.title}
        </h3>

        {/* Submitter / org */}
        <p className="font-mono text-[9px] text-muted-foreground tracking-wide mb-3">
          {ticket.client_name}
          {showOrg && ticket.org_name && (
            <span className="text-primary"> · {ticket.org_name}</span>
          )}
        </p>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">
          {ticket.description}
        </p>

        {/* Move controls (editable only) */}
        {canEdit && (
          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <button
              onClick={movePrev}
              disabled={currentStatusIndex === 0}
              className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase text-muted-foreground hover:text-primary disabled:opacity-25 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <ChevronLeft className="w-3 h-3" />
              {currentStatusIndex > 0 ? STATUS_CONFIG[STATUS_OPTIONS[currentStatusIndex - 1]].label : ""}
            </button>
            <div className="flex-1" />
            <button
              onClick={moveNext}
              disabled={currentStatusIndex === STATUS_OPTIONS.length - 1}
              className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase text-muted-foreground hover:text-primary disabled:opacity-25 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {currentStatusIndex < STATUS_OPTIONS.length - 1 ? STATUS_CONFIG[STATUS_OPTIONS[currentStatusIndex + 1]].label : ""}
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Column header accent colours ──────────────────────────────────────────────

const COLUMN_ACCENT: Record<TicketStatus, string> = {
  open:        "bg-[#8B6914]",
  confirmed:   "bg-blue-500",
  in_progress: "bg-primary",
  in_review:   "bg-purple-500",
  closed:      "bg-[#2d6a4f]",
};

// ── Kanban board ──────────────────────────────────────────────────────────────

export default function KanbanBoard({
  tickets,
  canEditTicket,
  showOrg = false,
  onStatusChange,
}: {
  tickets: any[];
  canEditTicket: (ticket: any) => boolean;
  showOrg?: boolean;
  onStatusChange: (id: number, status: string) => void;
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      {STATUS_OPTIONS.map((status) => {
        const col = STATUS_CONFIG[status];
        const colTickets = tickets.filter((t) => t.status === status);

        return (
          <div key={status} className="flex-shrink-0 w-72 flex flex-col">
            {/* Column header */}
            <div className="flex items-center gap-3 mb-3 px-1">
              <span className={`w-2 h-2 rounded-full shrink-0 ${COLUMN_ACCENT[status]}`} />
              <span className="font-mono text-[10px] tracking-widest uppercase text-foreground font-medium">
                {col.label}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground ml-auto">
                {colTickets.length}
              </span>
            </div>

            {/* Column body */}
            <div className="flex-1 bg-secondary/40 border border-border p-2 space-y-2 min-h-[480px] overflow-y-auto">
              {colTickets.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <span className="font-mono text-[9px] text-muted-foreground/40 tracking-widest uppercase">
                    Empty
                  </span>
                </div>
              ) : (
                colTickets.map((ticket, i) => (
                  <KanbanCard
                    key={ticket.id}
                    ticket={ticket}
                    canEdit={canEditTicket(ticket)}
                    showOrg={showOrg}
                    onStatusChange={onStatusChange}
                    index={i}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
