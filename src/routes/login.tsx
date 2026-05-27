import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";
import { Mail, Phone, Building2, User } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login · Settle" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [role, setRole] = useState<"employee" | "owner">("employee");
  const [method, setMethod] = useState<"email" | "phone">("email");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Settle workspace."
      footer={
        <>
          New to Settle?{" "}
          <Link to="/request-access" className="text-primary hover:underline">
            Request access
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-input mb-5">
        <RoleTab active={role === "employee"} onClick={() => setRole("employee")} icon={User}>
          Employee
        </RoleTab>
        <RoleTab active={role === "owner"} onClick={() => setRole("owner")} icon={Building2}>
          Owner
        </RoleTab>
      </div>

      <div className="flex gap-1 p-1 rounded-lg bg-input mb-5">
        <MethodTab active={method === "email"} onClick={() => setMethod("email")} icon={Mail}>
          Email
        </MethodTab>
        <MethodTab active={method === "phone"} onClick={() => setMethod("phone")} icon={Phone}>
          Phone
        </MethodTab>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {method === "email" ? (
          <>
            <Field label="Email" type="email" placeholder="you@company.com" />
            <Field label="Password" type="password" placeholder="••••••••" />
          </>
        ) : (
          <Field label="Phone number" type="tel" placeholder="+91 98765 43210" />
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
    </AuthShell>
  );
}

function RoleTab({ active, onClick, icon: Icon, children }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-medium transition ${
        active ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
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
        active ? "bg-foreground/5 text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon size={12} /> {children}
    </button>
  );
}
