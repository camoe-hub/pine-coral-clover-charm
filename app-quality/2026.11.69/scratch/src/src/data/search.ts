import { symptoms, type Symptom } from "@/data/symptoms";
import { parts } from "@/data/parts";
import { procedures } from "@/data/procedures";
import { tasks } from "@/data/schedule";
import { checklists } from "@/data/checklists";
import { recalls } from "@/data/recalls";
import { faultCodes, faultCodeExact, faultCodeMatches, faultCodeRank, ownerReportedCode } from "@/data/codes";
import { flows } from "@/data/flows";
import { causes, causeFits } from "@/data/causes";
import { figures, figureApplies } from "@/data/figures";
import type { Model } from "@/data/models";
import { codeFits, flowFits, partBrandOk, procedureFits, recallsFor, symptomOn, waterBrands } from "@/data/coach";
import { aldeShownName } from "@/data/fitment";
import type { Screen } from "@/lib/store";
import { textHasWords, wordsOf, canonWord } from "@/data/words";

export type Hit = {
  title: string;
  detail: string;
  kicker: string;
  why?: string;
  to: Screen;
};

export function searchAll(q: string, model?: Model, year?: number | null): Hit[] {
  const words = wordsOf(q);
  if (!words.length) return [];
  const full = gatherHits(words, model, year, q);
  const strong = full.filter((row) => row.score < 4);
  if (strong.length >= 4 || words.length < 2) return rankHits(full);
  const long = [...words].filter((w) => w.length >= 5).sort((a, b) => b.length - a.length);
  const core = (long.length ? long : [...words].sort((a, b) => b.length - a.length)).slice(0, 2);
  if (core.join(" ") === words.join(" ")) return rankHits(full);
  const extra = gatherHits(core, model, year);
  const byKey = new Map<string, { hit: Hit; score: number }>();
  const keyOf = (row: { hit: Hit }) => `${row.hit.kicker}\0${row.hit.title}`;
  for (const row of full) byKey.set(keyOf(row), row);
  const fullTop = full.reduce((n, row) => Math.max(n, row.score), -1);
  for (const row of extra) {
    const key = keyOf(row);
    if (!textHasWords(`${row.hit.title} ${row.hit.kicker}`, core)) continue;
    const prev = byKey.get(key);
    const score = row.score + 1;
    if (!prev) byKey.set(key, { hit: row.hit, score: fullTop + 2 + row.score });
    else if (prev.score >= 4 && score < prev.score) byKey.set(key, { hit: row.hit, score });
  }
  return rankHits([...byKey.values()]);
}

