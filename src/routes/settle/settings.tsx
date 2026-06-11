import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SettleShell } from "@/components/settle-core/SettleShell";
import {
  Bell,
  Clock,
  MessageSquare,
  Users,
  UserPlus,
  X,
  Check,
  Shield,
} from "lucide-react";

export const Route = createFileRoute("/settle/settings")({
  head: () => ({ meta: [{ title: "Settings · Settle" }] }),
  component: SettingsPage,
});

/* ─── Types ──────────────────────────────────────────────── */
type MemberStatus = "Pending Setup Payload" | "Initialized" | "Active";
interface Member {
  id: string;
  name: string;
  phone: string;
  role: string;
  status: MemberStatus;
}

const STATUS_STYLES: Record<MemberStatus, string> = {
  "Pending Setup Payload": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Initialized: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const ROLE_OPTIONS = ["Front Desk", "Reservations", "F&B Staff", "Manager"];

function StatusBadge({ status }: { status: MemberStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border ${STATUS_STYLES[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Active"
            ? "bg-emerald-500"
            : status === "Initialized"
            ? "bg-sky-500"
            : "bg-amber-500"
        }`}
      />
      {status}
    </span>
  );
}

/* ─── Toggle ─────────────────────────────────────────────── */
function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative h-5 w-9 rounded-full shrink-0 transition-colors duration-200 ${
        value ? "bg-primary" : "bg-foreground/15"
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
          value ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/* ─── Section wrapper ────────────────────────────────────── */
function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Bell;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={15} className="text-primary" />
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card glass divide-y divide-border/50 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function SettingRow({
  label,
  desc,
  children,
}: {
  label: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div>
        <div className="text-xs font-medium">{label}</div>
        {desc && (
          <div className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
            {desc}
          </div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
function SettingsPage() {
  const [digestEnabled, setDigestEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [leadAlertsEnabled, setLeadAlertsEnabled] = useState(true);

  const [members, setMembers] = useState<Member[]>([
    {
      id: "m1",
      name: "Riya Sharma",
      phone: "+91 98100 11111",
      role: "Front Desk",
      status: "Active",
    },
    {
      id: "m2",
      name: "Kabir Mehta",
      phone: "+91 98200 22222",
      role: "Reservations",
      status: "Initialized",
    },
  ]);

  const [form, setForm] = useState({ name: "", phone: "", role: "Front Desk" });
  const [formError, setFormError] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setFormError("Name and phone are required.");
      return;
    }
    setFormError("");
    setMembers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...form,
        status: "Pending Setup Payload",
      },
    ]);
    setForm({ name: "", phone: "", role: "Front Desk" });
  };

  const whatsappNumber =
    typeof window !== "undefined"
      ? (localStorage.getItem("settle_whatsapp") ?? "—")
      : "—";
  const propertyName =
    typeof window !== "undefined"
      ? (localStorage.getItem("settle_propertyName") ?? "My Property")
      : "My Property";

  return (
    <SettleShell>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-display text-xl font-semibold tracking-tight mb-1">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage notifications, team members, and workspace preferences.
          </p>
        </div>

        {/* WhatsApp Notifications */}
        <Section title="WhatsApp Notifications" icon={Bell}>
          <SettingRow
            label="8 AM Daily Digest"
            desc={`Sent to +91 ${whatsappNumber} — occupancy, F&B covers, revenue MTD`}
          >
            <Toggle value={digestEnabled} onChange={setDigestEnabled} />
          </SettingRow>
          <SettingRow
            label="Real-time Exception Alerts"
            desc="Escalations, no-shows, complaints, and low inventory — pushed instantly"
          >
            <Toggle value={alertsEnabled} onChange={setAlertsEnabled} />
          </SettingRow>
          <SettingRow
            label="Hot Lead Alerts"
            desc="Instant WhatsApp ping when the AI classifier marks a lead as Hot"
          >
            <Toggle
              value={leadAlertsEnabled}
              onChange={setLeadAlertsEnabled}
            />
          </SettingRow>
        </Section>

        {/* Digest schedule */}
        <Section title="Digest Schedule" icon={Clock}>
          <SettingRow
            label="Daily Digest Time"
            desc="The time your 8 AM digest will be delivered each morning"
          >
            <select className="rounded-lg bg-input border border-border/60 px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition">
              <option>8:00 AM</option>
              <option>7:00 AM</option>
              <option>9:00 AM</option>
            </select>
          </SettingRow>
          <SettingRow
            label="WhatsApp Number"
            desc="Owner's number paired during onboarding"
          >
            <span className="text-xs font-medium text-foreground">
              +91 {whatsappNumber}
            </span>
          </SettingRow>
        </Section>

        {/* Property info */}
        <Section title="Workspace" icon={Shield}>
          <SettingRow
            label="Property Name"
            desc="Displayed in all WhatsApp digests and the dashboard header"
          >
            <span className="text-xs font-medium text-foreground">
              {propertyName}
            </span>
          </SettingRow>
          <SettingRow
            label="AI Messaging Policy"
            desc="Settle will never dispatch messages without explicit human approval"
          >
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Check size={9} /> Enforced
            </span>
          </SettingRow>
        </Section>

        {/* Team Members */}
        <Section title="Team Members" icon={Users}>
          {/* Add member form */}
          <div className="p-4">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Add Member
            </p>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    placeholder="e.g. Priya Nair"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full rounded-lg bg-input border border-border/60 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="w-full rounded-lg bg-input border border-border/60 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Role Designation
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                  className="w-full rounded-lg bg-input border border-border/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              {formError && (
                <p className="text-xs text-red-500">{formError}</p>
              )}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/8 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/15 transition"
              >
                <UserPlus size={14} /> Add Member
              </button>
            </form>
          </div>

          {/* Member list */}
          {members.length > 0 && (
            <div className="border-t border-border/50">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-foreground/2">
                <MessageSquare size={12} className="text-muted-foreground" />
                <span className="text-[11px] font-medium text-muted-foreground">
                  Invited Members ({members.length})
                </span>
              </div>
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-2 px-4 py-3 border-t border-border/50 first:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium">{m.name}</span>
                      <span className="text-[10px] text-muted-foreground bg-foreground/5 px-1.5 py-0.5 rounded">
                        {m.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {m.phone}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={m.status} />
                    <button
                      type="button"
                      onClick={() =>
                        setMembers((prev) => prev.filter((x) => x.id !== m.id))
                      }
                      className="h-5 w-5 rounded grid place-items-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition"
                    >
                      <X size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </SettleShell>
  );
}
