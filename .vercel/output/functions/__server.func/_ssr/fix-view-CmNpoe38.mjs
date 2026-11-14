import { i as __toESM } from "../_runtime.mjs";
import { C as symptomOn, k as waterBrands, l as coachYear, m as modelById, s as coachHasAlde, x as recalls } from "./checklists-CYZuG9Db.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { tt as useApp } from "./store-DUUzfVvp.mjs";
import { E as Code, S as Flame, i as Wind, j as Check, k as ChevronRight, s as Snowflake, t as Zap, w as Droplets } from "../_libs/lucide-react.mjs";
import { a as Btn, c as Kicker, d as Pill, o as Card, u as PageTitle } from "./router-Cw9i5Ud6.mjs";
import { s as useBackLayer } from "./routes-xIOD81ex.mjs";
import { t as procedureById } from "./procedures-C_lIH_E1.mjs";
import { t as StepMark } from "./step-mark-BUUGaPLO.mjs";
import { r as scopeLead } from "./year-scope-abgC83Lw.mjs";
import { t as ScopedCopy } from "./scoped-copy-Cx2pNeOk.mjs";
import { AlsoInBook } from "./figure-view-mnLYDqBf.mjs";
import { n as symptoms, r as systems, t as symptomById } from "./symptoms-BuRfv0Qj.mjs";
import { jumpsForSymptom } from "./graph-1nw5qE5R.mjs";
import { n as causes, t as causeFits } from "./causes-DZvk5kF7.mjs";
import { t as partById } from "./parts-BQFqy33o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fix-view-CmNpoe38.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Symptoms that stay in the data, but are not their own row on Troubleshoot. */
var foldedInto = {
	"inverter-hot": "no-120",
	"inverter-dead": "no-120",
	"pd-code": "no-120",
	"st-hot": "tankless",
	"st-code": "tankless",
	"furnace-flash": "furnace",
	"alde-cold": "alde",
	"alde-fault": "alde",
	"ac-drip": "ac",
	"ac-warm": "ac",
	"ac-soft": "ac",
	"ac-stat": "ac",
	"fridge-flash": "fridge",
	"fridge-yellow": "fridge",
	"brakes-lights": "brakes",
	"brakes-lock": "brakes",
	sway: "tires",
	"lp-alarm": "lp",
	"soft-floor": "leaks",
	"fan-lid": "fan-jack",
	"vent-fan": "fan-jack"
};
function foldedParent(id) {
	return foldedInto[id];
}
function foldedChildren(id) {
	return Object.entries(foldedInto).filter(([, parent]) => parent === id).map(([child]) => child);
}
var starts = [
	{
		id: "no-12v",
		title: "No 12 V",
		detail: "Nothing works, the converter, solar, or only the jack",
		ask: "What is actually dead?",
		choices: [
			{
				label: "Nothing has 12 V",
				symptom: "no-12v"
			},
			{
				label: "Plugged in, and the batteries are not charging",
				symptom: "converter"
			},
			{
				label: "Solar is in the sun and nothing is charging",
				symptom: "solar"
			},
			{
				label: "Only the tongue jack is dead",
				symptom: "fan-jack",
				step: 1
			}
		]
	},
	{
		id: "no-water",
		title: "No water",
		detail: "The pump will not prime, or the city hose",
		symptom: "no-water"
	},
	{
		id: "hot",
		title: "No hot water",
		detail: "The heater named for this coach",
		ask: "Which heater is in this coach?",
		choices: [
			{
				label: "Tank heater",
				symptom: "no-hot-tank"
			},
			{
				label: "Tankless",
				symptom: "tankless"
			},
			{
				label: "Alde, on a Classic",
				symptom: "alde"
			}
		]
	},
	{
		id: "heat",
		title: "No heat",
		detail: "The heat this coach uses",
		ask: "What heats the coach?",
		choices: [{
			label: "Furnace",
			symptom: "furnace"
		}, {
			label: "Alde, on a Classic",
			symptom: "alde"
		}]
	},
	{
		id: "climate",
		title: "Fridge or air conditioner",
		detail: "Warm box, no cool air, a drip",
		ask: "Which one?",
		choices: [{
			label: "Fridge",
			symptom: "fridge"
		}, {
			label: "Air conditioner",
			symptom: "ac"
		}]
	},
	{
		id: "brakes",
		title: "Brakes",
		detail: "Weak, grabby, or one wheel locking",
		symptom: "brakes"
	},
	{
		id: "leak",
		title: "A leak",
		detail: "Rain, plumbing, or a soft floor",
		symptom: "leaks"
	}
];
function heaterName(name) {
	if (name === "Alde 3030") return "Alde";
	if (name === "Girard GSWH-2") return "Girard tankless";
	if (name === "Suburban tank") return "Tank heater";
	if (name === "Atwood tank") return "Atwood tank";
	if (name === "Suburban ST-65RL" || name === "Suburban IW60") return "Suburban tankless";
	if (name === "Truma Combi") return "Truma Combi";
	if (name === "Truma AquaGo") return "Truma tankless";
	if (name === "Fogatti") return "Fogatti tankless";
	return name;
}
var startIcon = {
	"no-12v": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-5" }),
	"no-water": /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "size-5" }),
	hot: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-5" }),
	climate: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snowflake, { className: "size-5" }),
	brakes: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wind, { className: "size-5" }),
	heat: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-5" }),
	leak: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "size-5" })
};
function FixView() {
	const filter = useApp((s) => s.systemFilter);
	const setSystem = useApp((s) => s.setSystem);
	const model = modelById(useApp((s) => s.modelId));
	const vin = useApp((s) => s.vin);
	const year = coachYear(vin, useApp((s) => s.modelYear));
	const push = useApp((s) => s.push);
	const [onlyMine, setOnlyMine] = (0, import_react.useState)(true);
	const [q, setQ] = (0, import_react.useState)("");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [searched, setSearched] = (0, import_react.useState)("");
	const [searchDown, setSearchDown] = (0, import_react.useState)(false);
	const [openMore, setOpenMore] = (0, import_react.useState)(null);
	const [openStart, setOpenStart] = (0, import_react.useState)(null);
	useBackLayer(openStart !== null, () => setOpenStart(null));
	(0, import_react.useEffect)(() => {
		if (!q.trim()) return;
		let cancel = false;
		const timer = window.setTimeout(() => {
			const miss = () => {
				if (cancel) return;
				setHits([]);
				setSearched(q);
				setSearchDown(true);
			};
			import("./search-Dg-MeXp4.mjs").then(({ searchAll, searchSaved, savedRowsFrom, mergeHits }) => {
				if (cancel) return;
				import("./weights-DTEOTqeP.mjs").then((n) => n.C).then((n) => n.E).then(({ weightSearchBlob }) => {
					if (cancel) return;
					const live = useApp.getState();
					const saved = searchSaved(q, savedRowsFrom({
						notes: live.notes,
						log: live.log,
						weights: weightSearchBlob(live.modelId)
					}));
					setHits(mergeHits(saved, searchAll(q, model, year)));
					setSearched(q);
					setSearchDown(false);
				}).catch(miss);
			}).catch(miss);
		}, 150);
		return () => {
			cancel = true;
			window.clearTimeout(timer);
		};
	}, [
		q,
		model,
		year
	]);
	const list = (0, import_react.useMemo)(() => {
		return symptoms.filter((s) => {
			if (filter && s.system !== filter) return false;
			return symptomOn(s, model, year, onlyMine);
		});
	}, [
		filter,
		onlyMine,
		model,
		year
	]);
	const brands = waterBrands(model, year);
	const hasAlde = coachHasAlde(model, year);
	const aldeOnly = hasAlde && brands.size === 1 && brands.has("Alde 3030");
	const shownSystems = systems.filter((name) => symptoms.some((s) => s.system === name && symptomOn(s, model, year, onlyMine)));
	const systemChips = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[13px] font-semibold uppercase tracking-[0.14em] text-muted",
			children: "By system"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "chip-row chip-scroll chip-fade -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1",
			role: "group",
			"aria-label": "System",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				on: filter === "",
				onClick: () => setSystem(""),
				children: "Start"
			}), shownSystems.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				on: filter === name,
				onClick: () => setSystem(filter === name ? "" : name),
				children: name
			}, name))]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "sr-only",
			htmlFor: "diagnose-search",
			children: "Search"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "diagnose-search",
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Symptom, code, part, or a saved note",
				inputMode: "search",
				autoCapitalize: "off",
				autoCorrect: "off",
				spellCheck: false,
				className: "min-h-12 w-full rounded-full border border-line bg-sheet px-4"
			})
		}),
		q.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-3 space-y-2",
			"aria-live": "polite",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "sr-only",
					children: hits.length === 0 ? "Nothing matches that." : `${hits.length} results.`
				}),
				hits.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => push(h.to),
					className: "w-full rounded-card border border-line bg-sheet px-3 py-3 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
							children: h.kicker
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-semibold text-ink",
							children: h.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm text-muted",
							children: h.detail
						}),
						h.why ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm text-ink",
							children: h.why
						}) : null
					]
				}) }, `${h.title}-${i}`)),
				hits.length === 0 && searched === q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: searchDown ? "That list needs a signal." : "Nothing matches that."
				}),
				searched !== q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: "Searching…"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 flex items-start gap-2 text-sm text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "mt-0.5 size-4 shrink-0 text-ok",
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [onlyMine ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Showing guides for your ",
					model.short,
					". "
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Showing every guide. " }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "font-semibold underline underline-offset-2",
					onClick: () => setOnlyMine((v) => !v),
					children: onlyMine ? "Show all" : `Only ${model.short}`
				})] })]
			}),
			systemChips,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => push({ name: "flows" }),
				className: "mt-3 flex min-h-14 w-full items-center justify-between rounded-[18px] border border-line bg-sheet px-4 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-semibold text-ink",
					children: "Flowcharts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm text-muted",
					children: filter ? `${filter}, as a yes or no path` : "The same checks, as a yes or no path"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: "size-5 shrink-0 text-accent",
					"aria-hidden": true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => push({ name: "table" }),
				className: "mt-2 flex min-h-14 w-full items-center justify-between rounded-[18px] border border-line bg-sheet px-4 text-left text-base font-semibold text-ink",
				children: [filter ? `${filter}, in a table` : "Same checks, in a table", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: "size-5 shrink-0 text-accent",
					"aria-hidden": true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: filter === "" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [starts.map((job) => {
					const choices = job.choices?.filter((choice) => symptomOn(symptomById(choice.symptom) ?? {
						id: choice.symptom,
						system: ""
					}, model, year, onlyMine));
					const named = [...brands].map(heaterName);
					const detail = job.id === "hot" && aldeOnly ? "This Classic uses the Alde, not a tank or a tankless." : job.id === "hot" && named.length ? named.join(" or ") : job.id === "hot" && model.family !== "Other" ? "This year does not name the heater. Read the plate." : job.id === "heat" && hasAlde ? "Alde heats this coach" : job.id === "heat" ? "The ducted furnace" : job.detail;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-expanded": choices?.length ? openStart === job.id : void 0,
						onClick: () => {
							if (job.symptom) push({
								name: "symptom",
								id: job.symptom,
								step: 0
							});
							else if (choices?.length) setOpenStart(openStart === job.id ? null : job.id);
							else if (job.id === "hot") push({
								name: "flow",
								id: "hot"
							});
						},
						className: "flex w-full items-center gap-3 rounded-[18px] border border-line bg-sheet px-3 py-3 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 shrink-0 place-items-center rounded-xl bg-paper text-ok",
								"aria-hidden": true,
								children: startIcon[job.id]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-semibold text-ink",
									children: job.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-sm text-muted",
									children: detail
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: `size-5 shrink-0 text-muted ${openStart === job.id ? "rotate-90" : ""}` })
						]
					}), choices && choices.length > 0 && openStart === job.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 space-y-2 pl-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setOpenStart(null),
								className: "flex min-h-11 items-center text-sm font-semibold text-accent",
								children: "Back"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-ink",
								children: job.ask
							}),
							choices.map((choice) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => push({
									name: "symptom",
									id: choice.symptom,
									step: choice.step ?? 0
								}),
								className: "flex min-h-11 w-full items-center rounded-card border border-line bg-sheet px-3 py-3 text-left text-sm font-semibold text-ink",
								children: choice.symptom === "tankless" && brands.has("Truma Combi") && !brands.has("Girard GSWH-2") && !brands.has("Suburban ST-65RL") && !brands.has("Suburban IW60") ? "Truma Combi" : choice.label
							}, choice.symptom))
						]
					})] }, job.id);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => push({ name: "codes" }),
					className: "flex w-full items-center gap-3 rounded-[18px] border border-line bg-sheet px-3 py-3 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 shrink-0 place-items-center rounded-xl bg-paper text-ok",
							"aria-hidden": true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold text-ink",
								children: "I have a fault code"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 block text-sm text-muted",
								children: hasAlde ? "E-codes, flashes, and Alde messages" : "E-codes and flashes"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 shrink-0 text-muted" })
					]
				}) })] }) : systems.filter((name) => name === filter).map((name) => {
					const items = list.filter((s) => s.system === name && !foldedParent(s.id));
					if (!items.length) return null;
					const core = items.filter((s) => !s.id.startsWith("x-"));
					const more = items.filter((s) => s.id.startsWith("x-"));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [[
						"stop",
						"soon",
						"watch"
					].map((level) => {
						const group = core.filter((s) => s.level === level);
						if (!group.length) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
								children: level === "stop" ? "Stop" : level === "soon" ? "Soon" : "Watch"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-2",
								children: group.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SymptomRow, {
									s,
									year,
									onOpen: () => push({
										name: "symptom",
										id: s.id,
										step: 0
									})
								}, s.id))
							})]
						}, level);
					}), more.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-expanded": openMore === name,
							onClick: () => setOpenMore(openMore === name ? null : name),
							className: "min-h-11 text-sm font-semibold text-accent",
							children: [
								openMore === name ? "Hide" : "Show",
								" ",
								more.length,
								" more checks"
							]
						}), openMore === name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: more.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SymptomRow, {
								s,
								year,
								onOpen: () => push({
									name: "symptom",
									id: s.id,
									step: 0
								})
							}, s.id))
						})]
					})] }, name);
				})
			}),
			list.length === 0 && filter !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted",
				children: "Nothing in this system for the current filter. Show all, or pick Start."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "group mt-6 rounded-card border border-line bg-sheet",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
					className: "flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold text-ink",
						children: "More than one thing is wrong"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-normal text-muted",
						children: "Match what you see. The line under it is the one cause."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
						className: "size-5 shrink-0 text-muted transition-transform group-open:rotate-90",
						"aria-hidden": true
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4 px-3 pb-3",
					children: [
						"Power",
						"Gas",
						"Water",
						"Towing",
						"Body"
					].map((group) => {
						const rows = causes.filter((c) => c.group === group && causeFits(c, model, year));
						if (!rows.length) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
							children: group
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-2",
							children: rows.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => push(c.to),
								className: "w-full rounded-card border border-line bg-paper px-3 py-3 text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex flex-wrap gap-1.5",
										children: c.signs.map((sign) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-sheet px-2 py-1 text-sm text-ink",
											children: sign
										}, sign))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-2 block text-sm text-muted",
										children: "Usually"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-semibold text-ink",
										children: c.cause
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-sm font-semibold text-accent",
										children: c.start
									})
								]
							}) }, c.id))
						})] }, group);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => push({ name: "service" }),
				className: "mt-5 flex min-h-14 w-full items-center justify-between rounded-card border border-line bg-sheet px-4 text-left text-base font-semibold text-ink",
				children: ["Find a shop", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: "size-5 shrink-0 text-accent",
					"aria-hidden": true
				})]
			})
		] })
	] });
}
function SymptomRow({ s, year, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick: onOpen,
		className: "flex w-full items-center gap-3 rounded-card border border-line bg-sheet px-3 py-3 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							tone: s.level === "stop" ? "danger" : s.level === "soon" ? "warn" : "line",
							children: s.level === "stop" ? "Stop" : s.level === "soon" ? "Soon" : "Watch"
						}),
						s.fit === "classic" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							tone: "line",
							children: "Classic"
						}),
						s.fit === "gt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							tone: "line",
							children: "Globetrotter"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-2 block font-semibold text-ink",
					children: s.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 block text-sm text-muted",
					children: scopeLead(s.blurb, year)
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 shrink-0 text-muted" })]
	}) });
}
function Chip({ on, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		"aria-pressed": on,
		className: `min-h-11 min-w-11 shrink-0 rounded-full px-3 text-sm font-semibold ${on ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink"}`,
		children
	});
}
function PartLinks({ ids }) {
	const push = useApp((s) => s.push);
	const rows = (ids ?? []).map((id) => partById(id)).filter((part) => !!part);
	if (!rows.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Part numbers on this phone" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Stored in this app. This does not open a factory manual."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-2",
			children: rows.map((part) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => push({
					name: "part",
					id: part.id
				}),
				className: "w-full min-w-0 rounded-card border border-line bg-sheet px-3 py-3 text-left wrap-anywhere",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-semibold",
					children: part.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-sm text-accent",
					children: part.pn
				})]
			}) }, part.id))
		})
	] });
}
function SymptomView({ id, step }) {
	const sy = symptomById(id);
	const push = useApp((s) => s.push);
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const [fixed, setFixed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!sy || step <= 0) return;
		document.getElementById(`check-${sy.id}-${step}`)?.scrollIntoView({ block: "center" });
	}, [sy, step]);
	if (!sy) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "That symptom is not in this edition."
	});
	const parentId = foldedParent(sy.id);
	const parent = parentId ? symptomById(parentId) : void 0;
	const also = foldedChildren(sy.id).map((cid) => symptomById(cid)).filter((s) => !!s);
	const namedRecalls = recalls.filter((r) => {
		const num = r.campaign.replace(/^NHTSA\s+/, "");
		return `${sy.title} ${sy.blurb} ${sy.checks.map((c) => `${c.look} ${c.action}`).join(" ")}`.toLowerCase().includes(num.toLowerCase());
	});
	if (fixed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: sy.system }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				className: "font-display text-3xl text-ink",
				children: "That was the one."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "If it comes back, start again at check 1. Write it in the service log so the next time is faster."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				onClick: () => push({ name: "log" }),
				children: "Add a log note"
			}),
			!!sy.parts?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartLinks, { ids: sy.parts })
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-accent",
					children: sy.system
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
					className: "mt-1 font-display text-3xl text-ink",
					children: sy.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted wrap-anywhere",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopedCopy, {
						text: sy.blurb,
						year
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-ink",
					children: /owner-reported/i.test(`${sy.blurb} ${sy.checks.map((c) => c.action).join(" ")}`) ? "Owner report. Not a factory specification, and not confirmed on this coach." : "A step that does not name a factory manual is not a factory specification. The model-year manual governs."
				}),
				parent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "mt-2 min-h-11 text-sm font-semibold text-accent",
					onClick: () => push({
						name: "symptom",
						id: parent.id,
						step: 0
					}),
					children: ["Part of ", parent.title]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Work down the list. Stop when one of these is the problem."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-2",
				children: sy.checks.map((check, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					id: `check-${sy.id}-${i}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: `p-4 ${step > 0 && i === step ? "ring-2 ring-navy" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl text-ink wrap-anywhere",
								children: check.look
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-base text-ink wrap-anywhere",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopedCopy, {
									text: check.action,
									year
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepMark, { text: `${check.look} ${check.action}` })
						]
					})
				}, `${sy.id}-${i}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartLinks, { ids: sy.parts }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						onClick: () => setFixed(true),
						children: "This fixed it"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 text-sm font-semibold text-accent",
						onClick: () => push({ name: "service" }),
						children: "None of these. Find a shop"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 text-sm font-semibold text-accent",
						onClick: () => push({
							name: "table",
							id,
							step: 0
						}),
						children: "See this in the table"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 text-sm font-semibold text-accent",
						onClick: () => {
							const text = `Possible error in “${sy.title}.” Write what disagrees with the manual or the plate. This note stays on the phone.`;
							Promise.resolve(useApp.getState().addNote(text)).then((ok) => {
								useApp.getState().flash(ok === false ? "Could not save that note." : "Saved in notes. Nothing is sent.");
							});
						},
						children: "Report an error in this check"
					})
				]
			}),
			also.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Also in this job" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-2",
				children: also.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => push({
						name: "symptom",
						id: s.id,
						step: 0
					}),
					className: "w-full rounded-card border border-line bg-sheet px-3 py-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold text-ink",
						children: s.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-sm text-muted",
						children: scopeLead(s.blurb, year)
					})]
				}) }, s.id))
			})] }),
			!!sy.procedures?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Related procedure" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-col gap-2",
				children: sy.procedures.map((pid) => {
					const proc = procedureById(pid);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "line",
						onClick: () => push({
							name: "procedure",
							id: pid
						}),
						children: proc ? proc.title : "Open procedure"
					}, pid);
				})
			})] }),
			namedRecalls.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Recall named in these checks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-col gap-2",
				children: namedRecalls.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					onClick: () => push({ name: "recalls" }),
					children: r.campaign
				}, r.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlsoInBook, { items: jumpsForSymptom(sy) })
		]
	});
}
//#endregion
export { FixView, SymptomView };
