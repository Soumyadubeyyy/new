import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SettleShell } from "@/components/settle-core/SettleShell";
import {
  Upload,
  Star,
  MessageSquare,
  Database,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  XCircle,
  ChevronRight,
  ArrowLeft,
  Loader,
  Wifi,
  Link,
  FileText,
  PlugZap,
} from "lucide-react";

export const Route = createFileRoute("/settle/connectors")({
  head: () => ({ meta: [{ title: "Connectors · Settle" }] }),
  component: ConnectorsPage,
});

/* ─── Types ──────────────────────────────────────────────── */
type ConnectorHealth = "active" | "expired" | "failed" | "not_connected";
type ConnectorCategory = "easy" | "standard" | "advanced";
type ActivationPhase = "idle" | "connect" | "pull" | "normalise" | "status";

interface Connector {
  id: string;
  name: string;
  description: string;
  category: ConnectorCategory;
  icon: typeof Upload;
  iconColor: string;
  iconBg: string;
  health: ConnectorHealth;
  lastSync?: string;
  authType: "file" | "oauth" | "api_key";
}

/* ─── Connectors catalog ─────────────────────────────────── */
const CONNECTORS: Connector[] = [
  {
    id: "csv",
    name: "CSV / Excel Upload",
    description: "Import reservation & revenue data via drag-and-drop file upload",
    category: "easy",
    icon: Upload,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-500/10",
    health: "active",
    lastSync: "Today, 8:00 AM",
    authType: "file",
  },
  {
    id: "gmb",
    name: "Google My Business",
    description: "Pull reviews, ratings, and Q&A from your GMB listing automatically",
    category: "easy",
    icon: Star,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-500/10",
    health: "active",
    lastSync: "Today, 6:30 AM",
    authType: "oauth",
  },
  {
    id: "whatsapp_bsp",
    name: "WhatsApp Business API",
    description: "Connect via BSP (e.g. Interakt, Gupshup) for inbound lead capture & AI replies",
    category: "standard",
    icon: MessageSquare,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-500/10",
    health: "active",
    lastSync: "Live",
    authType: "api_key",
  },
  {
    id: "hotelogix",
    name: "Hotelogix PMS",
    description: "Sync reservations, room inventory & guest profiles from Hotelogix",
    category: "advanced",
    icon: Database,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-500/10",
    health: "expired",
    lastSync: "3 days ago",
    authType: "api_key",
  },
  {
    id: "ids_next",
    name: "IDS Next PMS",
    description: "Bidirectional sync with IDS Next for revenue, F&B covers & occupancy data",
    category: "advanced",
    icon: Database,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-500/10",
    health: "not_connected",
    authType: "api_key",
  },
  {
    id: "pos",
    name: "Generic POS (REST)",
    description: "Connect your restaurant POS via REST API for F&B cover tracking",
    category: "advanced",
    icon: Link,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-500/10",
    health: "failed",
    lastSync: "Failed 12 hrs ago",
    authType: "api_key",
  },
];

/* ─── Health badge ───────────────────────────────────────── */
const HEALTH_CONFIG: Record<
  ConnectorHealth,
  { label: string; classes: string; icon: typeof CheckCircle; dot: string }
> = {
  active: {
    label: "Connected · Active Syncing",
    classes: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    icon: CheckCircle,
    dot: "bg-emerald-500",
  },
  expired: {
    label: "Token Expired · Re-authenticate",
    classes: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    icon: AlertCircle,
    dot: "bg-amber-500",
  },
  failed: {
    label: "Failed · Check Error Log",
    classes: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: XCircle,
    dot: "bg-red-500",
  },
  not_connected: {
    label: "Not Connected",
    classes: "bg-foreground/5 text-muted-foreground border-border/40",
    icon: Wifi,
    dot: "bg-muted-foreground/40",
  },
};

function HealthBadge({ health }: { health: ConnectorHealth }) {
  const cfg = HEALTH_CONFIG[health];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold border ${cfg.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      <Icon size={9} />
      {cfg.label}
    </span>
  );
}

const CATEGORY_LABELS: Record<ConnectorCategory, string> = {
  easy: "Quick Setup",
  standard: "Standard",
  advanced: "PMS Integrations",
};

/* ─── Activation panel ───────────────────────────────────── */
const PHASES = ["connect", "pull", "normalise", "status"] as const;

