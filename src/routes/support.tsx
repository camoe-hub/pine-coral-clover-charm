import { createFileRoute } from "@tanstack/react-router";
import { SupportSections } from "@/components/legal-copy";
import { PublicPage } from "@/components/public-page";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support · RivetCare" },
      { name: "description", content: "How to get help with RivetCare. The model-year manual still governs." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <PublicPage kicker="RivetCare" title="Support">
      <SupportSections />
    </PublicPage>
  );
}
