import { createFileRoute } from "@tanstack/react-router";
import { PrivacySections } from "@/components/legal-copy";
import { PublicPage } from "@/components/public-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy · RivetCare" },
      { name: "description", content: "RivetCare stores the trailer records on this phone. It does not sell data or require an account." },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <PublicPage kicker="RivetCare" title="Privacy policy">
      <PrivacySections />
      <section className="space-y-2">
        <h2 className="text-2xl">Delete</h2>
        <p>In the app, Privacy has “Delete all local records.” That removes the trailers, the log, the photos, the notes, the scale tickets, the saved shop search, a restore undo copy, and a saved parts list on this phone. A backup you already saved in Files is not deleted.</p>
      </section>
    </PublicPage>
  );
}
