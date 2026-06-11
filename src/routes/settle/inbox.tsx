import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SettleShell } from "@/components/settle-core/SettleShell";
import { LeadBadge } from "@/components/settle-core/LeadBadge";
import type { LeadPriority } from "@/components/settle-core/LeadBadge";
import {
  MessageSquare,
  Mail,
  Globe,
  Phone,
  Clock,
  Send,
  ShieldAlert,
  Inbox,
  Filter,
  RefreshCw,
  ChevronRight,
  Sparkles,
  User,
} from "lucide-react";

export const Route = createFileRoute("/settle/inbox")({
  head: () => ({ meta: [{ title: "Lead Inbox · Settle" }] }),
  component: InboxPage,
});

/* ─── Types ─────────────────────────────────────────────── */
type LeadSource = "whatsapp" | "email" | "web";

interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  source: LeadSource;
  priority: LeadPriority;
  preview: string;
  timestamp: string;
  roomNights?: number;
  checkIn?: string;
  pax?: number;
  aiDraft: string;
}

/* ─── Mock data ──────────────────────────────────────────── */
const LEADS: Lead[] = [
  {
    id: "l1",
    name: "Arjun Kapoor",
    phone: "+91 98100 55321",
    source: "whatsapp",
    priority: "Hot",
    preview: "Need deluxe room for 3 nights from 15 June, anniversary trip",
    timestamp: "9:14 AM",
    roomNights: 3,
    checkIn: "15 Jun",
    pax: 2,
    aiDraft: `Hi Arjun! 🎉 Congratulations on your anniversary!\n\nWe'd love to host you at The Grand Maratha. We have our Deluxe King room available from 15–18 June at ₹8,500/night (incl. breakfast for 2).\n\nShall I confirm this booking? A 30% advance will hold the reservation.\n\nWarm regards,\nFront Desk · The Grand Maratha`,
  },
  {
    id: "l2",
    name: "Sneha Reddy",
    email: "sneha.r@techcorp.in",
    source: "email",
    priority: "Warm",
    preview: "Corporate rate enquiry for 12-person team offsite in July",
    timestamp: "8:47 AM",
    roomNights: 12,
    checkIn: "10 Jul",
    pax: 12,
    aiDraft: `Dear Sneha,\n\nThank you for reaching out about your team offsite! We'd be happy to accommodate your group of 12.\n\nWe can offer a special corporate rate of ₹6,200/room/night (incl. breakfast & conference room access). For 6 rooms × 2 nights, total package would be ₹74,400.\n\nI've also attached our group booking brochure. Would a quick call tomorrow work to finalise details?\n\nBest,\nReservations · The Grand Maratha`,
  },
  {
    id: "l3",
    name: "Rahul Verma",
    source: "web",
    phone: "+91 96220 78901",
    priority: "Warm",
    preview: "Weekend package for family of 4, pool-facing preference",
    timestamp: "Yesterday",
    roomNights: 2,
    checkIn: "21 Jun",
    pax: 4,
    aiDraft: `Hi Rahul! 👋\n\nGreat to hear from you! We have a lovely Pool-View Suite available for 21–23 June, perfect for a family of 4 — with a connecting room option.\n\nWeekend Family Package: ₹11,500 incl. breakfast for 4 + complimentary kids' meal.\n\nWould you like me to check availability for the connecting room as well?\n\nCheers,\nFront Desk · The Grand Maratha`,
  },
  {
    id: "l4",
    name: "Priya Malhotra",
    email: "priya.m@gmail.com",
    source: "email",
    priority: "Cold",
    preview: "Checking prices for October — no fixed dates yet",
    timestamp: "Yesterday",
    aiDraft: `Hi Priya,\n\nThanks for your interest in The Grand Maratha! October is a lovely time to visit.\n\nOur standard rates start from ₹7,200/night. Festive season (Oct 10–31) rates are slightly higher at ₹9,500/night due to high demand.\n\nWhen you have fixed dates, feel free to reach out — we'll check availability and share the best rate.\n\nLooking forward to welcoming you!\n\nThe Grand Maratha Team`,
  },
  {
    id: "l5",
    name: "Mohammed Irfan",
    phone: "+91 90010 12345",
    source: "whatsapp",
    priority: "Hot",
    preview: "URGENT: Need banquet hall for 150-pax wedding reception this Sat",
    timestamp: "9:02 AM",
    pax: 150,
    checkIn: "14 Jun",
    aiDraft: `Dear Mohammed,\n\nThank you for reaching out! We understand the urgency.\n\nOur Grand Ballroom can accommodate up to 200 guests and is available this Saturday (14 Jun) for an evening reception (6 PM onwards).\n\nBanquet Package: ₹1,850/pax (incl. 5-course dinner, décor, AV setup & welcome drinks)\nTotal for 150 pax: ₹2,77,500\n\nA 50% advance confirms the booking. Shall I connect you with our Banquet Manager for a site visit today?\n\nBest,\nBanquet Team · The Grand Maratha`,
  },
];

