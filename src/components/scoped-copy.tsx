import { scopeCopy } from "@/lib/year-scope";

/** Other-year sentences stay available, under a line that they are not this coach. */
export function ScopedCopy({ text, year }: { text: string; year: number | null }) {
  const scoped = scopeCopy(text, year);
  if (!scoped.aside) return <>{text}</>;
  return (
    <>
      {scoped.lead ? <span className="block">{scoped.lead}</span> : null}
      <span className={`block text-muted ${scoped.lead ? "mt-2" : ""}`}>Not this coach. {scoped.aside}</span>
    </>
  );
}
