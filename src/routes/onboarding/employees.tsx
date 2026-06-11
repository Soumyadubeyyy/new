import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";
import { UserPlus, Check, X, Users } from "lucide-react";

export const Route = createFileRoute("/onboarding/employees")({
  head: () => ({ meta: [{ title: "Team Setup · Settle" }] }),
  component: EmployeesPage,
});

const STEPS = [
  "Property Details",
  "WhatsApp Pairing",
  "Team Members",
  "All Done",
];

function StepProgress({ current }: { current: number }) {
  return (
    <div className="mb-7">
      <div className="flex items-center gap-1 mb-3">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-1 flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`h-6 w-6 rounded-full grid place-items-center text-[10px] font-semibold transition-all duration-300 ${
                  i < current
                    ? "bg-primary text-primary-foreground"
                    : i === current
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-foreground/8 text-muted-foreground"
                }`}
              >
                {i < current ? <Check size={10} /> : i + 1}
              </div>
              <span
                className={`text-[9px] whitespace-nowrap hidden sm:block ${
                  i === current ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mx-1 mb-3 transition-colors duration-300 ${
                  i < current ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground text-center">
        Step {current + 1} of {STEPS.length}
      </p>
    </div>
  );
}

type MemberStatus = "Pending Setup Payload" | "Initialized" | "Active";
interface Member {
  id: string;
  name: string;
  phone: string;
  role: string;
  status: MemberStatus;
}

const ROLE_OPTIONS = ["Front Desk", "Reservations", "F&B Staff", "Manager"];

const STATUS_STYLES: Record<MemberStatus, string> = {
  "Pending Setup Payload": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Initialized: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

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

function EmployeesPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([
    {
      id: "demo-1",
      name: "Riya Sharma",
      phone: "+91 98100 11111",
      role: "Front Desk",
      status: "Active",
    },
    {
      id: "demo-2",
      name: "Kabir Mehta",
      phone: "+91 98200 22222",
      role: "Reservations",
      status: "Initialized",
    },
  ]);

  const [form, setForm] = useState({ name: "", phone: "", role: "Front Desk" });
  const [error, setError] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    setError("");
    const newMember: Member = {
      id: crypto.randomUUID(),
      name: form.name,
      phone: form.phone,
      role: form.role,
      status: "Pending Setup Payload",
    };
    setMembers((prev) => [...prev, newMember]);
    setForm({ name: "", phone: "", role: "Front Desk" });
  };

  const handleRemove = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <AuthShell
      title="Add team members"
      subtitle="Invite front desk, reservations, and F&B staff. They'll receive setup instructions via WhatsApp."
    >
      <StepProgress current={2} />

      {/* Add member form */}
      <form onSubmit={handleAdd} className="space-y-3 mb-5">
        <div className="grid grid-cols-2 gap-2.5">
          <Field
            label="Full Name"
            placeholder="e.g. Priya Nair"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Field
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>

        <div>
          <span className="text-xs text-muted-foreground mb-1.5 block">Role Designation</span>
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="w-full rounded-lg bg-input border border-border/60 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/8 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/15 transition"
        >
          <UserPlus size={14} /> Add Member
        </button>
      </form>

      {/* Members table */}
      {members.length > 0 && (
        <div className="mb-5 rounded-xl border border-border/60 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 bg-foreground/3 border-b border-border/60">
            <Users size={13} className="text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground">
              Invited Members ({members.length})
            </span>
          </div>
          <div className="divide-y divide-border/50">
            <AnimatePresence initial={false}>
              {members.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-2 px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium truncate">{m.name}</span>
                      <span className="text-[10px] text-muted-foreground bg-foreground/5 px-1.5 py-0.5 rounded">
                        {m.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{m.phone}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={m.status} />
                    <button
                      type="button"
                      onClick={() => handleRemove(m.id)}
                      className="h-5 w-5 rounded grid place-items-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition"
                    >
                      <X size={11} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <PrimaryButton onClick={() => navigate({ to: "/onboarding/complete" })}>
        {members.length === 0 ? "Skip for now →" : "Finish Setup →"}
      </PrimaryButton>
    </AuthShell>
  );
}
