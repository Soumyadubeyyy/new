import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SettleShell } from "@/components/settle-core/SettleShell";
import {
  MessageSquare,
  Instagram,
  Mail,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  XCircle,
  ChevronRight,
  ArrowLeft,
  Loader,
  Wifi,
  PlugZap,
  Globe,
  Settings,
  Shield,
  FileText,
  Lock,
  ExternalLink,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/settle/connectors")({
  head: () => ({ meta: [{ title: "Connectors · Settle" }] }),
  component: ConnectorsPage,
});

/* ─── Types ──────────────────────────────────────────────── */
type ConnectorStatus =
  | "Not Connected"
  | "Connecting"
  | "Connected"
  | "Error"
  | "Verification Required";

interface Connector {
  id: "whatsapp" | "instagram" | "gmail";
  name: string;
  description: string;
  icon: any;
  iconColor: string;
  iconBg: string;
}

const CONNECTORS_LIST: Connector[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Connect your WhatsApp Business Account through Meta Business Manager.",
    icon: MessageSquare,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    id: "instagram",
    name: "Instagram Business",
    description: "Connect your Instagram Business Account through Meta Business Manager.",
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

/* Status Config for Badges */
const STATUS_CONFIG: Record<
  ConnectorStatus,
  { label: string; classes: string; dot: string }
> = {
  "Connected": {
    label: "Connected",
    classes: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  "Connecting": {
    label: "Connecting",
    classes: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    dot: "bg-blue-500",
  },
  "Verification Required": {
    label: "Verification Required",
    classes: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    dot: "bg-amber-500",
  },
  "Error": {
    label: "Error",
    classes: "bg-red-500/10 text-red-500 border-red-500/20",
    dot: "bg-red-500",
  },
  "Not Connected": {
    label: "Not Connected",
    classes: "bg-foreground/5 text-muted-foreground border-border/40",
    dot: "bg-muted-foreground/40",
  },
};

function StatusBadge({ status }: { status: ConnectorStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function ConnectorsPage() {
  const [activeTab, setActiveTab] = useState<"marketplace" | "details">("marketplace");
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [env, setEnv] = useState<"TEST" | "PRODUCTION">("TEST");

  // Config fields
  const [metaClientId, setMetaClientId] = useState("");
  const [metaRedirectUrl, setMetaRedirectUrl] = useState("");
  const [googleClientId, setGoogleClientId] = useState("");
  const [googleRedirectUrl, setGoogleRedirectUrl] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  // Statuses
  const [whatsappStatus, setWhatsappStatus] = useState<ConnectorStatus>("Not Connected");
  const [instagramStatus, setInstagramStatus] = useState<ConnectorStatus>("Not Connected");
  const [gmailStatus, setGmailStatus] = useState<ConnectorStatus>("Not Connected");

  // Details
  const [whatsappDetails, setWhatsappDetails] = useState<any>({});
  const [instagramDetails, setInstagramDetails] = useState<any>({});
  const [gmailDetails, setGmailDetails] = useState<any>({});

  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState<any>({});

  // Load from localStorage
  useEffect(() => {
    const savedEnv = (localStorage.getItem("settle_connector_env") as any) || "TEST";
    setEnv(savedEnv);

    // Load configs
    setMetaClientId(localStorage.getItem(`settle_meta_client_id_${savedEnv}`) || "");
    setMetaRedirectUrl(localStorage.getItem(`settle_meta_redirect_url_${savedEnv}`) || "");
    setGoogleClientId(localStorage.getItem(`settle_google_client_id_${savedEnv}`) || "");
    setGoogleRedirectUrl(localStorage.getItem(`settle_google_redirect_url_${savedEnv}`) || "");
    setWebhookUrl(localStorage.getItem(`settle_webhook_url_${savedEnv}`) || "");

    // Load statuses
    setWhatsappStatus((localStorage.getItem("settle_connector_whatsapp_status") as ConnectorStatus) || "Not Connected");
    setInstagramStatus((localStorage.getItem("settle_connector_instagram_status") as ConnectorStatus) || "Not Connected");
    setGmailStatus((localStorage.getItem("settle_connector_gmail_status") as ConnectorStatus) || "Not Connected");

    // Load details
    setWhatsappDetails(JSON.parse(localStorage.getItem("settle_connector_whatsapp_details") || "{}"));
    setInstagramDetails(JSON.parse(localStorage.getItem("settle_connector_instagram_details") || "{}"));
    setGmailDetails(JSON.parse(localStorage.getItem("settle_connector_gmail_details") || "{}"));
  }, []);

  const saveConfig = (key: string, val: string) => {
    localStorage.setItem(`${key}_${env}`, val);
    if (key === "settle_meta_client_id") setMetaClientId(val);
    if (key === "settle_meta_redirect_url") setMetaRedirectUrl(val);
    if (key === "settle_google_client_id") setGoogleClientId(val);
    if (key === "settle_google_redirect_url") setGoogleRedirectUrl(val);
    if (key === "settle_webhook_url") setWebhookUrl(val);
  };

  const handleEnvChange = (newEnv: "TEST" | "PRODUCTION") => {
    setEnv(newEnv);
    localStorage.setItem("settle_connector_env", newEnv);
    // Reload configs for this environment
    setMetaClientId(localStorage.getItem(`settle_meta_client_id_${newEnv}`) || "");
    setMetaRedirectUrl(localStorage.getItem(`settle_meta_redirect_url_${newEnv}`) || "");
    setGoogleClientId(localStorage.getItem(`settle_google_client_id_${newEnv}`) || "");
    setGoogleRedirectUrl(localStorage.getItem(`settle_google_redirect_url_${newEnv}`) || "");
    setWebhookUrl(localStorage.getItem(`settle_webhook_url_${newEnv}`) || "");
  };

  const getStatus = (id: string) => {
    if (id === "whatsapp") return whatsappStatus;
    if (id === "instagram") return instagramStatus;
    return gmailStatus;
  };

  const getDetails = (id: string) => {
    if (id === "whatsapp") return whatsappDetails;
    if (id === "instagram") return instagramDetails;
    return gmailDetails;
  };

  const updateStatus = (id: "whatsapp" | "instagram" | "gmail", status: ConnectorStatus, details: any) => {
    if (id === "whatsapp") {
      setWhatsappStatus(status);
      setWhatsappDetails(details);
      localStorage.setItem("settle_connector_whatsapp_status", status);
      localStorage.setItem("settle_connector_whatsapp_details", JSON.stringify(details));
    } else if (id === "instagram") {
      setInstagramStatus(status);
      setInstagramDetails(details);
      localStorage.setItem("settle_connector_instagram_status", status);
      localStorage.setItem("settle_connector_instagram_details", JSON.stringify(details));
    } else {
      setGmailStatus(status);
      setGmailDetails(details);
      localStorage.setItem("settle_connector_gmail_status", status);
      localStorage.setItem("settle_connector_gmail_details", JSON.stringify(details));
    }
  };

  const startConnect = (conn: Connector) => {
    setSelectedConnector(conn);
    setWizardStep(1);
    setWizardData({});
    setWizardOpen(true);
  };

  const handleDisconnect = (id: "whatsapp" | "instagram" | "gmail") => {
    updateStatus(id, "Not Connected", {});
    toast.info(`${id.toUpperCase()} disconnected.`);
    setActiveTab("marketplace");
    setSelectedConnector(null);
  };

  const handleReconnect = (conn: Connector) => {
    startConnect(conn);
  };

  const handleRefresh = (id: "whatsapp" | "instagram" | "gmail") => {
    toast.success("Connection status refreshed!");
  };

  return (
    <SettleShell>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Integration Marketplace</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Connect external platforms and tools to Settle's messaging pipelines.
            </p>
          </div>

          {/* Environment Selector */}
          <div className="flex items-center gap-2 self-start bg-input p-1 rounded-lg border border-border/40">
            <button
              onClick={() => handleEnvChange("TEST")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                env === "TEST" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              TEST Environment
            </button>
            <button
              onClick={() => handleEnvChange("PRODUCTION")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                env === "PRODUCTION" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              PRODUCTION
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === "marketplace" ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Col: Connectors List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available Connectors</h2>
              <div className="grid sm:grid-cols-1 gap-4">
                {CONNECTORS_LIST.map((conn) => {
                  const status = getStatus(conn.id);
                  return (
                    <div
                      key={conn.id}
                      className="group p-5 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-soft transition-all glass flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`h-11 w-11 rounded-xl grid place-items-center shrink-0 ${conn.iconBg}`}>
                          <conn.icon size={22} className={conn.iconColor} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="font-semibold text-sm text-foreground">{conn.name}</h3>
                            <StatusBadge status={status} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{conn.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        {status === "Not Connected" ? (
                          <button
                            onClick={() => startConnect(conn)}
                            className="text-xs px-3.5 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-medium transition"
                          >
                            Connect
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setSelectedConnector(conn);
                                setActiveTab("details");
                              }}
                              className="text-xs px-3.5 py-2 rounded-lg bg-foreground/5 text-foreground hover:bg-foreground/10 font-medium transition"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => startConnect(conn)}
                              className="text-xs px-3.5 py-2 rounded-lg border border-primary/20 text-primary hover:bg-primary/5 font-medium transition"
                            >
                              Reconnect
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Configuration / Environment Settings */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {env} API Settings
              </h2>
              <div className="p-5 rounded-2xl border border-border/60 bg-card glass space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">META_CLIENT_ID</label>
                  <input
                    type="text"
                    placeholder="Enter Meta App ID..."
                    value={metaClientId}
                    onChange={(e) => saveConfig("settle_meta_client_id", e.target.value)}
                    className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">META_REDIRECT_URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={metaRedirectUrl}
                    onChange={(e) => saveConfig("settle_meta_redirect_url", e.target.value)}
                    className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="border-t border-border/60 pt-3">
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">GOOGLE_CLIENT_ID</label>
                  <input
                    type="text"
                    placeholder="Enter Google Client ID..."
                    value={googleClientId}
                    onChange={(e) => saveConfig("settle_google_client_id", e.target.value)}
                    className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">GOOGLE_REDIRECT_URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={googleRedirectUrl}
                    onChange={(e) => saveConfig("settle_google_redirect_url", e.target.value)}
                    className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="border-t border-border/60 pt-3">
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">WEBHOOK_URL</label>
                  <input
                    type="text"
                    placeholder="https://api.settle.app/..."
                    value={webhookUrl}
                    onChange={(e) => saveConfig("settle_webhook_url", e.target.value)}
                    className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* CONNECTOR DETAILS SCREEN */
          selectedConnector && (
            <div className="space-y-6">
              <button
                onClick={() => {
                  setActiveTab("marketplace");
                  setSelectedConnector(null);
                }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft size={14} /> Back to Marketplace
              </button>

              <div className="grid md:grid-cols-[1fr_300px] gap-6">
                {/* Details info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl grid place-items-center ${selectedConnector.iconBg}`}>
                      <selectedConnector.icon size={24} className={selectedConnector.iconColor} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{selectedConnector.name} Integration</h2>
                      <p className="text-xs text-muted-foreground">{selectedConnector.description}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-border/60 bg-card glass">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Connection Status</span>
                      <div className="mt-1">
                        <StatusBadge status={getStatus(selectedConnector.id)} />
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-border/60 bg-card glass">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Connected Account</span>
                      <p className="text-sm font-medium mt-1">{getDetails(selectedConnector.id)?.connected_account || "N/A"}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border/60 bg-card glass">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Connected Date</span>
                      <p className="text-sm font-medium mt-1">{getDetails(selectedConnector.id)?.connected_date || "N/A"}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border/60 bg-card glass">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Last Sync</span>
                      <p className="text-sm font-medium mt-1">{getDetails(selectedConnector.id)?.last_sync || "N/A"}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border/60 bg-card glass">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Webhook Status</span>
                      <p className="text-sm font-medium mt-1 text-emerald-500">{getDetails(selectedConnector.id)?.webhook_status || "Inactive"}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border/60 bg-card glass">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Token Status</span>
                      <p className="text-sm font-medium mt-1 text-emerald-500">{getDetails(selectedConnector.id)?.token_status || "Inactive"}</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border/60 bg-card glass">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Environment</span>
                      <p className="text-sm font-medium mt-1 uppercase">{getDetails(selectedConnector.id)?.environment || env}</p>
                    </div>
                  </div>
                </div>

                {/* Actions sidebar */}
                <div className="space-y-4 bg-card p-5 rounded-2xl border border-border/60 glass">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</h3>
                  <button
                    onClick={() => handleReconnect(selectedConnector)}
                    className="w-full text-xs py-2 px-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
                  >
                    Reconnect
                  </button>
                  <button
                    onClick={() => handleRefresh(selectedConnector.id)}
                    className="w-full text-xs py-2 px-3 rounded-lg bg-foreground/5 text-foreground hover:bg-foreground/10 font-medium transition"
                  >
                    Refresh Status
                  </button>
                  <button
                    onClick={() => handleDisconnect(selectedConnector.id)}
                    className="w-full text-xs py-2 px-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 font-medium transition"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* WIZARD DIALOG MODAL */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="sm:max-w-lg glass-strong">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlugZap size={18} className="text-primary" />
              Configure {selectedConnector?.name}
            </DialogTitle>
          </DialogHeader>

          {/* WHATSAPP WIZARD */}
          {selectedConnector?.id === "whatsapp" && (
            <div className="space-y-6 py-2">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Step {wizardStep} of 12
              </div>

              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Connect WhatsApp Business</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Connect your WhatsApp Business Account to send and receive messages.
                  </p>
                  <button
                    onClick={() => setWizardStep(2)}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Continue
                  </button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Meta Authentication</h3>
                  <p className="text-xs text-muted-foreground">
                    You will be redirected to Meta Business.
                  </p>
                  <div className="bg-input/60 p-3 rounded-lg border border-border/40 text-[10px] font-mono break-all text-muted-foreground">
                    Redirect URL: {metaRedirectUrl || "Not Configured (Defaults to Meta SDK login)"}
                  </div>
                  <button
                    onClick={() => {
                      toast.info("Mock redirecting to Meta Business Manager...");
                      setTimeout(() => setWizardStep(3), 1000);
                    }}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                  >
                    Continue to Meta
                  </button>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Business Selection</h3>
                  <p className="text-xs text-muted-foreground">Select an existing business or create a new one.</p>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Business Name / ID</span>
                      <input
                        type="text"
                        placeholder="Enter business_id (e.g. 9817293812)"
                        value={wizardData.business_id || ""}
                        onChange={(e) => setWizardData({ ...wizardData, business_id: e.target.value })}
                        className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setWizardData({ ...wizardData, business_id: "biz_existing_1928" })}
                        className="py-2 border border-border rounded-lg text-xs hover:bg-foreground/5"
                      >
                        Select Existing Business
                      </button>
                      <button
                        onClick={() => setWizardData({ ...wizardData, business_id: "biz_new_" + Date.now() })}
                        className="py-2 border border-border rounded-lg text-xs hover:bg-foreground/5"
                      >
                        Create New Business
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setWizardStep(4)}
                    disabled={!wizardData.business_id}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">WhatsApp Business Account (WABA)</h3>
                  <p className="text-xs text-muted-foreground">Configure the WABA to link with your workspace.</p>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-[10px] font-semibold text-muted-foreground block mb-1">WABA ID</span>
                      <input
                        type="text"
                        placeholder="Enter waba_id..."
                        value={wizardData.waba_id || ""}
                        onChange={(e) => setWizardData({ ...wizardData, waba_id: e.target.value })}
                        className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setWizardData({ ...wizardData, waba_id: "waba_existing_0918" })}
                        className="py-2 border border-border rounded-lg text-xs hover:bg-foreground/5"
                      >
                        Select Existing WABA
                      </button>
                      <button
                        onClick={() => setWizardData({ ...wizardData, waba_id: "waba_new_" + Date.now() })}
                        className="py-2 border border-border rounded-lg text-xs hover:bg-foreground/5"
                      >
                        Create New WABA
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setWizardStep(5)}
                    disabled={!wizardData.waba_id}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Phone Number Verification</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block mb-1 font-semibold text-muted-foreground">Phone Number</label>
                      <input
                        type="text"
                        placeholder="+1 555-0199"
                        value={wizardData.phone || ""}
                        onChange={(e) => setWizardData({ ...wizardData, phone: e.target.value })}
                        className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold text-muted-foreground">Verification Method</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setWizardData({ ...wizardData, method: "SMS" })}
                          className={`flex-1 py-1.5 border rounded-lg ${wizardData.method === "SMS" ? "bg-primary/10 border-primary" : "border-border"}`}
                        >
                          SMS
                        </button>
                        <button
                          type="button"
                          onClick={() => setWizardData({ ...wizardData, method: "Call" })}
                          className={`flex-1 py-1.5 border rounded-lg ${wizardData.method === "Call" ? "bg-primary/10 border-primary" : "border-border"}`}
                        >
                          Call
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold text-muted-foreground">OTP</label>
                      <input
                        type="text"
                        placeholder="6-digit code"
                        value={wizardData.otp || ""}
                        onChange={(e) => setWizardData({ ...wizardData, otp: e.target.value })}
                        className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Mocking verification check. If phone ends in '0', we'll simulate verified === false
                      const isVerified = !(wizardData.phone && wizardData.phone.endsWith("0"));
                      setWizardData({ ...wizardData, verified: isVerified, phone_number_id: "phone_id_" + Date.now() });
                      setWizardStep(6);
                    }}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Verify & Continue
                  </button>
                </div>
              )}

              {wizardStep === 6 && (
                <div className="space-y-4">
                  {wizardData.verified === false ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        <AlertCircle size={18} />
                        <span className="text-xs font-semibold">Business Verification Required</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Meta requires additional verification for this business account before messaging can be activated.
                      </p>
                      <button
                        onClick={() => {
                          toast.info("Opening Meta Business Verification page...");
                          setWizardData({ ...wizardData, verified: true }); // Bypass after action
                        }}
                        className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
                      >
                        Open Meta Business Verification <ExternalLink size={13} />
                      </button>
                      <button
                        onClick={() => setWizardStep(7)}
                        className="w-full py-2 border border-border rounded-lg text-xs font-medium text-muted-foreground"
                      >
                        Skip Verification / Proceed
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center py-4">
                      <CheckCircle size={36} className="text-emerald-500 mx-auto" />
                      <p className="text-xs font-semibold">Business Account Automatically Verified</p>
                      <button
                        onClick={() => setWizardStep(7)}
                        className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              )}

              {wizardStep === 7 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Permissions Requested</h3>
                  <p className="text-xs text-muted-foreground">Settle requests the following permissions to function:</p>
                  <div className="space-y-2">
                    {["Messaging", "Business Management", "Account Access", "Webhook Access"].map((perm) => (
                      <div key={perm} className="flex items-center gap-2 p-2 rounded bg-input text-xs border border-border/40">
                        <CheckCircle size={14} className="text-primary shrink-0" />
                        <span>{perm}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setWizardStep(8);
                      setTimeout(() => {
                        setWizardStep(9);
                        setTimeout(() => {
                          setWizardStep(10);
                          setTimeout(() => {
                            setWizardStep(11);
                          }, 1000);
                        }, 1000);
                      }, 1200);
                    }}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Grant Permissions & Register
                  </button>
                </div>
              )}

              {wizardStep === 8 && (
                <div className="space-y-4 text-center py-6">
                  <Loader size={28} className="text-primary animate-spin mx-auto" />
                  <p className="text-xs font-medium text-muted-foreground">Generating Access Token...</p>
                </div>
              )}

              {wizardStep === 9 && (
                <div className="space-y-4 text-center py-6">
                  <Loader size={28} className="text-primary animate-spin mx-auto" />
                  <p className="text-xs font-medium text-muted-foreground">Registering Webhooks...</p>
                </div>
              )}

              {wizardStep === 10 && (
                <div className="space-y-4 text-center py-6">
                  <Loader size={28} className="text-primary animate-spin mx-auto" />
                  <p className="text-xs font-medium text-muted-foreground">Verifying Callback URL...</p>
                </div>
              )}

              {wizardStep === 11 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Health Check</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle size={14} /> <span>✓ Business Connected</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle size={14} /> <span>✓ WABA Connected</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle size={14} /> <span>✓ Phone Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle size={14} /> <span>✓ Token Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle size={14} /> <span>✓ Webhook Active</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setWizardStep(12)}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Next
                  </button>
                </div>
              )}

              {wizardStep === 12 && (
                <div className="space-y-4 text-center py-4">
                  <CheckCircle size={40} className="text-emerald-500 mx-auto" />
                  <h3 className="font-semibold text-sm text-foreground">WhatsApp Connected Successfully</h3>
                  <p className="text-xs text-muted-foreground">
                    Your WhatsApp Business integration is fully configured and ready to route messages.
                  </p>
                  <button
                    onClick={() => {
                      updateStatus("whatsapp", "Connected", {
                        connected_account: wizardData.phone || "Meta Account",
                        connected_date: new Date().toLocaleDateString(),
                        last_sync: "Just now",
                        webhook_status: "Active",
                        token_status: "Active",
                        environment: env,
                        business_id: wizardData.business_id,
                        waba_id: wizardData.waba_id,
                        phone_number_id: wizardData.phone_number_id,
                      });
                      setWizardOpen(false);
                      toast.success("WhatsApp Integrated!");
                    }}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Finish Setup
                  </button>
                </div>
              )}
            </div>
          )}

          {/* INSTAGRAM WIZARD */}
          {selectedConnector?.id === "instagram" && (
            <div className="space-y-6 py-2">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Step {wizardStep} of 9
              </div>

              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Connect Instagram Business</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Link your Instagram profile to Settle to automatically sync direct messages and comments.
                  </p>
                  <button
                    onClick={() => setWizardStep(2)}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Continue
                  </button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Account Type Verification</h3>
                  <p className="text-xs text-muted-foreground">Select your current Instagram Account Type:</p>
                  <div className="space-y-2 text-xs">
                    <button
                      onClick={() => setWizardData({ ...wizardData, account_type: "Business" })}
                      className={`w-full py-2 px-3 text-left border rounded-lg ${wizardData.account_type === "Business" ? "bg-primary/10 border-primary" : "border-border"}`}
                    >
                      Business Account (Supported)
                    </button>
                    <button
                      onClick={() => setWizardData({ ...wizardData, account_type: "Creator" })}
                      className={`w-full py-2 px-3 text-left border rounded-lg ${wizardData.account_type === "Creator" ? "bg-primary/10 border-primary" : "border-border"}`}
                    >
                      Creator Account (Supported)
                    </button>
                    <button
                      onClick={() => {
                        toast.error("Personal Accounts are not supported by Meta API.");
                        setWizardData({ ...wizardData, account_type: "Personal" });
                      }}
                      className="w-full py-2 px-3 text-left border border-red-500/20 bg-red-500/5 text-red-500 rounded-lg"
                    >
                      Personal Account (Rejected)
                    </button>
                  </div>
                  <button
                    onClick={() => setWizardStep(3)}
                    disabled={!wizardData.account_type || wizardData.account_type === "Personal"}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Facebook Page Linkage</h3>
                  <p className="text-xs text-muted-foreground">Instagram API requires the account to be linked to a Facebook Page.</p>
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-muted-foreground">Facebook Page ID</label>
                    <input
                      type="text"
                      placeholder="Enter Page ID (e.g. 1029381203)"
                      value={wizardData.page_id || ""}
                      onChange={(e) => setWizardData({ ...wizardData, page_id: e.target.value })}
                      className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setWizardStep(4)}
                    disabled={!wizardData.page_id}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Required Permissions</h3>
                  <div className="space-y-2">
                    {["Messages", "Comments", "Mentions", "Profile Access"].map((perm) => (
                      <div key={perm} className="flex items-center gap-2 p-2 rounded bg-input text-xs border border-border/40">
                        <CheckCircle size={14} className="text-primary shrink-0" />
                        <span>{perm}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setWizardStep(5)}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Grant Permissions
                  </button>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Webhooks Registration</h3>
                  <p className="text-xs text-muted-foreground">Settle will listen to the following events:</p>
                  <div className="space-y-2">
                    {["messages", "comments", "mentions", "story_mentions"].map((wh) => (
                      <div key={wh} className="flex items-center justify-between p-2 rounded bg-input text-xs border border-border/40">
                        <span className="font-mono">{wh}</span>
                        <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-semibold">Registered</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setWizardStep(6);
                      setTimeout(() => {
                        setWizardStep(7);
                        setTimeout(() => {
                          setWizardStep(8);
                        }, 1000);
                      }, 1200);
                    }}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Register Webhooks
                  </button>
                </div>
              )}

              {wizardStep === 6 && (
                <div className="space-y-4 text-center py-6">
                  <Loader size={28} className="text-primary animate-spin mx-auto" />
                  <p className="text-xs font-medium text-muted-foreground">Generating Access Token...</p>
                </div>
              )}

              {wizardStep === 7 && (
                <div className="space-y-4 text-center py-6">
                  <Loader size={28} className="text-primary animate-spin mx-auto" />
                  <p className="text-xs font-medium text-muted-foreground">Verifying Callback URL...</p>
                </div>
              )}

              {wizardStep === 8 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Health Check</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle size={14} /> <span>✓ Connected Page Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle size={14} /> <span>✓ Webhook Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle size={14} /> <span>✓ Token verified</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setWizardStep(9)}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Next
                  </button>
                </div>
              )}

              {wizardStep === 9 && (
                <div className="space-y-4 text-center py-4">
                  <CheckCircle size={40} className="text-emerald-500 mx-auto" />
                  <h3 className="font-semibold text-sm text-foreground">Instagram Connected Successfully</h3>
                  <p className="text-xs text-muted-foreground">
                    Instagram API has been configured successfully.
                  </p>
                  <button
                    onClick={() => {
                      updateStatus("instagram", "Connected", {
                        connected_account: "Meta Instagram Business",
                        connected_date: new Date().toLocaleDateString(),
                        last_sync: "Just now",
                        webhook_status: "Active",
                        token_status: "Active",
                        environment: env,
                        page_id: wizardData.page_id,
                      });
                      setWizardOpen(false);
                      toast.success("Instagram Integrated!");
                    }}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Finish Setup
                  </button>
                </div>
              )}
            </div>
          )}

          {/* GMAIL WIZARD */}
          {selectedConnector?.id === "gmail" && (
            <div className="space-y-6 py-2">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Step {wizardStep} of 9
              </div>

              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Connect Gmail</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Grant Settle secure access to monitor messages or automate emails using Google OAuth.
                  </p>
                  <button
                    onClick={() => setWizardStep(2)}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Continue
                  </button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Google OAuth</h3>
                  <p className="text-xs text-muted-foreground">You will proceed to secure Google authorization.</p>
                  <div className="bg-input/60 p-3 rounded-lg border border-border/40 text-[10px] font-mono break-all text-muted-foreground">
                    Redirect URL: {googleRedirectUrl || "Not Configured"}
                  </div>
                  <button
                    onClick={() => setWizardStep(3)}
                    className="w-full py-2.5 bg-foreground text-background hover:bg-foreground/90 transition rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    Continue with Google
                  </button>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Select Google Account</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setWizardData({ ...wizardData, email: "support@google.com" })}
                      className={`w-full py-2 px-3 text-left border rounded-lg text-xs font-medium ${wizardData.email === "support@google.com" ? "bg-primary/10 border-primary" : "border-border"}`}
                    >
                      support@google.com
                    </button>
                    <div className="border-t border-border/60 my-2 pt-2">
                      <label className="block">
                        <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Use another account</span>
                        <input
                          type="email"
                          placeholder="your-email@gmail.com"
                          value={wizardData.email || ""}
                          onChange={(e) => setWizardData({ ...wizardData, email: e.target.value })}
                          className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none"
                        />
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={() => setWizardStep(4)}
                    disabled={!wizardData.email}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium disabled:opacity-50"
                  >
                    Confirm & Proceed
                  </button>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Permissions Requested</h3>
                  <div className="space-y-2">
                    {["Gmail Read", "Gmail Send", "Gmail Metadata", "Profile Access"].map((perm) => (
                      <div key={perm} className="flex items-center gap-2 p-2 rounded bg-input text-xs border border-border/40">
                        <CheckCircle size={14} className="text-primary shrink-0" />
                        <span>{perm}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setWizardStep(5);
                      setTimeout(() => {
                        setWizardStep(6);
                        setTimeout(() => {
                          setWizardStep(7);
                          setTimeout(() => {
                            setWizardStep(8);
                          }, 1000);
                        }, 1000);
                      }, 1200);
                    }}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Grant Permissions
                  </button>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-4 text-center py-6">
                  <Loader size={28} className="text-primary animate-spin mx-auto" />
                  <p className="text-xs font-medium text-muted-foreground">Token Exchange in Progress...</p>
                </div>
              )}

              {wizardStep === 6 && (
                <div className="space-y-4 text-center py-6">
                  <Loader size={28} className="text-primary animate-spin mx-auto" />
                  <p className="text-xs font-medium text-muted-foreground">Validating Mailbox Access...</p>
                </div>
              )}

              {wizardStep === 7 && (
                <div className="space-y-4 text-center py-6">
                  <Loader size={28} className="text-primary animate-spin mx-auto" />
                  <p className="text-xs font-medium text-muted-foreground">Registering Pub/Sub Watch Command...</p>
                </div>
              )}

              {wizardStep === 8 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-foreground">Health Check</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle size={14} /> <span>✓ Account Connected</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle size={14} /> <span>✓ Refresh Token Stored</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle size={14} /> <span>✓ Watch Registered</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setWizardStep(9)}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Next
                  </button>
                </div>
              )}

              {wizardStep === 9 && (
                <div className="space-y-4 text-center py-4">
                  <CheckCircle size={40} className="text-emerald-500 mx-auto" />
                  <h3 className="font-semibold text-sm text-foreground">Gmail Connected Successfully</h3>
                  <p className="text-xs text-muted-foreground">
                    Google OAuth validation has completed.
                  </p>
                  <button
                    onClick={() => {
                      updateStatus("gmail", "Connected", {
                        connected_account: wizardData.email || "Google Account",
                        connected_date: new Date().toLocaleDateString(),
                        last_sync: "Just now",
                        webhook_status: "Active",
                        token_status: "Active",
                        environment: env,
                      });
                      setWizardOpen(false);
                      toast.success("Gmail Integrated!");
                    }}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium"
                  >
                    Finish Setup
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SettleShell>
  );
}
