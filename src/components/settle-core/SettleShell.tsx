import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Inbox,
  Clock,
  PlugZap,
  Settings,
  ChevronRight,
  Building2,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/settle/inbox", label: "Lead Inbox", icon: Inbox },
  { to: "/settle/followups", label: "Follow-Ups", icon: Clock },
  { to: "/settle/connectors", label: "Connectors", icon: PlugZap },
  { to: "/settle/settings", label: "Settings", icon: Settings },
] as const;

export function SettleShell({ children }: { children: React.ReactNode }) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  // Read property/user info from localStorage (set during onboarding)
  const propertyName =
    typeof window !== "undefined"
      ? (localStorage.getItem("settle_propertyName") ?? "My Property")
      : "My Property";
  const firstName =
    typeof window !== "undefined"
      ? (localStorage.getItem("settle_firstName") ?? "Staff")
      : "Staff";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-violet-glow grid place-items-center font-display font-bold text-primary-foreground text-xs">
              S
            </div>
            <span className="font-display font-semibold text-sm hidden sm:block">
              Settle
            </span>
          </Link>
          <ChevronRight size={14} className="text-border hidden sm:block" />
          {/* Property name */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hidden sm:flex">
            <Building2 size={12} />
            {propertyName}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="h-7 w-7 rounded-full bg-primary/15 grid place-items-center font-semibold text-primary text-[11px]">
              {firstName[0]?.toUpperCase()}
            </div>
            <span className="text-muted-foreground hidden sm:block">{firstName}</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-primary/10 text-primary border border-primary/20">
              Employee
            </span>
          </div>
          <Link
            to="/login"
            className="h-7 w-7 rounded-md grid place-items-center text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition"
            title="Log out"
          >
            <LogOut size={13} />
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-52 border-r border-border/60 p-3 gap-1 sticky top-[53px] h-[calc(100vh-53px)]">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  active
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={14} className="relative z-10" />
                <span className="relative z-10">{label}</span>
                {active && (
                  <span className="ml-auto relative z-10 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </aside>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl flex">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
