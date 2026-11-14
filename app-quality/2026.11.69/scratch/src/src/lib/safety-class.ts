export type StepKind = "owner" | "cited" | "guidance";

const HAZARDS: { test: RegExp; line: string; tone: "stop" | "caution" }[] = [
  {
    test: /propane|\blp gas\b|\blp\b|gas cylinder|regulator/i,
    line: "Propane. If you smell gas, or a CO or LP alarm is sounding, shut the cylinders, ventilate, leave, and do not flip switches.",
    tone: "stop",
  },
  {
    test: /120\s*-?\s*v|shore power|live circuit|breaker panel|inverter/i,
    line: "120 V. Unplug shore power and open the breaker before you touch a connection. Do not work a live circuit.",
    tone: "stop",
  },
  {
    test: /\bbrakes?\b|bearing|hub end play|nev-r-lube/i,
    line: "Brakes and bearings. The hub on this coach decides the job. Do not grease a cartridge hub. Stop if you are not sure which hub it is.",
    tone: "stop",
  },
  {
    test: /\bjack(?:ing|s)?\b|stabilizer|crawl under/i,
    line: "Jacking. Chock the wheels and use the jack points the manual names. Do not go under a trailer held only by a jack.",
    tone: "stop",
  },
  {
    test: /\btires?\b|blowout|sidewall|\bpsi\b/i,
    line: "Tires. The placard pressure governs. A low or old tire can blow out.",
    tone: "caution",
  },
  {
    test: /frame rail|delaminat|body seam|wall stud/i,
    line: "Structure. Do not drill or load a wall or frame point the manual does not name.",
    tone: "caution",
  },
  {
    test: /weight distribution|tongue weight|\bgvwr\b|hitch rating/i,
    line: "Weight. The hitch rating and the placard govern. This step is not a safe-tow result.",
    tone: "caution",
  },
];

/** A step is not a factory fact just because it mentions a part. */
export function classifyStep(text: string, namedSource?: string | null): { kind: StepKind; label: string; hazard: string | null; tone: "stop" | "caution" } {
  const owner = /owner-reported|owner reported|forum only|what owners/i.test(text);
  const cites =
    Boolean(namedSource?.trim()) ||
    /owner'?s manual|model-year manual|placard|nameplate|data plate|\bdexter\b|parts book|nhtsa/i.test(text);
  const kind: StepKind = owner ? "owner" : cites ? "cited" : "guidance";
  const label = kind === "owner" ? "Owner report" : kind === "cited" ? "Cites a source" : "General guidance";
  const hit = HAZARDS.find((row) => row.test.test(text));
  return { kind, label, hazard: hit?.line ?? null, tone: hit?.tone ?? "caution" };
}
