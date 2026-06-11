import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SettleShell } from "@/components/settle-core/SettleShell";
import { FollowUpTimeline } from "@/components/settle-core/FollowUpTimeline";
import type { FollowUpEvent, FollowUpStatus } from "@/components/settle-core/FollowUpTimeline";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/settle/followups")({
  head: () => ({ meta: [{ title: "Follow-Ups · Settle" }] }),
  component: FollowUpsPage,
});

/* ─── Mock data ──────────────────────────────────────────── */
const EVENTS: FollowUpEvent[] = [
  {
    id: "f1",
    leadName: "Mohammed Irfan (Wedding Banquet)",
    guestPhone: "+91 90010 12345",
    assignee: "Riya Sharma",
    assigneeInitials: "RS",
    nextAction: "Confirm 50% advance payment & send booking contract",
    scheduledAt: "Today, 11:00 AM",
    status: "Escalated",
  },
  {
    id: "f2",
    leadName: "Arjun Kapoor (Deluxe King Room)",
    guestPhone: "+91 98100 55321",
    assignee: "Kabir Mehta",
    assigneeInitials: "KM",
    nextAction: "Follow up on advance payment — booking expires at 3 PM",
    scheduledAt: "Today, 2:30 PM",
    status: "Due Soon",
  },
  {
    id: "f3",
    leadName: "Sneha Reddy (Corporate Group)",
    guestPhone: undefined,
    assignee: "Riya Sharma",
    assigneeInitials: "RS",
    nextAction: "Send group booking brochure & revised quote",
    scheduledAt: "Tomorrow, 10:00 AM",
    status: "On Track",
  },
  {
    id: "f4",
    leadName: "Rahul Verma (Weekend Family)",
    guestPhone: "+91 96220 78901",
    assignee: "Kabir Mehta",
    assigneeInitials: "KM",
    nextAction: "Send pool-facing room availability confirmation",
    scheduledAt: "Today, 5:00 PM",
    status: "On Track",
  },
  {
    id: "f5",
    leadName: "Priya Malhotra (October Enquiry)",
    guestPhone: undefined,
    assignee: "Riya Sharma",
    assigneeInitials: "RS",
    nextAction: "Send October availability calendar + early-bird offer",
    scheduledAt: "Fri, 9:00 AM",
    status: "On Track",
  },
];

type FilterTab = "All" | FollowUpStatus;

const STAT_CARDS = [
  {
    label: "Total Active",
    value: EVENTS.length,
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/8 border-primary/15",
  },
  {
    label: "Due Soon",
    value: EVENTS.filter((e) => e.status === "Due Soon").length,
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-500/8 border-amber-500/20",
  },
  {
    label: "Escalated",
    value: EVENTS.filter((e) => e.status === "Escalated").length,
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-500/8 border-red-500/20",
  },
  {
    label: "On Track",
    value: EVENTS.filter((e) => e.status === "On Track").length,
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-500/8 border-emerald-500/20",
  },
];

function FollowUpsPage() {
  const [filter, setFilter] = useState<FilterTab>("All");
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const filtered =
    filter === "All" ? EVENTS : EVENTS.filter((e) => e.status === filter);

  return (
    <SettleShell>
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-xl font-semibold tracking-tight mb-1">
            Follow-Up Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Active lead timelines, task assignees, and escalation warnings.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className={`flex items-center gap-3 p-3 rounded-xl border ${bg}`}
            >
              <Icon size={16} className={color} />
              <div>
                <div className={`text-lg font-bold leading-none ${color}`}>
                  {value}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-4">
          <Filter size={13} className="text-muted-foreground mr-1" />
          {(["All", "Escalated", "Due Soon", "On Track"] as FilterTab[]).map(
            (f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {f}
              </button>
            )
          )}
        </div>

        {/* Timeline */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-sm text-muted-foreground">
            No follow-ups matching this filter.
          </div>
        ) : (
          <FollowUpTimeline
            events={filtered}
            selectedId={selectedId}
            onSelect={(id) =>
              setSelectedId(selectedId === id ? undefined : id)
            }
          />
        )}

        {/* Empty prompt when nothing selected */}
        {!selectedId && filtered.length > 0 && (
          <p className="text-center text-[11px] text-muted-foreground mt-5">
            Click a follow-up to mark actions, reassign, or snooze the reminder.
          </p>
        )}
      </div>
    </SettleShell>
  );
}
