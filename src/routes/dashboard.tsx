import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Settle" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <main className="relative min-h-screen">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <header className="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to site
        </Link>
        <div className="text-xs text-muted-foreground">
          Owner dashboard · <span className="text-foreground">preview</span>
        </div>
      </header>
      <DashboardPreview />
      <div className="mx-auto max-w-3xl px-4 pb-16 text-center text-sm text-muted-foreground">
        Full owner workspace — employee management, reminder builder, AI report center —
        unlocks the moment your access is approved.
      </div>
    </main>
  );
}
