import { motion } from "framer-motion";
import { SectionHeader } from "./Feature";

const items = [
  {
    quote:
      "We replaced three apps and a spreadsheet with a single WhatsApp number. Our site supervisors finally report on time.",
    name: "Operations lead",
    role: "Construction · pilot user",
    tint: "from-emerald-300/30 to-emerald-300/0",
  },
  {
    quote:
      "The AI summaries save me 40 minutes a day. I open the dashboard, scan the digest, and I already know where to look.",
    name: "Founder",
    role: "D2C brand · pilot user",
    tint: "from-violet-300/30 to-violet-300/0",
  },
  {
    quote:
      "Attendance via WhatsApp was the unlock. Field staff don't open apps — they always open chat.",
    name: "Regional manager",
    role: "Logistics · pilot user",
    tint: "from-sky-300/30 to-sky-300/0",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Early voices"
          title={
            <>
              Built with our{" "}
              <span className="gradient-text-emerald">first teams</span>
            </>
          }
          subtitle="Quiet pilots with operators who actually run things."
        />

        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative glass rounded-2xl p-6 overflow-hidden"
            >
              <div
                className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${t.tint} blur-2xl`}
              />
              <p className="text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 pt-5 border-t border-border/60">
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
