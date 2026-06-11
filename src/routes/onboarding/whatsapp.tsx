import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";
import {
  MessageSquare,
  Bell,
  Clock,
  Check,
  Smartphone,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/onboarding/whatsapp")({
  head: () => ({ meta: [{ title: "WhatsApp Pairing · Settle" }] }),
  component: WhatsAppPairingPage,
});

const STEPS = [
  "Property Details",
  "WhatsApp Pairing",
  "Team Members",
  "All Done",
];

function StepProgress({ current }: { current: number }) {
  return (
    <div className="mb-7">
      <div className="flex items-center gap-1 mb-3">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-1 flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`h-6 w-6 rounded-full grid place-items-center text-[10px] font-semibold transition-all duration-300 ${
                  i < current
                    ? "bg-primary text-primary-foreground"
                    : i === current
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-foreground/8 text-muted-foreground"
                }`}
              >
                {i < current ? <Check size={10} /> : i + 1}
              </div>
              <span
                className={`text-[9px] whitespace-nowrap hidden sm:block ${
                  i === current ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mx-1 mb-3 transition-colors duration-300 ${
                  i < current ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground text-center">
        Step {current + 1} of {STEPS.length}
      </p>
    </div>
  );
}

type Stage = "number" | "otp" | "verified";

function OTPInput({
  onComplete,
}: {
  onComplete: (code: string) => void;
}) {
  const [values, setValues] = useState(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...values];
    next[i] = v;
    setValues(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (next.every((c) => c !== "")) onComplete(next.join(""));
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !values[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center my-5">
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`h-11 w-10 rounded-lg border text-center text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            v
              ? "border-primary/50 bg-primary/5 text-foreground"
              : "border-border/60 bg-input text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

function WhatsAppPairingPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>("number");
  const [phone, setPhone] = useState("");
  const [digestEnabled, setDigestEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [sending, setSending] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSending(true);
    // Simulate OTP send delay
    setTimeout(() => {
      setSending(false);
      setStage("otp");
    }, 1200);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) return;
    // Simulate verification
    setSending(true);
    setTimeout(() => {
      setSending(false);
      localStorage.setItem("settle_whatsapp", phone);
      localStorage.setItem("settle_digest", String(digestEnabled));
      localStorage.setItem("settle_alerts", String(alertsEnabled));
      setStage("verified");
    }, 1000);
  };

  const handleContinue = () => {
    navigate({ to: "/onboarding/employees" });
  };

  return (
    <AuthShell
      title="Pair your WhatsApp"
      subtitle="Settle delivers your 8 AM digest and real-time alerts directly to your WhatsApp — no dashboard needed."
    >
      <StepProgress current={1} />

      <AnimatePresence mode="wait">
        {stage === "number" && (
          <motion.form
            key="number"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
            onSubmit={handleSendOTP}
          >
            <div>
              <span className="text-xs text-muted-foreground mb-1.5 block">
                Owner's WhatsApp Number
              </span>
              <div className="flex rounded-lg overflow-hidden border border-border/60 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/30 transition bg-input">
                <span className="flex items-center px-3 text-xs font-medium text-muted-foreground border-r border-border/60 bg-foreground/5">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="flex-1 px-3 py-2.5 text-sm bg-transparent placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
            </div>

            {/* Notification toggles */}
            <div className="space-y-2.5 p-4 rounded-xl bg-input border border-border/60">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Notification Preferences
              </p>

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Clock size={14} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium">8 AM Daily Digest</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Occupancy, F&B covers, revenue summary via WhatsApp
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDigestEnabled((v) => !v)}
                  className={`relative h-5 w-9 rounded-full shrink-0 transition-colors duration-200 ${
                    digestEnabled ? "bg-primary" : "bg-foreground/15"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      digestEnabled ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Bell size={14} className="text-violet-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium">Real-time Exception Alerts</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Escalations, no-shows, complaints, low inventory
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAlertsEnabled((v) => !v)}
                  className={`relative h-5 w-9 rounded-full shrink-0 transition-colors duration-200 ${
                    alertsEnabled ? "bg-primary" : "bg-foreground/15"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      alertsEnabled ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <PrimaryButton type="submit" disabled={sending}>
              {sending ? (
                <span className="flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin" /> Sending OTP…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <MessageSquare size={14} /> Send Verification Code
                </span>
              )}
            </PrimaryButton>
          </motion.form>
        )}

        {stage === "otp" && (
          <motion.form
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
            onSubmit={handleVerify}
          >
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center mx-auto mb-3">
                <Smartphone size={22} className="text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-foreground">+91 {phone}</span>
              </p>
            </div>

            <OTPInput onComplete={setOtpCode} />

            <PrimaryButton type="submit" disabled={sending || otpCode.length < 6}>
              {sending ? (
                <span className="flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin" /> Verifying…
                </span>
              ) : (
                "Verify & Continue"
              )}
            </PrimaryButton>

            <button
              type="button"
              onClick={() => setStage("number")}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition"
            >
              ← Change number
            </button>
          </motion.form>
        )}

        {stage === "verified" && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <div className="text-center py-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="h-14 w-14 rounded-full bg-emerald-500/15 grid place-items-center mx-auto mb-4"
              >
                <ShieldCheck size={26} className="text-emerald-600" />
              </motion.div>
              <h3 className="font-display text-lg font-semibold">+91 {phone} verified!</h3>
              <p className="text-xs text-muted-foreground mt-1.5">
                Your WhatsApp is now paired with Settle.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-input border border-border/60 text-xs">
              {digestEnabled && (
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Check size={12} className="text-emerald-500 shrink-0" />
                  Daily 8 AM digest will arrive on WhatsApp
                </div>
              )}
              {alertsEnabled && (
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Check size={12} className="text-emerald-500 shrink-0" />
                  Real-time exception alerts enabled
                </div>
              )}
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Check size={12} className="text-emerald-500 shrink-0" />
                No daily dashboard login required — everything routes to WhatsApp
              </div>
            </div>

            <PrimaryButton onClick={handleContinue}>
              Add Team Members →
            </PrimaryButton>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
