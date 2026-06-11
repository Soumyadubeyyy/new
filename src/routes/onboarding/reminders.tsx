import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/reminders")({
  component: RemindersPage,
});

function RemindersPage() {
  return (
    <div style={{ padding: "40px" }}>
      {" "}
      <h1>Reminders Page</h1>{" "}
    </div>
  );
}
