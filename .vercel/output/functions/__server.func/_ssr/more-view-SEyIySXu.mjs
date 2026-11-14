import { i as __toESM } from "../_runtime.mjs";
import { n as tasks } from "./schedule-AmHNloLy.mjs";
import { E as vinOk, T as vinMismatch, _ as ownerIssues, a as checklists, b as procedureFits, d as fitmentStanding, g as models, i as checklistById, l as coachYear, m as modelById, n as applianceFits, o as coachBudget, r as bearingNote, t as aldeShownName, u as codeFits, w as tsbs, x as recalls } from "./checklists-CYZuG9Db.mjs";
import { d as require_react_dom, q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as trustedBlob, F as prepareFile, H as serviceTotal, I as putFile, P as platePlaceholder, Z as todayIso, b as formatWhen, f as daysBetween, m as deleteFile, nt as waterHeaterSpec, r as PLATE_FIELDS, tt as useApp, x as getFile } from "./store-DUUzfVvp.mjs";
import { A as ChevronLeft, C as FileText, M as Camera, j as Check, k as ChevronRight, n as X, u as ScanLine } from "../_libs/lucide-react.mjs";
import { a as Btn, c as Kicker, o as Card, u as PageTitle } from "./router-Cw9i5Ud6.mjs";
import { o as DisclaimerCopy, s as useBackLayer } from "./routes-xIOD81ex.mjs";
import { RestoreSheet, n as BackupSheet, r as previewBackup, t as applyBackupFiles } from "./backup-view-uH2vtOem.mjs";
import { n as procedures } from "./procedures-C_lIH_E1.mjs";
import { n as textHasWords, r as wordsOf } from "./words-CD5GbNH1.mjs";
import { a as faultCodes, i as faultCodeRank, o as ownerReportedCode, r as faultCodeMatches, s as symptomForCode, t as appliances } from "./codes-U2h1b4Az.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/more-view-SEyIySXu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
function ProceduresView() {
	const push = useApp((s) => s.push);
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const [q, setQ] = (0, import_react.useState)("");
	const words = wordsOf(q);
	const shown = procedures.filter((p) => {
		if (!procedureFits(p.id, model, year)) return false;
		if (!words.length) return true;
		const steps = p.steps.map((s) => `${s.title} ${s.body}`).join(" ");
		return textHasWords(`${p.title} ${p.system} ${p.tools ?? ""} ${p.caution ?? ""} ${steps}`, words);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Step by step" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			className: "mt-1 font-display text-3xl text-ink",
			children: "Procedures"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Step by step, for this coach. Your model-year manual still governs."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "mt-4 block text-sm font-semibold text-ink",
			htmlFor: "procedure-search",
			children: "Search procedures"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id: "procedure-search",
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Torque, winterize, bearings…",
			inputMode: "search",
			autoCapitalize: "off",
			autoCorrect: "off",
			spellCheck: false,
			className: "mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-ink"
		}),
		shown.length < procedures.length && !q.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Steps for other appliances stay off this list. A link from the schedule still opens them."
		}),
		shown.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "Nothing matches that."
		}),
		shown.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 rounded-card border border-line bg-sheet",
			children: shown.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: i === shown.length - 1 ? "" : "border-b border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => push({
						name: "procedure",
						id: p.id
					}),
					className: "flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-semibold text-ink",
							children: p.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm text-muted",
							children: p.system
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 shrink-0 text-muted" })]
				})
			}, p.id))
		})
	] });
}
function ChecklistsView() {
	const push = useApp((s) => s.push);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Before you leave, and after you arrive" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			className: "mt-1 font-display text-3xl text-ink",
			children: "Checklists"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 rounded-card border border-line bg-sheet",
			children: checklists.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: i === checklists.length - 1 ? "" : "border-b border-rule",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => push({
						name: "checklist",
						id: c.id
					}),
					className: "flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-semibold text-ink",
							children: c.title
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 shrink-0 self-center text-muted" })]
				})
			}, c.id))
		})
	] });
}
function ChecklistView({ id }) {
	const list = checklistById(id);
	const checks = useApp((s) => s.checks);
	const listDone = useApp((s) => s.listDone);
	const toggle = useApp((s) => s.toggleCheck);
	const clear = useApp((s) => s.clearList);
	(0, import_react.useEffect)(() => {
		if (id !== "winter") return;
		const trail = useApp.getState().winterPlace?.trail ?? [];
		useApp.getState().setWinterPlace({
			page: "checklist",
			trail
		});
	}, [id]);
	if (!list) return null;
	const state = checks[id] || {};
	const all = list.groups.flatMap((g) => g.items);
	const n = all.filter((i) => state[i.id]).length;
	const finished = n === all.length && all.length > 0 ? listDone[id] : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: finished ? `Finished ${formatWhen(finished)}` : `${n} of ${all.length}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			className: "mt-1 font-display text-3xl text-ink",
			children: list.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: list.intro
		}),
		id === "boondock" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BudgetCard, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 h-1.5 overflow-hidden rounded-full bg-quiet",
			role: "progressbar",
			"aria-valuemin": 0,
			"aria-valuemax": all.length,
			"aria-valuenow": n,
			"aria-label": `${n} of ${all.length} checked`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-navy",
				style: { width: `${all.length ? n / all.length * 100 : 0}%` }
			})
		}),
		list.groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: g.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-2",
				children: g.items.map((item) => {
					const on = !!state[item.id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "checkbox",
						"aria-checked": on,
						onClick: () => toggle(id, item.id),
						className: "flex w-full items-start gap-3 rounded-card border border-line bg-sheet px-3 py-3 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border ${on ? "border-sage bg-sage text-on-navy" : "border-line"}`,
							children: on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : null
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `block text-sm ${on ? "text-muted line-through" : "text-ink"}`,
							children: item.text
						}), item.owner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-caution",
							children: "Owner-reported, not a factory step"
						})] })]
					}), id === "arrival" && item.id === "level" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => useApp.getState().push({ name: "level" }),
						className: "mt-2 min-h-11 px-1 text-sm font-semibold text-ink",
						children: "Trailer level, in inches"
					}) : null] }, item.id);
				})
			})]
		}, g.title)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			variant: "line",
			className: "mt-4",
			onClick: () => clear(id),
			children: "Clear this list"
		})
	] });
}
function BudgetCard() {
	const m = modelById(useApp((s) => s.modelId));
	const budget = coachBudget(m);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-4 p-4 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold text-ink",
				children: "Dry-camping budget"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-ink",
				children: budget.fresh
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-ink",
				children: budget.power
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: budget.note
			})
		]
	});
}
function PlatesCard() {
	const modelId = useApp((s) => s.modelId);
	const saved = useApp((s) => s.plates);
	const setPlates = useApp((s) => s.setPlates);
	const flash = useApp((s) => s.flash);
	const [draft, setDraft] = (0, import_react.useState)(saved);
	(0, import_react.useEffect)(() => {
		setDraft(useApp.getState().plates);
	}, [modelId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-4 space-y-3 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold text-ink",
				children: "Plates on this coach"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Read the label on the unit. These words show on the matching flowchart. They do not choose the steps."
			}),
			PLATE_FIELDS.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-sm font-semibold text-ink",
				htmlFor: `plate-${field.key}`,
				children: [field.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: `plate-${field.key}`,
					value: draft[field.key],
					onChange: (e) => setDraft((current) => ({
						...current,
						[field.key]: e.target.value
					})),
					maxLength: 80,
					placeholder: platePlaceholder(modelById(modelId), field.key),
					autoCapitalize: "off",
					autoCorrect: "off",
					spellCheck: false,
					className: "mt-1 min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-base font-normal text-ink"
				})]
			}, field.key)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "w-full",
				onClick: () => {
					setPlates(draft);
					setDraft(useApp.getState().plates);
					flash("Plates saved");
				},
				children: "Save plates"
			})
		]
	});
}
function SpecsView() {
	const id = useApp((s) => s.modelId);
	const vin = useApp((s) => s.vin);
	const m = modelById(id);
	const mismatch = vinMismatch(vin, m);
	const rows = [
		["VIN", vin || "Add it above"],
		["Length", m.length],
		["UBW with LP and batteries", m.ubw],
		["Hitch weight", m.hitch],
		["GVWR", m.gvwr],
		["Cargo capacity (NCC)", m.ncc],
		["Fresh / gray / black", `${m.fresh} / ${m.gray} / ${m.black} gal`],
		["Tire", `${m.tire} · ${m.psi} · ${m.load} max load`],
		["Lug nuts", m.lug],
		["Re-torque", "5, 10, 25, and 50 miles after a wheel change, star pattern"],
		["Hitch ball", `${m.ball} at ${m.ballHeight}`],
		["Water heater", waterHeaterSpec(m)],
		["City water", m.blowPsi.startsWith("30") ? "Stop at 30 psi. This floor is not the 50 psi limit." : "Inline regulator limits to 50 psi"],
		["Breakaway", "Test every 90 days. Pin out no more than 20–30 seconds."],
		["Axle alignment", "Toe-in 1/16 in each side (±1/8). Camber 3/4° positive (±3/4°)."]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Selected floor, not every year" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			className: "mt-1 font-display text-3xl text-ink",
			children: m.name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "These figures match the floor plan you picked. They do not change with the VIN year. Tire pressure is the maximum cold rating. Check your placard and manual. Inflate to the placard for the load you are carrying, and confirm earlier years in that year’s manual."
		}),
		mismatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm font-semibold text-ink",
			children: mismatch
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatesCard, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
			className: "mt-4 rounded-card border border-line bg-sheet",
			children: rows.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-line px-4 py-3 last:border-b-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted",
					children: k
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-0.5 text-sm text-ink",
					children: v
				})]
			}, k))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4 p-4 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold text-ink",
				children: "Where is it"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-3 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted",
						children: "Power center"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-0.5 text-ink",
						children: m.powerCenter
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted",
						children: "Low-point drains"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-0.5 text-ink",
						children: m.drains
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted",
						children: "Blow-out"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "mt-0.5 text-ink",
						children: [m.blowPsi, " at the city inlet. If this is not your floor plan, stop at 30 psi."]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted",
						children: "Bearings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-0.5 text-ink",
						children: bearingNote(m)
					})] })
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BudgetCard, {}),
		m.alde && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4 p-4 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold",
				children: "Alde valves"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1",
				children: "Normal: 1, 2, 3 open / 4 closed. Bypass: 1, 2, 3 closed / 4 open. Drain: all open. Blow-out: close 1 and 2. The interactive card is in the valve procedure."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 text-sm text-muted",
			children: [
				"Other floor plans in this app: ",
				models.filter((x) => x.id !== "other").map((x) => x.short).join(", "),
				"."
			]
		})
	] });
}
function CodesView({ initialQuery = "", initialAppliance = "All" }) {
	const [app, setApp] = (0, import_react.useState)(initialAppliance);
	const [q, setQ] = (0, import_react.useState)(initialQuery);
	const push = useApp((s) => s.push);
	const model = modelById(useApp((s) => s.modelId));
	const vin = useApp((s) => s.vin);
	const year = coachYear(vin, useApp((s) => s.modelYear));
	(0, import_react.useEffect)(() => {
		setQ(initialQuery);
		setApp(initialAppliance);
	}, [initialQuery, initialAppliance]);
	const searching = q.trim().length > 0;
	const fits = (0, import_react.useCallback)((c) => codeFits(c, model, year), [model, year]);
	const list = (0, import_react.useMemo)(() => {
		const rows = faultCodes.filter((c) => {
			if (app !== "All" && c.appliance !== app) return false;
			if (!searching && !fits(c)) return false;
			return faultCodeMatches(c, q);
		});
		if (!searching) return rows;
		return rows.sort((a, b) => faultCodeRank(a, q, fits(a)) - faultCodeRank(b, q, fits(b)) || a.code.localeCompare(b.code) || a.appliance.localeCompare(b.appliance));
	}, [
		app,
		q,
		searching,
		fits
	]);
	const chips = appliances.filter((name) => searching || applianceFits(name, model, year) || name === app);
	const fit = fitmentStanding(model, year);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Panel, LED, and remote" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			className: "mt-1 font-display text-3xl text-ink",
			children: "Fault codes"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Codes for this coach. Search still finds the others, marked not on this coach."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-1 text-sm ${fit.standing === "factory" ? "text-muted" : "font-semibold text-ink"}`,
			children: fit.line
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "mt-4 block text-sm font-semibold text-ink",
			htmlFor: "fault-code",
			children: "Fault code or message"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id: "fault-code",
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "E-1, gas failure, 2 flashes…",
			inputMode: "search",
			autoCapitalize: "off",
			autoCorrect: "off",
			spellCheck: false,
			className: "mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "chip-row -mx-4 mt-3 flex gap-2 px-4",
			children: ["All", ...chips].map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setApp(name),
				className: `min-h-11 min-w-11 shrink-0 rounded-full px-3 text-sm font-semibold ${app === name ? "bg-navy text-on-navy" : "border border-line bg-sheet"}`,
				children: name === "Alde 3030" ? aldeShownName(year, model.id) : name
			}, name))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-2",
			children: list.map((c) => {
				const symptom = symptomForCode(c);
				const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: c.code.trim().length <= 8 && !/\s/.test(c.code) ? "font-mono text-base font-semibold tracking-wide text-ink" : "font-sans text-sm font-normal text-ink",
							children: c.code
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-right text-sm font-semibold text-muted",
							children: [c.appliance === "Alde 3030" ? fits(c) ? aldeShownName(year, model.id) : "Alde" : c.appliance, !fits(c) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block normal-case tracking-normal text-caution",
								children: "Not on this coach"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-sans text-sm font-normal text-ink",
						children: c.meaning
					}),
					ownerReportedCode(c) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-semibold text-ink",
						children: "Owner-reported. Not from the maker’s sheet."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: c.fix
					}),
					c.source ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: ["Source: ", c.source]
					}) : ownerReportedCode(c) ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-semibold text-ink",
						children: "No published source for this line."
					})
				] });
				if (!symptom) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-card border border-line bg-sheet p-4",
					children: body
				}, c.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => push({
						name: "symptom",
						id: symptom,
						step: 0
					}),
					"aria-label": `${c.code}. Open the checks`,
					className: "flex w-full items-start gap-2 rounded-card border border-line bg-sheet p-4 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1",
						children: body
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
						className: "mt-0.5 size-5 shrink-0 text-muted",
						"aria-hidden": true
					})]
				}) }, c.id);
			})
		}),
		list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 text-sm text-muted",
			children: q.trim() ? "No code matches that." : "Nothing on this coach in that filter. Search a code to see other appliances."
		})
	] });
}
/** A year overlap is not proof. Name the family, or say it does not. */
function recallFit(models, family) {
	if (!family || family === "Other") return "Check your VIN";
	const cleaned = models.replace(/\bnot\b[^.]*/gi, " ");
	if (!new RegExp(`\\b${family.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(cleaned) && !/\bother\b/i.test(models)) return "Doesn't apply";
	return "Check your VIN";
}
function RecallsView() {
	const vin = useApp((s) => s.vin);
	const model = modelById(useApp((s) => s.modelId));
	const ok = vinOk(vin);
	const href = ok ? `https://www.nhtsa.gov/recalls?vin=${encodeURIComponent(vin)}#vehicle` : "https://www.nhtsa.gov/recalls#vehicle";
	function openNhtsa() {
		if (ok) navigator.clipboard?.writeText(vin).catch(() => void 0);
		window.open(href, "_blank", "noopener,noreferrer");
	}
	const recallAge = daysBetween("2026-10-25", todayIso());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Checked 24–25 Oct 2026" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
					className: "mt-1 font-display text-3xl text-ink",
					children: "Recalls"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: openNhtsa,
					className: "mt-3 flex min-h-11 w-full items-center justify-center rounded-full bg-navy px-4 text-sm font-semibold text-on-navy",
					children: ok ? "Look up this VIN at NHTSA" : "Look up a VIN at NHTSA"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-ink",
					children: "As of 24–25 Oct 2026, NHTSA showed no recalls for a 2025–2027 Globetrotter or a 2027 Classic. That line is not a result for this trailer. A name on the list below is not proof it applies."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						ok ? "Copies this VIN and opens NHTSA. Paste it if the box is empty." : "Opens NHTSA. Add a valid VIN first if you want it copied for you.",
						" ",
						"The notes below were checked 24–25 Oct 2026. ",
						recallAge != null && recallAge >= 30 ? "That check is past 30 days." : "That is not yet 30 days.",
						" They will go stale. A campaign applies only to the VINs in it. NHTSA is the list that matters."
					]
				})
			] }),
			recalls.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-ink",
						children: r.campaign
					}),
					/fire/i.test(r.defect) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-semibold text-signal",
						children: "Fire risk"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-semibold text-ink",
						children: recallFit(r.models, model.family)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: r.when
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink",
						children: r.models
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink",
						children: r.defect
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: r.remedy
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink",
						children: r.tell
					})
				]
			}, r.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Bulletins, not recalls" }),
			tsbs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: t.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: t.applies
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: t.problem
					})
				]
			}, t.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Owner-reported, not a recall" }),
			ownerIssues.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: o.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: o.models
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: o.issue
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: o.fix
					})
				]
			}, o.title))
		]
	});
}
var kit = [
	["Torque wrench to ~150 ft-lb, 1/2 in drive", "Wind it back to zero after use. Final lug torque is a click, not an impact."],
	["Breaker bar, short extension, thin-wall 6-point socket", "Often 13/16 in (21 mm). Some nuts are 3/4 in. Test-fit at home. A cross wrench may not reach a recessed alloy nut."],
	["Socket set, 1/4 and 3/8 in drive", "SAE and metric, 6-point, shallow and deep. A short extension and a universal. Keep the 1/2 in lug socket with the wheel tools."],
	["3/8 and 1/2 in ratchets", "One of each. The 3/8 is the everyday driver. The 1/2 in takes the lug socket and the heavier frame bolts. A short extension for each."],
	["Cordless drill and a bit set", "Phillips, flat, and square driver bits, a few twist bits, and a charged spare battery. Interior screws do not need an impact."],
	["Combination wrenches", "7/16, 1/2, 9/16, 5/8, and 3/4 in, plus 10 and 13 mm. One adjustable wrench. Some stabilizer bolts are 3/4 in — confirm on yours."],
	["Screwdrivers, hex keys, and pliers", "#2 Phillips, a flat, and a stubby. SAE Allen keys and T25 / T30. Slip-joint, needle-nose, channel locks, and side cutters."],
	["Multimeter and spare fuses", "Two of each ATC rating in the 12 V panel. Same type and amperage only. Solar-port fuse: 15 A on Classic, Flying Cloud, Frank Lloyd Wright, and Trade Wind 23/25; 30 A on a Globetrotter, Stetson, or World Traveler EU. Basecamp 20XE portable solar is 300 W on a lithium profile. A clamp meter is the brake-magnet check, about 3 A each."],
	["Rivet tool and 3/16 in aluminum rivets", "Include large-flange rivets for the belly pan. Match the grip to the stack. Do not guess a box for the shell."],
	["Leveling blocks or a ramp", "On a tandem, the good tire climbs and the flat lifts clear. Still use stands if you go underneath."],
	["Bottle jack and rated jack stands", "Lift only at the marked JACK pad on the frame. Never on the axle. Stands go under before you work."],
	["Tire gauge and a compressor that can hit max cold psi", "Classic 90, Globetrotter 80, as maximums."],
	["Spare that matches", "The carrier wants an undamaged tire and rim of the specified type."],
	["Hitch pin, cotter, and ball lube", "Carry a spare pin in the coach, not only in the truck. A spare 7-way plug is the usual road spare."],
	["Wheel chocks and a warning triangle", "Both are on the manual equipment list. A hi-vis vest is worth having at the roadside."],
	["Two drinking-water hoses, a sewer hose, and a spare cap", "A hose washer, and a 90° elbow at the city inlet so the hose does not lever the fitting."],
	["Spare LP pigtails and a soapy-water bottle", "Collapsed pigtails are a common no-flame fault. Growing bubbles are a leak. Never a flame."],
	["1-1/16 in socket and a regulated air fitting", "The socket removes a Suburban tank anode. The fitting is the winter blow-out, held to your manual’s pressure limit."],
	["Hygrometer", "Keep indoor humidity at or under 60%, about 35% in a cold climate."],
	["Headlamp, gloves, and safety glasses", "Plus the flashlight and first-aid kit already in the motoring list. Eye protection for rivets and bearings."],
	["Contact cleaner, dielectric grease, graphite, Boeshield", "7-way, breakaway pin, locks, hinge."],
	["Water-heater anode or descale kit", "Tank: 233514. Tankless Suburban: 521163. Do not carry an anode for a tankless."],
	["Alde glycol, Classics", "360371-301C or -201C. Not automotive antifreeze."],
	["Non-toxic RV antifreeze", "Traps, and the winterize kit if you use the pink method."]
];
function ToolsView() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Classic 28RB and Globetrotter 27FB kit" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			className: "mt-1 font-display text-3xl text-ink",
			children: "What to carry"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Socket sizes vary. Test-fit every tool on your own trailer before you leave."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-2",
			children: kit.map(([t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-card border border-line bg-sheet p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-ink",
					children: t
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: d
				})]
			}, t))
		})
	] });
}
function fileError(err) {
	if (err instanceof Error && err.message === "too-big") return "That file is over 15 MB";
	if (err instanceof Error && err.message === "bad-type") return "Use a photo or a PDF";
	if (err instanceof Error && err.message === "heic") return "This photo is HEIC. Set the iPhone camera to Most Compatible, or choose a JPEG.";
	if (err instanceof Error && err.message === "odd-image") return "This photo format cannot be saved. Choose a JPEG or PNG.";
	return "Could not read that file";
}
function LogView() {
	const log = useApp((s) => s.log);
	const odo = useApp((s) => s.odometer);
	const add = useApp((s) => s.addLog);
	const update = useApp((s) => s.updateLog);
	const remove = useApp((s) => s.removeLog);
	const removeFile = useApp((s) => s.removeLogFile);
	const flash = useApp((s) => s.flash);
	const modelId = useApp((s) => s.modelId);
	const vin = useApp((s) => s.vin);
	const modelYear = useApp((s) => s.modelYear);
	const setLogDraft = useApp((s) => s.setLogDraft);
	const model = modelById(modelId);
	const year = coachYear(vin, modelYear);
	const scheduleJobs = tasks.filter((task) => {
		if (task.cadence.type === "trip") return false;
		if (task.fit === "classic" && !model.alde && model.family !== "Other") return false;
		if (task.fit === "gt" && model.family !== "Globetrotter" && model.family !== "Other") return false;
		if (task.procedureId && !procedureFits(task.procedureId, model, year)) return false;
		return true;
	});
	const [note, setNote] = (0, import_react.useState)("");
	const [job, setJob] = (0, import_react.useState)("");
	const [taskPick, setTaskPick] = (0, import_react.useState)("");
	const [entryIso, setEntryIso] = (0, import_react.useState)("");
	const [entryMiles, setEntryMiles] = (0, import_react.useState)(odo > 0 ? String(odo) : "");
	const [detail, setDetail] = (0, import_react.useState)({});
	const [pending, setPending] = (0, import_react.useState)([]);
	const draftTimer = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [view, setView] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [editIso, setEditIso] = (0, import_react.useState)("");
	const [editMiles, setEditMiles] = (0, import_react.useState)("");
	const [editDetail, setEditDetail] = (0, import_react.useState)({});
	const [backupOpen, setBackupOpen] = (0, import_react.useState)(false);
	const [restoreLook, setRestoreLook] = (0, import_react.useState)(null);
	useBackLayer(backupOpen, () => setBackupOpen(false));
	useBackLayer(restoreLook !== null, () => setRestoreLook(null));
	useBackLayer(view !== null, () => setView(null));
	const [photoError, setPhotoError] = (0, import_react.useState)("");
	const pendingRef = (0, import_react.useRef)(pending);
	pendingRef.current = pending;
	const noteRef = (0, import_react.useRef)(note);
	const jobRef = (0, import_react.useRef)(job);
	noteRef.current = note;
	jobRef.current = job;
	function remember(nextNote, nextJob, files, now = false) {
		if (draftTimer.current != null) window.clearTimeout(draftTimer.current);
		const modelAt = useApp.getState().modelId;
		const write = () => {
			if (useApp.getState().modelId !== modelAt) return;
			setLogDraft({
				note: nextNote,
				job: nextJob,
				files: files.map(({ id, name, mime }) => ({
					id,
					name,
					mime
				}))
			});
		};
		if (now) write();
		else draftTimer.current = window.setTimeout(write, 300);
	}
	(0, import_react.useEffect)(() => {
		let cancel = false;
		if (draftTimer.current != null) window.clearTimeout(draftTimer.current);
		const saved = useApp.getState().logDraft;
		setNote(saved?.note ?? "");
		setJob(saved?.job ?? "");
		setTaskPick(tasks.find((task) => task.title === (saved?.job ?? "").trim())?.id ?? "");
		setEntryIso(todayIso());
		setEntryMiles(useApp.getState().odometer > 0 ? String(useApp.getState().odometer) : "");
		setDetail({});
		setPending((current) => {
			for (const file of current) URL.revokeObjectURL(file.url);
			return [];
		});
		const files = saved?.files ?? [];
		if (!files.length) return () => {
			cancel = true;
		};
		(async () => {
			const restored = [];
			for (const file of files) {
				const blob = await getFile(file.id);
				if (cancel) break;
				if (!blob) continue;
				restored.push({
					id: file.id,
					name: file.name,
					mime: file.mime,
					blob,
					url: URL.createObjectURL(blob)
				});
			}
			if (cancel) {
				for (const file of restored) URL.revokeObjectURL(file.url);
				return;
			}
			setPending(restored);
		})();
		return () => {
			cancel = true;
		};
	}, [modelId]);
	(0, import_react.useEffect)(() => {
		return () => {
			for (const file of pendingRef.current) URL.revokeObjectURL(file.url);
		};
	}, []);
	async function takeFiles(list) {
		if (!list?.length || busy) return;
		setBusy(true);
		const next = [];
		try {
			for (const file of [...list]) {
				if (pending.length + next.length >= 6) {
					flash("Six files at a time");
					break;
				}
				try {
					const prepared = await prepareFile(file);
					next.push({
						id: crypto.randomUUID(),
						...prepared,
						url: URL.createObjectURL(prepared.blob)
					});
				} catch (err) {
					const message = fileError(err);
					if (err instanceof Error && (err.message === "heic" || err.message === "odd-image")) setPhotoError(message);
					else flash(message);
				}
			}
			if (next.length) {
				let kept = [...pending, ...next].slice(0, 6);
				setPhotoError("");
				setPending(kept);
				remember(note, job, kept, true);
				for (const file of next) {
					if (!kept.some((item) => item.id === file.id)) continue;
					try {
						await putFile(file.id, file.blob);
					} catch {
						kept = kept.filter((item) => item.id !== file.id);
						URL.revokeObjectURL(file.url);
						setPending(kept);
						remember(note, job, kept, true);
						flash("Could not save. This browser may be blocking storage.");
					}
				}
			}
		} finally {
			setBusy(false);
		}
	}
	async function finishRestore(plan) {
		try {
			await applyBackupFiles(plan, flash);
		} catch {
			flash("Could not restore. Nothing was replaced.");
		}
	}
	function dropPending(id) {
		setPending((current) => {
			const hit = current.find((file) => file.id === id);
			if (hit) URL.revokeObjectURL(hit.url);
			const left = current.filter((file) => file.id !== id);
			remember(noteRef.current, jobRef.current, left, true);
			return left;
		});
		deleteFile(id);
	}
	async function saveEntry() {
		if (busy || !note.trim() && !job.trim() && pending.length === 0 && !serviceFilled(detail)) return;
		const miles = entryMiles.trim() === "" ? odo : Number(entryMiles.replace(/,/g, ""));
		if (entryMiles.trim() !== "" && !Number.isFinite(miles)) {
			flash("Miles should be a number");
			return;
		}
		setBusy(true);
		try {
			for (const file of pending) await putFile(file.id, file.blob);
			if (!await Promise.resolve(add(note, pending.map((file) => ({
				id: file.id,
				name: file.name,
				mime: file.mime,
				...file.role ? { role: file.role } : {}
			})), job, false, {
				iso: entryIso || todayIso(),
				miles,
				detail,
				taskId: taskPick || void 0
			}))) return;
			if (draftTimer.current != null) window.clearTimeout(draftTimer.current);
			for (const file of pending) URL.revokeObjectURL(file.url);
			setPending([]);
			setNote("");
			setJob("");
			setTaskPick("");
			setEntryIso(todayIso());
			setEntryMiles(odo > 0 ? String(odo) : "");
			setDetail({});
			if (!taskPick) flash("Saved on this phone");
		} catch {
			flash("Could not save. This browser may be blocking storage.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "On this phone" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			className: "mt-1 font-display text-3xl text-ink",
			children: "Service log"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => useApp.getState().push({ name: "desk" }),
			className: "mt-2 min-h-11 text-sm font-semibold text-accent",
			children: "Shop sheet"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm text-muted",
			children: [
				"Notes and photos stay with this trailer. A different coach has its own miles and log. Clearing the phone’s data deletes them, so keep a backup file.",
				" ",
				odo ? `Current odometer ${odo.toLocaleString()} mi.` : "Add the mileage on Maintain so the schedule can use it."
			]
		}),
		log.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "Record your first service visit. A job, a photo, or a receipt is enough."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderHistory, { log }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-2",
			children: log.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-card border border-rule bg-sheet p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm tabular-nums text-muted",
						children: [formatWhen(entry.iso), entry.miles ? ` · ${entry.miles.toLocaleString()} mi` : ""]
					}),
					entry.job ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-semibold text-ink",
						children: entry.job
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceLines, { entry }),
					editing === entry.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-2",
						onSubmit: (e) => {
							e.preventDefault();
							const miles = editMiles.trim() === "" ? 0 : Number(editMiles.replace(/,/g, ""));
							if (update(entry.id, draft, {
								iso: editIso,
								miles,
								detail: editDetail
							})) {
								setEditing(null);
								setDraft("");
								setEditIso("");
								setEditMiles("");
								setEditDetail({});
							}
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-sm font-semibold text-muted",
									htmlFor: `date-${entry.id}`,
									children: ["Date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: `date-${entry.id}`,
										type: "date",
										value: editIso,
										onChange: (e) => setEditIso(e.target.value),
										className: "mt-1 min-h-11 w-full rounded-card border border-line bg-paper px-3 text-base text-ink"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block text-sm font-semibold text-muted",
									htmlFor: `miles-${entry.id}`,
									children: ["Miles", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: `miles-${entry.id}`,
										inputMode: "numeric",
										value: editMiles,
										onChange: (e) => setEditMiles(e.target.value),
										className: "mt-1 min-h-11 w-full rounded-card border border-line bg-paper px-3 text-base text-ink"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceFields, {
								idPrefix: `edit-${entry.id}`,
								value: editDetail,
								onChange: setEditDetail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 block text-sm font-semibold text-ink",
								htmlFor: `edit-${entry.id}`,
								children: ["Notes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									id: `edit-${entry.id}`,
									value: draft,
									maxLength: 800,
									rows: 3,
									onChange: (e) => setDraft(e.target.value),
									className: "mt-2 w-full rounded-card border border-line bg-paper px-3 py-2 text-base text-ink"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
									type: "submit",
									className: "px-3",
									children: "Save"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
									type: "button",
									variant: "line",
									className: "px-3",
									onClick: () => {
										setEditing(null);
										setDraft("");
										setEditIso("");
										setEditMiles("");
										setEditDetail({});
									},
									children: "Cancel"
								})]
							})
						]
					}) : entry.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 whitespace-pre-wrap text-sm text-ink",
						children: entry.note
					}) : null,
					entry.files && entry.files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex gap-2 overflow-x-auto",
						children: entry.files.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setView({
									entryId: entry.id,
									file
								}),
								className: "block",
								"aria-label": `Open ${file.name}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoredThumb, { file }), file.role ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-center text-sm text-ink",
									children: roleLabel(file.role)
								}) : null]
							})
						}, file.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-4",
						children: [editing !== entry.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setEditing(entry.id);
								setDraft(entry.note);
								setEditIso(entry.iso);
								setEditMiles(entry.miles ? String(entry.miles) : "");
								setEditDetail({
									work: entry.work,
									provider: entry.provider,
									parts: entry.parts,
									partsCost: entry.partsCost,
									laborCost: entry.laborCost,
									cost: entry.cost,
									warranty: entry.warranty,
									tech: entry.tech,
									phone: entry.phone
								});
							},
							className: "min-h-11 text-sm font-semibold text-accent",
							children: "Edit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => remove(entry.id),
							className: "min-h-11 text-sm font-semibold text-stop",
							children: "Remove"
						})]
					})
				]
			}, entry.id))
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					className: "px-3",
					onClick: () => setBackupOpen(true),
					children: "Export backup"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "line",
					className: "px-3",
					onClick: () => downloadHistory(log),
					children: "Export history"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line bg-sheet px-4 text-sm font-semibold",
					children: ["Restore", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "application/json,.json",
						className: "sr-only",
						onChange: async (e) => {
							const file = e.target.files?.[0];
							e.target.value = "";
							if (!file) return;
							const result = await previewBackup(file);
							if (!result.ok) {
								flash(result.message);
								return;
							}
							setRestoreLook(result.look);
						}
					})]
				})
			]
		}),
		backupOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackupSheet, { onClose: () => setBackupOpen(false) }),
		restoreLook && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestoreSheet, {
			look: restoreLook,
			onClose: () => setRestoreLook(null),
			onRestore: () => {
				const plan = restoreLook.plan;
				setRestoreLook(null);
				finishRestore(plan);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					htmlFor: "service-task",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-semibold text-ink",
						children: "Schedule job"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						id: "service-task",
						value: taskPick,
						onChange: (e) => {
							const id = e.target.value;
							setTaskPick(id);
							const task = scheduleJobs.find((item) => item.id === id);
							const nextJob = task ? task.title : job;
							if (task) setJob(task.title);
							remember(note, nextJob, pending);
						},
						className: "mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-base text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Not a scheduled job"
						}), scheduleJobs.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: task.id,
							children: task.title
						}, task.id))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Choosing a schedule job marks it done on the date below, unless the schedule already has a later date."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 block",
					htmlFor: "service-job",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-semibold text-ink",
						children: "Job"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "service-job",
						value: job,
						onChange: (e) => {
							const next = e.target.value;
							setJob(next);
							const match = scheduleJobs.find((task) => task.title === next.trim());
							setTaskPick(match?.id ?? "");
							remember(note, next, pending);
						},
						maxLength: 80,
						placeholder: "Not on the schedule, such as a dent repair",
						className: "mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-base"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 block",
					htmlFor: "service-note",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-sm font-semibold text-ink",
						children: "Service note"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "service-note",
						value: note,
						onChange: (e) => {
							setNote(e.target.value);
							remember(e.target.value, job, pending);
						},
						placeholder: "Rotated tires, star torque 110",
						className: "mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-base"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-semibold text-ink",
						htmlFor: "service-date",
						children: ["Date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "service-date",
							type: "date",
							value: entryIso,
							onChange: (e) => setEntryIso(e.target.value),
							className: "mt-2 min-h-11 w-full rounded-card border border-line bg-sheet px-3 text-base text-ink"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm font-semibold text-ink",
						htmlFor: "service-miles",
						children: ["Miles", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "service-miles",
							inputMode: "numeric",
							value: entryMiles,
							onChange: (e) => setEntryMiles(e.target.value),
							placeholder: odo > 0 ? String(odo) : "Trailer miles",
							className: "mt-2 min-h-11 w-full rounded-card border border-line bg-sheet px-3 text-base text-ink"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceFields, {
					idPrefix: "service",
					value: detail,
					onChange: setDetail
				}),
				pending.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 flex gap-2 overflow-x-auto pb-1",
					children: pending.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "relative shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingThumb, { file }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-1 block text-sm text-ink",
								htmlFor: `role-${file.id}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "What this file is"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: `role-${file.id}`,
									value: file.role ?? "",
									onChange: (e) => {
										const role = e.target.value;
										setPending((current) => current.map((item) => item.id === file.id ? {
											...item,
											role: role || void 0
										} : item));
									},
									className: "min-h-11 w-full rounded-card border border-line bg-paper px-1 text-sm text-ink",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Photo"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "before",
											children: "Before"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "after",
											children: "After"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "receipt",
											children: "Receipt"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "invoice",
											children: "Invoice"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `Remove ${file.name}`,
								onClick: () => dropPending(file.id),
								className: "absolute -right-1 -top-1 grid size-11 place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-6 place-items-center rounded-full bg-inverse text-on-navy",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
										className: "size-3.5",
										"aria-hidden": true
									})
								})
							})
						]
					}, file.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-sheet px-3 text-sm font-semibold text-ink",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
								className: "size-5 shrink-0",
								"aria-hidden": true
							}),
							"Take photo",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "log-photo",
								type: "file",
								accept: "image/*",
								capture: "environment",
								className: "sr-only",
								onChange: (e) => {
									takeFiles(e.target.files);
									e.target.value = "";
								}
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-sheet px-3 text-sm font-semibold text-ink",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, {
								className: "size-5 shrink-0",
								"aria-hidden": true
							}),
							"Scan or file",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "log-scan",
								type: "file",
								accept: "image/*,application/pdf,.pdf",
								multiple: true,
								className: "sr-only",
								onChange: (e) => {
									takeFiles(e.target.files);
									e.target.value = "";
								}
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "On iPhone, Scan Documents is in the file sheet. Photos are resized before they are saved."
				}),
				log.length >= 200 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm font-semibold text-ink",
					children: "The log is full at 200. Saving another entry removes the oldest one and its photos."
				}) : null,
				photoError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-start gap-2",
					role: "alert",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "flex-1 text-sm font-semibold text-stop",
						children: photoError
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPhotoError(""),
						"aria-label": "Close",
						className: "flex min-h-11 min-w-11 items-center justify-center text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					className: "mt-3 w-full disabled:border disabled:border-line disabled:bg-sheet disabled:text-muted disabled:opacity-100",
					disabled: busy || !note.trim() && !job.trim() && pending.length === 0 && !serviceFilled(detail),
					"aria-describedby": !note.trim() && !job.trim() && pending.length === 0 && !serviceFilled(detail) ? "log-save-why" : void 0,
					onClick: () => void saveEntry(),
					children: busy ? "Working…" : "Save in the log"
				}),
				!note.trim() && !job.trim() && pending.length === 0 && !serviceFilled(detail) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					id: "log-save-why",
					className: "mt-2 text-sm font-semibold text-ink",
					children: "Add a job, a note, or a photo."
				}) : null
			]
		}),
		view && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileViewer, {
			file: view.file,
			onClose: () => setView(null),
			onRemove: () => {
				removeFile(view.entryId, view.file.id);
				setView(null);
				flash("Removed");
			}
		})
	] });
}
function serviceFilled(detail) {
	return Object.values(detail).some((value) => typeof value === "string" && value.trim());
}
var SERVICE_FIELDS = [
	{
		key: "work",
		label: "Work performed",
		max: 200
	},
	{
		key: "provider",
		label: "Service provider",
		max: 80
	},
	{
		key: "parts",
		label: "Parts",
		max: 200
	},
	{
		key: "partsCost",
		label: "Parts cost",
		max: 20
	},
	{
		key: "laborCost",
		label: "Labor cost",
		max: 20
	},
	{
		key: "cost",
		label: "Total cost",
		max: 20
	},
	{
		key: "warranty",
		label: "Warranty",
		max: 200
	},
	{
		key: "tech",
		label: "Technician",
		max: 80
	},
	{
		key: "phone",
		label: "Technician phone",
		max: 40
	}
];
function ServiceFields({ idPrefix, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-3 space-y-3",
		children: SERVICE_FIELDS.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "block text-sm font-semibold text-ink",
			htmlFor: `${idPrefix}-${field.key}`,
			children: [field.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: `${idPrefix}-${field.key}`,
				value: field.key === "cost" ? value.cost || serviceTotal(value.partsCost, value.laborCost) : value[field.key] ?? "",
				maxLength: field.max,
				inputMode: field.key === "partsCost" || field.key === "laborCost" || field.key === "cost" ? "decimal" : void 0,
				onChange: (e) => {
					const raw = e.target.value;
					if (field.key !== "partsCost" && field.key !== "laborCost") {
						onChange({
							...value,
							[field.key]: raw
						});
						return;
					}
					const next = {
						...value,
						[field.key]: raw
					};
					const total = serviceTotal(next.partsCost, next.laborCost);
					onChange(total ? {
						...next,
						cost: total
					} : next);
				},
				className: "mt-1 min-h-11 w-full rounded-card border border-line bg-sheet px-3 text-base font-normal text-ink"
			})]
		}, field.key))
	});
}
function ServiceLines({ entry }) {
	const total = entry.cost?.trim() || serviceTotal(entry.partsCost, entry.laborCost);
	const rows = SERVICE_FIELDS.map((field) => {
		const text = field.key === "cost" ? total : entry[field.key];
		return [field.label, text];
	}).filter((row) => Boolean(row[1]));
	if (!rows.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
		className: "mt-2",
		children: rows.map(([label, text]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-sm font-semibold text-ink",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "text-sm text-ink",
				children: text
			})]
		}, label))
	});
}
function roleLabel(role) {
	if (role === "before") return "Before";
	if (role === "after") return "After";
	if (role === "receipt") return "Receipt";
	return "Invoice";
}
function ProviderHistory({ log }) {
	const counts = /* @__PURE__ */ new Map();
	for (const entry of log) {
		const name = entry.provider?.trim();
		if (!name) continue;
		counts.set(name, (counts.get(name) ?? 0) + 1);
	}
	const shops = [...counts.entries()];
	if (!shops.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-3 text-sm text-ink",
		children: [
			"Shops on this phone: ",
			shops.map(([name, count]) => count === 1 ? name : `${name} (${count})`).join(", "),
			"."
		]
	});
}
function csvCell(value) {
	return `"${value.replace(/"/g, "\"\"")}"`;
}
function downloadHistory(log) {
	const header = [
		"Date",
		"Miles",
		"Job",
		"Work performed",
		"Service provider",
		"Parts",
		"Parts cost",
		"Labor cost",
		"Total cost",
		"Warranty",
		"Technician",
		"Phone",
		"Notes",
		"Files"
	];
	const lines = log.map((entry) => [
		entry.iso,
		entry.miles ? String(entry.miles) : "",
		entry.job ?? "",
		entry.work ?? "",
		entry.provider ?? "",
		entry.parts ?? "",
		entry.partsCost ?? "",
		entry.laborCost ?? "",
		entry.cost ?? "",
		entry.warranty ?? "",
		entry.tech ?? "",
		entry.phone ?? "",
		entry.note,
		(entry.files ?? []).map((file) => file.role ? `${roleLabel(file.role)}: ${file.name}` : file.name).join("; ")
	].map(csvCell).join(","));
	const file = new File([[header.map(csvCell).join(","), ...lines].join("\n")], "rivetcare-service.csv", { type: "text/csv" });
	const url = URL.createObjectURL(file);
	const a = document.createElement("a");
	a.href = url;
	a.download = "rivetcare-service.csv";
	a.rel = "noopener";
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 6e4);
}
function PendingThumb({ file }) {
	if (file.mime === "application/pdf") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdfTile, { name: file.name });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: file.url,
		alt: "",
		className: "size-20 rounded-card border border-line object-cover"
	});
}
function StoredThumb({ file }) {
	const [url, setUrl] = (0, import_react.useState)(null);
	const [missing, setMissing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (file.mime === "application/pdf") return;
		let dead = false;
		let current = "";
		getFile(file.id).then((blob) => {
			if (dead) return;
			if (!blob) {
				setMissing(true);
				return;
			}
			current = URL.createObjectURL(blob);
			setUrl(current);
		}).catch(() => {
			if (!dead) setMissing(true);
		});
		return () => {
			dead = true;
			if (current) URL.revokeObjectURL(current);
		};
	}, [file.id, file.mime]);
	if (file.mime === "application/pdf") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdfTile, { name: file.name });
	if (missing) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MissingTile, {});
	if (!url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block size-20 rounded-card border border-line bg-paper" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt: "",
		className: "size-20 rounded-card border border-line object-cover"
	});
}
function PdfTile({ name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "grid size-20 content-center justify-items-center overflow-hidden rounded-card border border-line bg-paper px-1 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
			className: "size-5 text-accent",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "line-clamp-2 text-xs font-semibold leading-tight text-ink",
			children: name.replace(/\.pdf$/i, "")
		})]
	});
}
function MissingTile() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "grid size-20 place-items-center rounded-card border border-line bg-paper px-1 text-center text-xs font-semibold leading-tight text-muted",
		children: "Not on this phone"
	});
}
function FileViewer({ file, onClose, onRemove }) {
	const [url, setUrl] = (0, import_react.useState)(null);
	const [missing, setMissing] = (0, import_react.useState)(false);
	const closeRef = (0, import_react.useRef)(null);
	const safeRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		closeRef.current?.focus();
		let dead = false;
		let current = "";
		safeRef.current = null;
		getFile(file.id).then(async (blob) => {
			if (dead) return;
			if (!blob) {
				setMissing(true);
				return;
			}
			const safe = await trustedBlob(blob, file.mime);
			if (dead) return;
			if (!safe) {
				setMissing(true);
				return;
			}
			safeRef.current = safe;
			current = URL.createObjectURL(safe);
			setUrl(current);
		}).catch(() => {
			if (!dead) setMissing(true);
		});
		return () => {
			dead = true;
			safeRef.current = null;
			if (current) URL.revokeObjectURL(current);
		};
	}, [file.id, file.mime]);
	async function share() {
		const blob = safeRef.current;
		if (!blob) {
			useApp.getState().flash("That file is not on this phone.");
			return;
		}
		const shared = new File([blob], file.name, { type: blob.type || file.mime });
		try {
			if (navigator.canShare?.({ files: [shared] })) {
				await navigator.share({
					files: [shared],
					title: file.name
				});
				return;
			}
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") return;
		}
		if (!url) return;
		const a = document.createElement("a");
		a.href = url;
		a.download = file.name;
		a.click();
	}
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "no-print fixed inset-0 z-40 flex justify-center bg-inverse",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": file.name,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full w-full max-w-lg flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "safe-top flex items-center justify-between px-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						ref: closeRef,
						type: "button",
						onClick: onClose,
						className: "flex min-h-11 items-center px-2 text-sm font-semibold text-on-navy",
						"aria-label": "Back",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
							className: "size-5 shrink-0",
							"aria-hidden": true
						}), "Back"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void share(),
						disabled: !url,
						className: "min-h-11 px-3 text-sm font-semibold text-on-navy disabled:opacity-40",
						children: "Share"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 flex-1 items-center justify-center px-4",
					children: [
						missing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-on-navy",
							children: "That file is not on this phone."
						}),
						!missing && !url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-on-navy",
							children: "Opening…"
						}),
						url && file.mime !== "application/pdf" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: url,
							alt: file.name,
							className: "max-h-full max-w-full object-contain"
						}),
						url && file.mime === "application/pdf" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: url,
							target: "_blank",
							rel: "noopener",
							className: "rounded-full bg-sheet px-4 py-3 text-sm font-semibold text-accent",
							children: ["Open ", file.name]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "safe-bottom bg-sheet px-4 pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-ink",
						children: file.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onRemove,
						className: "mt-1 min-h-11 text-sm font-semibold text-stop",
						children: "Remove this file"
					})]
				})
			]
		})
	}), document.body);
}
function AboutView() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 text-sm text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "November 2026 edition" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				className: "mt-1 font-display text-3xl",
				children: "About RivetCare"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-base text-ink",
				children: "Owner's book for your Airstream"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "@RivetCareApp"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => useApp.getState().push({ name: "privacy" }),
				className: "mt-2 block min-h-11 text-sm font-semibold text-accent",
				children: "Privacy and where the data stays"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => useApp.getState().push({ name: "support" }),
				className: "mt-1 block min-h-11 text-sm font-semibold text-accent",
				children: "Support"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => useApp.getState().push({ name: "records" }),
				className: "mt-1 block min-h-11 text-left text-sm font-semibold text-accent",
				children: "Dealer and roadside are saved under Records"
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DisclaimerCopy, {})]
	});
}
//#endregion
export { AboutView, ChecklistView, ChecklistsView, CodesView, DisclaimerCopy, LogView, ProceduresView, RecallsView, SpecsView, ToolsView };
