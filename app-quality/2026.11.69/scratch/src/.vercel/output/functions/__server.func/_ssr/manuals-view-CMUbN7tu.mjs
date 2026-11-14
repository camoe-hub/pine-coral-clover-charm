import { i as __toESM } from "../_runtime.mjs";
import { c as coachYear } from "./coach-KEaWY9VI.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { et as useApp } from "./store-C3gr-Jyz.mjs";
import { i as manualYears, n as manualLinks, r as manualRevision, t as LIBRARY_URL } from "./manuals-DbozeEkY.mjs";
//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/manuals-view-CMUbN7tu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ManualsView() {
	const vin = useApp((s) => s.vin);
	const fromVin = coachYear(vin, useApp((s) => s.modelYear));
	const [year, setYear] = (0, import_react.useState)(fromVin && manualYears.includes(fromVin) ? fromVin : "all");
	const [kind, setKind] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		const seen = /* @__PURE__ */ new Set();
		return manualLinks.filter((m) => {
			if (seen.has(m.url)) return false;
			seen.add(m.url);
			if (year !== "all" && m.year !== year) return false;
			if (kind !== "all" && m.kind !== kind) return false;
			if (!needle) return true;
			return `${m.year} ${m.title} ${m.brand}`.toLowerCase().includes(needle);
		});
	}, [
		year,
		kind,
		q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl text-ink",
			children: "Manuals"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-sm text-muted",
			children: [
				"Factory manuals and parts books, 2000 through ",
				manualYears[0],
				". They open on Airstream’s site. Nothing is stored in this app."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: LIBRARY_URL,
			target: "_blank",
			rel: "noopener noreferrer",
			className: "mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-accent",
			children: "All files on Airstream.com"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "chip-row chip-scroll chip-fade -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1",
			role: "group",
			"aria-label": "Year",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				on: year === "all",
				onClick: () => setYear("all"),
				children: "All years"
			}), manualYears.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				on: year === y,
				onClick: () => setYear(y),
				children: String(y)
			}, y))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 flex gap-2",
			role: "group",
			"aria-label": "Kind of book",
			children: [
				["all", "All"],
				["manual", "Owner’s"],
				["parts", "Parts"]
			].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				on: kind === id,
				onClick: () => setKind(id),
				children: label
			}, id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "mt-3 block text-sm font-semibold text-ink",
			htmlFor: "manual-search",
			children: "Find a manual"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id: "manual-search",
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Flying Cloud, Classic, Bambi…",
			inputMode: "search",
			autoCapitalize: "off",
			autoCorrect: "off",
			spellCheck: false,
			className: "mt-2 min-h-11 w-full rounded-full border border-line bg-sheet px-4 text-ink"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: year === "all" && !q.trim() ? `${rows.length} files. Pick a year or search to shorten the list.` : `${rows.length} files`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 rounded-card border border-line bg-sheet",
			children: (year === "all" && !q.trim() ? rows.slice(0, 24) : rows).map((m, i, list) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: i === list.length - 1 ? "" : "border-b border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: m.url,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "block px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-semibold text-ink",
							children: m.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-muted",
							children: [
								m.year,
								" · ",
								m.kind === "parts" ? "Parts book" : "Owner’s manual",
								manualRevision(m.url) ? ` · ${manualRevision(m.url)}` : " · no revision in the file name",
								m.brand ? ` · ${m.brand}` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: " Opens the Airstream PDF in a new tab."
						})
					]
				})
			}, `${m.year}-${m.kind}-${m.title}-${m.url}`))
		}),
		rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "Nothing matches. Try all years, or the Airstream library."
		})
	] });
}
function Chip({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		"aria-pressed": on,
		className: `min-h-11 min-w-11 shrink-0 rounded-full px-3 text-sm font-semibold ${on ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink"}`,
		children
	});
}
//#endregion
export { ManualsView };
