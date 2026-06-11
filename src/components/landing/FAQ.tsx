import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-foreground/60">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
        {subtitle}
      </p>
    </div>
  );
}

const faqs = [
  {
    q: "How does Settle integrate with WhatsApp?",
    a: "Settle runs on WhatsApp Business Cloud API. Once your organization is approved, your team chats with the Settle number like any contact — no app to install.",
  },
  {
    q: "How do I onboard my employees?",
    a: "From the owner dashboard, add employee phone numbers manually or upload a CSV. They become authorized instantly and can start sending reports.",
  },
  {
    q: "Can I customize daily reminders?",
    a: "Yes — schedule reminders by time, frequency, department, or individual. Pause anytime and monitor completion in real time.",
  },
  {
    q: "What does the AI actually do with reports?",
    a: "It extracts structure from messy input — PDFs, images, voice notes, free text — and turns it into summaries, action items, and metrics you can query.",
  },
  {
    q: "Who can see what?",
    a: "Owners and admins see everything in their organization. Employees see their own submissions, reminders, and personal analytics. Unauthorized phone numbers see nothing.",
  },
  {
    q: "Is this free?",
    a: "Settle is free during early access. We'll introduce paid plans later — early users get founder pricing.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeader
          eyebrow="FAQ"
          title={
            <>
              Questions, <span className="gradient-text-emerald">answered</span>
            </>
          }
          subtitle="Still unclear? Reach out to the team — we reply fast."
        />

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-foreground/5 transition-colors"
                >
                  <span className="font-medium text-sm md:text-base">
                    {f.q}
                  </span>
                  <div className="h-7 w-7 rounded-full grid place-items-center glass shrink-0">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