function gatherHits(words: string[], model?: Model, year?: number | null, raw = "") {
  const q = raw || words.join(" ");
  const hits: { hit: Hit; score: number }[] = [];
  const push = (blob: string, h: Hit, score: number) => {
    if (textHasWords(blob, words)) hits.push({ hit: h, score });
  };
  const titleScore = (title: string) => (textHasWords(title, words) ? 1 : 4);

  for (const c of faultCodes) {
    const fits = !model || codeFits(c, model, year);
    const exact = faultCodeExact(c, q);
    if (!fits && !exact) continue;
    if (!faultCodeMatches(c, q)) continue;
    const about = `${c.code} ${c.meaning} ${c.appliance}`;
    if (!exact && !textHasWords(about, words)) continue;
    const shown = c.appliance === "Alde 3030" ? aldeShownName(year, model?.id) : c.appliance;
    const meaning = ownerReportedCode(c) ? `Owner-reported. ${c.meaning}` : c.meaning;
    const onCoach = faultCodeRank(c, q, fits);
    hits.push({
      hit: {
        kicker: fits ? shown : "Not on this coach",
        title: c.code,
        detail: fits ? meaning : `${shown}. ${meaning}`,
        why: fits ? undefined : "Matched the code. This appliance is not on the saved coach.",
        to: { name: "codes", q: c.code, appliance: c.appliance },
      },
      score: (onCoach === 0 ? -2 : exact ? -1 : textHasWords(c.code, words) ? 0 : 2) + (fits ? 0 : 1),
    });
  }
  for (const sy of symptoms) {
    if (model && !symptomOn(sy, model, year)) continue;
    const found = symptomQuery(sy, words);
    if (!found) continue;
    const imported = sy.id.startsWith("x-");
    hits.push({
      hit: { kicker: sy.system, title: sy.title, detail: found.detail, to: { name: "symptom", id: sy.id, step: 0 } },
      score: found.score + (imported ? 3 : 0),
    });
  }
  for (const f of figures) {
    if (model && !figureApplies(f.id, model, year)) continue;
    if (model && !model.alde && model.family !== "Other" && /\balde\b/i.test(`${f.title} ${f.group}`)) continue;
    const titled = textHasWords(`${f.title} ${f.group}`, words);
    const numbered = textHasWords(f.num, words);
    if (!titled && !numbered) continue;
    hits.push({
      hit: { kicker: "Figure", title: f.num, detail: f.title, to: { name: "figure", id: f.id } },
      score: titled ? 2 : 3,
    });
  }
  for (const p of parts) {
    if (model && model.family !== "Other" && partNamesOtherCoach(p.name, model.family)) continue;
    if (model && !partBrandOk(p.id, model, year)) continue;
    const preAlde = model?.family === "Classic" && year != null && year <= 2016;
    if (model && ((!model.alde && model.family !== "Other") || preAlde) && /\balde\b/i.test(`${p.name} ${p.system} ${p.application}`)) continue;
    const blob = `${p.name} ${p.pn} ${p.also ?? ""} ${p.application} ${p.system} ${p.notes}`;
    const named = textHasWords(p.name, words);
    const number = textHasWords(`${p.pn} ${p.also ?? ""}`, words);
    const curated = named && !p.id.startsWith("pn-");
    push(blob, {
      kicker: p.tool ? "Tool" : "Part",
      title: p.name,
      detail: p.pn,
      to: { name: "part", id: p.id },
    }, curated || named ? 2 : number ? 1 : 4);
  }
  for (const p of procedures) {
    if (model && !procedureFits(p.id, model, year)) continue;
    const head = textHasWords(`${p.title} ${p.system}`, words);
    const stepTitle = p.steps.some((st) => textHasWords(st.title, words));
    const stepBody = p.steps.some((st) => textHasWords(st.body, words));
    if (!head && !stepTitle && !stepBody) continue;
    hits.push({
      hit: { kicker: "Procedure", title: p.title, detail: p.system, to: { name: "procedure", id: p.id } },
      score: head ? 1 : stepTitle ? 2 : 4,
    });
  }
  for (const t of tasks) {
    if (!taskFits(t.fit, model)) continue;
    if (t.procedureId && model && !procedureFits(t.procedureId, model, year)) continue;
    push(`${t.title} ${t.detail} ${t.system}`, { kicker: "Schedule", title: t.title, detail: t.detail, to: { name: "care" } }, titleScore(t.title));
  }
  for (const c of checklists) {
    const head = textHasWords(`${c.title} ${c.intro}`, words);
    const item = c.groups.some((g) => g.items.some((i) => textHasWords(i.text, words)));
    if (!head && !item) continue;
    hits.push({
      hit: { kicker: "Checklist", title: c.title, detail: c.intro, to: { name: "checklist", id: c.id } },
      score: head ? 1 : 4,
    });
  }
  for (const r of recalls) {
    const mine = !model || model.family === "Other" || recallsFor(model, year).some((row) => row.campaign === r.campaign);
    if (!mine && !textHasWords(r.campaign, words)) continue;
    push(`${r.campaign} ${r.models} ${r.defect} ${r.remedy}`, { kicker: "Recall", title: r.campaign, detail: r.models, to: { name: "recalls" } }, textHasWords(r.campaign, words) ? 1 : 4);
  }
  for (const f of flows) {
    if (model && !flowFits(f, model, year)) continue;
    const head = `${f.title} ${f.system}`;
    const about = `${head} ${f.blurb}`;
    const body = Object.values(f.nodes)
      .map((n) => `${"q" in n ? n.q : ""} ${"detail" in n ? (n.detail ?? "") : ""} ${"body" in n ? (n.body ?? "") : ""} ${"title" in n ? (n.title ?? "") : ""}`)
      .join(" ");
    const flowHit = {
      kicker: "Flowchart",
      title: f.title,
      detail: f.blurb,
      to: { name: "flow" as const, id: f.id },
    };
    const topic = words.filter((word) => word !== "no" && word !== "cold" && word !== "warm" && word !== "dead" && (word.length >= 4 || word === "ac"));
    const named = topic.length > 0 && topic.every((word) => textHasWords(head, [word]));
    const rest = words.filter((word) => !topic.includes(word));
    const restOk = rest.length === 0 || rest.every((word) => word === "no" || word === "cold" || word === "warm" || word === "dead") || textHasWords(`${about} ${body}`, rest);
    if (named && restOk) {
      hits.push({ hit: flowHit, score: symptomPhrase(words) ? 0 : 1 });
    } else if (textHasWords(about, words)) {
      hits.push({ hit: flowHit, score: 1 });
    }
  }
  for (const c of causes) {
    if (model && !causeFits(c, model, year)) continue;
    push(`${c.cause} ${c.signs.join(" ")} ${c.start} same cause`, { kicker: "Same cause", title: c.cause, detail: c.signs.join(" · "), to: c.to }, titleScore(c.cause));
  }
  const pages: Hit[] = [
    { kicker: "Records", title: "Tire record", detail: "DOT code, mount date, and cold pressure for each wheel", to: { name: "tires" } },
    { kicker: "Records", title: "Propane cylinders/batteries", detail: "Collar date on the cylinder, and when the batteries went in", to: { name: "supplies" } },
    { kicker: "Records", title: "Shop sheet", detail: "Weights, tires, and the notes to hand a shop", to: { name: "desk" } },
    { kicker: "Records", title: "Backup", detail: "Export or restore the book on this phone", to: { name: "backup" } },
    { kicker: "Records", title: "Privacy", detail: "Where the records stay and how to delete them", to: { name: "privacy" } },
    { kicker: "Records", title: "Support", detail: "Who publishes this app and how to get help", to: { name: "support" } },
    { kicker: "Records", title: "Offline", detail: "What works with no signal", to: { name: "offline" } },
  ];
  for (const page of pages) {
    push(`${page.title} ${page.detail} service desk`, page, titleScore(page.title));
  }
  explainHits(hits, raw, words, model, year);

  return hits;
}

