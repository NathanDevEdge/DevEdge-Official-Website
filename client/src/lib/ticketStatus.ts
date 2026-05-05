export type TicketStatus = "open" | "confirmed" | "in_progress" | "in_review" | "closed";

export const STATUS_CONFIG: Record<TicketStatus, { label: string; classes: string }> = {
  open:        { label: "Open",        classes: "bg-[#8B6914]/10 text-[#8B6914] border-[#8B6914]/20" },
  confirmed:   { label: "Confirmed",   classes: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
  in_progress: { label: "In Progress", classes: "bg-primary/10 text-primary border-primary/30" },
  in_review:   { label: "In Review",   classes: "bg-purple-500/10 text-purple-700 border-purple-500/20" },
  closed:      { label: "Closed",      classes: "bg-[#2d6a4f]/10 text-[#2d6a4f] border-[#2d6a4f]/20" },
};

export const STATUS_OPTIONS: TicketStatus[] = [
  "open", "confirmed", "in_progress", "in_review", "closed",
];
