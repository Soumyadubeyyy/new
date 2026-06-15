import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";
import {
  Mail,
  Phone,
  Building2,
  User,
  MessageSquare,
  Instagram,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login · Settle" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [role, setRole] = useState<"employee" | "owner">("employee");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const navigate = useNavigate({ from: "/login" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "employee") {
      toast.success("Welcome back! Routing to your task inbox…");
      navigate({ to: "/settle/inbox" });
    } else {
      toast.success("Welcome back! Loading your property overview…");
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Settle workspace."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-input mb-5">
        <RoleTab
          active={role === "employee"}
          onClick={() => setRole("employee")}
          icon={User}
        >
          Employee
        </RoleTab>
        <RoleTab
          active={role === "owner"}
          onClick={() => setRole("owner")}
          icon={Building2}
        >
          Owner
        </RoleTab>
      </div>

      <div className="flex gap-1 p-1 rounded-lg bg-input mb-5">
        <MethodTab
          active={method === "email"}
          onClick={() => setMethod("email")}
          icon={Mail}
        >
          Email
        </MethodTab>
        <MethodTab
          active={method === "phone"}
          onClick={() => setMethod("phone")}
          icon={Phone}
        >
          Phone
        </MethodTab>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        {method === "email" ? (
          <>
            <Field label="Email" type="email" placeholder="you@company.com" />
            <Field label="Password" type="password" placeholder="••••••••" />
          </>
        ) : (
          <Field
            label="Phone number"
            type="tel"
            placeholder="+91 98765 43210"
          />
        )}
        <PrimaryButton>
          {method === "email" ? "Continue" : "Send OTP"}
        </PrimaryButton>
      </form>

      <p className="mt-5 text-[11px] text-muted-foreground text-center leading-relaxed">
        {role === "employee"
          ? "Only phone numbers added by your organization owner can access dashboards."
          : "Owners can manage employees, departments, reminders, and reports."}
      </p>

      {/* Available Integrations */}
      <AvailableIntegrations />
    </AuthShell>
  );
}

function RoleTab({ active, onClick, icon: Icon, children }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-medium transition ${
        active
          ? "bg-primary text-primary-foreground shadow"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon size={12} /> {children}
    </button>
  );
}
function MethodTab({ active, onClick, icon: Icon, children }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs transition ${
        active
          ? "bg-foreground/5 text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon size={12} /> {children}
    </button>
  );
}

/* ─── Available Integrations on Login ─────────────────────── */
const LOGIN_CONNECTORS = [
  {
    id: "whatsapp" as const,
    name: "WhatsApp Business",
    description: "Connect via Meta Business Manager",
    icon: MessageSquare,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    id: "instagram" as const,
    name: "Instagram Business",
    description: "Connect via Meta Business Manager",
    icon: Instagram,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
  },
  {
    id: "gmail" as const,
    name: "Gmail",
    description: "Connect using Google OAuth",
    icon: Mail,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
  },
];

function AvailableIntegrations() {
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const navigate = useNavigate({ from: "/login" });

  useEffect(() => {
    setStatuses({
      whatsapp: localStorage.getItem("settle_connector_whatsapp_status") || "Not Connected",
      instagram: localStorage.getItem("settle_connector_instagram_status") || "Not Connected",
      gmail: localStorage.getItem("settle_connector_gmail_status") || "Not Connected",
    });
  }, []);

  // Check if user is "authenticated" (has stored name)
  const isAuth = typeof window !== "undefined" && !!localStorage.getItem("settle_firstName");

  return (
    <div className="mt-8 pt-6 border-t border-border/40">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Available Integrations
      </h3>
      <div className="space-y-2">
        {LOGIN_CONNECTORS.map((conn) => {
          const status = statuses[conn.id] || "Not Connected";
          const isConnected = status === "Connected";
          return (
            <div
              key={conn.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-input/40 hover:border-primary/30 transition-all"
            >
              <div className={`h-8 w-8 rounded-lg grid place-items-center shrink-0 ${conn.iconBg}`}>
                <conn.icon size={16} className={conn.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{conn.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{conn.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isConnected && (
                  <span className="inline-flex items-center gap-1 text-[9px] text-emerald-500 font-semibold">
                    <CheckCircle size={10} /> Connected
                  </span>
                )}
                {isAuth ? (
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/settle/connectors" })}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition flex items-center gap-1"
                  >
                    {isConnected ? "Manage" : "Connect"} <ChevronRight size={10} />
                  </button>
                ) : (
                  <span className="text-[10px] px-2.5 py-1 rounded-md bg-foreground/5 text-muted-foreground font-medium">
                    Login to Connect
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

