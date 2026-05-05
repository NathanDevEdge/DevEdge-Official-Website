export type TicketPriority = "low" | "medium" | "high" | "critical";

export const PRIORITY_CONFIG: Record<
  TicketPriority,
  { label: string; description: string; sla: string; classes: string; borderClass: string }
> = {
  low: {
    label:       "Low",
    description: "Minor visual change, no functionality impact",
    sla:         "Next available window",
    classes:     "bg-foreground/5 text-muted-foreground border-foreground/15",
    borderClass: "border-t-foreground/20",
  },
  medium: {
    label:       "Medium",
    description: "Functional issue, site / system still usable",
    sla:         "Current or next business day",
    classes:     "bg-blue-500/10 text-blue-700 border-blue-500/20",
    borderClass: "border-t-blue-400",
  },
  high: {
    label:       "High",
    description: "Broken feature affecting users",
    sla:         "Same day where possible",
    classes:     "bg-primary/10 text-primary border-primary/30",
    borderClass: "border-t-primary",
  },
  critical: {
    label:       "Critical",
    description: "Site down or major breakage",
    sla:         "Immediate — drop everything",
    classes:     "bg-red-500/10 text-red-600 border-red-500/20",
    borderClass: "border-t-red-500",
  },
};

export const PRIORITY_OPTIONS: TicketPriority[] = ["low", "medium", "high", "critical"];
