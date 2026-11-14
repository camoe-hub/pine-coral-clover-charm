import { i as __toESM } from "../_runtime.mjs";
import { S as symptomOn, c as coachYear, p as modelById } from "./coach-KEaWY9VI.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { et as useApp } from "./store-C3gr-Jyz.mjs";
import { g as Pill, m as Kicker } from "./routes-BL7pyKhp.mjs";
import { i as scopedLine, r as scopeLead } from "./year-scope-abgC83Lw.mjs";
import { n as symptoms, r as systems, t as symptomById } from "./symptoms-BuRfv0Qj.mjs";
//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/table-view-C_KldGH5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var levelWord = {
	stop: "Stop",
	soon: "Soon",
	watch: "Watch"
};
var levelTone = {
	stop: "danger",
	soon: "warn",
	watch: "line"
};
function fitsModel(fit, family, alde) {
	if (!fit || family === "Other") return true;
	if (fit === "classic") return alde;
	return family === "Globetrotter";
}
/** Forum notes and contested write-ups are not check/action rows. */
function isTip(symptom) {
	if (symptom.title.toLowerCase().includes("contested topic")) return true;
	return symptom.checks.some((check) => {
		const look = check.look.trim().toLowerCase();
		const action = check.action.trim().toLowerCase();
		return look.startsWith("what owners") || action.startsWith("owner-reported") || action.startsWith("manufacturer + owner-reported");
	});
}
function TableView({ id, step }) {
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const push = useApp((s) => s.push);
	const storedSystem = useApp((s) => s.systemFilter);
	const focus = id ? symptomById(id) : void 0;
	const [onlyMine, setOnlyMine] = (0, import_react.useState)(() => focus ? fitsModel(focus.fit, model.family, model.alde) : true);
	const [system, setSystem] = (0, import_react.useState)(focus?.system ?? storedSystem);
	const [showRest, setShowRest] = (0, import_react.useState)(false);
	function pickSystem(next) {
		setSystem(next);
		if (!focus) useApp.getState().setSystem(next);
	}
	const checks = (0, import_react.useMemo)(() => symptoms.filter((s) => !isTip(s) || s.id === id), [id]);
	const groups = (0, import_react.useMemo)(() => {
		const rows = checks.filter((s) => {
			if (focus && !showRest) return s.id === focus.id;
			if (focus && showRest && s.system !== focus.system) return false;
			if (!focus && system && s.system !== system) return false;
			if (s.id === id) return true;
			return symptomOn(s, model, year, onlyMine);
		});
		return systems.map((name) => ({
			name,
			items: rows.filter((s) => s.system === name).sort((a, b) => a.id === id ? -1 : b.id === id ? 1 : 0)
		})).filter((g) => g.items.length > 0);
	}, [
		checks,
		onlyMine,
		system,
		model,
		year,
		focus,
		showRest,
		id
	]);
	const neighbors = focus ? checks.filter((s) => s.system === focus.system && s.id !== focus.id).length : 0;
	(0, import_react.useEffect)(() => {
		if (focus || !system) return;
		document.getElementById("table-system")?.querySelector("[aria-pressed='true']")?.scrollIntoView({
			inline: "center",
			block: "nearest"
		});
	}, [system, focus]);
	(0, import_react.useEffect)(() => {
		if (!id) return;
		const row = step != null ? document.getElementById(`table-${id}-${step}`) : null;
		const card = document.getElementById(`table-${id}`);
		(row ?? card)?.scrollIntoView({ block: "center" });
	}, [
		id,
		step,
		showRest
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "A view of the Fix checks" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-display text-3xl text-ink",
			children: focus && !showRest ? focus.title : "Checks table"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: focus ? `${focus.system}. The highlighted row is the check you were on.` : system ? `Showing ${system}. Symptom, check, and action only. Forum notes are not listed here.` : "Symptom, check, and action only. Forum notes are not listed here. Stop means do not keep going. Soon means it is close. Watch means look, not that it failed."
		}),
		focus && !showRest && neighbors > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setShowRest(true),
			className: "mt-3 min-h-11 text-sm font-semibold text-accent",
			children: ["Rest of ", focus.system]
		}),
		!focus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOnlyMine((v) => !v),
			className: "mt-3 flex min-h-11 items-center gap-2 text-sm font-semibold text-accent",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `grid size-5 place-items-center rounded border ${onlyMine ? "border-navy bg-navy text-on-navy" : "border-line bg-sheet"}`,
					children: onlyMine ? "✓" : ""
				}),
				"Only jobs that fit ",
				model.short
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: "table-system",
			className: "chip-row -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1",
			role: "group",
			"aria-label": "System",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
				on: system === "",
				onClick: () => pickSystem(""),
				children: "All"
			}), systems.filter((name) => symptoms.some((s) => s.system === name && symptomOn(s, model, year, onlyMine))).map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
				on: system === name,
				onClick: () => pickSystem(system === name ? "" : name),
				children: name
			}, name))]
		})] }),
		groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6",
			children: [(showRest || !focus) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl text-accent",
				children: group.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-3",
				children: group.items.map((symptom) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SymptomTable, {
					symptom,
					year,
					activeId: id,
					step,
					onOpen: () => push({
						name: "symptom",
						id: symptom.id,
						step: 0
					})
				}, symptom.id))
			})]
		}, group.name))
	] });
}
function SymptomTable({ symptom, year, activeId, step, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: `table-${symptom.id}`,
		className: "rounded-card border border-line bg-sheet",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onOpen,
			className: "flex w-full items-start justify-between gap-3 px-3 py-3 text-left",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-semibold text-ink",
				children: symptom.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 block text-sm text-muted",
				children: scopeLead(symptom.blurb, year)
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
				tone: levelTone[symptom.level],
				children: levelWord[symptom.level]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full border-collapse text-left text-sm max-sm:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "max-sm:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "bg-paper text-xs font-semibold uppercase tracking-wider text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "w-[40%] px-3 py-2 font-semibold",
							children: "Check"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-semibold",
							children: "Action"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "max-sm:block",
					children: symptom.checks.map((check, i) => {
						const here = symptom.id === activeId && i === step;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							id: `table-${symptom.id}-${i}`,
							className: `align-top max-sm:block${here ? " bg-blue-soft" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-t border-line px-3 py-2 font-semibold text-ink wrap-anywhere max-sm:block max-sm:pb-0",
								children: check.look
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "border-t border-line px-3 py-2 text-ink wrap-anywhere max-sm:block max-sm:border-t-0 max-sm:pt-1",
								children: scopedLine(check.action, year)
							})]
						}, `${check.look}-${i}`);
					})
				})]
			})
		})]
	});
}
function Filter({ on, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		"aria-pressed": on,
		className: `min-h-11 min-w-11 shrink-0 rounded-full border px-3 text-sm font-semibold ${on ? "border-navy bg-navy text-on-navy" : "border-line bg-sheet text-ink"}`,
		children
	});
}
//#endregion
export { TableView };
