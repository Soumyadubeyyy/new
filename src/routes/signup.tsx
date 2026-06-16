import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";
import { useState } from "react";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up · Settle" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Start onboarding your organization"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data = Object.fromEntries(formData.entries());
          
          setLoading(true);
          try {
            const res = await fetch("http://localhost:4000/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.error);
            
            localStorage.setItem("settle_token", resData.token);
            if (data.firstName) {
              localStorage.setItem("settle_firstName", data.firstName as string);
            }
            navigate({ to: "/onboarding/property" });
          } catch (error: any) {
            alert(error.message || "Signup failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field name="firstName" label="First Name" placeholder="John" required />
          <Field name="lastName" label="Last Name" placeholder="Doe" required />
        </div>
        <Field name="orgName" label="Organization Name" placeholder="Acme Inc." required />
        <Field name="email" label="Email" type="email" placeholder="john@acme.com" required />
        <Field name="phone" label="Phone Number" type="tel" placeholder="+1 234 567 8900" required />
        <Field name="password" label="Password" type="password" placeholder="••••••••" required />

        <PrimaryButton disabled={loading}>{loading ? "Signing Up..." : "Sign Up"}</PrimaryButton>
      </form>
    </AuthShell>
  );
}
