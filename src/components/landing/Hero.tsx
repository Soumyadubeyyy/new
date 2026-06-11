import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  FileText,
  Check,
  CheckCheck,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* gradient mesh background */}
      <div
        className="absolute inset-0 -z-10 animate-gradient"
        style={{ background: "var(--gradient-hero)" }}
      />
      {/* grid */}
      <div className="absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* floating orbs */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
      <div
        className="absolute bottom-0 right-10 h-96 w-96 rounded-full bg-violet-glow/20 blur-[140px] animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <Sparkles size={12} className="text-primary" />
            Early access — invitations open
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight max-w-4xl">
            Turn WhatsApp into your <br className="hidden sm:block" />
            <span className="gradient-text-emerald">smart reporting</span>{" "}
            system
          </h1>

          <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Collect reports, automate reminders, generate AI insights, and
            manage team workflows — all directly through the chat your team
            already uses.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-blue-500 px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_8px_30px_-8px_oklch(0.55_0.20_275/0.45)] hover:scale-[1.02] transition-transform"
            >
              Sign up
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No credit card · Free during beta · Set up in minutes
          </p>
        </motion.div>

        {/* WhatsApp chat mockup floating */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 mx-auto max-w-5xl"
        >
          <div className="grid md:grid-cols-5 gap-6 items-center">
            {/* phone */}
            <div className="md:col-span-2 mx-auto md:mx-0">
              <div className="relative w-[280px]">
                <div className="absolute -inset-6 bg-gradient-to-br from-primary/20 to-violet-glow/20 blur-3xl rounded-full -z-10" />
                <div className="glass-strong rounded-[2.5rem] p-3 shadow-elevated animate-float-slow">
                  <div className="rounded-[2rem] bg-[#0b141a] overflow-hidden border border-border/60">
                    {/* WA header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#202c33]">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-blue-500 grid place-items-center text-xs font-bold text-primary-foreground">
                        S
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          Settle
                        </div>
                        <div className="text-[10px] text-emerald-600/80">
                          online
                        </div>
                      </div>
                    </div>
                    {/* messages */}
                    <div className="p-3 space-y-2 min-h-[380px] bg-[#0b141a]">
                      <ChatBubble side="right" delay={0.4}>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded bg-red-500/20 grid place-items-center">
                            <FileText size={14} className="text-red-300" />
                          </div>
                          <div className="text-xs">
                            <div className="font-medium">daily-report.pdf</div>
                            <div className="text-[10px] opacity-60">218 KB</div>
                          </div>
                        </div>
                      </ChatBubble>
                      <ChatBubble side="right" delay={0.7}>
                        <p className="text-xs">Today's site report ✅</p>
                      </ChatBubble>
                      <ChatBubble side="left" delay={1.2}>
                        <div className="flex items-center gap-1.5 text-[10px] text-primary mb-1">
                          <Sparkles size={10} />
                          AI Summary
                        </div>
                        <p className="text-xs leading-relaxed">
                          12 tasks complete · 3 pending · 0 blockers.
                          Productivity up 18% vs yesterday.
                        </p>
                      </ChatBubble>
                      <ChatBubble side="left" delay={1.6}>
                        <p className="text-xs">Logged to your dashboard 📊</p>
                      </ChatBubble>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* floating cards */}
            <div className="md:col-span-3 space-y-4 relative">
              <FloatCard delay={0.6} className="ml-auto max-w-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Reports today
                    </div>
                    <div className="font-display text-2xl font-semibold mt-1">
                      128
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-md bg-primary/15 text-primary">
                    +18%
                  </div>
                </div>
                <div className="mt-3 flex gap-1 h-10 items-end">
                  {[40, 60, 35, 70, 55, 80, 65, 90, 75, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-gradient-to-t from-primary/40 to-primary"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </FloatCard>

              <FloatCard delay={0.9} className="max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-violet-glow/20 grid place-items-center">
                    <Sparkles size={16} className="text-violet-glow" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium">
                      AI processed 24 docs
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      just now
                    </div>
                  </div>
                  <CheckCheck size={14} className="text-primary" />
                </div>
              </FloatCard>

              <FloatCard delay={1.2} className="ml-12 max-w-sm">
                <div className="text-xs text-muted-foreground mb-2">
                  Team participation
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["#10b981", "#a78bfa", "#60a5fa", "#f472b6"].map(
                      (c, i) => (
                        <div
                          key={i}
                          className="h-7 w-7 rounded-full border-2 border-background"
                          style={{ background: c }}
                        />
                      ),
                    )}
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-foreground/5 overflow-hidden">
                    <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-primary to-violet-glow" />
                  </div>
                  <div className="text-xs font-medium">82%</div>
                </div>
              </FloatCard>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ChatBubble({
  side,
  children,
  delay,
}: {
  side: "left" | "right";
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 text-white ${
          side === "right" ? "bg-[#005c4b]" : "bg-[#202c33]"
        }`}
      >
        {children}
        <div className="flex justify-end items-center gap-1 mt-0.5">
          <span className="text-[9px] opacity-60">10:24</span>
          {side === "right" && <Check size={10} className="opacity-60" />}
        </div>
      </div>
    </motion.div>
  );
}

function FloatCard({
  children,
  className = "",
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-strong rounded-2xl p-4 shadow-elevated ${className}`}
    >
      {children}
    </motion.div>
  );
}
