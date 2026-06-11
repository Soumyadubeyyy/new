import { Flame, TrendingUp, Snowflake } from "lucide-react";

export type LeadPriority = "Hot" | "Warm" | "Cold";

const BADGE_CONFIG: Record<
  LeadPriority,
  { label: string; icon: typeof Flame; classes: string; dot: string }
> = {
  Hot: {
    label: "Hot",
    icon: Flame,
    classes:
      "bg-red-500/12 text-red-600 border-red-500/25 shadow-[0_0_12px_-4px_rgba(239,68,68,0.4)]",
    dot: "bg-red-500",
  },
  Warm: {
    label: "Warm",
    icon: TrendingUp,
    classes:
      "bg-orange-500/12 text-orange-600 border-orange-500/25 shadow-[0_0_12px_-4px_rgba(249,115,22,0.3)]",
    dot: "bg-orange-500",
  },
  Cold: {
    label: "Cold",
    icon: Snowflake,
    classes:
      "bg-slate-500/10 text-slate-500 border-slate-500/20",
    dot: "bg-slate-400",
  },
};

interface LeadBadgeProps {
  priority: LeadPriority;
  size?: "sm" | "md";
}

export function LeadBadge({ priority, size = "md" }: LeadBadgeProps) {
  const cfg = BADGE_CONFIG[priority];
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 border font-semibold rounded-full ${cfg.classes} ${
        size === "sm" ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-1"
      }`}
    >
      <span className={`rounded-full ${cfg.dot} ${size === "sm" ? "h-1 w-1" : "h-1.5 w-1.5"}`} />
      <Icon size={size === "sm" ? 9 : 10} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}