function installedHeater(model?: Model, year?: number | null): string | null {
  if (!model || model.family === "Other") return null;
  const brands = [...waterBrands(model, year)];
  if (!brands.length) return model.alde ? "Alde" : null;
  return brands.map((name) => (name === "Alde 3030" ? "Alde" : name)).join(" or ");
}

function asksIgnite(raw: string, words: string[]) {
  if (words.some((word) => canonWord(word) === "ignite")) return true;
  return /no flame|will not light|won't light|wont light|does not light|doesn't light|failure to light/i.test(raw);
}

const OTHER_APPLIANCE = new Set(["furnace", "fridge", "refrigerator", "stove", "cooktop", "range", "air", "ac", "brake"]);

function heaterKind(hit: Hit) {
  if (hit.kicker === "Procedure") return "procedure";
  if (hit.kicker === "Flowchart") return "flowchart";
  if (hit.kicker === "Schedule") return "service job";
  return "check";
}

function isInstalledHeaterHit(hit: Hit) {
  if (hit.to.name === "codes") return false;
  if (hit.to.name === "flow" && hit.to.id === "hot") return true;
  if (hit.to.name === "procedure" && (hit.to.id === "alde" || hit.to.id === "anode" || hit.to.id === "descale")) return hit.to.id === "alde";
  if (hit.to.name === "symptom" && (hit.to.id === "alde" || hit.to.id === "no-hot-tank" || hit.to.id === "tankless" || hit.to.id === "alde-cold" || hit.to.id === "alde-fault")) return true;
  return hit.kicker === "Water heater" || hit.kicker === "Alde";
}

