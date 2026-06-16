import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { SettleShell } from "@/components/settle-core/SettleShell";
import {
  MessageSquare,
  Instagram,
  Mail,
  ArrowLeft,
  ExternalLink,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { useConnectors } from "@/hooks/useConnectors";

export const Route = createFileRoute("/settle/connectors")({
  head: () => ({ meta: [{ title: "Connectors · Settle" }] }),
  component: ConnectorsPage,
});

/* ─── Types ──────────────────────────────────────────────── */
type ConnectorId = "whatsapp" | "instagram" | "gmail";

type ConnectorStatus =
  | "Not Connected"
  | "Connected"
  | "Action Required";

interface Connector {
  id: ConnectorId;
  name: string;
  description: string;
  icon: any;
  iconColor: string;
  iconBg: string;
}

/* ─── Connector definitions ───────────────────────────────── */
const CONNECTORS_LIST: Connector[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Connect your WhatsApp Business Account via Meta Business Suite.",
    icon: MessageSquare,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    id: "instagram",
    name: "Instagram Business",
    description: "Connect your Instagram Business Account via Meta Business Suite.",
    icon: Instagram,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Connect your Gmail account using Google OAuth.",
    icon: Mail,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
  },
];

/* ─── Setup guide content per connector ───────────────────── */
interface SetupStep {
  number: number;
  title: string;
}

const SETUP_GUIDES: Record<
  ConnectorId,
  { heading: string; steps: SetupStep[]; buttonLabel: string; buttonUrl: string }
> = {
  whatsapp: {
    heading: "WhatsApp Setup",
    steps: [
      { number: 1, title: "Create/Login to Meta Business Account" },
      { number: 2, title: "Complete Business Verification in Meta" },
      { number: 3, title: "Create WhatsApp Business Account" },
      { number: 4, title: "Register and Verify Phone Number" },
      { number: 5, title: "Configure WhatsApp Business Settings" },
      { number: 6, title: "Return to Settle and connect your account" },
    ],
    buttonLabel: "Open Meta Business Suite",
    buttonUrl: "https://business.facebook.com",
  },
  instagram: {
    heading: "Instagram Business Setup",
    steps: [
      { number: 1, title: "Login to Meta Business Suite" },
      { number: 2, title: "Create or Select Business Account" },
      { number: 3, title: "Connect Instagram Business Account" },
      { number: 4, title: "Link Facebook Page" },
      { number: 5, title: "Complete Meta Permissions" },
      { number: 6, title: "Return to Settle and connect account" },
    ],
    buttonLabel: "Open Meta Business Suite",
    buttonUrl: "https://business.facebook.com",
  },
  gmail: {
    heading: "Gmail Setup",
    steps: [
      { number: 1, title: "Login with Google" },
      { number: 2, title: "Grant Required Permissions" },
      { number: 3, title: "Allow Mail Access" },
      { number: 4, title: "Return to Settle" },
    ],
    buttonLabel: "Connect with Google",
    buttonUrl: "https://accounts.google.com/o/oauth2/auth",
  },
};

/* ─── Status configuration for badges ────────────────────── */
const STATUS_CONFIG: Record<
  ConnectorStatus,
  { label: string; classes: string; dot: string }
