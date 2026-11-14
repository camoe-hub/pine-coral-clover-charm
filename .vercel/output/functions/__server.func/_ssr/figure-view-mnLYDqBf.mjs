import { i as __toESM } from "../_runtime.mjs";
import { n as tasks, t as cadenceLabel } from "./schedule-AmHNloLy.mjs";
import { l as coachYear, m as modelById } from "./checklists-CYZuG9Db.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { tt as useApp } from "./store-DUUzfVvp.mjs";
import { c as Kicker, u as PageTitle } from "./router-Cw9i5Ud6.mjs";
import { n as figureById, r as figures, t as figureApplies } from "./figures-ittBo0Ud.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/figure-view-mnLYDqBf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function circuitSheet(_id) {
	return null;
}
var order = [
	"Schedule",
	"Wheels, tires, and brakes",
	"Water and the body",
	"Heat and power",
	"Schematics",
	"Flowcharts",
	"Decision charts",
	"Where things are"
];
function DiagramsGone() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Not in this edition" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			className: "mt-1 font-display text-3xl text-ink",
			children: "Diagrams"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-base text-ink",
			children: "The pictures are not in this copy. The checks are written out on Fix and in Procedures. The drawing, if you need it, is in the manual for this coach."
		})
	] });
}
function FiguresView() {
	const push = useApp((s) => s.push);
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const [all, setAll] = (0, import_react.useState)(false);
	const shown = all ? figures : figures.filter((f) => figureApplies(f.id, model, year));
	const hidden = figures.filter((f) => !figureApplies(f.id, model, year)).length;
	if (!figures.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiagramsGone, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "From the guide" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			className: "mt-1 font-display text-3xl text-ink",
			children: "Figures"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: all ? "Every chart in the guide." : `Charts for this ${model.short}.`
		}),
		hidden > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setAll((v) => !v),
			className: "mt-2 min-h-11 text-sm font-semibold text-accent",
			children: all ? `Only this ${model.short}` : `Show all diagrams`
		}),
		order.map((group) => {
			const items = shown.filter((f) => f.group === group);
			if (!items.length) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "px-1 font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
					children: group
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: items.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => push({
							name: "figure",
							id: f.id
						}),
						className: "flex w-full items-center gap-3 rounded-card border border-line bg-sheet p-2 text-left",
						children: [f.src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: f.src,
							alt: "",
							className: "h-16 w-16 shrink-0 rounded-lg border border-line bg-paper object-contain"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-paper px-1 text-center text-sm font-semibold leading-tight text-ink",
							children: figureMark(f.num)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs font-semibold uppercase tracking-wider text-muted",
								children: f.num
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-sm font-semibold text-ink",
								children: f.title
							})]
						})]
					}) }, f.id))
				})]
			}, group);
		})
	] });
}
function AlsoInBook({ items }) {
	const push = useApp((s) => s.push);
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const shown = items.filter((item) => item.to.name !== "figure" || figureApplies(item.to.id, model, year));
	if (!shown.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		open: true,
		className: "rounded-card border border-line bg-sheet",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
			className: "flex min-h-12 cursor-pointer list-none items-center px-3 py-2 [&::-webkit-details-marker]:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-semibold text-ink",
				children: "Related"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-1 px-2 pb-2",
			children: shown.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => push(item.to),
				className: "min-h-11 w-full rounded-lg px-2 py-2 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs font-semibold uppercase tracking-wider text-muted",
					children: item.detail
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm font-semibold text-ink",
					children: item.label
				})]
			}) }, item.key))
		})]
	});
}
function FigureView({ id }) {
	const fig = figureById(id);
	const sheet = circuitSheet(id);
	const [scale, setScale] = (0, import_react.useState)(1);
	if (!fig) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiagramsGone, {});
	const wide = scale > 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: fig.group }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			className: "mt-1 font-display text-3xl text-ink",
			children: fig.num
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-base text-ink",
			children: fig.title
		}),
		fig.id === "p14-1" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-ink",
			children: "The chart is a picture of type that is too small to read. These are the same intervals."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 divide-y divide-rule overflow-hidden rounded-card border border-line bg-sheet",
			children: tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-ink",
					children: task.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-sm text-ink",
					children: cadenceLabel(task.cadence)
				})]
			}, task.id))
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy",
					onClick: () => setScale((n) => Math.min(3, Math.round((n + .5) * 10) / 10)),
					"aria-label": "Make this diagram larger",
					children: "Larger"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 rounded-full border border-line px-4 text-sm font-semibold text-ink disabled:opacity-40",
					disabled: !wide,
					onClick: () => setScale(1),
					children: "Fit"
				})]
			}),
			sheet ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircuitTable, {
				sheet,
				scale
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 overflow-auto rounded-card border border-line bg-sheet",
				style: { touchAction: "pinch-zoom" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: fig.src,
					alt: fig.title,
					style: {
						width: `${scale * 100}%`,
						maxWidth: "none",
						touchAction: "pinch-zoom"
					},
					className: "block h-auto"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: sheet ? "Larger only makes this table easier to read. It is not a factory page." : "The title above is the text. Larger only magnifies the drawing. It is not a factory page."
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FigureJumps, { id })
		})
	] });
}
function figureMark(num) {
	return /([0-9]+(?:\.[0-9]+)?[a-z]?)/i.exec(num)?.[1] ?? num;
}
function CircuitTable({ sheet, scale }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 min-w-0 text-ink",
		style: { fontSize: `${scale}em` },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-ink",
				children: sheet.heading
			}),
			sheet.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-3 min-w-0 overflow-hidden rounded-card border border-line bg-sheet",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "bg-paper px-3 py-2 text-[0.875em] font-semibold text-ink",
					children: section.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: section.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "min-w-0 border-t border-line px-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "min-w-0 font-semibold",
								children: ["Circuit ", row.circuit]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "shrink-0 text-right text-[0.875em]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mr-1 font-semibold uppercase tracking-wider text-muted",
									children: "Amps"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold tabular-nums",
									children: row.amps
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[0.875em]",
							children: row.loads
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[0.875em] text-muted",
							children: [
								row.breaker,
								" · Romex ",
								row.romex
							]
						})
					]
				}, `${section.label}-${row.circuit}`)) })]
			}, section.label)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[0.875em] text-muted",
				children: sheet.note
			})
		]
	});
}
function FigureJumps({ id }) {
	const [items, setItems] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		import("./graph-1nw5qE5R.mjs").then((mod) => {
			if (live) setItems(mod.jumpsForFigure(id));
		}).catch(() => {
			if (live) setItems([]);
		});
		return () => {
			live = false;
		};
	}, [id]);
	if (!items) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlsoInBook, { items });
}
function SheetView(_props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiguresView, {});
}
//#endregion
export { AlsoInBook, FigureView, FiguresView, SheetView };
