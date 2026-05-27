import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Feature } from "@/components/landing/Feature";
import { Workflow } from "@/components/landing/Workflow";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA, Footer } from "@/components/landing/CTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Settle — WhatsApp-native reporting for modern teams | GooseLabs" },
      { name: "description", content: "Collect reports, automate reminders, generate AI insights, and manage team workflows directly through WhatsApp. Built by GooseLabs." },
      { property: "og:title", content: "Settle — WhatsApp-native reporting for modern teams" },
      { property: "og:description", content: "Turn WhatsApp into your organization's smart reporting system." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen noise">
      <Nav />
      <Hero />
      <Feature />
      <Workflow />
      <DashboardPreview />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
