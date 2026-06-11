import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";
import { Building2, UtensilsCrossed, Hotel, Check } from "lucide-react";

export const Route = createFileRoute("/onboarding/property")({
  head: () => ({ meta: [{ title: "Property Setup · Settle" }] }),
  component: PropertySetupPage,
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

function PropertySetupPage() {
  const navigate = useNavigate();
  const [propertyType, setPropertyType] = useState<"hotel" | "fnb" | "both">("both");
  const [hasRestaurant, setHasRestaurant] = useState(true);
  const [starRating, setStarRating] = useState("4");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    localStorage.setItem("settle_propertyName", fd.get("propertyName") as string);
    localStorage.setItem("settle_propertyType", propertyType);
    localStorage.setItem("settle_starRating", starRating);
    localStorage.setItem("settle_hasRestaurant", String(hasRestaurant));
    navigate({ to: "/onboarding/whatsapp" });
  };

  return (
    <AuthShell
      title="Set up your property"
      subtitle="Tell us about your hospitality operation so Settle can personalise your intelligence layer."
    >
      <StepProgress current={0} />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field
          name="propertyName"
          label="Property Name"
          placeholder="e.g. The Grand Maratha"
          required
        />
        <Field
          name="city"
          label="City / Location"
          placeholder="e.g. Mumbai, Maharashtra"
          required
        />

        {/* Property type selector */}
        <div>
          <span className="text-xs text-muted-foreground mb-2 block">
            Operation Type
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: "hotel", label: "Hotel Only", icon: Hotel },
                { id: "fnb", label: "F&B Only", icon: UtensilsCrossed },
                { id: "both", label: "Hotel + F&B", icon: Building2 },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setPropertyType(id)}
                className={`flex flex-col items-center gap-2 py-3 rounded-xl border text-xs font-medium transition-all ${
                  propertyType === id
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border/60 bg-input text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Star rating */}
        <div>
          <span className="text-xs text-muted-foreground mb-2 block">
            Star Category
          </span>
          <div className="flex gap-2">
            {["Budget", "3★", "4★", "5★"].map((s) => {
              const val = s === "Budget" ? "budget" : s.replace("★", "");
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStarRating(val)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                    starRating === val
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border/60 bg-input text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* In-house restaurant toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-input border border-border/60">
          <div>
            <div className="text-xs font-medium">In-house Restaurant / F&B</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Enables F&B cover tracking and POS integrations
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHasRestaurant((v) => !v)}
            className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
              hasRestaurant ? "bg-primary" : "bg-foreground/15"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                hasRestaurant ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <PrimaryButton type="submit">Continue →</PrimaryButton>
      </form>
    </AuthShell>
  );
}
