import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthShell, PrimaryButton } from "@/components/auth/AuthShell";
import {
  MessageSquare,
  Clock,
  Bell,
  Check,
  LayoutDashboard,
} from "lucide-react";

export const Route = createFileRoute("/onboarding/complete")({
  head: () => ({ meta: [{ title: "Setup Complete · Settle" }] }),
  component: CompletePage,
});

function CompletePage() {
  const navigate = useNavigate();
  const [propertyName, setPropertyName] = useState("Your Property");
  const [phone, setPhone] = useState("");
  const [digestEnabled, setDigestEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  useEffect(() => {
    setPropertyName(localStorage.getItem("settle_propertyName") || "Your Property");
    setPhone(localStorage.getItem("settle_whatsapp") || "");
    setDigestEnabled(localStorage.getItem("settle_digest") !== "false");
    setAlertsEnabled(localStorage.getItem("settle_alerts") !== "false");
  }, []);

  const items = [
    {
      icon: Clock,
      color: "text-primary",
      bg: "bg-primary/10",
      title: "8 AM Daily Digest",
      desc: digestEnabled
        ? `Delivered to +91 ${phone} every morning — occupancy, F&B covers, revenue summary`
        : "Disabled — enable anytime from settings",
      enabled: digestEnabled,
    },
    {
      icon: Bell,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      title: "Real-time Exception Alerts",
      desc: alertsEnabled
        ? "Escalations, no-shows, complaints, and low inventory — sent instantly"
        : "Disabled — enable anytime from settings",
      enabled: alertsEnabled,
    },
    {
      icon: MessageSquare,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      title: "WhatsApp-first Intelligence",
      desc: "Everything routes to WhatsApp — no need to log into a dashboard daily",
      enabled: true,
    },
    {
      icon: LayoutDashboard,
      color: "text-sky-600",
      bg: "bg-sky-500/10",
      title: "Web Dashboard (Optional)",
      desc: "Available at /dashboard for deep-dives, team management, and connectors",
      enabled: true,
    },
  ];

  return (
    <AuthShell
      title="You're all set! 🎉"
      subtitle={`${propertyName} is now connected to Settle's intelligence layer.`}
    >
      {/* Hero check animation */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        className="flex justify-center mb-6"
      >
        <div className="relative">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-emerald-500 grid place-items-center shadow-[0_0_40px_-8px_oklch(0.55_0.20_275/0.5)]">
            <Check size={28} className="text-white" strokeWidth={3} />
          </div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
          />
        </div>
      </motion.div>

      {/* WhatsApp preview mockup */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="rounded-xl bg-[#0b141a] border border-border/30 p-3 mb-5 space-y-2"
      >
        <div className="flex justify-start">
          <div className="bg-[#202c33] text-white text-[11px] p-2.5 rounded-lg max-w-[90%]">
            <div className="text-emerald-400 text-[10px] font-semibold mb-1">
              Settle · {propertyName}
            </div>
            <p className="leading-relaxed">
              🌅 <strong>Good morning!</strong> Here's your 8 AM digest:{" "}
              <br />
              🏨 Occupancy: <strong>78%</strong> (62/79 rooms){" "}
              <br />
              🍽️ F&B covers last night: <strong>142</strong>{" "}
              <br />
              💰 Revenue MTD: <strong>₹14.2L</strong> (+11% vs last week){" "}
              <br />⚠️ 1 escalation needs your attention.
            </p>
            <div className="text-[9px] text-white/40 text-right mt-1.5">8:00 AM ✓✓</div>
          </div>
        </div>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="space-y-2 mb-6"
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.45 + i * 0.08 }}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
              item.enabled
                ? "bg-foreground/3 border-border/50"
                : "bg-foreground/1 border-border/30 opacity-60"
            }`}
          >
            <div className={`h-7 w-7 rounded-lg grid place-items-center shrink-0 ${item.bg}`}>
              <item.icon size={13} className={item.color} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{item.title}</span>
                {item.enabled && (
                  <span className="h-4 w-4 rounded-full bg-emerald-500/15 grid place-items-center">
                    <Check size={8} className="text-emerald-600" />
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <PrimaryButton onClick={() => navigate({ to: "/dashboard" })}>
          View Property Dashboard
        </PrimaryButton>
        <p className="text-center text-[10px] text-muted-foreground mt-3 leading-relaxed">
          You won't need this daily — Settle brings everything to WhatsApp.
        </p>
      </motion.div>
    </AuthShell>
  );
}
