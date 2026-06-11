import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/book-demo")({
  head: () => ({ meta: [{ title: "Book a Demo · Settle" }] }),
  component: BookDemoPage,
});

function BookDemoPage() {
  return (
    <AuthShell
      title="Book a demo"
      subtitle="15 minutes. We'll walk through your exact workflow."
      footer={
        <>
          Already have access?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Your name" placeholder="Aarav Sharma" />
        <Field label="Work email" type="email" placeholder="you@company.com" />
        <Field label="Phone" type="tel" placeholder="+91 98765 43210" />
        <Field label="Company" placeholder="Acme Operations" />
        <label className="block">
          <span className="text-xs text-muted-foreground mb-1.5 block">
            What would you like to see?
          </span>
          <textarea
            rows={3}
            placeholder="e.g. daily site reports from 40 field workers"
            className="w-full rounded-lg bg-input border border-border/60 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </label>
        <PrimaryButton>Schedule demo</PrimaryButton>
      </form>
    </AuthShell>
  );
}
