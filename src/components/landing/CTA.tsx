import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Github, Twitter, Linkedin } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden glass-strong rounded-3xl p-10 md:p-16 text-center"
        >
          <div
            className="absolute inset-0 -z-10 opacity-80"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />

          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight max-w-2xl mx-auto">
            Ready to make WhatsApp{" "}
            <span className="gradient-text-emerald">work for you</span>?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Join early access. Set up your organization in minutes. Get
            founder-tier pricing forever.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-blue-500 px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_8px_30px_-8px_oklch(0.55_0.20_275/0.45)] hover:scale-[1.02] transition-transform"
            >
              Sign up
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-10">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-violet-glow grid place-items-center font-display font-bold text-primary-foreground">
                S
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-semibold">Settle</span>
                <span className="text-[10px] text-muted-foreground">
                  by GooseLabs
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              A WhatsApp-native operating layer for teams that ship in the real
              world.
            </p>
            <div className="mt-5 flex gap-2">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-lg glass grid place-items-center hover:bg-foreground/5 transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Product"
            links={["Features", "Dashboard", "How it works", "FAQ"]}
          />
          <FooterCol
            title="Company"
            links={["About", "Contact", "Privacy", "Terms"]}
          />
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} GooseLabs. All rights reserved.
          </span>
          <span>Crafted in the open · settle.gooselabs.app</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-sm hover:text-primary transition-colors"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
