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

  // WhatsApp connection states
  const [waMetaConnected, setWaMetaConnected] = useState(false);
  const [waBusinessId, setWaBusinessId] = useState("");
  const [waBusinessConfirmed, setWaBusinessConfirmed] = useState(false);
  const [waWabaId, setWaWabaId] = useState("");
  const [waWabaConfirmed, setWaWabaConfirmed] = useState(false);
  const [waPhone, setWaPhone] = useState("");
  const [waMethod, setWaMethod] = useState("SMS");
  const [waOtp, setWaOtp] = useState("");
  const [waPhoneVerified, setWaPhoneVerified] = useState(false);
  const [waVerifiedStatus, setWaVerifiedStatus] = useState<"pending" | "verified" | "required">("pending");
  const [waPermissionsGranted, setWaPermissionsGranted] = useState(false);
  const [waWebhookRegistering, setWaWebhookRegistering] = useState(false);
  const [waWebhookRegistered, setWaWebhookRegistered] = useState(false);
  const [waHealthChecked, setWaHealthChecked] = useState(false);

  // Instagram connection states
  const [igMetaConnected, setIgMetaConnected] = useState(false);
  const [igAccountType, setIgAccountType] = useState<"Business" | "Creator" | "Personal" | "">("");
  const [igAccountTypeConfirmed, setIgAccountTypeConfirmed] = useState(false);
  const [igPageId, setIgPageId] = useState("");
  const [igPageConfirmed, setIgPageConfirmed] = useState(false);
  const [igPermissionsGranted, setIgPermissionsGranted] = useState(false);
  const [igWebhookRegistering, setIgWebhookRegistering] = useState(false);
  const [igWebhookRegistered, setIgWebhookRegistered] = useState(false);
  const [igHealthChecked, setIgHealthChecked] = useState(false);

  // Gmail connection states
  const [gmGoogleConnected, setGmGoogleConnected] = useState(false);
  const [gmEmail, setGmEmail] = useState("");
  const [gmEmailConfirmed, setGmEmailConfirmed] = useState(false);
  const [gmPermissionsGranted, setGmPermissionsGranted] = useState(false);
  const [gmMailboxValidating, setGmMailboxValidating] = useState(false);
  const [gmMailboxValidated, setGmMailboxValidated] = useState(false);
  const [gmWatchRegistering, setGmWatchRegistering] = useState(false);
  const [gmWatchRegistered, setGmWatchRegistered] = useState(false);
  const [gmHealthChecked, setGmHealthChecked] = useState(false);

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
    
    // Reset WhatsApp connection states
    setWaMetaConnected(false);
    setWaBusinessId("");
    setWaBusinessConfirmed(false);
    setWaWabaId("");
    setWaWabaConfirmed(false);
    setWaPhone("");
    setWaMethod("SMS");
    setWaOtp("");
    setWaPhoneVerified(false);
    setWaVerifiedStatus("pending");
    setWaPermissionsGranted(false);
    setWaWebhookRegistering(false);
    setWaWebhookRegistered(false);
    setWaHealthChecked(false);

    // Reset Instagram connection states
    setIgMetaConnected(false);
    setIgAccountType("");
    setIgAccountTypeConfirmed(false);
    setIgPageId("");
    setIgPageConfirmed(false);
    setIgPermissionsGranted(false);
    setIgWebhookRegistering(false);
    setIgWebhookRegistered(false);
    setIgHealthChecked(false);

    // Reset Gmail connection states
    setGmGoogleConnected(false);
    setGmEmail("");
    setGmEmailConfirmed(false);
    setGmPermissionsGranted(false);
    setGmMailboxValidating(false);
    setGmMailboxValidated(false);
    setGmWatchRegistering(false);
    setGmWatchRegistered(false);
    setGmHealthChecked(false);

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

  // WhatsApp active step tracker
  const getWaActiveStep = () => {
    if (!waMetaConnected) return 1;
    if (!waBusinessConfirmed) return 2;
    if (!waWabaConfirmed) return 3;
    if (!waPhoneVerified) return 4;
    if (waVerifiedStatus !== "verified") return 5;
    if (!waPermissionsGranted) return 6;
    if (!waWebhookRegistered) return 7;
    if (!waHealthChecked) return 8;
    return 8;
  };

  // Instagram active step tracker
  const getIgActiveStep = () => {
    if (!igMetaConnected) return 1;
    if (!igAccountTypeConfirmed) return 2;
    if (!igPageConfirmed) return 3;
    if (!igPermissionsGranted) return 4;
    if (!igWebhookRegistered) return 5;
    if (!igHealthChecked) return 6;
    return 6;
  };

  // Gmail active step tracker
  const getGmActiveStep = () => {
    if (!gmGoogleConnected) return 1;
    if (!gmEmailConfirmed) return 2;
    if (!gmPermissionsGranted) return 3;
    if (!gmMailboxValidated) return 4;
    if (!gmWatchRegistered) return 5;
    if (!gmHealthChecked) return 6;
    return 6;
  };

  // WhatsApp webhooks simulated registration
  const [waWebhookStep, setWaWebhookStep] = useState("");
  const handleRegisterWhatsAppWebhooks = async () => {
    setWaWebhookRegistering(true);
    setWaWebhookStep("Generating Access Token...");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setWaWebhookStep("Registering Webhooks...");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setWaWebhookStep("Verifying Callback URL...");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setWaWebhookRegistered(true);
    setWaWebhookRegistering(false);
    setWaWebhookStep("");
    toast.success("WhatsApp Webhooks Registered!");
  };

  // Instagram webhooks simulated registration
  const [igWebhookStep, setIgWebhookStep] = useState("");
  const handleRegisterInstagramWebhooks = async () => {
    setIgWebhookRegistering(true);
    setIgWebhookStep("Generating Access Token...");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIgWebhookStep("Verifying Callback URL...");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIgWebhookRegistered(true);
    setIgWebhookRegistering(false);
    setIgWebhookStep("");
    toast.success("Instagram Webhooks Registered!");
  };

  // Gmail Mailbox validation
  const [gmMailboxStep, setGmMailboxStep] = useState("");
  const handleValidateGmailMailbox = async () => {
    setGmMailboxValidating(true);
    setGmMailboxStep("Token Exchange in Progress...");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setGmMailboxStep("Validating Mailbox Access...");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setGmMailboxValidated(true);
    setGmMailboxValidating(false);
    setGmMailboxStep("");
    toast.success("Gmail Mailbox Access Validated!");
  };

  // Gmail watch registration
  const [gmWatchStep, setGmWatchStep] = useState("");
  const handleRegisterGmailWatch = async () => {
    setGmWatchRegistering(true);
    setGmWatchStep("Registering Pub/Sub Watch Command...");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setGmWatchRegistered(true);
    setGmWatchRegistering(false);
    setGmWatchStep("");
    toast.success("Gmail Watch Command Registered!");
  };

  // Health checks loaders
  const [waHealthChecking, setWaHealthChecking] = useState(false);
  const handleWaHealthCheck = async () => {
    setWaHealthChecking(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setWaHealthChecking(false);
    setWaHealthChecked(true);
    toast.success("WhatsApp Connection Health: Excellent!");
  };

  const [igHealthChecking, setIgHealthChecking] = useState(false);
  const handleIgHealthCheck = async () => {
    setIgHealthChecking(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIgHealthChecking(false);
    setIgHealthChecked(true);
    toast.success("Instagram Connection Health: Excellent!");
  };

  const [gmHealthChecking, setGmHealthChecking] = useState(false);
  const handleGmHealthCheck = async () => {
    setGmHealthChecking(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setGmHealthChecking(false);
    setGmHealthChecked(true);
    toast.success("Gmail Connection Health: Excellent!");
  };

  // Scroll to active step
  useEffect(() => {
    if (wizardOpen && selectedConnector) {
      let step = 1;
      if (selectedConnector.id === "whatsapp") step = getWaActiveStep();
      else if (selectedConnector.id === "instagram") step = getIgActiveStep();
      else if (selectedConnector.id === "gmail") step = getGmActiveStep();
      
      const element = document.getElementById(`step-section-${selectedConnector.id}-${step}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [
    wizardOpen,
    selectedConnector?.id,
    waMetaConnected,
    waBusinessConfirmed,
    waWabaConfirmed,
    waPhoneVerified,
    waVerifiedStatus,
    waPermissionsGranted,
    waWebhookRegistered,
    waHealthChecked,
    igMetaConnected,
    igAccountTypeConfirmed,
    igPageConfirmed,
    igPermissionsGranted,
    igWebhookRegistered,
    igHealthChecked,
    gmGoogleConnected,
    gmEmailConfirmed,
    gmPermissionsGranted,
    gmMailboxValidated,
    gmWatchRegistered,
    gmHealthChecked
  ]);

  // Setup Completion Handler
  const handleFinishSetup = () => {
    if (!selectedConnector) return;
    
    if (selectedConnector.id === "whatsapp") {
      updateStatus("whatsapp", "Connected", {
        connected_account: waPhone || "Meta Account",
        connected_date: new Date().toLocaleDateString(),
        last_sync: "Just now",
        webhook_status: "Active",
        token_status: "Active",
        environment: env,
        business_id: waBusinessId,
        waba_id: waWabaId,
        phone_number_id: "phone_id_" + Date.now(),
      });
      toast.success("WhatsApp Integrated Successfully!");
    } else if (selectedConnector.id === "instagram") {
      updateStatus("instagram", "Connected", {
        connected_account: "Meta Instagram Business",
        connected_date: new Date().toLocaleDateString(),
        last_sync: "Just now",
        webhook_status: "Active",
        token_status: "Active",
        environment: env,
        page_id: igPageId,
        account_type: igAccountType,
      });
      toast.success("Instagram Integrated Successfully!");
    } else if (selectedConnector.id === "gmail") {
      updateStatus("gmail", "Connected", {
        connected_account: gmEmail || "Google Account",
        connected_date: new Date().toLocaleDateString(),
        last_sync: "Just now",
        webhook_status: "Active",
        token_status: "Active",
        environment: env,
      });
      toast.success("Gmail Integrated Successfully!");
    }
    
    setWizardOpen(false);
  };

  // Sidebar Checklist
  const renderSidebar = () => {
    if (!selectedConnector) return null;
    
    let steps: { title: string; completed: boolean; current: boolean }[] = [];
    if (selectedConnector.id === "whatsapp") {
      const active = getWaActiveStep();
      steps = [
        { title: "Meta Login", completed: waMetaConnected, current: active === 1 },
        { title: "Business Selection", completed: waBusinessConfirmed, current: active === 2 },
        { title: "WhatsApp Account", completed: waWabaConfirmed, current: active === 3 },
        { title: "Phone Verification", completed: waPhoneVerified, current: active === 4 },
        { title: "Verification Status", completed: waVerifiedStatus === "verified", current: active === 5 },
        { title: "Permissions", completed: waPermissionsGranted, current: active === 6 },
        { title: "Webhook Status", completed: waWebhookRegistered, current: active === 7 },
        { title: "Connection Health", completed: waHealthChecked, current: active === 8 },
      ];
    } else if (selectedConnector.id === "instagram") {
      const active = getIgActiveStep();
      steps = [
        { title: "Meta Login", completed: igMetaConnected, current: active === 1 },
        { title: "Account Type", completed: igAccountTypeConfirmed, current: active === 2 },
        { title: "Facebook Page Link", completed: igPageConfirmed, current: active === 3 },
        { title: "Permissions", completed: igPermissionsGranted, current: active === 4 },
        { title: "Webhook Status", completed: igWebhookRegistered, current: active === 5 },
        { title: "Connection Health", completed: igHealthChecked, current: active === 6 },
      ];
    } else {
      const active = getGmActiveStep();
      steps = [
        { title: "Google Login", completed: gmGoogleConnected, current: active === 1 },
        { title: "Account Selection", completed: gmEmailConfirmed, current: active === 2 },
        { title: "Permissions", completed: gmPermissionsGranted, current: active === 3 },
        { title: "Mailbox Validation", completed: gmMailboxValidated, current: active === 4 },
        { title: "Watch Registration", completed: gmWatchRegistered, current: active === 5 },
        { title: "Connection Health", completed: gmHealthChecked, current: active === 6 },
      ];
    }

    return (
      <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-border/60 bg-muted/20 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary mb-2">
              Setup Wizard
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <span className={`p-1 rounded-lg ${selectedConnector.iconBg}`}>
                <selectedConnector.icon size={16} className={selectedConnector.iconColor} />
              </span>
              {selectedConnector.name}
            </h3>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Setup Progress</h4>
            <div className="relative pl-3 border-l border-border/60 space-y-5">
              {steps.map((step, idx) => {
                let dotClass = "bg-muted-foreground/30";
                let textClass = "text-muted-foreground font-medium";
                let dotContent = null;
                
                if (step.completed) {
                  dotClass = "bg-emerald-500 text-white scale-110";
                  textClass = "text-emerald-500 font-semibold";
                  dotContent = <CheckCircle size={10} className="stroke-[3]" />;
                } else if (step.current) {
                  dotClass = "bg-primary text-white scale-115 shadow-sm shadow-primary/20 ring-2 ring-primary/20 animate-pulse";
                  textClass = "text-foreground font-bold";
                }
                
                return (
                  <div key={idx} className="relative flex items-center gap-3">
                    {/* Step bullet */}
                    <div className={`absolute -left-[19px] h-3.5 w-3.5 rounded-full flex items-center justify-center text-[8px] transition-all duration-300 ${dotClass}`}>
                      {dotContent}
                    </div>
                    <span className={`text-xs transition-colors duration-300 ${textClass}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-border/40 text-[10px] text-muted-foreground">
          All steps are required to establish a secure connection.
        </div>
      </div>
    );
  };

  // WhatsApp configuration form
  const renderWhatsAppForm = () => {
    const activeStep = getWaActiveStep();
    
    return (
      <div className="space-y-6">
        {/* Section 1: Meta Authentication */}
        <div
          id="step-section-whatsapp-1"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 1
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : waMetaConnected
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                1. Meta Authentication
                {waMetaConnected && <CheckCircle size={14} className="text-emerald-500" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connect your Meta developer or business account.
              </p>
            </div>
          </div>
          
          {waMetaConnected ? (
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <CheckCircle size={16} />
              <span>Connected as Meta Developer (ID: developer_982)</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-input/60 p-3 rounded-lg border border-border/40 text-[10px] font-mono break-all text-muted-foreground">
                Redirect URL: {metaRedirectUrl || "Not Configured (Defaults to Meta SDK login)"}
              </div>
              <button
                type="button"
                onClick={async () => {
                  toast.info("Connecting to Meta Business...");
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  setWaMetaConnected(true);
                  toast.success("Authenticated with Meta!");
                }}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1.5"
              >
                Connect Meta Account
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Business Selection */}
        <div
          id="step-section-whatsapp-2"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 2
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : waBusinessConfirmed
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                2. Business Selection
                {waBusinessConfirmed && <CheckCircle size={14} className="text-emerald-500" />}
                {!waMetaConnected && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select an existing Business Manager or create a new one.
              </p>
            </div>
          </div>
          
          {waBusinessConfirmed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                <CheckCircle size={16} />
                <span>Confirmed Business ID: {waBusinessId}</span>
              </div>
              <button
                type="button"
                onClick={() => setWaBusinessConfirmed(false)}
                className="text-xs text-primary hover:underline font-medium"
              >
                Change Business Selection
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Business ID / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9817293812"
                  value={waBusinessId}
                  onChange={(e) => setWaBusinessId(e.target.value)}
                  className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWaBusinessId("biz_existing_1928")}
                  className="py-2 border border-border rounded-lg text-xs hover:bg-foreground/5 font-medium"
                >
                  Select Existing (1928)
                </button>
                <button
                  type="button"
                  onClick={() => setWaBusinessId("biz_new_" + Date.now().toString().slice(-4))}
                  className="py-2 border border-border rounded-lg text-xs hover:bg-foreground/5 font-medium"
                >
                  Create New Business
                </button>
              </div>
              <button
                type="button"
                disabled={!waBusinessId.trim()}
                onClick={() => setWaBusinessConfirmed(true)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                Confirm Business
              </button>
            </div>
          )}
        </div>

        {/* Section 3: WhatsApp Business Account */}
        <div
          id="step-section-whatsapp-3"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 3
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : waWabaConfirmed
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                3. WhatsApp Business Account (WABA)
                {waWabaConfirmed && <CheckCircle size={14} className="text-emerald-500" />}
                {!waBusinessConfirmed && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure the specific WABA account.
              </p>
            </div>
          </div>
          
          {waWabaConfirmed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                <CheckCircle size={16} />
                <span>Confirmed WABA ID: {waWabaId}</span>
              </div>
              <button
                type="button"
                onClick={() => setWaWabaConfirmed(false)}
                className="text-xs text-primary hover:underline font-medium"
              >
                Change WABA Selection
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  WABA ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. waba_existing_0918"
                  value={waWabaId}
                  onChange={(e) => setWaWabaId(e.target.value)}
                  className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWaWabaId("waba_existing_0918")}
                  className="py-2 border border-border rounded-lg text-xs hover:bg-foreground/5 font-medium"
                >
                  Use Existing (0918)
                </button>
                <button
                  type="button"
                  onClick={() => setWaWabaId("waba_new_" + Date.now().toString().slice(-4))}
                  className="py-2 border border-border rounded-lg text-xs hover:bg-foreground/5 font-medium"
                >
                  Create New WABA
                </button>
              </div>
              <button
                type="button"
                disabled={!waWabaId.trim()}
                onClick={() => setWaWabaConfirmed(true)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                Confirm WABA Account
              </button>
            </div>
          )}
        </div>

        {/* Section 4: Phone Number Verification */}
        <div
          id="step-section-whatsapp-4"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 4
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : waPhoneVerified
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                4. Phone Number Verification
                {waPhoneVerified && <CheckCircle size={14} className="text-emerald-500" />}
                {!waWabaConfirmed && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verify the phone number you wish to use.
              </p>
            </div>
          </div>
          
          {waPhoneVerified ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                <CheckCircle size={16} />
                <span>Verified: {waPhone} ({waMethod})</span>
              </div>
              <button
                type="button"
                onClick={() => setWaPhoneVerified(false)}
                className="text-xs text-primary hover:underline font-medium"
              >
                Re-verify Phone Number
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +1 555-0199"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                    Tip: End phone with '0' to test manual business verification flow.
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Method
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWaMethod("SMS")}
                      className={`flex-1 py-1.5 border rounded-lg text-xs font-medium ${
                        waMethod === "SMS" ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground"
                      }`}
                    >
                      SMS
                    </button>
                    <button
                      type="button"
                      onClick={() => setWaMethod("Call")}
                      className={`flex-1 py-1.5 border rounded-lg text-xs font-medium ${
                        waMethod === "Call" ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground"
                      }`}
                    >
                      Call
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  OTP Code
                </label>
                <input
                  type="text"
                  placeholder="6-digit code"
                  value={waOtp}
                  onChange={(e) => setWaOtp(e.target.value)}
                  className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <button
                type="button"
                disabled={!waPhone.trim() || !waOtp.trim()}
                onClick={() => {
                  const isVerified = !waPhone.endsWith("0");
                  setWaPhoneVerified(true);
                  if (isVerified) {
                    setWaVerifiedStatus("verified");
                    toast.success("Phone verified automatically!");
                  } else {
                    setWaVerifiedStatus("required");
                    toast.warning("Verification Required: Meta verification is required for this business account.");
                  }
                }}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                Verify & Continue
              </button>
            </div>
          )}
        </div>

        {/* Section 5: Business Verification Status */}
        <div
          id="step-section-whatsapp-5"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 5
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : waVerifiedStatus === "verified"
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                5. Business Verification Status
                {waVerifiedStatus === "verified" && <CheckCircle size={14} className="text-emerald-500" />}
                {!waPhoneVerified && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Meta registration status verification.
              </p>
            </div>
          </div>
          
          {waVerifiedStatus === "verified" ? (
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <CheckCircle size={16} />
              <span>Verified: Business Account is Active & Verified.</span>
            </div>
          ) : waVerifiedStatus === "required" ? (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-amber-500 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-xs leading-relaxed">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Business Verification Required</span>
                  Meta requires additional verification for this business account before messaging can be activated.
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.info("Opening Meta Business Verification page...");
                    setTimeout(() => {
                      setWaVerifiedStatus("verified");
                      toast.success("Business verification completed!");
                    }, 1500);
                  }}
                  className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 transition"
                >
                  Open Meta Verification <ExternalLink size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWaVerifiedStatus("verified");
                    toast.info("Bypassed verification.");
                  }}
                  className="py-2 px-3 border border-border rounded-lg text-xs font-medium hover:bg-foreground/5"
                >
                  Skip / Proceed
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground italic">
              Verification will be completed after phone number validation.
            </div>
          )}
        </div>

        {/* Section 6: Permissions */}
        <div
          id="step-section-whatsapp-6"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 6
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : waPermissionsGranted
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                6. Permissions Requested
                {waPermissionsGranted && <CheckCircle size={14} className="text-emerald-500" />}
                {waVerifiedStatus !== "verified" && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Grant Settle access to the following Meta resources.
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            {["Messaging", "Business Management", "Account Access", "Webhook Access"].map((perm) => (
              <div key={perm} className="flex items-center gap-2 p-2 rounded bg-input text-xs border border-border/40">
                <CheckCircle size={14} className={waPermissionsGranted ? "text-emerald-500" : "text-primary/70"} />
                <span>{perm}</span>
              </div>
            ))}
          </div>

          {!waPermissionsGranted && (
            <button
              type="button"
              onClick={() => {
                setWaPermissionsGranted(true);
                toast.success("Permissions granted successfully!");
              }}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition"
            >
              Grant Permissions
            </button>
          )}
        </div>

        {/* Section 7: Webhooks */}
        <div
          id="step-section-whatsapp-7"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 7
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : waWebhookRegistered
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                7. Webhook & Token Registration
                {waWebhookRegistered && <CheckCircle size={14} className="text-emerald-500" />}
                {!waPermissionsGranted && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Establish real-time webhook callback endpoints.
              </p>
            </div>
          </div>
          
          {waWebhookRegistering ? (
            <div className="space-y-3 text-center py-4">
              <Loader size={20} className="text-primary animate-spin mx-auto" />
              <p className="text-xs font-medium text-muted-foreground animate-pulse">
                {waWebhookStep}
              </p>
            </div>
          ) : waWebhookRegistered ? (
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <CheckCircle size={16} />
              <span>Webhooks & Token Active: Callback URL registered.</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRegisterWhatsAppWebhooks}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition"
            >
              Register Webhooks
            </button>
          )}
        </div>

        {/* Section 8: Health Check */}
        <div
          id="step-section-whatsapp-8"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 8
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : waHealthChecked
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                8. Connection Health Check
                {waHealthChecked && <CheckCircle size={14} className="text-emerald-500" />}
                {!waWebhookRegistered && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verify secure channel communications end-to-end.
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4 text-xs">
            <div className="flex items-center gap-2 text-emerald-500 font-medium">
              <CheckCircle size={14} /> <span>✓ Business Connected ({waBusinessId})</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-500 font-medium">
              <CheckCircle size={14} /> <span>✓ WABA Connected ({waWabaId})</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-500 font-medium">
              <CheckCircle size={14} /> <span>✓ Phone Verified ({waPhone})</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-500 font-medium">
              <CheckCircle size={14} /> <span>✓ Token Active & Webhooks Validated</span>
            </div>
          </div>

          {waHealthChecking ? (
            <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
              <Loader size={14} className="animate-spin text-primary" />
              <span>Pinging endpoints...</span>
            </div>
          ) : !waHealthChecked ? (
            <button
              type="button"
              onClick={handleWaHealthCheck}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition"
            >
              Run Connection Health Check
            </button>
          ) : (
            <div className="bg-emerald-500/10 text-emerald-500 text-xs font-semibold p-2.5 rounded-lg text-center border border-emerald-500/20">
              Connection Verified & Healthy!
            </div>
          )}
        </div>
      </div>
    );
  };

  // Instagram configuration form
  const renderInstagramForm = () => {
    const activeStep = getIgActiveStep();
    
    return (
      <div className="space-y-6">
        {/* Step 1: Meta Authentication */}
        <div
          id="step-section-instagram-1"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 1
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : igMetaConnected
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                1. Meta Authentication
                {igMetaConnected && <CheckCircle size={14} className="text-emerald-500" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connect your Meta developer or business account.
              </p>
            </div>
          </div>
          
          {igMetaConnected ? (
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <CheckCircle size={16} />
              <span>Connected as Meta Developer</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={async () => {
                toast.info("Connecting to Meta...");
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setIgMetaConnected(true);
                toast.success("Authenticated with Meta!");
              }}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
            >
              Connect Meta Account
            </button>
          )}
        </div>

        {/* Step 2: Account Type Validation */}
        <div
          id="step-section-instagram-2"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 2
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : igAccountTypeConfirmed
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                2. Account Type Validation
                {igAccountTypeConfirmed && <CheckCircle size={14} className="text-emerald-500" />}
                {!igMetaConnected && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select your Instagram profile account category.
              </p>
            </div>
          </div>
          
          {igAccountTypeConfirmed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                <CheckCircle size={16} />
                <span>Confirmed Account Type: {igAccountType}</span>
              </div>
              <button
                type="button"
                onClick={() => setIgAccountTypeConfirmed(false)}
                className="text-xs text-primary hover:underline font-medium"
              >
                Change Account Type
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setIgAccountType("Business")}
                  className={`py-2 px-3 border rounded-lg text-xs font-semibold transition ${
                    igAccountType === "Business" ? "bg-primary/10 border-primary text-primary" : "border-border hover:bg-foreground/5 text-muted-foreground"
                  }`}
                >
                  Business
                </button>
                <button
                  type="button"
                  onClick={() => setIgAccountType("Creator")}
                  className={`py-2 px-3 border rounded-lg text-xs font-semibold transition ${
                    igAccountType === "Creator" ? "bg-primary/10 border-primary text-primary" : "border-border hover:bg-foreground/5 text-muted-foreground"
                  }`}
                >
                  Creator
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIgAccountType("Personal");
                    toast.error("Personal Accounts are not supported by Meta API.");
                  }}
                  className={`py-2 px-3 border rounded-lg text-xs font-semibold transition ${
                    igAccountType === "Personal" ? "bg-red-500/10 border-red-500 text-red-500" : "border-border hover:bg-foreground/5 text-muted-foreground"
                  }`}
                >
                  Personal
                </button>
              </div>
              
              {igAccountType === "Personal" && (
                <p className="text-xs text-red-500 font-semibold bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                  Instagram API requires a Business or Creator account to integrate. Please convert your account in the Instagram app.
                </p>
              )}

              <button
                type="button"
                disabled={!igAccountType || igAccountType === "Personal"}
                onClick={() => setIgAccountTypeConfirmed(true)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                Confirm Account Type
              </button>
            </div>
          )}
        </div>

        {/* Step 3: Facebook Page Linking */}
        <div
          id="step-section-instagram-3"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 3
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : igPageConfirmed
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                3. Facebook Page Linkage
                {igPageConfirmed && <CheckCircle size={14} className="text-emerald-500" />}
                {!igAccountTypeConfirmed && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                The linked Facebook Page required for Instagram Messaging APIs.
              </p>
            </div>
          </div>
          
          {igPageConfirmed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                <CheckCircle size={16} />
                <span>Linked Page ID: {igPageId}</span>
              </div>
              <button
                type="button"
                onClick={() => setIgPageConfirmed(false)}
                className="text-xs text-primary hover:underline font-medium"
              >
                Change Linked Page
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Facebook Page ID / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1029381203"
                  value={igPageId}
                  onChange={(e) => setIgPageId(e.target.value)}
                  className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <button
                type="button"
                disabled={!igPageId.trim()}
                onClick={() => setIgPageConfirmed(true)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                Confirm Page Linkage
              </button>
            </div>
          )}
        </div>

        {/* Step 4: Permissions */}
        <div
          id="step-section-instagram-4"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 4
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : igPermissionsGranted
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                4. Required Permissions
                {igPermissionsGranted && <CheckCircle size={14} className="text-emerald-500" />}
                {!igPageConfirmed && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enable permissions to sync direct messages & comments.
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            {["Messages", "Comments", "Mentions", "Profile Access"].map((perm) => (
              <div key={perm} className="flex items-center gap-2 p-2 rounded bg-input text-xs border border-border/40">
                <CheckCircle size={14} className={igPermissionsGranted ? "text-emerald-500" : "text-primary/70"} />
                <span>{perm}</span>
              </div>
            ))}
          </div>

          {!igPermissionsGranted && (
            <button
              type="button"
              onClick={() => {
                setIgPermissionsGranted(true);
                toast.success("Permissions granted!");
              }}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition"
            >
              Grant Permissions
            </button>
          )}
        </div>

        {/* Step 5: Webhooks */}
        <div
          id="step-section-instagram-5"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 5
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : igWebhookRegistered
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                5. Webhooks Registration
                {igWebhookRegistered && <CheckCircle size={14} className="text-emerald-500" />}
                {!igPermissionsGranted && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enable webhooks for incoming event triggers.
              </p>
            </div>
          </div>
          
          {igWebhookRegistering ? (
            <div className="space-y-3 text-center py-4">
              <Loader size={20} className="text-primary animate-spin mx-auto" />
              <p className="text-xs font-medium text-muted-foreground animate-pulse">
                {igWebhookStep}
              </p>
            </div>
          ) : igWebhookRegistered ? (
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <CheckCircle size={16} />
              <span>Webhooks Connected: events (messages, comments, mentions, story_mentions) active.</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRegisterInstagramWebhooks}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition"
            >
              Register Webhooks
            </button>
          )}
        </div>

        {/* Step 6: Health Check */}
        <div
          id="step-section-instagram-6"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 6
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : igHealthChecked
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                6. Connection Health Check
                {igHealthChecked && <CheckCircle size={14} className="text-emerald-500" />}
                {!igWebhookRegistered && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verify webhook routing and token status.
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4 text-xs">
            <div className="flex items-center gap-2 text-emerald-500 font-medium">
              <CheckCircle size={14} /> <span>✓ Connected Page Active ({igPageId})</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-500 font-medium">
              <CheckCircle size={14} /> <span>✓ Webhooks Registered</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-500 font-medium">
              <CheckCircle size={14} /> <span>✓ Token verified</span>
            </div>
          </div>

          {igHealthChecking ? (
            <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
              <Loader size={14} className="animate-spin text-primary" />
              <span>Verifying Instagram API...</span>
            </div>
          ) : !igHealthChecked ? (
            <button
              type="button"
              onClick={handleIgHealthCheck}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition"
            >
              Run Connection Health Check
            </button>
          ) : (
            <div className="bg-emerald-500/10 text-emerald-500 text-xs font-semibold p-2.5 rounded-lg text-center border border-emerald-500/20">
              Connection Verified & Healthy!
            </div>
          )}
        </div>
      </div>
    );
  };

  // Gmail configuration form
  const renderGmailForm = () => {
    const activeStep = getGmActiveStep();
    
    return (
      <div className="space-y-6">
        {/* Step 1: Google Login */}
        <div
          id="step-section-gmail-1"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 1
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : gmGoogleConnected
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                1. Google Login
                {gmGoogleConnected && <CheckCircle size={14} className="text-emerald-500" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Authenticate your email using secure Google OAuth.
              </p>
            </div>
          </div>
          
          {gmGoogleConnected ? (
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <CheckCircle size={16} />
              <span>Authenticated with Google Cloud Platform</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={async () => {
                toast.info("Opening Google OAuth Sign-in...");
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setGmGoogleConnected(true);
                toast.success("Authenticated with Google!");
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-foreground text-background hover:bg-foreground/90 transition rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
            >
              Continue with Google
            </button>
          )}
        </div>

        {/* Step 2: Account Selection */}
        <div
          id="step-section-gmail-2"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 2
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : gmEmailConfirmed
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                2. Account Selection
                {gmEmailConfirmed && <CheckCircle size={14} className="text-emerald-500" />}
                {!gmGoogleConnected && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Select or configure your Gmail address.
              </p>
            </div>
          </div>
          
          {gmEmailConfirmed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                <CheckCircle size={16} />
                <span>Connected Email: {gmEmail}</span>
              </div>
              <button
                type="button"
                onClick={() => setGmEmailConfirmed(false)}
                className="text-xs text-primary hover:underline font-medium"
              >
                Change Gmail Account
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setGmEmail("support@google.com")}
                  className={`w-full py-2 px-3 text-left border rounded-lg text-xs font-medium transition ${
                    gmEmail === "support@google.com" ? "bg-primary/10 border-primary text-primary" : "border-border hover:bg-foreground/5"
                  }`}
                >
                  support@google.com
                </button>
                <div className="border-t border-border/60 my-2 pt-2">
                  <label className="block">
                    <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Use another account</span>
                    <input
                      type="email"
                      placeholder="your-email@gmail.com"
                      value={gmEmail}
                      onChange={(e) => setGmEmail(e.target.value)}
                      className="w-full rounded-lg bg-input border border-border/60 px-3 py-2 text-xs focus:outline-none"
                    />
                  </label>
                </div>
              </div>
              <button
                type="button"
                disabled={!gmEmail.trim()}
                onClick={() => setGmEmailConfirmed(true)}
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                Confirm Account
              </button>
            </div>
          )}
        </div>

        {/* Step 3: Permissions */}
        <div
          id="step-section-gmail-3"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 3
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : gmPermissionsGranted
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                3. Permissions Requested
                {gmPermissionsGranted && <CheckCircle size={14} className="text-emerald-500" />}
                {!gmEmailConfirmed && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Grant Settle access to read, send, and listen to mailbox updates.
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            {["Gmail Read", "Gmail Send", "Gmail Metadata", "Profile Access"].map((perm) => (
              <div key={perm} className="flex items-center gap-2 p-2 rounded bg-input text-xs border border-border/40">
                <CheckCircle size={14} className={gmPermissionsGranted ? "text-emerald-500" : "text-primary/70"} />
                <span>{perm}</span>
              </div>
            ))}
          </div>

          {!gmPermissionsGranted && (
            <button
              type="button"
              onClick={() => {
                setGmPermissionsGranted(true);
                toast.success("Permissions granted!");
              }}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition"
            >
              Grant Permissions
            </button>
          )}
        </div>

        {/* Step 4: Mailbox Validation */}
        <div
          id="step-section-gmail-4"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 4
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : gmMailboxValidated
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                4. Mailbox Validation
                {gmMailboxValidated && <CheckCircle size={14} className="text-emerald-500" />}
                {!gmPermissionsGranted && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Validate OAuth tokens and mailbox communication lines.
              </p>
            </div>
          </div>
          
          {gmMailboxValidating ? (
            <div className="space-y-3 text-center py-4">
              <Loader size={20} className="text-primary animate-spin mx-auto" />
              <p className="text-xs font-medium text-muted-foreground animate-pulse">
                {gmMailboxStep}
              </p>
            </div>
          ) : gmMailboxValidated ? (
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <CheckCircle size={16} />
              <span>Mailbox Validated: Secure token exchange completed.</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleValidateGmailMailbox}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition"
            >
              Validate Mailbox
            </button>
          )}
        </div>

        {/* Step 5: Watch Registration */}
        <div
          id="step-section-gmail-5"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 5
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : gmWatchRegistered
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                5. Google Cloud Pub/Sub Watch
                {gmWatchRegistered && <CheckCircle size={14} className="text-emerald-500" />}
                {!gmMailboxValidated && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Register pub/sub listener command to receive email triggers.
              </p>
            </div>
          </div>
          
          {gmWatchRegistering ? (
            <div className="space-y-3 text-center py-4">
              <Loader size={20} className="text-primary animate-spin mx-auto" />
              <p className="text-xs font-medium text-muted-foreground animate-pulse">
                {gmWatchStep}
              </p>
            </div>
          ) : gmWatchRegistered ? (
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
              <CheckCircle size={16} />
              <span>Watch Registered: Listening for new incoming emails.</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRegisterGmailWatch}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition"
            >
              Register Watch Command
            </button>
          )}
        </div>

        {/* Step 6: Health Check */}
        <div
          id="step-section-gmail-6"
          className={`p-5 rounded-xl border transition-all duration-300 ${
            activeStep === 6
              ? "border-primary/50 bg-card shadow-soft ring-1 ring-primary/10"
              : gmHealthChecked
              ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-90"
              : "border-border/60 bg-muted/5 opacity-40 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                6. Connection Health Check
                {gmHealthChecked && <CheckCircle size={14} className="text-emerald-500" />}
                {!gmWatchRegistered && <Lock size={12} className="text-muted-foreground/50" />}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Verify Google OAuth Token and mailbox watch channels.
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4 text-xs">
            <div className="flex items-center gap-2 text-emerald-500 font-medium">
              <CheckCircle size={14} /> <span>✓ Account Connected ({gmEmail})</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-500 font-medium">
              <CheckCircle size={14} /> <span>✓ Refresh Token Stored</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-500 font-medium">
              <CheckCircle size={14} /> <span>✓ Watch Registered Successfully</span>
            </div>
          </div>

          {gmHealthChecking ? (
            <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
              <Loader size={14} className="animate-spin text-primary" />
              <span>Verifying Google API endpoints...</span>
            </div>
          ) : !gmHealthChecked ? (
            <button
              type="button"
              onClick={handleGmHealthCheck}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition"
            >
              Run Connection Health Check
            </button>
          ) : (
            <div className="bg-emerald-500/10 text-emerald-500 text-xs font-semibold p-2.5 rounded-lg text-center border border-emerald-500/20">
              Connection Verified & Healthy!
            </div>
          )}
        </div>
      </div>
    );
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
                  const details = getDetails(conn.id);
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
                          {status !== "Not Connected" && details?.connected_account && (
                            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-foreground/5 text-[11px] font-medium text-foreground border border-border/40">
                              <span className="text-muted-foreground">Account:</span> {details.connected_account}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        {status === "Not Connected" ? (
                          <button
                            onClick={() => startConnect(conn)}
                            className="text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-medium transition"
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
                            <button
                              onClick={() => handleDisconnect(conn.id)}
                              className="text-xs px-3.5 py-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 font-medium transition"
                            >
                              Disconnect
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
                    {selectedConnector.id === "whatsapp" && (
                      <>
                        <div className="p-4 rounded-xl border border-border/60 bg-card glass">
                          <span className="text-[10px] uppercase font-semibold text-muted-foreground">Business ID</span>
                          <p className="text-sm font-medium mt-1 font-mono text-xs truncate">{getDetails(selectedConnector.id)?.business_id || "N/A"}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border/60 bg-card glass">
                          <span className="text-[10px] uppercase font-semibold text-muted-foreground">WABA ID</span>
                          <p className="text-sm font-medium mt-1 font-mono text-xs truncate">{getDetails(selectedConnector.id)?.waba_id || "N/A"}</p>
                        </div>
                      </>
                    )}
                    {selectedConnector.id === "instagram" && (
                      <>
                        <div className="p-4 rounded-xl border border-border/60 bg-card glass">
                          <span className="text-[10px] uppercase font-semibold text-muted-foreground">Facebook Page ID</span>
                          <p className="text-sm font-medium mt-1 font-mono text-xs truncate">{getDetails(selectedConnector.id)?.page_id || "N/A"}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-border/60 bg-card glass">
                          <span className="text-[10px] uppercase font-semibold text-muted-foreground">Account Type</span>
                          <p className="text-sm font-medium mt-1">{getDetails(selectedConnector.id)?.account_type || "N/A"}</p>
                        </div>
                      </>
                    )}
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
        <DialogContent className="sm:max-w-4xl h-[85vh] p-0 overflow-hidden flex flex-col md:flex-row glass-strong border border-border/80">
          
          {/* Left Sidebar Checklist */}
          {renderSidebar()}

          {/* Right Content Form */}
          {selectedConnector && (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-card/10">
              {/* Header */}
              <div className="p-6 border-b border-border/40 flex items-center justify-between shrink-0 bg-card/30">
                <div>
                  <h3 className="font-display font-semibold text-base text-foreground">
                    Configure {selectedConnector.name} Integration
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Complete all configuration sections below to activate.
                  </p>
                </div>
              </div>

              {/* Form Content Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                {selectedConnector.id === "whatsapp" && renderWhatsAppForm()}
                {selectedConnector.id === "instagram" && renderInstagramForm()}
                {selectedConnector.id === "gmail" && renderGmailForm()}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border/40 bg-muted/10 flex justify-between items-center shrink-0">
                <button
                  type="button"
                  onClick={() => setWizardOpen(false)}
                  className="text-xs px-4 py-2 border border-border hover:bg-foreground/5 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                
                {/* Finish / Complete Setup Button */}
                <button
                  type="button"
                  onClick={handleFinishSetup}
                  disabled={
                    selectedConnector.id === "whatsapp"
                      ? !waHealthChecked
                      : selectedConnector.id === "instagram"
                      ? !igHealthChecked
                      : !gmHealthChecked
                  }
                  className="text-xs px-5 py-2 bg-primary text-primary-foreground hover:opacity-95 rounded-lg font-semibold shadow-soft transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SettleShell>
  );
}
