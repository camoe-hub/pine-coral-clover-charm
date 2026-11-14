import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { tt as useApp, u as closeFiles } from "./store-DUUzfVvp.mjs";
import { u as PageTitle } from "./router-Cw9i5Ud6.mjs";
import { l as closeRestoreUndo } from "./routes-xIOD81ex.mjs";
import { PrivacySections } from "./legal-copy-1dLCID2q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-view-Dk_QZjcS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Delete every on-phone database, and finish only after each one has succeeded or failed once. */
var ERASE_DATABASES = [
	"rivetcare-files",
	"rivetcare-books",
	"rivetcare-undo"
];
var ERASE_WAIT_MS = 4e3;
function eraseDatabases(idb, names = ERASE_DATABASES, timeoutMs = ERASE_WAIT_MS) {
	return new Promise((resolve) => {
		const settled = /* @__PURE__ */ new Set();
		let ok = true;
		let finished = false;
		const finish = (good) => {
			if (finished) return;
			finished = true;
			clearTimeout(timer);
			resolve(good);
		};
		const settle = (name, good) => {
			if (finished || settled.has(name)) return;
			settled.add(name);
			ok = ok && good;
			if (settled.size === names.length) finish(ok);
		};
		const timer = setTimeout(() => finish(false), timeoutMs);
		try {
			for (const name of names) {
				const req = idb.deleteDatabase(name);
				req.onsuccess = () => settle(name, true);
				req.onerror = () => settle(name, false);
			}
		} catch {
			finish(false);
		}
	});
}
var KEYS = [
	"rivetcare-v1",
	"rivetcare-v1-unreadable",
	"rivetcare-v1-before-trim",
	"rivetcare-weights",
	"rivetcare-theme",
	"rivetcare-spoke",
	"rivetcare-service",
	"rivetcare-offline-set",
	"rivetcare-level",
	"rivetcare-level-zero"
];
function clearNamedStorage() {
	const drop = new Set(KEYS);
	try {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith("rivetcare-")) drop.add(key);
		}
	} catch {}
	for (const key of drop) localStorage.removeItem(key);
	try {
		const session = [];
		for (let i = 0; i < sessionStorage.length; i++) {
			const key = sessionStorage.key(i);
			if (key && key.startsWith("rivetcare-")) session.push(key);
		}
		for (const key of session) sessionStorage.removeItem(key);
	} catch {}
}
function PrivacyView() {
	const flash = useApp((s) => s.flash);
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function erase() {
		if (busy) return;
		setBusy(true);
		closeFiles();
		closeRestoreUndo();
		clearNamedStorage();
		if (!await eraseDatabases(indexedDB)) {
			setBusy(false);
			flash("The records were removed. A photo file was still open, so clear this site’s data in the browser to finish.");
			window.setTimeout(() => window.location.reload(), 1600);
			return;
		}
		window.location.reload();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				className: "font-display text-3xl text-ink",
				children: "Privacy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacySections, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-2 rounded-card border border-line bg-sheet p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-ink",
						children: "Delete the records"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base text-ink",
						children: "This removes the trailers, the log, the photos, the notes, the scale tickets, the floor-level spans, the phone zero, the saved shop search, a restore undo copy, and a saved parts list on this phone. Anything else this app saved under its own name on this phone goes with them. A backup file you already saved in Files is not deleted. The app itself can stay until you clear this site’s data in the browser."
					}),
					confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base font-semibold text-ink",
								children: "This cannot be undone."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void erase(),
								disabled: busy,
								className: "min-h-12 w-full rounded-full border border-stop px-4 font-semibold text-stop disabled:opacity-40",
								children: busy ? "Deleting…" : "Delete the records on this phone"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setConfirm(false),
								disabled: busy,
								className: "min-h-11 w-full font-semibold text-accent",
								children: "Keep them"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setConfirm(true),
						className: "min-h-11 font-semibold text-stop",
						children: "Delete all local records"
					})
				]
			})
		]
	});
}
//#endregion
export { PrivacyView };