/* ─── Source badge ───────────────────────────────────────── */
const SOURCE_CONFIG: Record<
  LeadSource,
  { label: string; icon: typeof MessageSquare; classes: string }
> = {
  whatsapp: {
    label: "WhatsApp",
    icon: MessageSquare,
    classes: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  email: {
    label: "Email",
    icon: Mail,
    classes: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  },
  web: {
    label: "Web Form",
    icon: Globe,
    classes: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  },
};

function SourceBadge({ source }: { source: LeadSource }) {
  const cfg = SOURCE_CONFIG[source];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium border ${cfg.classes}`}
    >
      <Icon size={9} />
      {cfg.label}
    </span>
  );
}

/* ─── Lead row ───────────────────────────────────────────── */
function LeadRow({
  lead,
  selected,
  onClick,
}: {
  lead: Lead;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-border/50 transition-all hover:bg-foreground/3 ${
        selected ? "bg-primary/5 border-l-2 border-l-primary" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-foreground">
            {lead.name}
          </span>
          <LeadBadge priority={lead.priority} size="sm" />
          <SourceBadge source={lead.source} />
        </div>
        <span className="text-[10px] text-muted-foreground shrink-0">
          {lead.timestamp}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
        {lead.preview}
      </p>
      <div className="flex gap-3 mt-1.5 text-[10px] text-muted-foreground">
        {lead.checkIn && (
          <span className="flex items-center gap-1">
            <Clock size={9} /> Check-in: {lead.checkIn}
          </span>
        )}
        {lead.pax && (
          <span className="flex items-center gap-1">
            <User size={9} /> {lead.pax} pax
          </span>
        )}
        {lead.phone && (
          <span className="flex items-center gap-1">
            <Phone size={9} /> {lead.phone}
          </span>
        )}
      </div>
    </button>
  );
}

/* ─── Composer panel ─────────────────────────────────────── */
function ComposerPanel({ lead }: { lead: Lead }) {
  const [draft, setDraft] = useState(lead.aiDraft);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1800);
  };

  return (
    <motion.div
      key={lead.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold">{lead.name}</span>
          <LeadBadge priority={lead.priority} />
          <SourceBadge source={lead.source} />
        </div>
        <p className="text-[11px] text-muted-foreground">{lead.preview}</p>
      </div>

      {/* AI badge */}
      <div className="mx-5 mt-4 mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/15">
        <Sparkles size={13} className="text-primary shrink-0" />
        <p className="text-[11px] text-primary font-medium">
          AI-generated contextual reply draft — review before sending
        </p>
      </div>

      {/* Draft textarea */}
      <div className="flex-1 px-5 min-h-0">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full h-full min-h-[180px] rounded-xl border border-border/60 bg-input px-3.5 py-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition resize-none leading-relaxed"
        />
      </div>

      {/* Disclaimer */}
      <div className="mx-5 mt-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/15">
        <ShieldAlert size={12} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-[10px] text-amber-700 leading-relaxed">
          Settle never sends messages autonomously. This draft requires your
          explicit review and approval before any WhatsApp message is dispatched.
        </p>
      </div>

      {/* CTA */}
      <div className="px-5 py-4">
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 py-2.5 text-sm font-medium text-emerald-600"
          >
            ✓ Queued for WhatsApp dispatch
          </motion.div>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !draft.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-[0_6px_20px_-6px_rgba(16,185,129,0.5)] hover:scale-[1.01] disabled:opacity-60 disabled:scale-100 transition-transform"
          >
            {sending ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            {sending ? "Queuing…" : "Review & Send via WhatsApp"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Filter types ───────────────────────────────────────── */
type FilterTab = "All" | "Hot" | "Warm" | "Cold";

/* ─── Main page ──────────────────────────────────────────── */
function InboxPage() {
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<FilterTab>("All");

  const filtered =
    filter === "All" ? LEADS : LEADS.filter((l) => l.priority === filter);

  const hotCount = LEADS.filter((l) => l.priority === "Hot").length;
  const warmCount = LEADS.filter((l) => l.priority === "Warm").length;
  const coldCount = LEADS.filter((l) => l.priority === "Cold").length;

  return (
    <SettleShell>
      <div className="flex h-[calc(100vh-53px)] overflow-hidden">
        {/* ── Left pane: Lead list ── */}
        <div
          className={`flex flex-col border-r border-border/60 bg-background transition-all ${
            selected ? "w-full md:w-[380px] hidden md:flex" : "w-full md:w-[380px] flex"
          }`}
        >
          {/* Pane header */}
          <div className="px-4 py-3.5 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox size={14} className="text-primary" />
              <span className="text-sm font-semibold">Lead Inbox</span>
              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                {LEADS.length}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter size={13} />
            </div>
          </div>

          {/* Priority counters */}
          <div className="px-4 py-2.5 border-b border-border/50 grid grid-cols-3 gap-2">
            {(
              [
                { label: "Hot", count: hotCount, color: "text-red-600 bg-red-500/8 border-red-500/20" },
                { label: "Warm", count: warmCount, color: "text-orange-600 bg-orange-500/8 border-orange-500/20" },
                { label: "Cold", count: coldCount, color: "text-slate-500 bg-slate-500/8 border-slate-500/15" },
              ] as const
            ).map(({ label, count, color }) => (
              <div
                key={label}
                className={`text-center py-1.5 rounded-lg border text-[10px] font-semibold ${color}`}
              >
                {count} {label}
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="px-4 pt-3 pb-1 flex gap-1">
            {(["All", "Hot", "Warm", "Cold"] as FilterTab[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Lead list */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {filtered.map((lead) => (
                <motion.div
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <LeadRow
                    lead={lead}
                    selected={selected?.id === lead.id}
                    onClick={() =>
                      setSelected(selected?.id === lead.id ? null : lead)
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Right pane: Composer ── */}
        <div
          className={`flex-1 flex flex-col bg-background transition-all ${
            selected ? "flex" : "hidden md:flex"
          }`}
        >
          {selected ? (
            <>
              {/* Mobile back button */}
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="md:hidden flex items-center gap-1.5 px-4 py-3 text-xs text-muted-foreground hover:text-foreground border-b border-border/50"
              >
                ← Back to inbox
              </button>
              <div className="flex-1 overflow-y-auto">
                <ComposerPanel lead={selected} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-3">
              <div className="h-14 w-14 rounded-2xl bg-primary/8 border border-primary/15 grid place-items-center">
                <ChevronRight size={22} className="text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Select a lead to compose a reply
              </p>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                Settle's AI classifier surfaces the highest-priority enquiries
                first. Click any lead to review the AI-drafted reply.
              </p>
            </div>
          )}
        </div>
      </div>
    </SettleShell>
  );
}
