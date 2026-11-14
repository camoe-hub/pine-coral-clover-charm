import { codeFits } from "@/data/coach";
import { faultCodeExact, faultCodes, symptomForCode } from "@/data/codes";
import type { EndNode, Flow } from "@/data/flows";
import type { Model } from "@/data/models";
import { pathSteps } from "@/lib/plates";

export type ReportRow = { label: string; text: string };

/** The stop, written from the path that was taken. It does not add a code or a page that this stop does not name. */
export function flowReport(input: {
  flow: Flow;
  trail: string[];
  node: EndNode;
  model: Model;
  year: number | null;
  coach: string;
  plate?: string;
}): { rows: ReportRow[]; log: string } {
  const steps = pathSteps(input.flow, input.trail);
  const checks = steps.length ? steps.map((step, i) => `${i + 1}. ${step.q}`).join("\n") : "No question was answered.";
  const answers = steps.length ? steps.map((step, i) => `${i + 1}. ${step.answer}`).join("\n") : "None.";
  const manual = [input.node.source, input.plate].filter(Boolean).join("\n") || "No manual page is cited for this stop.";
  const rows: ReportRow[] = [
    { label: "Reported symptom", text: input.flow.title },
    { label: "Checks performed", text: checks },
    { label: "Answers provided", text: answers },
    { label: "Likely problem areas", text: `${input.node.title.replace(/\.+$/, "")}. This is where the answers led, not a confirmed fault.` },
    { label: "Relevant fault codes", text: codesFor(input.node, input.model, input.year) },
    { label: "Recommended next steps", text: input.node.body.trim() },
    { label: "Relevant manual reference", text: manual },
    { label: "Technician escalation", text: escalate(input.node) },
    { label: "Confidence", text: confidence(input.node, steps.length) },
  ];
  return { rows, log: fitLog(rows, input.coach, input.year) };
}

function codesFor(node: EndNode, model: Model, year: number | null) {
  if (!node.symptom) return "No fault code is tied to this stop.";
  const text = `${node.title} ${node.body}`;
  const related = faultCodes.filter((code) => symptomForCode(code) === node.symptom && codeFits(code, model, year));
  const named = related.filter((code) => mentions(text, code.code));
  if (named.length) return named.slice(0, 3).map((code) => `${code.code}, ${code.appliance}: ${code.meaning}`).join("\n");
  const appliances = [...new Set(related.map((code) => code.appliance))].slice(0, 3);
  if (!appliances.length) return "No fault code is tied to this stop.";
  return `None is named by this stop. Codes for ${appliances.join(", ")} are on the fault-code list if the panel shows one.`;
}

function mentions(text: string, code: string) {
  if (faultCodeExact({ id: "", appliance: "", code, meaning: "", fix: "" }, text)) return true;
  const key = code.toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (key.length < 4) return false;
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "").includes(key);
}

function confidence(node: EndNode, answered: number) {
  if (!answered) return "Low. No question was answered, so this stop is not confirmed.";
  if (/owner report/i.test(node.source ?? "") || /owner-reported/i.test(node.body)) return "Owner report. Not a factory finding, and not confirmed on this coach.";
  if (node.level === "stop") return "The stop itself is firm: do not continue. The cause is still not confirmed.";
  return "These answers only narrow the path. They do not confirm the fault.";
}

function escalate(node: EndNode) {
  if (node.level === "stop") return "Stop. Do not keep troubleshooting. This stop is for a technician.";
  if (/technician|service center|dealer/i.test(node.body)) return "This stop already hands the job to a technician.";
  if (node.level === "soon") return "If the next step does not clear it, take this note to a technician.";
  return "An owner can try the next step. Gas, brakes, and shore power still go to a technician if you are not sure.";
}

function fitLog(rows: ReportRow[], coach: string, year: number | null) {
  const full = write(rows, coach, year);
  if (full.length <= 800) return full;
  const short = rows.map((row) =>
    row.label === "Checks performed" || row.label === "Answers provided" || row.label === "Recommended next steps"
      ? { ...row, text: clip(row.text) }
      : row,
  );
  const text = write(short, coach, year);
  return text.length <= 800 ? text : `${text.slice(0, 780)}\nShortened to fit the log.`;
}

function write(rows: ReportRow[], coach: string, year: number | null) {
  const who = year ? `${coach}, ${year}` : coach;
  return ["Path taken, not a diagnosis.", who, "", ...rows.map((row) => `${row.label}\n${row.text}`)].join("\n");
}

function clip(text: string) {
  return text
    .split("\n")
    .slice(0, 4)
    .map((line) => (line.length > 140 ? `${line.slice(0, 139)}…` : line))
    .join("\n");
}
