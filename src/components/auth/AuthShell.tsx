import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden noise">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-violet-glow/15 blur-[120px]" />

      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-violet-glow grid place-items-center font-display font-bold text-primary-foreground">S</div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-semibold">Settle</span>
            <span className="text-[10px] text-muted-foreground">by GooseLabs</span>
          </div>
        </Link>

        <div className="glass-strong rounded-2xl p-7 shadow-elevated">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>

          <div className="mt-7">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </motion.div>
    </main>
  );
}

export function Field({
  label,
  type = "text",
  placeholder,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground mb-1.5 block">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg bg-input border border-border/60 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition"
        {...rest}
      />
    </label>
  );
}

export function PrimaryButton({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary to-blue-500 px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.55_0.20_275/0.40)] hover:scale-[1.01] transition-transform"
    >
      {children}
    </button>
  );
}