const PHASE_META = {
  connect: {
    label: "Configuration",
    desc: "Provide credentials or authorise access",
    icon: PlugZap,
  },
  pull: {
    label: "Ingestion",
    desc: "Extracting data from source",
    icon: RefreshCw,
  },
  normalise: {
    label: "Normalisation",
    desc: "Mapping to Settle entity schema",
    icon: Database,
  },
  status: {
    label: "Health Check",
    desc: "Verifying connection health",
    icon: CheckCircle,
  },
};

const SETTLE_ENTITIES = [
  "Property",
  "Guest",
  "Lead",
  "Reservation",
  "Review",
  "Vendor",
  "Task",
  "Transaction",
];

function ActivationPanel({
  connector,
  onClose,
}: {
  connector: Connector;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<ActivationPhase>("connect");
  const [apiKey, setApiKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [running, setRunning] = useState(false);
  const [entityProgress, setEntityProgress] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const handleConnect = () => {
    setRunning(true);
    setPhase("pull");

    // Simulate pull phase
    setTimeout(() => {
      setPhase("normalise");
      let i = 0;
      const interval = setInterval(() => {
        if (i < SETTLE_ENTITIES.length) {
          setEntityProgress((prev) => [...prev, SETTLE_ENTITIES[i]]);
          i++;
        } else {
          clearInterval(interval);
          setPhase("status");
          setTimeout(() => {
            setRunning(false);
            setDone(true);
          }, 800);
        }
      }, 250);
    }, 1800);
  };

  const phaseIndex = PHASES.indexOf(
    phase === "idle" ? "connect" : (phase as (typeof PHASES)[number])
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-xl mx-auto"
    >
      {/* Back */}
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-5 transition"
      >
        <ArrowLeft size={13} /> All connectors
      </button>

      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`h-10 w-10 rounded-xl grid place-items-center ${connector.iconBg}`}
        >
          <connector.icon size={18} className={connector.iconColor} />
        </div>
        <div>
          <h2 className="font-display font-semibold text-base">
            {connector.name}
          </h2>
          <p className="text-xs text-muted-foreground">
            {connector.description}
          </p>
        </div>
      </div>

      {/* Phase stepper */}
      <div className="flex items-center gap-1 mb-6">
        {PHASES.map((p, i) => {
          const meta = PHASE_META[p];
          const Icon = meta.icon;
          const isActive = p === phase;
          const isDone = i < phaseIndex || done;
          return (
            <div key={p} className="flex items-center gap-1 flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`h-7 w-7 rounded-full grid place-items-center text-[10px] font-bold transition-all duration-300 ${
                    isDone
                      ? "bg-primary text-primary-foreground"
                      : isActive
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-foreground/8 text-muted-foreground"
                  }`}
                >
                  {isDone ? <CheckCircle size={12} /> : <Icon size={12} />}
                </div>
                <span
                  className={`text-[9px] whitespace-nowrap hidden sm:block ${
                    isActive ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {meta.label}
                </span>
              </div>
              {i < PHASES.length - 1 && (
                <div
                  className={`flex-1 h-px mx-1 mb-3.5 transition-colors duration-300 ${
                    isDone ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Phase content */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 glass">
        <AnimatePresence mode="wait">
          {/* ── Connect phase ── */}
          {(phase === "connect" || phase === "idle") && !done && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div>
                <p className="text-xs font-semibold mb-3 text-foreground">
                  {PHASE_META.connect.desc}
                </p>

                {connector.authType === "file" && (
                  <label className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-border/60 hover:border-primary/40 transition cursor-pointer bg-input/50">
                    <FileText size={24} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground text-center">
                      {file
                        ? `✓ ${file.name}`
                        : "Drag & drop your CSV/Excel file here, or click to browse"}
                    </span>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="sr-only"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                )}

                {connector.authType === "oauth" && (
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-input px-4 py-3 text-sm font-medium hover:bg-foreground/5 transition"
                  >
                    <Star size={14} className="text-amber-500" />
                    Authorise with Google
                  </button>
                )}

                {connector.authType === "api_key" && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">
                        API Key / Access Token
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your API key…"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full rounded-lg bg-input border border-border/60 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">
                        Property / Account ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. PROP_12345"
                        className="w-full rounded-lg bg-input border border-border/60 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleConnect}
                disabled={
                  running ||
                  (connector.authType === "file" && !file) ||
                  (connector.authType === "api_key" && !apiKey.trim())
                }
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-blue-500 px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_6px_20px_-6px_oklch(0.55_0.20_275/0.4)] hover:scale-[1.01] disabled:opacity-50 disabled:scale-100 transition-transform"
              >
                <PlugZap size={14} /> Connect & Ingest Data
              </button>
            </motion.div>
          )}

          {/* ── Pull + Normalise phase ── */}
          {(phase === "pull" || phase === "normalise") && !done && (
            <motion.div
              key="pulling"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <Loader size={16} className="text-primary animate-spin" />
                <p className="text-sm font-medium">
                  {phase === "pull"
                    ? "Pulling data from source…"
                    : "Normalising to Settle schema…"}
                </p>
              </div>

              {phase === "normalise" && (
                <div className="space-y-1.5">
                  <p className="text-[11px] text-muted-foreground mb-2">
                    Mapping entities:
                  </p>
                  {SETTLE_ENTITIES.map((entity) => {
                    const isDone = entityProgress.includes(entity);
                    return (
                      <motion.div
                        key={entity}
                        className={`flex items-center gap-2 text-xs rounded-lg px-3 py-1.5 border transition-all ${
                          isDone
                            ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700"
                            : "border-border/40 bg-foreground/3 text-muted-foreground"
                        }`}
                        animate={{ opacity: isDone ? 1 : 0.5 }}
                      >
                        {isDone ? (
                          <CheckCircle size={11} className="text-emerald-500" />
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-border" />
                        )}
                        {entity}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Status phase ── */}
          {(phase === "status" || done) && (
            <motion.div
              key="status"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <div className="flex flex-col items-center text-center py-3 gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/15 grid place-items-center">
                  <CheckCircle size={24} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {connector.name} is now connected!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All {SETTLE_ENTITIES.length} entity types synced successfully.
                  </p>
                </div>
              </div>

              {/* Health diagnostic */}
              <div className="space-y-2 p-3 rounded-xl bg-input border border-border/50">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Connection Health
                </p>
                <HealthBadge health="active" />
                <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] text-muted-foreground">
                  <span>Last sync: Just now</span>
                  <span>Entities: {SETTLE_ENTITIES.length} types</span>
                  <span>Status: Active</span>
                  <span>Next sync: 1 hour</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/8 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/15 transition"
              >
                ← Back to Connectors
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Connector card ─────────────────────────────────────── */
function ConnectorCard({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const cfg = HEALTH_CONFIG[connector.health];
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left p-4 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-soft transition-all glass"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div
          className={`h-9 w-9 rounded-xl grid place-items-center ${connector.iconBg} group-hover:scale-105 transition-transform`}
        >
          <connector.icon size={16} className={connector.iconColor} />
        </div>
        <ChevronRight
          size={14}
          className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all mt-1"
        />
      </div>
      <div className="mb-2">
        <p className="text-xs font-semibold mb-0.5">{connector.name}</p>
        <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
          {connector.description}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <HealthBadge health={connector.health} />
        {connector.lastSync && (
          <span className="text-[9px] text-muted-foreground">
            {connector.lastSync}
          </span>
        )}
      </div>
    </button>
  );
}

/* ─── Main page ──────────────────────────────────────────── */
function ConnectorsPage() {
  const [active, setActive] = useState<Connector | null>(null);

  const grouped = (
    ["easy", "standard", "advanced"] as ConnectorCategory[]
  ).reduce<Record<ConnectorCategory, Connector[]>>(
    (acc, cat) => {
      acc[cat] = CONNECTORS.filter((c) => c.category === cat);
      return acc;
    },
    { easy: [], standard: [], advanced: [] }
  );

  return (
    <SettleShell>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key="panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ActivationPanel
                connector={active}
                onClose={() => setActive(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="mb-6">
                <h1 className="font-display text-xl font-semibold tracking-tight mb-1">
                  Integration Marketplace
                </h1>
                <p className="text-sm text-muted-foreground">
                  Connect data sources to Settle's normalised intelligence
                  pipeline — connect, pull, normalise, verify.
                </p>
              </div>

              {/* Grouped grids */}
              {(["easy", "standard", "advanced"] as ConnectorCategory[]).map(
                (cat) =>
                  grouped[cat].length > 0 && (
                    <div key={cat} className="mb-7">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {CATEGORY_LABELS[cat]}
                        </span>
                        <div className="flex-1 h-px bg-border/50" />
                        <span className="text-[10px] text-muted-foreground">
                          {grouped[cat].length} connector
                          {grouped[cat].length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {grouped[cat].map((c) => (
                          <ConnectorCard
                            key={c.id}
                            connector={c}
                            onClick={() => setActive(c)}
                          />
                        ))}
                      </div>
                    </div>
                  )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SettleShell>
  );
}
