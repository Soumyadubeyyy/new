import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/request-access")({
  head: () => ({
    meta: [{ title: "Request Access · Settle" }],
  }),
  component: RequestAccessPage,
});

function RequestAccessPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <AuthShell
        title="Request Submitted"
        subtitle="Thank you for your interest in Settle."
      >
        <div className="space-y-4 text-center">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">We'll contact you shortly</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Your early access request has been received. Our team will review
              your organization details and reach out with next steps.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Return Home
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Request early access"
      subtitle="Tell us about your team — we'll set up your workspace."
      footer={
        <>
          Already have access?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <Field label="Your name" placeholder="Aarav Sharma" />

        <Field label="Organization name" placeholder="Acme Operations" />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Org type" placeholder="Construction" />

          <Field label="Team size" placeholder="25–50" />
        </div>

        <Field label="Work email" type="email" placeholder="you@company.com" />

        <Field label="Phone number" type="tel" placeholder="+91 98765 43210" />

        <PrimaryButton>Request Access</PrimaryButton>
      </form>

      <p className="mt-4 text-[11px] text-center text-muted-foreground">
        We review applications in 24 hours and contact teams directly during
        early access.
      </p>
    </AuthShell>
  );
}