function explainHits(
  hits: { hit: Hit; score: number }[],
  raw: string,
  words: string[],
  model?: Model,
  year?: number | null,
) {
  const heater = installedHeater(model, year);
  const ignite = asksIgnite(raw, words);
  const otherAppliance = words.some((word) => OTHER_APPLIANCE.has(canonWord(word)));
  const codeQuery = words.some((word) => /\d/.test(word) && word.replace(/[^a-z0-9]/gi, "").length <= 8);
  if (ignite && heater && model && !otherAppliance) {
    const seen = new Set(hits.map((row) => `${row.hit.kicker}\0${row.hit.title}`));
    const note = (hit: Hit) => `Matched because this ${heaterKind(hit)} covers failure to ignite in the installed water heater, ${heater}.`;
    for (const row of hits) {
      if (isInstalledHeaterHit(row.hit)) row.hit.why = note(row.hit);
    }
    const add = (hit: Hit, score: number) => {
      const key = `${hit.kicker}\0${hit.title}`;
      if (seen.has(key)) return;
      seen.add(key);
      hits.push({ hit: { ...hit, why: note(hit) }, score });
    };
    const hot = flows.find((flow) => flow.id === "hot");
    if (hot) add({ kicker: "Flowchart", title: hot.title, detail: hot.blurb, to: { name: "flow", id: hot.id } }, 0);
    if (model.alde && procedureFits("alde", model, year)) {
      const alde = procedures.find((item) => item.id === "alde");
      if (alde) add({ kicker: "Procedure", title: alde.title, detail: alde.system, to: { name: "procedure", id: alde.id } }, 2);
    }
    for (const id of ["alde", "no-hot-tank", "tankless"]) {
      const sy = symptoms.find((item) => item.id === id);
      if (!sy || !symptomOn(sy, model, year)) continue;
      add({ kicker: sy.system, title: sy.title, detail: sy.blurb, to: { name: "symptom", id: sy.id, step: 0 } }, 2);
    }
  }
  if (codeQuery) {
    for (const row of hits) {
      if (row.hit.to.name === "codes" && !row.hit.why) {
        row.hit.why = `Matched because this is a ${row.hit.kicker} fault code.`;
      }
    }
  }
}

