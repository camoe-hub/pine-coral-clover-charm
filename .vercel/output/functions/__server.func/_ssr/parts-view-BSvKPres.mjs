import { i as __toESM } from "../_runtime.mjs";
import { c as coachPart, l as coachYear, m as modelById } from "./checklists-CYZuG9Db.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { tt as useApp } from "./store-DUUzfVvp.mjs";
import { T as Copy } from "../_libs/lucide-react.mjs";
import { a as Btn, c as Kicker, d as Pill, o as Card, u as PageTitle } from "./router-Cw9i5Ud6.mjs";
import { r as dropBookParts } from "./routes-xIOD81ex.mjs";
import { n as textHasWords, r as wordsOf } from "./words-CD5GbNH1.mjs";
import { t as modelYearsIn } from "./year-scope-abgC83Lw.mjs";
import { t as ScopedCopy } from "./scoped-copy-Cx2pNeOk.mjs";
import { n as parts, t as partById } from "./parts-BQFqy33o.mjs";
import { a as partsBookFor, t as LIBRARY_URL } from "./manuals-DbozeEkY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parts-view-BSvKPres.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EXAMPLE = /,?\s+including\b[^.]*/gi;
var FAMILY = /\b(?:globetrotter|classic|flying cloud|trade wind|bambi|basecamp|international|caravel|stetson|world traveler|frank lloyd wright)\b/gi;
function sentences(text) {
	const clean = text.replace(/\s+/g, " ").trim();
	if (!clean) return [];
	return clean.split(/(?<=[.!?])\s+/).filter(Boolean);
}
/** Distinctive tokens of an ordering number. Short hardware sizes are not tokens. */
function partTokens(pn) {
	const kept = /* @__PURE__ */ new Set();
	for (const raw of pn.split(/[\s/·,]+/)) {
		const token = raw.trim();
		if (/(?:\d{4,}|\d{2,}-\d)/.test(token)) kept.add(token);
	}
	return [...kept];
}
function hasToken(sentence, token) {
	const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`(?<![A-Za-z0-9-])${escaped}(?![A-Za-z0-9-])`, "i").test(sentence);
}
function isYearStamp(sentence) {
	if (!modelYearsIn(sentence).length) return false;
	return sentence.replace(/\b(?:19|20)\d{2}\b/g, " ").replace(FAMILY, " ").replace(/[^a-z]+/gi, "").length === 0;
}
function isConfirm(sentence) {
	return /^(confirm|verify|quote|read|match|check)\b/i.test(sentence.trim());
}
function isNegation(sentence) {
	return /^not\b/i.test(sentence.trim());
}
/** “690732-02 is the furnace assembly” names the number. It is not a use. */
function isIdentity(sentence, tokens) {
	if (!tokens.some((token) => hasToken(sentence, token))) return false;
	const without = tokens.reduce((text, token) => text.replace(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), " "), sentence);
	return /^(is|are)\b/i.test(without.replace(/[^a-z]+/gi, " ").trim());
}
function namesOtherNumber(sentence, tokens) {
	return (sentence.match(/\b[A-Za-z]{0,6}\d{4,}(?:-[A-Za-z0-9]+)*\b/g) ?? []).some((raw) => {
		if (/^(?:19|20)\d{2}$/.test(raw)) return false;
		const low = raw.toLowerCase();
		return !tokens.some((token) => {
			const offered = token.toLowerCase();
			return low === offered || offered.startsWith(low) || low.startsWith(offered);
		});
	});
}
/** Sentences that say where this number is used. A confirm line, a denial, or another number does not. */
function statedUses(application, tokens) {
	return sentences(application.replace(EXAMPLE, "")).filter((sentence) => {
		if (isConfirm(sentence) || isNegation(sentence) || isIdentity(sentence, tokens)) return false;
		if (!tokens.some((token) => hasToken(sentence, token)) && namesOtherNumber(sentence, tokens)) return false;
		return true;
	});
}
/**
* True when the offered number is tied to years that are not this coach.
* A floor-plan number with no year claim stays. No year set stays.
*/
function otherYearNumber(input) {
	const year = input.year;
	if (year == null) return false;
	const nameYears = modelYearsIn(input.name);
	if (nameYears.length > 0 && !nameYears.includes(year)) return true;
	const tokens = partTokens(input.pn);
	const hits = sentences([
		input.application,
		input.notes,
		input.coachNote
	].join(" ")).filter((sentence) => tokens.some((token) => hasToken(sentence, token)) && !isIdentity(sentence, tokens));
	if (hits.length) return !hits.some((sentence) => {
		const years = modelYearsIn(sentence);
		return years.length === 0 || years.includes(year);
	});
	const claimed = sentences(input.application.replace(EXAMPLE, ""));
	if (claimed.length && isYearStamp(claimed[0]) && !modelYearsIn(claimed[0]).includes(year)) {
		if (!claimed.slice(1).some((sentence) => modelYearsIn(sentence).includes(year))) return true;
	}
	const uses = statedUses(input.application, tokens);
	const yearUses = uses.filter((sentence) => modelYearsIn(sentence).length > 0);
	if (!yearUses.length || yearUses.length !== uses.length) return false;
	return yearUses.every((sentence) => !modelYearsIn(sentence).includes(year));
}
function offeredPart(part, model, year) {
	const view = coachPart(part, model);
	const otherYear = otherYearNumber({
		pn: view.pn,
		name: part.name,
		application: part.application,
		notes: part.notes,
		coachNote: view.note,
		year
	});
	return {
		...view,
		otherYear,
		title: otherYear ? part.name : view.name
	};
}
function PartsView() {
	const [q, setQ] = (0, import_react.useState)("");
	const [source, setSource] = (0, import_react.useState)("guide");
	const [system, setSystem] = (0, import_react.useState)("");
	const push = useApp((s) => s.push);
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const book = partsBookFor(model.id, model.family, year);
	(0, import_react.useEffect)(() => {
		dropBookParts();
	}, []);
	(0, import_react.useEffect)(() => {
		setSystem("");
	}, [model.id]);
	const guideList = (0, import_react.useMemo)(() => {
		const words = wordsOf(q);
		const pool = words.length ? parts : parts.filter((p) => {
			if (coachPart(p, model).hide) return false;
			if (source === "tools") return !!p.tool;
			if (p.tool) return false;
			if (system && p.system !== system) return false;
			return true;
		});
		const blob = (p) => `${p.name} ${p.pn} ${p.also ?? ""} ${p.application} ${p.system} ${p.notes}`;
		const matched = words.length ? pool.filter((p) => textHasWords(blob(p), words)) : pool.slice();
		if (words.length) {
			const rank = (p) => {
				const named = textHasWords(p.name, words);
				if (named && !p.id.startsWith("pn-")) return 0;
				if (named) return 1;
				if (textHasWords(`${p.pn} ${p.also ?? ""}`, words)) return 2;
				return 3;
			};
			return matched.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name)).slice(0, 30);
		}
		const order = [
			"Running gear",
			"Tires and wheels",
			"Axles and brakes",
			"Hitch",
			"Electrical",
			"Plumbing",
			"Water",
			"Water heater",
			"Alde",
			"Furnace",
			"Air conditioning",
			"Refrigerator",
			"Appliances",
			"Propane",
			"Body",
			"General"
		];
		return matched.sort((a, b) => {
			const ia = order.indexOf(a.system);
			const ib = order.indexOf(b.system);
			const d = (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
			if (d) return d;
			const ra = a.id.startsWith("pn-") ? 1 : 0;
			const rb = b.id.startsWith("pn-") ? 1 : 0;
			if (ra !== rb) return ra - rb;
			return a.pn.localeCompare(b.pn);
		});
	}, [
		q,
		source,
		system,
		model
	]);
	const visibleParts = (0, import_react.useMemo)(() => parts.filter((p) => !p.tool && !coachPart(p, model).hide), [model]);
	const partCount = visibleParts.length;
	const systems = (0, import_react.useMemo)(() => {
		const counts = /* @__PURE__ */ new Map();
		for (const p of visibleParts) counts.set(p.system, (counts.get(p.system) ?? 0) + 1);
		return [...counts.entries()];
	}, [visibleParts]);
	const searching = wordsOf(q).length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Service list and tools" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			className: "mt-1 font-display text-3xl text-ink",
			children: "Parts"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm text-muted",
			children: [partCount, " service reminders and the tool list. Numbers follow the selected floor, not every year of that floor. Quote the VIN before you order."]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Needs a signal" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-2xl text-ink",
					children: book.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-ink",
					children: book.note
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: book.url,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "mt-4 flex min-h-11 items-center justify-center rounded-full bg-navy px-4 text-sm font-semibold text-on-navy",
					children: "Open the parts book"
				}),
				book.url !== book.fallback ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: LIBRARY_URL,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "mt-2 flex min-h-11 items-center justify-center text-sm font-semibold text-accent",
					children: "If that file does not open"
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "chip-row -mx-4 mt-3 flex gap-2 overflow-x-auto px-4",
			children: [["guide", "Service list"], ["tools", "Tools"]].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setSource(id),
				className: `min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold ${source === id ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink"}`,
				children: label
			}, id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "mt-4 block text-sm font-semibold text-ink",
			htmlFor: "parts-search",
			children: "Search parts"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id: "parts-search",
			value: q,
			onChange: (e) => setQ(e.target.value),
			"aria-label": "Search parts",
			placeholder: "Search faucet, inverter, anode…",
			inputMode: "search",
			autoCapitalize: "off",
			autoCorrect: "off",
			spellCheck: false,
			className: "mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-ink"
		}),
		searching && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-2",
			children: guideList.map((p) => {
				const view = offeredPart(p, model, year);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => push({
						name: "part",
						id: p.id
					}),
					className: "w-full rounded-card border border-line bg-sheet px-3 py-3 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-ink",
								children: view.title
							}), view.hide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								tone: "warn",
								children: "Not on this coach"
							}) : null]
						}),
						view.otherYear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm text-muted",
							children: "Not this year’s part"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block font-mono text-sm text-accent wrap-anywhere",
							children: view.pn
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm text-muted",
							children: p.system
						})
					]
				}) }, p.id);
			})
		}),
		searching && guideList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 text-sm text-muted",
			children: "No part matches that. The factory book is the link above."
		}),
		!searching && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			source === "guide" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "chip-row -mx-4 mt-3 flex gap-2 overflow-x-auto px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSystem(""),
					className: `min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold ${system === "" ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink"}`,
					children: ["All ", partCount]
				}), systems.map(([name, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setSystem(name),
					className: `min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold ${system === name ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink"}`,
					children: [
						name,
						" ",
						count
					]
				}, name))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-ink",
				children: "Check the VIN or the data plate before you order. This list does not confirm the part."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: guideList.map((p, i) => {
					const view = offeredPart(p, model, year);
					const head = source === "guide" && (i === 0 || guideList[i - 1].system !== p.system);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [head && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 mt-4 font-display text-xl text-ink first:mt-0",
						children: p.system
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => push({
							name: "part",
							id: p.id
						}),
						className: "w-full rounded-card border border-line bg-sheet px-3 py-3 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-ink",
							children: view.title
						}), view.otherYear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm text-muted",
							children: "Not this year’s part"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block font-mono text-sm text-accent wrap-anywhere",
							children: view.pn
						})]
					})] }, p.id);
				})
			})
		] })
	] });
}
function PartView({ id }) {
	const flash = useApp((s) => s.flash);
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const p = partById(id);
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "That factory line is not stored in this app. Open the parts book on Airstream’s site."
	});
	const view = offeredPart(p, model, year);
	const copyText = [view.pn, p.also].filter(Boolean).join(" · ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: p.system }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				className: "mt-1 font-display text-3xl text-ink",
				children: view.title
			})] }),
			view.hide && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pill, {
				tone: "warn",
				children: ["Not the part for ", model.name]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [
					view.otherYear ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-ink",
							children: "Not this year’s part"
						}),
						view.name !== p.name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: view.name
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-sm text-muted wrap-anywhere",
							children: view.pn
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: p.tool ? "Carry this" : "For this coach" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-lg text-accent wrap-anywhere",
						children: view.pn
					})] }),
					view.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink",
						children: view.note
					}),
					p.also && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Also" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink",
						children: p.also
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
						className: "mt-4",
						onClick: async () => {
							try {
								await navigator.clipboard.writeText(copyText);
								flash("Copied");
							} catch {
								flash("Could not copy");
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy numbers"]
					})
				]
			}),
			p.verify && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
				tone: "warn",
				children: "Verify by VIN or data plate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopedCopy, {
					text: p.application,
					year
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScopedCopy, {
					text: p.notes,
					year
				})
			})
		]
	});
}
//#endregion
export { PartView, PartsView };
