import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, Field, PrimaryButton } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign Up · Settle" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Start onboarding your organization"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const firstName = formData.get("firstName") as string;
          if (firstName) {
            localStorage.setItem("settle_firstName", firstName);
          }
          navigate({ to: "/onboarding/property" });
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Field name="firstName" label="First Name" placeholder="John" required />
          <Field name="lastName" label="Last Name" placeholder="Doe" required />
        </div>
        <Field name="orgName" label="Organization Name" placeholder="Acme Inc." required />
        <Field name="email" label="Email" type="email" placeholder="john@acme.com" required />
        <Field name="phone" label="Phone Number" type="tel" placeholder="+1 234 567 8900" required />
        <Field name="password" label="Password" type="password" placeholder="••••••••" required />

        <PrimaryButton>Sign Up</PrimaryButton>
      </form>
    </AuthShell>
  );
}
