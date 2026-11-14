import type { ReactNode } from "react";
import { PageTitle } from "@/components/ui";

export function PublicPage({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return (
    <main className="mx-auto min-h-dvh max-w-lg bg-paper px-4 py-8 text-ink">
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">{kicker}</p>
      <PageTitle className="mt-1 font-display text-3xl text-ink">{title}</PageTitle>
      <div className="mt-6 space-y-5 text-base leading-relaxed">{children}</div>
      <p className="mt-8 text-sm text-muted">
        <a className="font-semibold text-accent" href="/">RivetCare</a>
        {" · "}
        <a className="font-semibold text-accent" href="/privacy">Privacy</a>
        {" · "}
        <a className="font-semibold text-accent" href="/support">Support</a>
      </p>
    </main>
  );
}
