import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as oldestTire, G as supplyAges, J as tireAges, et as useApp, y as formatWhen } from "./store-C3gr-Jyz.mjs";
import { D as ClipboardList, M as Camera, O as CircleDot, S as Flame, c as Shield, d as Scale, h as Pencil, k as ChevronRight } from "../_libs/lucide-react.mjs";
import { f as Btn } from "./routes-BL7pyKhp.mjs";
//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/records-view-CYCH79fs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RecordsView() {
	const push = useApp((s) => s.push);
	const log = useApp((s) => s.log);
	const notes = useApp((s) => s.notes);
	const lastBackup = useApp((s) => s.lastBackup);
	const shots = useApp((s) => s.shots);
	const fileCount = log.reduce((n, entry) => n + (entry.files?.length ?? 0), 0) + Object.values(shots).reduce((n, files) => n + files.length, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Everything here is saved on this phone and works with no signal."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachRecordLinks, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordRow, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-5" }),
				title: "Backup",
				detail: lastBackup ? `Last backup saved ${formatWhen(lastBackup)}` : "No backup saved yet. Export or restore a file.",
				onClick: () => push({ name: "backup" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordRow, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-5" }),
				title: "Service history",
				detail: log.length ? `${log.length} saved` : "None yet. Record the first visit.",
				onClick: () => push({ name: "log" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordRow, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-5" }),
				title: "Photos and receipts",
				detail: fileCount ? `${fileCount} saved` : "None yet. Add the first one.",
				onClick: () => push({ name: "log" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordRow, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-5" }),
				title: "Weight tickets",
				detail: "Scale numbers for this coach.",
				onClick: () => push({ name: "weights" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordRow, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-5" }),
				title: "Personal notes",
				detail: notes.length ? `${notes.length} saved` : "None yet. Add a reminder for this trailer.",
				onClick: () => push({ name: "notes" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DealerCard, {})
		]
	});
}
function DealerCard() {
	const dealer = useApp((s) => s.dealer);
	const dealerAddress = useApp((s) => s.dealerAddress);
	const setDealer = useApp((s) => s.setDealer);
	const setDealerAddress = useApp((s) => s.setDealerAddress);
	const hydrated = useApp((s) => s.hydrated);
	const modelId = useApp((s) => s.modelId);
	const [text, setText] = (0, import_react.useState)(dealer);
	const [address, setAddress] = (0, import_react.useState)(dealerAddress);
	(0, import_react.useEffect)(() => {
		if (hydrated) {
			setText(dealer);
			setAddress(dealerAddress);
		}
	}, [
		hydrated,
		dealer,
		dealerAddress,
		modelId
	]);
	const map = [dealer, dealerAddress].map((part) => part.trim()).filter(Boolean).join(", ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-[18px] border border-line bg-sheet p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-sm font-semibold text-ink",
				htmlFor: "dealer",
				children: "My dealer / roadside"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "dealer",
				value: text,
				onChange: (e) => setText(e.target.value),
				placeholder: "Name and phone",
				className: "mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "mt-3 block text-sm font-semibold text-ink",
				htmlFor: "dealer-address",
				children: "Address"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "dealer-address",
				value: address,
				onChange: (e) => setAddress(e.target.value),
				placeholder: "Street, city, ZIP",
				autoComplete: "street-address",
				className: "mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "mt-3",
				onClick: () => {
					setDealer(text);
					setDealerAddress(address);
				},
				children: "Save on this phone"
			}),
			dealer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-semibold text-ink",
				children: dealer
			}) : null,
			dealerAddress ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-ink",
				children: dealerAddress
			}) : null,
			map ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "mt-1 inline-flex min-h-11 items-center font-semibold text-accent",
				href: `https://maps.apple.com/?q=${encodeURIComponent(map)}`,
				target: "_blank",
				rel: "noreferrer",
				children: "Open in Maps"
			}) : null
		]
	});
}
/** Tire record and propane cylinders/batteries. On Records, and under the schedule on Maintain. */
function CoachRecordLinks() {
	const push = useApp((s) => s.push);
	const tires = useApp((s) => s.tires);
	const supplies = useApp((s) => s.supplies);
	const ages = tireAges(tires);
	const oldest = oldestTire(tires);
	const supply = supplyAges(supplies);
	const tireBits = [
		tires.psi ? `${tires.psi} psi cold` : "",
		oldest && oldest.id !== "set" ? `${oldest.label} oldest, about ${Math.floor(oldest.years)} years` : "",
		oldest && oldest.id === "set" ? `DOT about ${Math.floor(oldest.years)} years` : "",
		!oldest && ages.onYears != null ? `mounted about ${Math.floor(ages.onYears)} years` : ""
	].filter(Boolean);
	const supplyBits = [supply.propaneYears != null && supply.propaneYears >= 0 ? `cylinder about ${Math.floor(supply.propaneYears)} years` : "", supply.batteryYears != null && supply.batteryYears >= 0 ? `batteries about ${Math.floor(supply.batteryYears)} years` : ""].filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordRow, {
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDot, { className: "size-5" }),
		title: "Tire record",
		detail: tireBits.length ? tireBits.join(", ") : "DOT code, mount date, and cold pressure for each wheel.",
		onClick: () => push({ name: "tires" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordRow, {
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-5" }),
		title: "Propane cylinders/batteries",
		detail: supplyBits.length ? supplyBits.join(", ") : "Collar date on the cylinder, and when the batteries went in.",
		onClick: () => push({ name: "supplies" })
	})] });
}
function RecordRow({ icon, title, detail, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex w-full items-center gap-3 rounded-[18px] border border-line bg-sheet px-3 py-3 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-10 shrink-0 place-items-center rounded-xl bg-paper text-ok",
				"aria-hidden": true,
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-semibold text-ink",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-sm text-muted",
					children: detail
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
				className: "size-5 shrink-0 self-center text-muted",
				"aria-hidden": true
			})
		]
	});
}
//#endregion
export { CoachRecordLinks, RecordsView };
