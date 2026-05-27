import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/request-access")({
  head: () => ({ meta: [{ title: "Request Access · Settle" }] }),
  component: RequestAccessPage,
});

function RequestAccessPage() {
  return (
    <AuthShell
      title="Request early access"
      subtitle="Tell us about your team — we'll set up your workspace."
      footer={
        <>
          Already have access?{" "}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Your name" placeholder="Aarav Sharma" />
        <Field label="Organization name" placeholder="Acme Operations" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Org type" placeholder="Construction" />
          <Field label="Team size" placeholder="25–50" />
        </div>
        <Field label="Work email" type="email" placeholder="you@company.com" />
        <Field label="Phone number" type="tel" placeholder="+91 98765 43210" />
        <PrimaryButton>Request access</PrimaryButton>
      </form>
      <p className="mt-4 text-[11px] text-muted-foreground text-center">
        We review applications in 24 hours. Founder pricing locked for early users.
      </p>
    </AuthShell>
  );
}
