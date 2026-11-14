import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { K as supplyAges, b as formatWhen, tt as useApp } from "./store-DUUzfVvp.mjs";
import { a as Btn, c as Kicker, o as Card, u as PageTitle } from "./router-Cw9i5Ud6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supplies-view-d5m_oUEf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function years(n) {
	const whole = Math.max(0, Math.floor(n));
	return whole === 1 ? "about 1 year" : `about ${whole} years`;
}
function SuppliesView() {
	const saved = useApp((s) => s.supplies);
	const modelId = useApp((s) => s.modelId);
	const part = useApp((s) => {
		const open = s.trail[s.cursor]?.screen;
		return open?.name === "supplies" ? open.part : void 0;
	});
	const setSupplies = useApp((s) => s.setSupplies);
	const flash = useApp((s) => s.flash);
	const [propane, setPropane] = (0, import_react.useState)(saved.propane);
	const [battery, setBattery] = (0, import_react.useState)(saved.battery);
	(0, import_react.useEffect)(() => {
		setPropane(saved.propane);
		setBattery(saved.battery);
	}, [
		modelId,
		saved.propane,
		saved.battery
	]);
	(0, import_react.useEffect)(() => {
		if (!part) return;
		const field = document.getElementById(part === "battery" ? "battery-date" : "propane-date");
		field?.scrollIntoView({ block: "center" });
		if (field instanceof HTMLInputElement) field.focus({ preventScroll: true });
	}, [part]);
	const ages = supplyAges({
		propane,
		battery
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kicker, { children: "Collar stamp and battery label" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			className: "mt-1 font-display text-3xl text-ink",
			children: "Cylinders and batteries"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "The collar date is on the cylinder, not the tank cover. If the stamp is a month and year, use the first of that month. Battery age is the day these batteries went in."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4 space-y-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm font-semibold text-ink",
					htmlFor: "propane-date",
					children: "Propane cylinder date"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "propane-date",
					type: "date",
					value: propane,
					onChange: (e) => setPropane(e.target.value),
					className: "min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base text-ink"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "block text-sm font-semibold text-ink",
					htmlFor: "battery-date",
					children: "Battery install date"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "battery-date",
					type: "date",
					value: battery,
					onChange: (e) => setBattery(e.target.value),
					className: "min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base text-ink"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					className: "w-full",
					onClick: () => {
						setSupplies({
							propane,
							battery
						});
						flash("Saved on this phone");
					},
					children: "Save on this phone"
				})
			]
		}),
		(ages.propaneYears != null || ages.batteryYears != null) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4 space-y-2 p-4 text-sm text-ink",
			children: [ages.propaneYears != null && propane ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [ages.propaneYears < 0 ? "That cylinder date is ahead of today." : `Cylinder date ${formatWhen(propane)} · ${years(ages.propaneYears)}.`, ages.propaneYears >= 12 ? " DOT cylinders are often requalified 12 years after the collar date. Confirm the stamp and the shop. This app does not recertify a cylinder." : ""] }) : null, ages.batteryYears != null && battery ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [ages.batteryYears < 0 ? "That battery date is ahead of today." : `Batteries installed ${formatWhen(battery)} · ${years(ages.batteryYears)}.`, ages.batteryYears >= 5 ? " Flooded batteries often fade around 5 years. Lithium lasts longer. The label and the manual govern, not this app." : ""] }) : null]
		})
	] });
}
//#endregion
export { SuppliesView };
