import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthShell, PrimaryButton } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/onboarding/review")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();

  return (
    <AuthShell title="Review Setup" subtitle="Verify your information">
      <div className="space-y-4">
        <div className="border rounded-xl p-4">Owner Details</div>

        <div className="border rounded-xl p-4">Organization Details</div>

        <div className="border rounded-xl p-4">Employees</div>

        <div className="border rounded-xl p-4">Reminder Settings</div>

        <PrimaryButton
          onClick={() =>
            navigate({
              to: "/onboarding/complete",
            })
          }
        >
          Confirm Setup
        </PrimaryButton>
      </div>
    </AuthShell>
  );
}
