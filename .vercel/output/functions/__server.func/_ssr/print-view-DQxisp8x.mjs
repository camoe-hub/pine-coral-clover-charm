import { i as __toESM } from "../_runtime.mjs";
import { C as symptomOn, l as coachYear, m as modelById } from "./checklists-CYZuG9Db.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { tt as useApp } from "./store-DUUzfVvp.mjs";
import { p as Printer } from "../_libs/lucide-react.mjs";
import { u as PageTitle } from "./router-Cw9i5Ud6.mjs";
import { i as scopedLine } from "./year-scope-abgC83Lw.mjs";
import { n as symptoms, r as systems } from "./symptoms-BuRfv0Qj.mjs";
import { n as causes, t as causeFits } from "./causes-DZvk5kF7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/print-view-DQxisp8x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var levelWord = {
	stop: "Stop",
	soon: "Soon",
	watch: "Watch"
};
function PrintView() {
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const [onlyMine, setOnlyMine] = (0, import_react.useState)(true);
	const [system, setSystem] = (0, import_react.useState)("");
	const groups = (0, import_react.useMemo)(() => {
		const rows = symptoms.filter((s) => {
			if (system && s.system !== system) return false;
			if (!onlyMine) return true;
			return symptomOn(s, model, year);
		});
		return systems.map((name) => ({
			name,
			items: rows.filter((s) => s.system === name)
		})).filter((g) => g.items.length > 0);
	}, [
		onlyMine,
		system,
		model,
		year
	]);
	const count = groups.reduce((n, g) => n + g.items.length, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "print-sheet max-w-full overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print mb-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => window.print(),
						className: "flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-navy px-4 font-semibold text-on-navy",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {
							className: "size-5",
							"aria-hidden": true
						}), "Print or save as PDF"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "On iPhone: Print, then choose a printer or Save to Files. The tabs and this button stay off the page."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "checkbox",
						"aria-checked": onlyMine,
						onClick: () => setOnlyMine((v) => !v),
						className: "flex min-h-11 items-center gap-2 text-sm font-semibold text-accent",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid size-5 place-items-center rounded border ${onlyMine ? "border-navy bg-navy text-on-navy" : "border-line bg-sheet"}`,
								children: onlyMine ? "✓" : ""
							}),
							"Only jobs that fit ",
							model.short
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chip-row flex max-w-full gap-2 overflow-x-auto pb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
							on: system === "",
							onClick: () => setSystem(""),
							children: "All systems"
						}), systems.filter((name) => symptoms.some((s) => s.system === name && symptomOn(s, model, year, onlyMine))).map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
							on: system === name,
							onClick: () => setSystem(system === name ? "" : name),
							children: name
						}, name))]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-ink pb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-accent",
						children: "RivetCare · symptom, then check, then action"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
						className: "mt-1 font-display text-3xl text-ink",
						children: "Symptom checklist"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-ink",
						children: [
							model.name,
							onlyMine ? " · this coach only" : " · every system in the book",
							" · ",
							count,
							" symptoms"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Date ______________" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Miles _____________" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Site ______________" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Initials __________" })
						]
					})
				]
			}),
			system === "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "border-b border-line pb-1 font-display text-xl text-accent",
						children: "More than one thing is wrong"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink",
						children: "If you see more than one of these, start with the cause under them."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-2 text-sm text-ink",
						children: (onlyMine ? causes.filter((c) => causeFits(c, model, year)) : causes).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: c.signs.join(" · ") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: c.cause
						})] }, c.id))
					})
				]
			}),
			groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "border-b border-line pb-1 font-display text-xl text-accent",
					children: group.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-3",
					children: group.items.map((symptom) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "print-symptom",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-start gap-2 font-semibold text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box$1, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 break-words",
								children: [symptom.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs font-semibold uppercase tracking-wider text-muted",
									children: levelWord[symptom.level]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-1 space-y-1 pl-6",
							children: symptom.checks.map((check, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box$1, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 break-words",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold",
										children: [check.look, ". "]
									}), scopedLine(check.action, year)]
								})]
							}, `${symptom.id}-${index}`))
						})]
					}, symptom.id))
				})]
			}, group.name)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 border-t border-line pt-3 text-sm text-muted",
				children: "Work the checks in order. Stop means do not keep going until that one is fixed. Soon means it is close. Watch means look, not that it failed. Your model-year owner’s manual governs. Owner-reported steps are one person’s experience."
			})
		]
	});
}
function Box$1() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "print-box",
		"aria-hidden": true
	});
}
function Filter({ on, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `min-h-11 shrink-0 rounded-full border px-3 text-sm font-semibold ${on ? "border-navy bg-navy text-on-navy" : "border-line bg-sheet text-ink"}`,
		children
	});
}
//#endregion
export { PrintView };
