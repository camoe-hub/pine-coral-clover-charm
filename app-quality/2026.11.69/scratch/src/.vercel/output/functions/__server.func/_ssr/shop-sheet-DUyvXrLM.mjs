import { C as tasks, c as coachYear, p as modelById, y as procedureFits } from "./coach-KEaWY9VI.mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as lowWheels, E as oldestTire, J as tireAges, S as jobMark, U as sideNeedsReplace, V as serviceTotal, Z as treadNeedsReplace, et as useApp, h as dueWhy, i as WHEELS, m as dueOf, r as PLATE_FIELDS, y as formatWhen } from "./store-C3gr-Jyz.mjs";
import { p as Printer } from "../_libs/lucide-react.mjs";
//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/shop-sheet-DUyvXrLM.js
var import_jsx_runtime = require_jsx_runtime();
function ShopSheet() {
	const model = modelById(useApp((s) => s.modelId));
	const vin = useApp((s) => s.vin);
	const odo = useApp((s) => s.odometer);
	const done = useApp((s) => s.done);
	const tires = useApp((s) => s.tires);
	const dealer = useApp((s) => s.dealer);
	const dealerAddress = useApp((s) => s.dealerAddress);
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const nickname = useApp((s) => s.nickname);
	const plates = useApp((s) => s.plates);
	const log = useApp((s) => s.log);
	const ages = tireAges(tires);
	const oldest = oldestTire(tires);
	const due = tasks.filter((t) => {
		if (t.fit === "classic" && !model.alde && model.family !== "Other") return false;
		if (t.fit === "gt" && model.family !== "Globetrotter" && model.family !== "Other") return false;
		if (t.procedureId && !procedureFits(t.procedureId, model, year)) return false;
		const state = dueOf(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo);
		return state === "due" || state === "unset";
	});
	const notes = log.filter((entry) => !entry.note.startsWith("Path taken")).slice(0, 8);
	const diagnostics = log.filter((entry) => entry.note.startsWith("Path taken")).slice(0, 3);
	const equipment = PLATE_FIELDS.map((field) => ({
		label: field.label,
		value: plates[field.key]
	})).filter((row) => row.value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "print-sheet",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => window.print(),
					className: "flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-navy px-4 font-semibold text-on-navy",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {
						className: "size-5",
						"aria-hidden": true
					}), "Print or save as PDF"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "One page for the shop. Print, then choose Save as PDF. The full history is the CSV on the service log. This is a record, not a work order."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-ink",
				children: nickname || model.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-ink",
				children: [model.name, year ? ` · ${year}` : " · Year not set"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink",
				children: vin ? `VIN ${vin}` : "VIN not entered"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink",
				children: odo > 0 ? `${odo.toLocaleString()} trailer miles` : "Trailer miles not set"
			}),
			dealer || dealerAddress ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-ink",
				children: [
					"Dealer: ",
					dealer || "Saved",
					dealerAddress ? ` · ${dealerAddress}` : "",
					(dealer || dealerAddress) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "font-semibold text-accent",
						href: `https://maps.apple.com/?q=${encodeURIComponent([dealer, dealerAddress].filter(Boolean).join(", "))}`,
						target: "_blank",
						rel: "noreferrer",
						children: "Map"
					})] })
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-5 font-display text-xl text-ink",
				children: "Installed equipment"
			}),
			equipment.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink",
				children: "No appliance plates saved. Read them off the units in Glovebox."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 text-sm text-ink",
				children: equipment.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					row.label,
					": ",
					row.value
				] }, row.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-5 font-display text-xl text-ink",
				children: "Diagnostic results"
			}),
			diagnostics.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink",
				children: "No flowchart report is in the log. A saved flowchart report is a path taken, not a diagnosis."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 space-y-2 text-sm text-ink",
				children: diagnostics.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Visit, { entry }) }, entry.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-5 font-display text-xl text-ink",
				children: "Tires"
			}),
			tires.psi || tires.dot || tires.on || tires.rotated || oldest || tires.checks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-1 text-sm text-ink",
				children: [
					tires.psi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Placard cold pressure written down: ",
						tires.psi,
						" psi"
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Placard pressure not set" }),
					tires.rotated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Last rotation ",
						formatWhen(tires.rotated),
						". Same side, front and rear."
					] }) : null,
					WHEELS.map((wheel) => {
						const row = tires.wheels[wheel.id];
						if (!row) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [wheel.label, ": not set"] }, wheel.id);
						const bits = [
							row.dot ? `DOT ${row.dot}` : "DOT not set",
							row.on ? `mounted ${formatWhen(row.on)}` : "",
							row.tread ? treadNeedsReplace(row.tread) ? `tread ${row.tread === "replace" ? "replace" : `${row.tread}/32, replace`}` : `tread ${row.tread === "ok" ? "ok" : `${row.tread}/32`}` : "",
							sideNeedsReplace(row.side) ? "sidewall replace" : row.side === "ok" ? "sidewall ok" : ""
						].filter(Boolean);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							wheel.label,
							": ",
							bits.join(", ")
						] }, wheel.id);
					}),
					oldest && oldest.id !== "set" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Oldest tire: ",
						oldest.label,
						", DOT ",
						oldest.dot,
						", about ",
						Math.floor(oldest.years),
						" years. The 5-year replace follows this tire."
					] }) : tires.dot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"One code for the set, DOT ",
						tires.dot,
						ages.dotYears != null ? `, about ${Math.floor(ages.dotYears)} years old` : ""
					] }) : null,
					tires.on && (!oldest || oldest.id === "set") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Mounted ",
						formatWhen(tires.on),
						ages.onYears != null ? `, about ${Math.floor(ages.onYears)} years on the trailer` : ""
					] }) : null,
					tires.checks[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						"Last cold check ",
						formatWhen(tires.checks[0].on),
						tires.checks[0].note ? `, ${tires.checks[0].note}` : "",
						lowWheels(tires.psi, tires.checks[0]).length ? `. More than 20% under the placard: ${lowWheels(tires.psi, tires.checks[0]).map((id) => WHEELS.find((wheel) => wheel.id === id)?.label).filter(Boolean).join(", ")}` : ""
					] }) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink",
				children: "Tire dates not set."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-5 font-display text-xl text-ink",
				children: "Due or never recorded"
			}),
			due.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink",
				children: "Nothing on the schedule is due."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 space-y-1 text-sm text-ink",
				children: due.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					t.title,
					". ",
					dueWhy(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo)
				] }, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-5 font-display text-xl text-ink",
				children: "Service history"
			}),
			notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink",
				children: "No service notes yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 space-y-2 text-sm text-ink",
				children: notes.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Visit, { entry }) }, entry.id))
			}),
			log.length > notes.length + diagnostics.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-ink",
				children: "Older visits are in the service log. Export history for the full CSV."
			}) : null
		]
	});
}
function OwnerHistory() {
	const model = modelById(useApp((s) => s.modelId));
	const vin = useApp((s) => s.vin);
	const year = coachYear(vin, useApp((s) => s.modelYear));
	const nickname = useApp((s) => s.nickname);
	const odo = useApp((s) => s.odometer);
	const log = useApp((s) => s.log);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "print-sheet",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => window.print(),
					className: "flex min-h-12 w-full items-center justify-center rounded-full bg-navy px-4 font-semibold text-on-navy",
					children: "Print or save as PDF"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "This is the service history on this phone. The browser’s print sheet can save it as a PDF. It is a record, not a work order."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-ink",
				children: nickname || model.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-ink",
				children: [model.name, year ? ` · ${year}` : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink",
				children: vin ? `VIN ${vin}` : "VIN not entered"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink",
				children: odo > 0 ? `${odo.toLocaleString()} trailer miles` : "Trailer miles not set"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-5 font-display text-xl text-ink",
				children: "Service history"
			}),
			log.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink",
				children: "No service records yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 space-y-3 text-sm text-ink",
				children: log.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Visit, { entry }) }, entry.id))
			})
		]
	});
}
function Visit({ entry }) {
	const bits = [
		entry.work ? `Work: ${entry.work}` : "",
		entry.provider ? `Shop: ${entry.provider}` : "",
		entry.parts ? `Parts: ${entry.parts}` : "",
		entry.partsCost ? `Parts cost: ${entry.partsCost}` : "",
		entry.laborCost ? `Labor: ${entry.laborCost}` : "",
		entry.cost || serviceTotal(entry.partsCost, entry.laborCost) ? `Total: ${entry.cost || serviceTotal(entry.partsCost, entry.laborCost)}` : "",
		entry.warranty ? `Warranty: ${entry.warranty}` : "",
		entry.tech ? `Technician: ${entry.tech}` : "",
		entry.note ? entry.note : ""
	].filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums",
			children: formatWhen(entry.iso)
		}),
		entry.miles ? ` · ${entry.miles.toLocaleString()} mi` : "",
		entry.job ? `. ${entry.job}` : "",
		bits.length ? `. ${bits.join(". ")}` : ""
	] });
}
//#endregion
export { OwnerHistory, ShopSheet };
