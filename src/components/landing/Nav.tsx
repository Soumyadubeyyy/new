import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#features", label: "Features" },
    { href: "#workflow", label: "How it works" },
    { href: "#dashboard", label: "Dashboard" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 ${
            scrolled
              ? "glass-strong shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]"
              : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-glow grid place-items-center font-display font-bold text-primary-foreground">
              S
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-violet-glow blur-md opacity-50 group-hover:opacity-80 transition-opacity -z-10" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-semibold tracking-tight">
                Settle
              </span>
              <span className="text-[10px] text-muted-foreground">
                by GooseLabs
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="relative px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-br from-primary to-blue-500 text-primary-foreground hover:scale-[1.02] transition-transform shadow-[0_4px_20px_-4px_oklch(0.55_0.20_275/0.40)]"
            >
              Sign up
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-foreground/5"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 glass-strong rounded-2xl p-4 flex flex-col gap-2"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <Link to="/login" className="px-3 py-2 text-sm">
              Login
            </Link>
            <Link
              to="/signup"
              className="px-3 py-2 text-sm text-center rounded-lg bg-gradient-to-br from-primary to-blue-500 text-primary-foreground font-medium"
            >
              Sign up
            </Link>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
