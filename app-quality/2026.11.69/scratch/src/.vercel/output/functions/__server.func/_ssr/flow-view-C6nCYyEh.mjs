import { i as __toESM } from "../_runtime.mjs";
import { c as coachYear, d as flowFits, k as waterBrands, l as codeFits, o as coachHasAlde, p as modelById, y as procedureFits } from "./coach-KEaWY9VI.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as plateKeyForFlow, M as plateOnFlow, O as pathSteps, et as useApp, j as plateLabel } from "./store-C3gr-Jyz.mjs";
import { k as ChevronRight } from "../_libs/lucide-react.mjs";
import { _ as useBackLayer, c as hazardFlow, f as Btn, g as Pill, h as Notice, m as Kicker, p as Card, s as gasStopFlow } from "./routes-BL7pyKhp.mjs";
import { t as StepMark } from "./step-mark-BxG3L6bU.mjs";
import { AlsoInBook } from "./figure-view-DMLHB3W7.mjs";
import { i as waysFrom, n as flows, r as followFlow, t as flowById } from "./flows-BEXVNR5W.mjs";
import { jumpsForFlow } from "./graph-BL3hw7ba.mjs";
import { a as faultCodes, n as faultCodeExact, s as symptomForCode } from "./codes-DIyD6LV_.mjs";
//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/flow-view-C6nCYyEh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** The stop, written from the path that was taken. It does not add a code or a page that this stop does not name. */
function flowReport(input) {
	const steps = pathSteps(input.flow, input.trail);
	const checks = steps.length ? steps.map((step, i) => `${i + 1}. ${step.q}`).join("\n") : "No question was answered.";
	const answers = steps.length ? steps.map((step, i) => `${i + 1}. ${step.answer}`).join("\n") : "None.";
	const manual = [input.node.source, input.plate].filter(Boolean).join("\n") || "No manual page is cited for this stop.";
	const rows = [
		{
			label: "Reported symptom",
			text: input.flow.title
		},
		{
			label: "Checks performed",
			text: checks
		},
		{
			label: "Answers provided",
			text: answers
		},
		{
			label: "Likely problem areas",
			text: `${input.node.title.replace(/\.+$/, "")}. This is where the answers led, not a confirmed fault.`
		},
		{
			label: "Relevant fault codes",
			text: codesFor(input.node, input.model, input.year)
		},
		{
			label: "Recommended next steps",
			text: input.node.body.trim()
		},
		{
			label: "Relevant manual reference",
			text: manual
		},
		{
			label: "Technician escalation",
			text: escalate(input.node)
		},
		{
			label: "Confidence",
			text: confidence(input.node, steps.length)
		}
	];
	return {
		rows,
		log: fitLog(rows, input.coach, input.year)
	};
}
function codesFor(node, model, year) {
	if (!node.symptom) return "No fault code is tied to this stop.";
	const text = `${node.title} ${node.body}`;
	const related = faultCodes.filter((code) => symptomForCode(code) === node.symptom && codeFits(code, model, year));
	const named = related.filter((code) => mentions(text, code.code));
	if (named.length) return named.slice(0, 3).map((code) => `${code.code}, ${code.appliance}: ${code.meaning}`).join("\n");
	const appliances = [...new Set(related.map((code) => code.appliance))].slice(0, 3);
	if (!appliances.length) return "No fault code is tied to this stop.";
	return `None is named by this stop. Codes for ${appliances.join(", ")} are on the fault-code list if the panel shows one.`;
}
function mentions(text, code) {
	if (faultCodeExact({
		id: "",
		appliance: "",
		code,
		meaning: "",
		fix: ""
	}, text)) return true;
	const key = code.toLowerCase().replace(/[^a-z0-9]+/g, "");
	if (key.length < 4) return false;
	return text.toLowerCase().replace(/[^a-z0-9]+/g, "").includes(key);
}
function confidence(node, answered) {
	if (!answered) return "Low. No question was answered, so this stop is not confirmed.";
	if (/owner report/i.test(node.source ?? "") || /owner-reported/i.test(node.body)) return "Owner report. Not a factory finding, and not confirmed on this coach.";
	if (node.level === "stop") return "The stop itself is firm: do not continue. The cause is still not confirmed.";
	return "These answers only narrow the path. They do not confirm the fault.";
}
function escalate(node) {
	if (node.level === "stop") return "Stop. Do not keep troubleshooting. This stop is for a technician.";
	if (/technician|service center|dealer/i.test(node.body)) return "This stop already hands the job to a technician.";
	if (node.level === "soon") return "If the next step does not clear it, take this note to a technician.";
	return "An owner can try the next step. Gas, brakes, and shore power still go to a technician if you are not sure.";
}
function fitLog(rows, coach, year) {
	const full = write(rows, coach, year);
	if (full.length <= 800) return full;
	const text = write(rows.map((row) => row.label === "Checks performed" || row.label === "Answers provided" || row.label === "Recommended next steps" ? {
		...row,
		text: clip(row.text)
	} : row), coach, year);
	return text.length <= 800 ? text : `${text.slice(0, 780)}\nShortened to fit the log.`;
}
function write(rows, coach, year) {
	return [
		"Path taken, not a diagnosis.",
		year ? `${coach}, ${year}` : coach,
		"",
		...rows.map((row) => `${row.label}\n${row.text}`)
	].join("\n");
}
function clip(text) {
	return text.split("\n").slice(0, 4).map((line) => line.length > 140 ? `${line.slice(0, 139)}…` : line).join("\n");
}
var DEMAND_HEATERS = [
	"Girard GSWH-2",
	"Suburban ST-65RL",
	"Suburban IW60",
	"Truma AquaGo",
	"Fogatti",
	"Truma Combi"
];
function hotStart(id, brands, hasAlde) {
	if (id !== "hot" || hasAlde) return null;
	const tank = brands.has("Suburban tank") || brands.has("Atwood tank");
	return DEMAND_HEATERS.some((name) => brands.has(name)) && !tank ? "demand" : null;
}
function FlowsView() {
	const push = useApp((s) => s.push);
	const filter = useApp((s) => s.systemFilter);
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const [showAll, setShowAll] = (0, import_react.useState)(false);
	const fitted = flows.filter((f) => flowFits(f, model, year));
	const list = filter && !showAll ? fitted.filter((f) => f.system === filter) : fitted;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Yes, no, or not sure" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-display text-3xl text-ink",
			children: "Flowcharts"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "A shorter path through the same problems. The checks it opens are the source. Follow those if the wording ever disagrees."
		}),
		filter ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-sm text-ink",
			children: [list.length > 0 && !showAll ? `Showing ${filter}. ` : showAll ? `Showing every flowchart. ` : `No flowchart for ${filter}. `, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "font-semibold underline underline-offset-2",
				onClick: () => setShowAll((v) => !v),
				children: showAll ? `Only ${filter}` : "Show all"
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-2",
			children: list.map((flow) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => push({
					name: "flow",
					id: flow.id
				}),
				className: "flex w-full items-center gap-3 rounded-card border border-line bg-sheet px-3 py-3 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted",
							children: flow.system
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block font-semibold text-ink",
							children: flow.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-sm text-muted",
							children: flow.blurb
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 shrink-0 text-muted" })]
			}) }, flow.id))
		})
	] });
}
function FlowView({ id }) {
	const flow = flowById(id);
	const push = useApp((s) => s.push);
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const brands = waterBrands(model, year);
	const hasAlde = coachHasAlde(model, year);
	const setWinterPlace = useApp((s) => s.setWinterPlace);
	const remembered = flow && id === "winter" ? followFlow(flow, useApp.getState().winterPlace?.trail ?? []) : null;
	const [nodeId, setNodeId] = (0, import_react.useState)(remembered?.nodeId ?? hotStart(id, brands, hasAlde) ?? flow?.start ?? "");
	const [stack, setStack] = (0, import_react.useState)(remembered?.stack ?? []);
	const [trail, setTrail] = (0, import_react.useState)(remembered ? useApp.getState().winterPlace?.trail ?? [] : []);
	const [unsure, setUnsure] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setUnsure(false);
	}, [nodeId]);
	function popStep() {
		setStack((s) => {
			const prev = s[s.length - 1];
			if (!prev) return s;
			setNodeId(prev);
			setTrail((path) => {
				const next = path.slice(0, -1);
				if (id === "winter") setWinterPlace({
					page: "flow",
					trail: next
				});
				return next;
			});
			return s.slice(0, -1);
		});
	}
	useBackLayer(stack.length > 0, popStep, stack.length);
	(0, import_react.useEffect)(() => {
		if (id !== "winter") return;
		const saved = useApp.getState().winterPlace?.trail ?? [];
		setWinterPlace({
			page: "flow",
			trail: saved
		});
	}, [id, setWinterPlace]);
	if (!flow) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm",
		children: "That flowchart is not in this app."
	});
	const node = flow.nodes[nodeId];
	if (!node) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm",
		children: "That step is missing."
	});
	const aldeOnly = hasAlde && brands.size === 1 && brands.has("Alde 3030");
	const atwoodOnly = brands.size === 1 && brands.has("Atwood tank");
	const heaterUnnamed = model.family !== "Other" && flow.id === "hot" && brands.size === 0;
	const skipSuburban = aldeOnly && flow.id === "hot" && nodeId === "tank" && trail.length === 0;
	function remember(path) {
		if (id !== "winter") return;
		setWinterPlace({
			page: "flow",
			trail: path
		});
	}
	function choose(next, answer) {
		const dest = flow?.id === "hot" && next === "alde-instead" && !hasAlde ? "unknown-heater" : next;
		const path = [...trail, answer];
		setStack((s) => [...s, nodeId]);
		setTrail(path);
		setNodeId(dest);
		remember(path);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Kicker, { children: [
			flow.system,
			" · step ",
			trail.length + 1
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-display text-3xl text-ink",
			children: flow.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm text-muted",
			children: [
				model.name,
				" · ",
				year ?? "Year not set"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlateLine, { flowId: flow.id }),
		trail.length === 0 && gasStopFlow(flow.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm font-semibold text-ink",
			children: "If you smell propane, or a CO or LP alarm is sounding: shut the cylinders, ventilate, leave, and do not flip switches."
		}),
		trail.length === 0 && hazardFlow(flow.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "stop",
				title: "Stop",
				children: "This is an aid, not the manual. Gas, brakes, and shore power can hurt you. If you are not sure, stop."
			})
		}),
		trail.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "line",
				onClick: popStep,
				children: "Back one step"
			})
		}),
		flow.id === "hot" && aldeOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-ink",
			children: "Hot water on this Classic is the Alde. It is not a Suburban tank or a Suburban tankless."
		}),
		flow.id === "hot" && atwoodOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-ink",
			children: "This Classic year is an Atwood tank in the fitment notes, not a Suburban. Do not install a Suburban anode."
		}),
		heaterUnnamed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-ink",
			children: "This year does not name the water heater. Do not assume Suburban, Girard, or Truma. Read the plate, then use a question only if it matches that plate."
		}),
		skipSuburban ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl text-ink",
					children: "Open the Alde checks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "A Suburban flowchart is the wrong heater for this coach."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						className: "w-full",
						onClick: () => push({
							name: "flow",
							id: "alde-heat"
						}),
						children: "Alde flowchart"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "line",
						className: "w-full",
						onClick: () => choose("demand", "Not the factory heater"),
						children: "This coach was changed"
					})]
				})
			]
		}) : node.type === "ask" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl text-ink",
					children: node.q
				}),
				node.detail && !(flow.id === "hot" && nodeId === "demand" && !hasAlde) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-base text-ink",
					children: node.detail
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepMark, { text: `${node.q} ${node.detail ?? ""}` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `mt-4 grid gap-2 ${waysFrom(flow, nodeId) ? "grid-cols-3" : "grid-cols-2"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "line",
							className: "w-full px-2",
							onClick: () => choose(node.yes, "Yes"),
							children: "Yes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "line",
							className: "w-full px-2",
							onClick: () => choose(node.no, "No"),
							children: "No"
						}),
						waysFrom(flow, nodeId) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "line",
							className: "w-full px-2",
							"aria-expanded": unsure,
							onClick: () => setUnsure(true),
							children: "Not sure"
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotSure, {
					flow,
					nodeId,
					open: unsure
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(End, {
			flow,
			trail,
			node,
			onOpen: node.procedure && procedureFits(node.procedure, model, year) ? () => push({
				name: "procedure",
				id: node.procedure
			}) : node.symptom ? () => push({
				name: "symptom",
				id: node.symptom,
				step: 0
			}) : void 0,
			label: node.procedure ? "Open the winterizing procedure" : "Open the full checks"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex gap-2",
			children: [trail.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "min-w-0 flex-1 self-center text-sm text-muted",
				children: ["Path: ", trail.join(" → ")]
			}), nodeId !== flow.start && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "ghost",
				onClick: () => {
					setTrail([]);
					setStack([]);
					setNodeId(flow.start);
					remember([]);
				},
				children: "Start over"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlsoInBook, { items: jumpsForFlow(flow.id).filter((item) => item.to.name !== "procedure" || procedureFits(item.to.id, model, year)) })
		})
	] });
}
function NotSure({ flow, nodeId, open }) {
	const push = useApp((s) => s.push);
	const ways = waysFrom(flow, nodeId);
	if (!ways || !open) return null;
	const shared = ways.shared;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 border-t border-rule pt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink",
				children: "Nothing is chosen yet. Read both, then tap Yes or No only if one of them is right."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm font-semibold text-ink",
				children: "If yes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink",
				children: ways.yes.kind === "ask" ? ways.yes.label : `Stops at: ${ways.yes.label}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm font-semibold text-ink",
				children: "If no"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink",
				children: ways.no.kind === "ask" ? ways.no.label : `Stops at: ${ways.no.label}`
			}),
			shared ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "line",
				className: "mt-3 w-full",
				onClick: () => {
					if (shared.symptom) push({
						name: "symptom",
						id: shared.symptom,
						step: 0
					});
					else if (shared.procedure) push({
						name: "procedure",
						id: shared.procedure
					});
				},
				children: "Open the checks either answer would use"
			}) : null
		]
	});
}
function PlateLine({ flowId }) {
	const plates = useApp((s) => s.plates);
	const push = useApp((s) => s.push);
	const key = plateKeyForFlow(flowId);
	if (!key) return null;
	const note = plateOnFlow(flowId, plates);
	if (!note) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 text-sm text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"No ",
			plateLabel(key).toLowerCase(),
			" plate saved."
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "min-h-11 font-semibold text-accent",
			onClick: () => push({ name: "specs" }),
			children: "Read it off the unit"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-ink",
			children: note.line
		}), note.warn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-semibold text-ink",
			children: note.warn
		}) : null]
	});
}
function PathNote({ flow, trail, node }) {
	const addNote = useApp((s) => s.addNote);
	const flash = useApp((s) => s.flash);
	const model = modelById(useApp((s) => s.modelId));
	const nickname = useApp((s) => s.nickname);
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const plate = plateOnFlow(flow.id, useApp((s) => s.plates));
	const [saved, setSaved] = (0, import_react.useState)(null);
	const [logged, setLogged] = (0, import_react.useState)(false);
	async function handOff(text, already) {
		if (typeof navigator.share === "function") try {
			await navigator.share({
				title: "Repair note",
				text
			});
			flash(already ? "Already in notes" : "Saved in notes");
			return;
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") {
				flash(already ? "Already in notes" : "Saved in notes");
				return;
			}
		}
		try {
			await navigator.clipboard.writeText(text);
			flash(already ? "Copied" : "Copied. Saved in notes.");
		} catch {
			flash("Saved in notes");
		}
	}
	function report() {
		return flowReport({
			flow,
			trail,
			node,
			model,
			year,
			coach: nickname || model.name,
			plate: plate?.line
		});
	}
	async function saveLog() {
		const text = report().log;
		const full = useApp.getState().log.length >= 200;
		if (!await Promise.resolve(useApp.getState().addLog(text, void 0, flow.title.slice(0, 80), true))) {
			flash("Could not save that in the service log.");
			return;
		}
		setLogged(true);
		flash(full ? "Saved in the service log. The oldest entry was removed." : "Saved in the service log.");
	}
	async function save() {
		const text = report().log;
		if (!saved && !await Promise.resolve(addNote(text))) return;
		if (!saved) setSaved(text);
		handOff(text, !!saved);
	}
	const rows = report().rows;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 border-t border-rule pt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 first:mt-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-sm font-semibold text-ink",
					children: row.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-0.5 whitespace-pre-line text-sm text-ink",
					children: row.text
				})]
			}, row.label)) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "line",
				className: "mt-4",
				onClick: saveLog,
				disabled: logged,
				children: logged ? "In the service log" : "Save this report in the service log"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "line",
				className: "mt-2",
				onClick: save,
				children: "Save this path"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "The log line says this is a path taken, not a diagnosis. It names a fault code or a manual page only when this stop already does. Nothing is uploaded."
			})
		]
	});
}
function End({ flow, trail, node, onOpen, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-4 p-4",
		children: [
			node.level && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
				tone: node.level === "stop" ? "danger" : node.level === "soon" ? "warn" : "line",
				children: node.level === "stop" ? "Stop" : node.level === "soon" ? "Soon" : "Watch"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-2xl text-ink",
				children: node.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepMark, { text: `${node.title} ${node.body}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PathNote, {
				flow,
				trail,
				node
			}),
			onOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					onClick: onOpen,
					children: label
				})
			})
		]
	});
}
//#endregion
export { FlowView, FlowsView };