> = {
  Connected: {
    label: "Connected",
    classes: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  "Action Required": {
    label: "Action Required",
    classes: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    dot: "bg-amber-500",
  },
  "Not Connected": {
    label: "Not Connected",
    classes: "bg-foreground/5 text-muted-foreground border-border/40",
    dot: "bg-muted-foreground/40",
  },
};

function StatusBadge({ status }: { status: ConnectorStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["Not Connected"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function normaliseStatus(raw: string | undefined): ConnectorStatus {
  if (!raw) return "Not Connected";
  const str = raw.toLowerCase();
  if (str === "connected") return "Connected";
  if (str === "action required" || str === "error" || str === "verification required") return "Action Required";
  return "Not Connected";
}

/* ─── Setup Guide panel ───────────────────────────────────── */

function SetupGuide({
  connector,
  onBack,
  onRedirect,
}: {
  connector: Connector;
  onBack: () => void;
  onRedirect: () => void;
}) {
  const guide = SETUP_GUIDES[connector.id];

  return (
    <motion.div
      key="setup-guide"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition font-medium"
      >
        <ArrowLeft size={14} />
        Back to Connectors
      </button>

      <div className="p-6 rounded-2xl border border-border/60 bg-card glass">
        <h2 className="font-display text-xl font-semibold tracking-tight mb-6">
          {guide.heading}
        </h2>

        <div className="space-y-5">
          {guide.steps.map((step) => (
            <div key={step.number}>
              <p className="text-sm font-semibold text-muted-foreground mb-1">
                Step {step.number}
              </p>
              <p className="text-sm font-medium text-foreground">
                {step.title}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border/60">
          <button
            onClick={onRedirect}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition shadow-soft"
          >
            {guide.buttonLabel}
            <ExternalLink size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Connector Card ──────────────────────────────────────── */

function ConnectorCard({
  connector,
  status,
  onAction,
}: {
  connector: Connector;
  status: ConnectorStatus;
  onAction: () => void;
}) {
  let buttonText = "Setup";
  if (status === "Connected") buttonText = "Connected";
  else if (status === "Action Required") buttonText = "Reconnect";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="group p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-soft transition-all glass flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-4">
        <div className={`h-11 w-11 rounded-xl grid place-items-center shrink-0 ${connector.iconBg}`}>
          <connector.icon size={22} className={connector.iconColor} />
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="font-semibold text-sm text-foreground">
              {connector.name}
            </h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {connector.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <button
          onClick={onAction}
          className={`text-xs px-4 py-2 rounded-lg font-semibold transition ${
            status === "Connected"
              ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {buttonText}
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Main page ───────────────────────────────────────────── */

type View =
  | { type: "list" }
  | { type: "setup"; connectorId: ConnectorId };

function ConnectorsPage() {
  const { connectors: backendConnectors } = useConnectors();

  const [statuses, setStatuses] = useState<Record<ConnectorId, ConnectorStatus>>({
    whatsapp: "Not Connected",
    instagram: "Not Connected",
    gmail: "Not Connected",
  });

  const [view, setView] = useState<View>({ type: "list" });

  useEffect(() => {
    if (!backendConnectors || backendConnectors.length === 0) return;
    const nextStatuses = { ...statuses };
    backendConnectors.forEach((c: any) => {
      const id = (c.id ?? c.connector_type) as ConnectorId;
      if (["whatsapp", "instagram", "gmail"].includes(id)) {
        nextStatuses[id] = normaliseStatus(c.status);
      }
    });
    setStatuses(nextStatuses);
  }, [backendConnectors]);

  const handleRedirect = (id: ConnectorId) => {
    const guide = SETUP_GUIDES[id];
    window.open(guide.buttonUrl, "_blank", "noopener,noreferrer");
    toast.info(`Opened ${guide.buttonLabel} in a new tab.`);
  };

  const selectedConnector =
    view.type !== "list"
      ? CONNECTORS_LIST.find((c) => c.id === view.connectorId)!
      : null;

  return (
    <SettleShell>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Header matching manager feedback */}
        <div className="flex items-center justify-between border-b border-border/60 pb-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Connectors
          </h1>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-foreground/5 text-foreground hover:bg-foreground/10 font-medium transition">
              <Plus size={14} /> Add Members
            </button>
            <Link
              to="/settle/connectors"
              className="inline-flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition"
            >
              Connectors
            </Link>
          </div>
        </div>

        {/* View routing */}
        <AnimatePresence mode="wait">
          {view.type === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {CONNECTORS_LIST.map((conn) => (
                <ConnectorCard
                  key={conn.id}
                  connector={conn}
                  status={statuses[conn.id]}
                  onAction={() => setView({ type: "setup", connectorId: conn.id })}
                />
              ))}
            </motion.div>
          )}

          {view.type === "setup" && selectedConnector && (
            <SetupGuide
              key={`setup-${selectedConnector.id}`}
              connector={selectedConnector}
              onBack={() => setView({ type: "list" })}
              onRedirect={() => handleRedirect(selectedConnector.id)}
            />
          )}
        </AnimatePresence>
      </div>
    </SettleShell>
  );
}