function rankHits(hits: { hit: Hit; score: number }[]): Hit[] {
  hits.sort((a, b) => a.score - b.score || a.hit.title.localeCompare(b.hit.title));
  const seen = new Set<string>();
  const unique = hits.filter((row) => {
    const key = `${row.hit.kicker}\0${row.hit.title}\0${JSON.stringify(row.hit.to)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const strong = unique.filter((h) => h.score < 4);
  const led = strong.some((h) => h.hit.kicker === "Flowchart");
  const weak = unique.filter((h) => h.score >= 4).slice(0, led ? 2 : 6);
  return [...strong, ...weak].slice(0, 12).map((h) => h.hit);
}

export type SavedRow = {
  kind: "note" | "log" | "photo" | "weights";
  title: string;
  detail: string;
};

export function savedRowsFrom(input: {
  notes: { text: string }[];
  log: { note: string; job?: string; work?: string; provider?: string; parts?: string; warranty?: string; tech?: string; files?: { name: string }[] }[];
  weights: string;
}): SavedRow[] {
  const rows: SavedRow[] = [];
  for (const note of input.notes) {
    const text = note.text.trim();
    if (text) rows.push({ kind: "note", title: text.slice(0, 80), detail: "Personal note" });
  }
  for (const entry of input.log) {
    const title = (entry.job || entry.note || "Service visit").trim().slice(0, 80);
    const detail = [entry.job, entry.work, entry.provider, entry.parts, entry.warranty, entry.tech, entry.note].filter(Boolean).join(" · ");
    if (detail) rows.push({ kind: "log", title, detail });
    for (const file of entry.files ?? []) {
      if (file.name.trim()) rows.push({ kind: "photo", title: file.name.trim().slice(0, 80), detail: title });
    }
  }
  if (input.weights.trim()) rows.push({ kind: "weights", title: "Weight ticket", detail: input.weights });
  return rows;
}

/** Notes, service-log lines, photo names, and a saved scale ticket. */
export function searchSaved(q: string, rows: SavedRow[]): Hit[] {
  const words = wordsOf(q);
  if (!words.length) return [];
  const hits: Hit[] = [];
  for (const row of rows) {
    if (!textHasWords(`${row.title} ${row.detail}`, words)) continue;
    const to: Screen =
      row.kind === "note" ? { name: "notes" } : row.kind === "weights" ? { name: "weights" } : { name: "log" };
    const kicker = row.kind === "note" ? "Note" : row.kind === "weights" ? "Weight ticket" : row.kind === "photo" ? "Photo" : "Service log";
    hits.push({ kicker, title: row.title, detail: row.detail, to });
    if (hits.length === 4) break;
  }
  return hits;
}

export function mergeHits(saved: Hit[], book: Hit[]): Hit[] {
  return [...saved, ...book].slice(0, 12);
}

function partNamesOtherCoach(name: string, family: string) {
  const named = name.match(/\b(Classic|Globetrotter|Trade Wind|Flying Cloud|Basecamp|Bambi|Caravel|International|Stetson)\b/g);
  if (!named) return false;
  return !named.some((n) => n.toLowerCase() === family.toLowerCase());
}

function symptomPhrase(words: string[]) {
  if (words.some((word) => /\d/.test(word))) return false;
  return words.some((word) => word.length >= 4);
}

/** A job matches on its title, summary, or the check you would read. A word buried in the steps does not. */
function symptomQuery(sy: Symptom, words: string[]): { score: number; detail: string } | null {
  if (textHasWords(sy.title, words)) return { score: 1, detail: sy.blurb };
  const look = sy.checks.find((c) => textHasWords(c.look, words));
  if (look) return { score: 2, detail: look.look };
  if (textHasWords(`${sy.title} ${sy.blurb} ${sy.system}`, words)) return { score: 2, detail: sy.blurb };
  if (textHasWords(`${sy.blurb} ${sy.system}`, words)) return { score: 3, detail: sy.blurb };
  const step = sy.checks.find((c) => textHasWords(c.action, words));
  if (step) return { score: 3, detail: step.look };
  return null;
}

function symptomFits(sy: Symptom, model?: Model, year?: number | null) {
  if (!model || model.family === "Other") return true;
  return symptomOn(sy, model, year);
}

function taskFits(fit: "classic" | "gt" | undefined, model?: Model) {
  if (!model || model.family === "Other" || !fit) return true;
  if (fit === "classic") return model.alde;
  return model.family === "Globetrotter";
}

function screenFits(to: Screen, model?: Model, year?: number | null) {
  if (!model || model.family === "Other") return true;
  if (to.name === "symptom") {
    const sy = symptoms.find((s) => s.id === to.id);
    return !sy || symptomFits(sy, model, year);
  }
  if (to.name === "procedure") return procedureFits(to.id, model, year);
  if (to.name === "flow") {
    const flow = flows.find((f) => f.id === to.id);
    return !flow || flowFits(flow, model, year);
  }
  if (to.name === "codes" && to.appliance) return codeFits({ id: "", appliance: to.appliance }, model, year);
  return true;
}
