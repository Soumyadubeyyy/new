import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  FileText,
  Users,
  Bell,
  ArrowUpRight,
  Sparkles,
  Plus,
  Settings as SettingsIcon,
  Shield,
  MessageSquare,
  Clock,
  CheckCircle,
  BarChart3,
  Check,
  Mail,
  Instagram,
  MessageCircle,
  Inbox
} from "lucide-react";
import { SectionHeader } from "./Feature";
import {
  AddMembersModal,
  type MemberFormData,
} from "@/components/auth/AddMembersModal";

export function DashboardPreview() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [userName, setUserName] = useState("Aarav");

  useEffect(() => {
    const storedName = localStorage.getItem("settle_firstName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleAddMember = (data: MemberFormData) => {
    console.log("Member added:", data);
  };

  const tabs = [
    "Overview",
    "Reports",
    "Unified Inbox",
    "Employees",
    "Reminders",
    "Why Settle?",
    "Settings",
  ];

  return (
    <section id="dashboard" className="relative py-24 md:py-32">
      <AddMembersModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleAddMember}
      />
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Dashboard"
          title={
            <>
              One console for your{" "}
              <span className="gradient-text-emerald">entire operation</span>
            </>
          }
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
                <div className="ml-3 text-[11px] text-muted-foreground">
                  settle.gooselabs.app / dashboard / {activeTab.toLowerCase().replace("?", "").replace(" ", "-")}
                </div>
              </div>

              <div className="grid lg:grid-cols-[200px_1fr] min-h-[480px]">
                {/* sidebar */}
                <div className="hidden lg:flex flex-col gap-1 p-4 border-r border-border/60">
                  {tabs.map((l) => (
                    <button
                      key={l}
                      onClick={() => setActiveTab(l)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        activeTab === l
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                {/* main */}
                <div className="p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="font-display text-lg font-medium">
                        {activeTab === "Overview" ? `Good morning, ${userName}` : activeTab}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activeTab === "Overview" && "Here's what your team shipped today"}
                        {activeTab === "Reports" && "View and manage team submissions"}
                        {activeTab === "Unified Inbox" && "Manage all your communications in one place"}
                        {activeTab === "Employees" && "Manage team access and roles"}
                        {activeTab === "Reminders" && "Automate WhatsApp follow-ups"}
                        {activeTab === "Why Settle?" && "Discover the benefits of our platform"}
                        {activeTab === "Settings" && "Workspace configuration"}
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
                      >
                        <Plus size={14} />
                        Add Members
                      </button>
                      <div className="text-[11px] px-2.5 py-1 rounded-md glass">
                        Today
                      </div>
                      <div className="text-[11px] px-2.5 py-1 rounded-md bg-primary/15 text-primary">
                        Live
                      </div>
                    </div>
                  </div>

                  {activeTab === "Overview" && <OverviewTabContent />}
                  {activeTab === "Reports" && <ReportsTabContent />}
                  {activeTab === "Unified Inbox" && <UnifiedInboxTabContent />}
                  {activeTab === "Employees" && <EmployeesTabContent />}
                  {activeTab === "Reminders" && <RemindersTabContent />}
                  {activeTab === "Why Settle?" && <WhySettleTabContent />}
                  {activeTab === "Settings" && <SettingsTabContent />}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function OverviewTabContent() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
                <div className="text-[9px] text-muted-foreground">{["M", "T", "W", "T", "F", "S", "S"][i]}</div>
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
            Engineering shipped 24 reports (+12%). Ops attendance hit 96%. 3 sites flagged delayed concrete pours — review recommended.
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
  );
}

function ReportsTabContent() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4 border border-emerald-500/20">
          <div className="text-xs text-muted-foreground">Submitted Today</div>
          <div className="font-display text-2xl font-semibold mt-1">128</div>
        </div>
        <div className="glass rounded-xl p-4 border border-amber-500/20">
          <div className="text-xs text-muted-foreground">Pending</div>
          <div className="font-display text-2xl font-semibold mt-1">24</div>
        </div>
        <div className="glass rounded-xl p-4 border border-blue-500/20">
          <div className="text-xs text-muted-foreground">Total Forms</div>
          <div className="font-display text-2xl font-semibold mt-1">6</div>
        </div>
      </div>
      <div className="glass rounded-xl p-4">
        <div className="text-xs font-medium mb-3">Recent Submissions</div>
        <div className="space-y-3">
          {[
            { name: "Daily Standup", user: "Priya", time: "10:30 AM", status: "Reviewed" },
            { name: "Site Inspection", user: "Rohan", time: "09:15 AM", status: "Pending" },
            { name: "Expense Claim", user: "Kabir", time: "Yesterday", status: "Approved" }
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/40 text-xs border border-border/40">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-muted-foreground" />
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-muted-foreground">by {r.user}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{r.time}</span>
                <span className="px-2 py-1 rounded bg-foreground/5">{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmployeesTabContent() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Owner View */}
        <div className="glass rounded-xl p-4 border border-primary/20 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">Owner / Admin Access</span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-4">Owners can see aggregate reports, manage settings, and access the web dashboard.</p>
          <div className="bg-[#0b141a] rounded-lg p-3 space-y-2 border border-border/40 relative z-10">
            <div className="flex justify-start">
              <div className="bg-[#202c33] text-white text-[11px] p-2 rounded-lg max-w-[85%] relative">
                <div className="text-emerald-500 mb-1 font-medium">Settle Bot</div>
                Hi! Here is your daily summary: 45 reports submitted, 3 missing.
                <div className="flex justify-end items-center gap-1 mt-0.5">
                  <span className="text-[9px] opacity-60">10:24</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#005c4b] text-white text-[11px] p-2 rounded-lg max-w-[85%] relative">
                Remind missing employees
                <div className="flex justify-end items-center gap-1 mt-0.5">
                  <span className="text-[9px] opacity-60">10:25</span>
                  <Check size={10} className="opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee View */}
        <div className="glass rounded-xl p-4 border border-border/60 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} className="text-muted-foreground" />
            <span className="text-xs font-medium">Employee Access</span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-4">Employees interact purely via WhatsApp to submit data and receive individual reminders.</p>
          <div className="bg-[#0b141a] rounded-lg p-3 space-y-2 border border-border/40 relative z-10">
            <div className="flex justify-start">
              <div className="bg-[#202c33] text-white text-[11px] p-2 rounded-lg max-w-[85%] relative">
                <div className="text-emerald-500 mb-1 font-medium">Settle Bot</div>
                Hi Priya, please submit your Daily Standup report.
                <div className="flex justify-end items-center gap-1 mt-0.5">
                  <span className="text-[9px] opacity-60">09:00</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#005c4b] text-white text-[11px] p-2 rounded-lg max-w-[85%] relative">
                1. Worked on UI updates<br/>2. Blocked by API
                <div className="flex justify-end items-center gap-1 mt-0.5">
                  <span className="text-[9px] opacity-60">09:15</span>
                  <Check size={10} className="opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RemindersTabContent() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="glass rounded-xl p-6 text-center max-w-md mx-auto mt-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center mx-auto mb-4">
          <Clock size={24} className="text-primary" />
        </div>
        <h3 className="font-display text-lg font-medium mb-2">Automated Reminders</h3>
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Set up daily schedules to automatically ping your team on WhatsApp to submit their reports.
        </p>
        
        <div className="bg-background/50 border border-border/60 rounded-lg p-4 text-left space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Daily Standup Reminder</span>
            <span className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded">Active</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock size={12} />
            Every weekday at 09:00 AM
          </div>
        </div>

        <button disabled className="w-full py-2.5 rounded-lg bg-foreground/5 text-foreground text-xs font-medium opacity-50 cursor-not-allowed border border-border/40 transition">
          Add New Reminder
        </button>
        <p className="text-[10px] text-primary mt-3 italic">Reminder setting up option coming soon...</p>
      </div>
    </div>
  );
}

function WhySettleTabContent() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5 border border-red-500/20 bg-red-500/5">
          <div className="text-xs font-medium text-red-500 mb-4 flex items-center gap-2">
            Without Settle
          </div>
          <ul className="space-y-3 text-xs text-muted-foreground">
            <li className="flex gap-2"><span className="text-red-500">❌</span> Chasing team members for reports</li>
            <li className="flex gap-2"><span className="text-red-500">❌</span> Manual data entry from chats to spreadsheets</li>
            <li className="flex gap-2"><span className="text-red-500">❌</span> Information scattered across groups</li>
            <li className="flex gap-2"><span className="text-red-500">❌</span> Need to install a new app for everyone</li>
          </ul>
        </div>
        <div className="glass rounded-xl p-5 border border-emerald-500/20 bg-emerald-500/5">
          <div className="text-xs font-medium text-emerald-500 mb-4 flex items-center gap-2">
            With Settle
          </div>
          <ul className="space-y-3 text-xs text-muted-foreground">
            <li className="flex gap-2"><span className="text-emerald-500">✅</span> Automated WhatsApp reminders</li>
            <li className="flex gap-2"><span className="text-emerald-500">✅</span> AI-powered summaries & structured data</li>
            <li className="flex gap-2"><span className="text-emerald-500">✅</span> Centralized dashboard for owners</li>
            <li className="flex gap-2"><span className="text-emerald-500">✅</span> Works instantly in WhatsApp, zero friction</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SettingsTabContent() {
  return (
    <div className="h-[300px] flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2 duration-500 glass rounded-xl">
      <div className="h-16 w-16 rounded-full bg-foreground/5 grid place-items-center mb-4">
        <SettingsIcon size={24} className="text-muted-foreground opacity-50" />
      </div>
      <h3 className="font-display text-xl font-medium mb-2">Settings</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Workspace configuration, billing, and advanced preferences are coming soon...
      </p>
    </div>
  );
}

function UnifiedInboxTabContent() {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="glass rounded-xl p-8 text-center max-w-2xl mx-auto mt-4 border border-border/40 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-[#ea4335]/10 grid place-items-center">
            <Mail size={22} className="text-[#ea4335]" />
          </div>
          <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] grid place-items-center text-white shadow-lg shadow-pink-500/20">
            <Instagram size={26} />
          </div>
          <div className="h-12 w-12 rounded-full bg-[#0088cc]/10 grid place-items-center">
            <MessageCircle size={22} className="text-[#0088cc]" />
          </div>
        </div>

        <h3 className="font-display text-2xl font-semibold tracking-tight mb-3">All your conversations, unified.</h3>
        <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          Now you can connect your Gmail, Instagram, WhatsApp, and other social media apps right from here to manage all incoming reports and messages in a single inbox.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-xs font-medium transition-colors border border-border/60">
            <Mail size={14} /> Connect Gmail
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-xs font-medium transition-colors border border-border/60">
            <Instagram size={14} /> Connect Instagram
          </button>
        </div>
      </div>
    </div>
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
