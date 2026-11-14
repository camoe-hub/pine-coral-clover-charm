import { n as tasks } from "./schedule-AmHNloLy.mjs";
import { t as procedureById } from "./procedures-C_lIH_E1.mjs";
import { r as figures } from "./figures-ittBo0Ud.mjs";
import { t as flowById } from "./flows-BMCYNTi_.mjs";
import { n as symptoms } from "./symptoms-BuRfv0Qj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/graph-1nw5qE5R.js
var flowBySystem = {
	Electrical: ["dead-12"],
	Plumbing: ["water"],
	"Water heater": ["hot"],
	Alde: ["alde-heat"],
	Furnace: ["furnace-flow"],
	"Air conditioning": ["ac-flow"],
	Refrigerator: ["fridge-flow"],
	"Running gear": ["brake-flow", "tires-flow"],
	Propane: ["lp-flow"],
	Leaks: ["body"],
	"Body & gear": ["body"]
};
var flowOverride = {
	"no-120": ["shore", "smartplug"],
	"inverter-hot": ["inverter-flow", "shore"],
	"inverter-dead": ["inverter-flow", "shore"],
	"pd-code": ["inverter-flow"],
	solar: [
		"solar-12",
		"solar-24",
		"solar-flow"
	],
	converter: ["charge", "dead-12"],
	"lithium-cold": ["charge"],
	app: ["myas"],
	"seven-way": ["brake-flow"],
	"brakes-lights": ["brake-flow"],
	brakes: ["brake-flow"],
	"brakes-lock": ["brake-flow"],
	tires: ["tires-flow"],
	bearing: ["tires-flow"],
	sway: ["tires-flow"],
	"black-tank": ["tanks"],
	"gray-shower": ["tanks"],
	"toilet-bowl": ["tanks"],
	leaks: ["body"],
	"soft-floor": ["body"],
	"shower-leak": ["body"],
	"slide-leak": ["body"],
	door: ["body"],
	"window-stuck": ["body"],
	"no-water": ["water", "winter"],
	"pump-runs": ["water"],
	"city-psi": ["pressure"],
	relief: ["pressure", "hot"],
	awning: ["awning-flow"],
	"lp-alarm": ["lp-flow"]
};
var procedureFlows = {
	valves: [
		"winter",
		"alde-heat",
		"maint-valves"
	],
	winterize: [
		"winter",
		"maint-drain",
		"maint-pink"
	],
	where: [
		"winter",
		"water",
		"maint-strainer"
	],
	tpms: ["tires-flow", "maint-tpms"],
	sanitize: [
		"water",
		"maint-sanitize",
		"maint-spring"
	],
	anode: ["hot"],
	descale: ["hot", "maint-truma"],
	alde: ["alde-heat", "maint-cushion"],
	"lp-test": ["lp-flow"],
	"ac-filter": ["ac-flow"],
	sealant: ["body"],
	lithium: [
		"dead-12",
		"charge",
		"maint-battery"
	],
	dump: [
		"tanks",
		"maint-dump",
		"maint-flush"
	],
	lube: ["body"],
	shore: ["shore", "smartplug"],
	furnace: ["furnace-flow"],
	lugs: ["tires-flow", "maint-lugs"],
	tires: ["tires-flow", "maint-lugs"],
	jack: ["tires-flow"],
	bearings: ["tires-flow", "maint-bearings"],
	brakes: ["brake-flow"],
	breakaway: ["brake-flow", "maint-breakaway"]
};
function flowsForSymptom(s) {
	return flowOverride[s.id] ?? flowBySystem[s.system] ?? [];
}
function figureHits(procIds, flowIds) {
	return figures.filter((f) => f.links.some((l) => l.to.name === "procedure" && procIds.includes(l.to.id) || l.to.name === "flow" && flowIds.includes(l.to.id)));
}
function jumpFigure(f) {
	return {
		key: `fig-${f.id}`,
		label: `${f.num.replace(/\.$/, "")} ${f.title}`,
		detail: "Figure",
		to: {
			name: "figure",
			id: f.id
		}
	};
}
function jumpSymptom(s) {
	return {
		key: `sy-${s.id}`,
		label: s.title,
		detail: `Fix · ${s.system}`,
		to: {
			name: "symptom",
			id: s.id,
			step: 0
		}
	};
}
function jumpsForSymptom(s) {
	const procs = s.procedures ?? [];
	const flowIds = flowsForSymptom(s);
	const out = [];
	for (const id of flowIds) {
		const flow = flowById(id);
		if (flow) out.push({
			key: `flow-${id}`,
			label: flow.title,
			detail: "Flowchart",
			to: {
				name: "flow",
				id
			}
		});
	}
	for (const id of procs) for (const t of tasks) if (t.procedureId === id) out.push({
		key: `task-${t.id}`,
		label: t.title,
		detail: "Maintenance",
		to: { name: "care" }
	});
	for (const f of figureHits(procs, flowIds)) out.push(jumpFigure(f));
	return dedupe(out);
}
function jumpsForProcedure(id) {
	const flowIds = procedureFlows[id] ?? [];
	const out = [];
	for (const fid of flowIds) {
		const flow = flowById(fid);
		if (flow) out.push({
			key: `flow-${fid}`,
			label: flow.title,
			detail: "Flowchart",
			to: {
				name: "flow",
				id: fid
			}
		});
	}
	for (const s of symptoms) if (s.procedures?.includes(id)) out.push(jumpSymptom(s));
	for (const t of tasks) if (t.procedureId === id) out.push({
		key: `task-${t.id}`,
		label: t.title,
		detail: "Maintenance",
		to: { name: "care" }
	});
	for (const f of figureHits([id], flowIds)) out.push(jumpFigure(f));
	return dedupe(out);
}
function jumpsForFlow(id) {
	const out = [];
	for (const [pid, flows] of Object.entries(procedureFlows)) {
		if (!flows.includes(id)) continue;
		const p = procedureById(pid);
		if (p) out.push({
			key: `proc-${pid}`,
			label: p.title,
			detail: "Procedure",
			to: {
				name: "procedure",
				id: pid
			}
		});
	}
	for (const s of symptoms) if (flowsForSymptom(s).includes(id)) out.push(jumpSymptom(s));
	for (const f of figureHits([], [id])) out.push(jumpFigure(f));
	return dedupe(out);
}
function jumpsForFigure(id) {
	const fig = figures.find((f) => f.id === id);
	if (!fig) return [];
	const procIds = fig.links.flatMap((l) => l.to.name === "procedure" ? [l.to.id] : []);
	const flowIds = fig.links.flatMap((l) => l.to.name === "flow" ? [l.to.id] : []);
	const out = [];
	for (const pid of procIds) {
		const p = procedureById(pid);
		if (p) out.push({
			key: `proc-${pid}`,
			label: p.title,
			detail: "Procedure",
			to: {
				name: "procedure",
				id: pid
			}
		});
		for (const t of tasks) if (t.procedureId === pid) out.push({
			key: `task-${t.id}`,
			label: t.title,
			detail: "Maintenance",
			to: { name: "care" }
		});
	}
	for (const fid of flowIds) {
		const flow = flowById(fid);
		if (flow) out.push({
			key: `flow-${fid}`,
			label: flow.title,
			detail: "Flowchart",
			to: {
				name: "flow",
				id: fid
			}
		});
	}
	for (const s of symptoms) {
		const procs = s.procedures ?? [];
		const flows = flowsForSymptom(s);
		if (procs.some((p) => procIds.includes(p)) || flows.some((f) => flowIds.includes(f))) out.push(jumpSymptom(s));
	}
	if (fig.links.some((l) => l.to.name === "care")) out.push({
		key: "care",
		label: "Maintenance schedule",
		detail: "Maintenance",
		to: { name: "care" }
	});
	return dedupe(out);
}
function dedupe(list) {
	const seen = /* @__PURE__ */ new Set();
	return list.filter((j) => {
		if (seen.has(j.key)) return false;
		seen.add(j.key);
		return true;
	});
}
//#endregion
export { jumpsForFigure, jumpsForFlow, jumpsForProcedure, jumpsForSymptom };
