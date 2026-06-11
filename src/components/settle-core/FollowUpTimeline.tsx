import { AlertTriangle, Clock, CheckCircle, User } from "lucide-react";

export type FollowUpStatus = "On Track" | "Due Soon" | "Escalated";

interface FollowUpEvent {
  id: string;
  leadName: string;
  guestPhone?: string;
  assignee: string;
  assigneeInitials: string;
  nextAction: string;
  scheduledAt: string; // human-readable e.g. "Today, 3:00 PM"
  status: FollowUpStatus;
}

const STATUS_CONFIG: Record<
  FollowUpStatus,
  { icon: typeof Clock; classes: string; dot: string }
> = {
  "On Track": {
    icon: CheckCircle,
    classes: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  "Due Soon": {
    icon: Clock,
    classes: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    dot: "bg-amber-500",
  },
  Escalated: {
    icon: AlertTriangle,
    classes: "bg-red-500/10 text-red-600 border-red-500/20",
    dot: "bg-red-500",
  },
};

function StatusChip({ status }: { status: FollowUpStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold border ${cfg.classes}`}
    >
      <Icon size={9} strokeWidth={2.5} />
      {status}
    </span>
  );
}

interface FollowUpTimelineProps {
  events: FollowUpEvent[];
  onSelect?: (id: string) => void;
  selectedId?: string;
}

export function FollowUpTimeline({
  events,
  onSelect,
  selectedId,
}: FollowUpTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border/60" />

      <div className="space-y-3">
        {events.map((ev, i) => {
          const isEscalated = ev.status === "Escalated";
          return (
            <button
              key={ev.id}
              type="button"
              onClick={() => onSelect?.(ev.id)}
              className={`relative w-full text-left flex gap-4 p-3 pl-10 rounded-xl border transition-all hover:shadow-soft ${
                selectedId === ev.id
                  ? "border-primary/40 bg-primary/5"
                  : isEscalated
                    ? "border-red-500/20 bg-red-500/3 hover:border-red-500/30"
                    : "border-border/50 bg-foreground/2 hover:border-border/80"
              }`}
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-3 top-4 h-3 w-3 rounded-full border-2 border-background z-10 ${
                  STATUS_CONFIG[ev.status].dot
                }`}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-semibold truncate">{ev.leadName}</span>
                  <StatusChip status={ev.status} />
                  {isEscalated && (
                    <AlertTriangle
                      size={11}
                      className="text-red-500 animate-pulse"
                    />
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground truncate mb-1.5">
                  {ev.nextAction}
                </p>

                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock size={9} /> {ev.scheduledAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="h-4 w-4 rounded-full bg-primary/15 grid place-items-center text-primary font-bold text-[8px]">
                      {ev.assigneeInitials}
                    </div>
                    {ev.assignee}
                  </span>
                  {ev.guestPhone && (
                    <span className="text-muted-foreground/60">{ev.guestPhone}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { FollowUpEvent };
