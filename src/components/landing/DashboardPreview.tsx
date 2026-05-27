import { motion } from "framer-motion";
import { TrendingUp, FileText, Users, Bell, ArrowUpRight, Sparkles } from "lucide-react";
import { SectionHeader } from "./Feature";

export function DashboardPreview() {
  return (
    <section id="dashboard" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Dashboard"
          title={<>One console for your <span className="gradient-text-emerald">entire operation</span></>}
          subtitle="See submissions, completion rates, AI summaries, and team activity at a glance."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mt-16 relative"
        >
          <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 via-violet-glow/20 to-transparent blur-3xl -z-10" />

          <div className="glass-strong rounded-3xl p-3 md:p-4 shadow-elevated">
            <div className="rounded-2xl bg-background/60 border border-border/60 overflow-hidden">
              {/* mock window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
                <div className="ml-3 text-[11px] text-muted-foreground">settle.gooselabs.app / dashboard</div>
              </div>

              <div className="grid lg:grid-cols-[200px_1fr] min-h-[480px]">
                {/* sidebar */}
                <div className="hidden lg:flex flex-col gap-1 p-4 border-r border-border/60">
                  {["Overview", "Reports", "Employees", "Reminders", "Analytics", "Settings"].map((l, i) => (
                    <div
                      key={l}
                      className={`px-3 py-2 rounded-lg text-xs ${
                        i === 0 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-foreground/5"
                      }`}
                    >
                      {l}
                    </div>
                  ))}
                </div>

                {/* main */}
                <div className="p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="font-display text-lg font-medium">Good morning, Aarav</div>
                      <div className="text-xs text-muted-foreground">Here's what your team shipped today</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-[11px] px-2.5 py-1 rounded-md glass">Today</div>
                      <div className="text-[11px] px-2.5 py-1 rounded-md bg-primary/15 text-primary">Live</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard icon={FileText} label="Reports" value="128" delta="+18%" tint="emerald" />
                    <StatCard icon={Users} label="Active" value="46" delta="+4" tint="violet" />
                    <StatCard icon={Bell} label="Reminders sent" value="312" delta="98%" tint="blue" />
                    <StatCard icon={TrendingUp} label="Completion" value="82%" delta="+6%" tint="pink" />
                  </div>

                  <div className="grid lg:grid-cols-3 gap-3">
                    {/* chart */}
                    <div className="lg:col-span-2 glass rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-medium">Submissions this week</div>
                        <div className="text-[10px] text-muted-foreground">Mon — Sun</div>
                      </div>
                      <div className="h-32 flex items-end gap-2">
                        {[55, 70, 45, 80, 65, 90, 75].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full rounded-md bg-gradient-to-t from-primary/20 to-primary relative overflow-hidden"
                              style={{ height: `${h}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                            </div>
                            <div className="text-[9px] text-muted-foreground">{["M","T","W","T","F","S","S"][i]}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI summary */}
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-1.5 text-[10px] text-violet-600 uppercase tracking-wider mb-2">
                        <Sparkles size={10} /> AI digest
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Engineering shipped 24 reports (+12%). Ops attendance hit 96%. 3 sites flagged
                        delayed concrete pours — review recommended.
                      </p>
                      <button className="mt-3 text-[11px] text-primary flex items-center gap-1 hover:gap-1.5 transition-all">
                        View full digest <ArrowUpRight size={11} />
                      </button>
                    </div>
                  </div>

                  {/* activity */}
                  <div className="glass rounded-xl p-4">
                    <div className="text-xs font-medium mb-3">Recent activity</div>
                    <div className="space-y-2">
                      {[
                        { who: "Priya", what: "submitted Q3 sales recap", when: "2m", tint: "bg-emerald-500" },
                        { who: "Rohan", what: "uploaded site-photo.jpg", when: "8m", tint: "bg-violet-500" },
                        { who: "Meera", what: "marked attendance", when: "14m", tint: "bg-sky-500" },
                        { who: "Kabir", what: "missed daily standup report", when: "1h", tint: "bg-amber-500" },
                      ].map((a, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs">
                          <div className={`h-2 w-2 rounded-full ${a.tint}`} />
                          <span className="font-medium">{a.who}</span>
                          <span className="text-muted-foreground flex-1 truncate">{a.what}</span>
                          <span className="text-muted-foreground text-[10px]">{a.when}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, delta, tint }: any) {
  const colors: Record<string, string> = {
    emerald: "text-emerald-600 bg-emerald-100",
    violet: "text-violet-600 bg-violet-100",
    blue: "text-sky-600 bg-sky-100",
    pink: "text-pink-600 bg-pink-100",
  };
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`h-7 w-7 rounded-lg grid place-items-center ${colors[tint]}`}>
          <Icon size={13} />
        </div>
        <span className="text-[10px] text-primary">{delta}</span>
      </div>
      <div className="font-display text-xl font-semibold">{value}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
