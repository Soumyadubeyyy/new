import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/onboarding/organization")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();

  return (
    <AuthShell
      title="Organization Setup"
      subtitle="Tell us about your organization"
    >
      <div className="space-y-4">
        <Field label="Organization Name" />
        <Field label="Industry" />
        <Field label="Company Size" />
        <Field label="Organization Type" />

        <PrimaryButton
          onClick={() =>
            navigate({
              to: "/onboarding/employees",
            })
          }
        >
          Continue
        </PrimaryButton>
      </div>
    </AuthShell>
  );
}
