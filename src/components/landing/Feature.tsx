import { motion } from "framer-motion";
export { Features as Feature };
import {
  MessageSquare,
  Sparkles,
  LayoutDashboard,
  Users,
  BellRing,
  ClipboardCheck,
  Building2,
  FileBarChart,
  Activity,
  Shield,
  Settings2,
  Download,
  Workflow,
  Bell,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "WhatsApp Ingestion",
    desc: "Reports, files, and updates flow straight into Settle from WhatsApp.",
    tint: "emerald",
  },
  {
    icon: Sparkles,
    title: "AI Report Generation",
    desc: "Raw chat turned into clean, structured summaries automatically.",
    tint: "violet",
  },
  {
    icon: LayoutDashboard,
    title: "Smart Dashboards",
    desc: "Live team overview across departments, employees, and projects.",
    tint: "blue",
  },
  {
    icon: Users,
    title: "Employee Tracking",
    desc: "Activity, submissions, and response health for every team member.",
    tint: "pink",
  },
  {
    icon: BellRing,
    title: "Daily Reminders",
    desc: "Automated nudges keep teams reporting without manual chasing.",
    tint: "amber",
  },
  {
    icon: ClipboardCheck,
    title: "Attendance Collection",
    desc: "Check-ins and roll calls captured directly through chat.",
    tint: "emerald",
  },
  {
    icon: Building2,
    title: "Department Reports",
    desc: "Slice insights by team, location, or business unit.",
    tint: "violet",
  },
  {
    icon: FileBarChart,
    title: "AI Summaries",
    desc: "Long PDFs and images condensed into the key signal.",
    tint: "blue",
  },
  {
    icon: Activity,
    title: "Real-time Analytics",
    desc: "Watch participation and output as it happens.",
    tint: "pink",
  },
  {
    icon: Shield,
    title: "Role-based Access",
    desc: "Owners, admins, employees — scoped permissions by default.",
    tint: "amber",
  },
  {
    icon: Settings2,
    title: "Organization Management",
    desc: "Add, edit, or remove members from one clean console.",
    tint: "emerald",
  },
  {
    icon: Download,
    title: "CSV Export",
    desc: "Take any report, table, or activity log with you.",
    tint: "violet",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    desc: "Trigger flows when reports arrive, are missed, or flagged.",
    tint: "blue",
  },
  {
    icon: Bell,
    title: "Notifications",
    desc: "Per-channel alerts so the right person sees the right thing.",
    tint: "pink",
  },
  {
    icon: Clock,
    title: "Reminder Scheduling",
    desc: "Daily, weekly, custom — fully tunable cadences.",
    tint: "amber",
  },
];

const tints: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    ring: "group-hover:shadow-[0_0_40px_-8px_rgba(110,231,183,0.5)]",
  },
  violet: {
    bg: "bg-violet-100",
    text: "text-violet-600",
    ring: "group-hover:shadow-[0_0_40px_-8px_rgba(196,181,253,0.5)]",
  },
  blue: {
    bg: "bg-sky-100",
    text: "text-sky-600",
    ring: "group-hover:shadow-[0_0_40px_-8px_rgba(125,211,252,0.5)]",
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    ring: "group-hover:shadow-[0_0_40px_-8px_rgba(249,168,212,0.5)]",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    ring: "group-hover:shadow-[0_0_40px_-8px_rgba(252,211,77,0.5)]",
  },
};

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Platform"
          title={
            <>
              Everything your team needs,{" "}
              <span className="gradient-text-emerald">already in WhatsApp</span>
            </>
          }
          subtitle="Settle wraps your existing workflow with AI, structure, and accountability — without making anyone learn new software."
        />

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const t = tints[f.tint];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
                className={`group relative glass rounded-2xl p-5 hover:bg-white/[0.07] transition-all duration-500 hover:-translate-y-1 ${t.ring}`}
              >
                <div
                  className={`h-10 w-10 rounded-xl ${t.bg} grid place-items-center mb-4`}
                >
                  <f.icon size={18} className={t.text} />
                </div>
                <h3 className="font-display text-base font-medium">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-2xl mx-auto"
    >
      <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </div>
      <h2 className="mt-5 font-display text-3xl md:text-5xl font-semibold tracking-tight">
        {title}
      </h2>
      <p className="mt-4 text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
}
