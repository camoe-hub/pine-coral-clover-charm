import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { tt as useApp } from "./store-DUUzfVvp.mjs";
import { a as Btn, u as PageTitle } from "./router-Cw9i5Ud6.mjs";
import { n as BOOK_VERSION } from "./routes-xIOD81ex.mjs";
import { SupportSections } from "./legal-copy-1dLCID2q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/support-view-P5JRvLil.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectCopy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl text-ink",
			children: "This copy"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => window.dispatchEvent(new Event("rivetcare-check-update")),
			className: "flex min-h-11 items-center text-left text-sm font-semibold text-ink",
			children: [
				"Version ",
				BOOK_VERSION,
				". Check for an update"
			]
		})]
	});
}
function SupportView() {
	const addNote = useApp((s) => s.addNote);
	const flash = useApp((s) => s.flash);
	const [draft, setDraft] = (0, import_react.useState)("");
	async function save() {
		const body = draft.trim();
		if (!body) {
			flash("Write what disagrees with the manual or the plate.");
			return;
		}
		if (await Promise.resolve(addNote(`Possible error. ${body} This note stays on the phone.`)) === false) {
			flash("Could not save that note.");
			return;
		}
		setDraft("");
		flash("Saved in notes. Nothing is sent.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				className: "font-display text-3xl text-ink",
				children: "Support"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-ink",
						children: "Report a wrong step"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base text-ink",
						children: "Write what the step got wrong. The note stays on this phone. Nothing is sent."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						htmlFor: "wrong-step",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "What the step got wrong"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "wrong-step",
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							maxLength: 2e3,
							rows: 4,
							placeholder: "The step, the page, and what the manual or the plate says",
							className: "min-h-28 w-full rounded-card border border-line bg-sheet px-4 py-3 text-base"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						className: "w-full",
						onClick: () => void save(),
						children: "Save the note"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportSections, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectCopy, {})
		]
	});
}
//#endregion
export { SupportView };
