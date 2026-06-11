import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/onboarding/employess")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();

  return (
    <AuthShell
      title="Authorize Employees"
      subtitle="Add employee phone numbers"
    >
      <div className="space-y-4">
        <Field label="Employee Name" />
        <Field label="Phone Number" />
        <Field label="Department" />
        <Field label="Role" />

        <PrimaryButton>Add Employee</PrimaryButton>

        <PrimaryButton
          onClick={() =>
            navigate({
              to: "/onboarding/reminders",
            })
          }
        >
          Continue
        </PrimaryButton>
      </div>
    </AuthShell>
  );
}
