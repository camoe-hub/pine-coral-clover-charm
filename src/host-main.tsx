import { StrictMode, useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Shell } from "@/components/shell";
import { PassGate } from "@/components/pass-gate";
import { PrivacySections, SupportSections } from "@/components/legal-copy";
import { PublicPage } from "@/components/public-page";
import { passUnlocked } from "@/lib/pass-code";
import "@/styles.css";

function LaunchSplash() {
  const [show, setShow] = useState(true);
  useLayoutEffect(() => {
    const timer = window.setTimeout(() => setShow(false), 1700);
    return () => window.clearTimeout(timer);
  }, []);
  if (!show) return null;
  return (
    <div className="launch-splash">
      <img src="/splash/brand.jpg?v=2" alt="" />
    </div>
  );
}

function PrivacyPage() {
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

function SupportPage() {
  return (
    <PublicPage kicker="RivetCare" title="Support">
      <SupportSections />
    </PublicPage>
  );
}

function pagePath() {
  const path = window.location.pathname.replace(/\/index\.html$/, "").replace(/\/$/, "") || "/";
  return path;
}

function LockedHome() {
  const [open, setOpen] = useState(passUnlocked);
  return (
    <>
      <LaunchSplash />
      {open ? <Shell /> : <PassGate onUnlock={() => setOpen(true)} />}
    </>
  );
}

function App() {
  const path = pagePath();
  if (path === "/privacy") return <PrivacyPage />;
  if (path === "/support") return <SupportPage />;
  return <LockedHome />;
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
