import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthShell, PrimaryButton } from "@/components/auth/AuthShell";
import { useState } from "react";

export const Route = createFileRoute("/verify")({
  component: VerifyPage,
});

function VerifyPage() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  return (
    <AuthShell
      title="Verify Account"
      subtitle="Enter the OTP sent to your phone"
    >
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border rounded-lg p-3"
        placeholder="123456"
      />

      <div className="mt-4">
        <PrimaryButton
          onClick={() =>
            navigate({
              to: "/onboarding/organization",
            })
          }
        >
          Verify
        </PrimaryButton>
      </div>
    </AuthShell>
  );
}
