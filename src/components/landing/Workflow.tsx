import { motion } from "framer-motion";
import { Building2, UserPlus, MessageCircle, Sparkles, Check } from "lucide-react";
import { SectionHeader } from "./Feature";

const steps = [
  {
    n: "01",
    icon: Building2,
    title: "Owner creates organization",
    desc: "Spin up your workspace in under a minute. Name it, pick a type, and you're in.",
    tint: "text-emerald-600 bg-emerald-100",
  },
  {
    n: "02",
    icon: UserPlus,
    title: "Add employee phone numbers",
    desc: "Authorize teammates by phone — only added numbers can submit reports.",
    tint: "text-violet-600 bg-violet-100",
  },
  {
    n: "03",
    icon: MessageCircle,
    title: "Employees report via WhatsApp",
    desc: "They chat. Settle's AI structures it. Owners see everything in real time.",
    tint: "text-sky-600 bg-sky-100",
  },
];

export function Workflow() {
  return (
    <section id="workflow" className="relative py-24 md:py-32">
      <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div
          className="h-full w-full opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, oklch(0.78 0.18 158 / 0.15), transparent 60%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="How it works"
          title={<>From setup to first insight in <span className="gradient-text-emerald">3 steps</span></>}
          subtitle="No onboarding workshops. No new apps to install. Your team keeps using WhatsApp."
        />

        <div className="mt-16 grid md:grid-cols-3 gap-6 relative">
          {/* connecting line */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative"
            >
              <div className="glass-strong rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-2xl grid place-items-center ${s.tint}`}>
                    <s.icon size={20} />
                  </div>
                  <span className="font-display text-3xl font-semibold text-foreground/10">{s.n}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp chat preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 glass-strong rounded-3xl p-6 md:p-10 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
            <Sparkles size={12} className="text-primary" />
            Live preview · WhatsApp ↔ Settle
          </div>
          <div className="space-y-3">
            <Bubble side="right">Submitting today's site report 🏗️</Bubble>
            <Bubble side="right">[ attached: site-photo.jpg ]</Bubble>
            <Bubble side="left" ai>
              <p>Got it — analyzing image and notes…</p>
            </Bubble>
            <Bubble side="left" ai>
              <p className="font-medium mb-1.5">📋 Daily Site Report — Block C</p>
              <ul className="text-xs space-y-1 opacity-90">
                <li className="flex gap-2"><Check size={12} className="text-primary mt-0.5" /> 32 workers on-site</li>
                <li className="flex gap-2"><Check size={12} className="text-primary mt-0.5" /> Concrete pour: 80% complete</li>
                <li className="flex gap-2"><Check size={12} className="text-primary mt-0.5" /> 0 safety incidents</li>
              </ul>
              <div className="mt-2 text-[10px] opacity-60">Saved to dashboard · Visible to 2 admins</div>
            </Bubble>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Bubble({ side, children, ai }: { side: "left" | "right"; children: React.ReactNode; ai?: boolean }) {
  return (
    <div className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md rounded-2xl px-4 py-2.5 text-sm ${
          side === "right"
            ? "bg-primary/15 text-foreground border border-primary/20"
            : "glass border border-border"
        }`}
      >
        {ai && (
          <div className="flex items-center gap-1.5 text-[10px] text-primary mb-1.5 uppercase tracking-wider">
            <Sparkles size={10} /> Settle AI
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
