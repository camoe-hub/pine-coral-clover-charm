import { i as __toESM } from "../_runtime.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { et as useApp } from "./store-C3gr-Jyz.mjs";
import { i as previewPathPrefix } from "./router-DrBUOS9N.mjs";
import { f as Btn, n as BOOK_VERSION } from "./routes-BL7pyKhp.mjs";
import { SupportSections } from "./legal-copy-HLcWwbVZ.mjs";
//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/support-view-CmLpRHKA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function phoneSave() {
	const nav = navigator;
	const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
	const standalone = window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
	let framed = false;
	try {
		framed = window.top !== window.self;
	} catch {
		framed = true;
	}
	return ios || standalone || framed;
}
async function readProjectZip(href) {
	const res = await fetch(href, { cache: "no-store" });
	if (!res.ok) throw new Error("missing");
	const buf = await res.arrayBuffer();
	const bytes = new Uint8Array(buf);
	if (bytes.length < 4 || bytes[0] !== 80 || bytes[1] !== 75) throw new Error("not a zip");
	return new File([buf], "rivetcare-book.zip", { type: "application/zip" });
}
function shareableZip(file) {
	if (typeof navigator === "undefined" || !navigator.share) return null;
	if (!navigator.canShare || navigator.canShare({ files: [file] })) return file;
	const plain = new File([file], file.name, { type: "application/octet-stream" });
	if (navigator.canShare({ files: [plain] })) return plain;
	return file;
}
function ProjectCopy() {
	const [zipHref, setZipHref] = (0, import_react.useState)("/rivetcare-book.zip");
	const [zipFile, setZipFile] = (0, import_react.useState)(null);
	const [zipBusy, setZipBusy] = (0, import_react.useState)(false);
	const zipStarted = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const prefix = previewPathPrefix(window.location.hostname, window.location.pathname) ?? "";
		setZipHref(`${prefix}/rivetcare-book.zip`);
	}, []);
	function loadZip() {
		if (zipFile || zipBusy || zipStarted.current) return;
		zipStarted.current = true;
		setZipBusy(true);
		readProjectZip(zipHref).then((file) => {
			setZipFile(file);
			setZipBusy(false);
		}).catch(() => {
			zipStarted.current = false;
			setZipBusy(false);
		});
	}
	function saveProjectZip(event) {
		const file = zipFile;
		if (!file || !phoneSave() || !navigator.share) return;
		const shareFile = shareableZip(file);
		if (!shareFile || navigator.canShare && !navigator.canShare({ files: [shareFile] })) return;
		event.preventDefault();
		try {
			const pending = navigator.share({
				files: [shareFile],
				title: "RivetCare"
			});
			Promise.resolve(pending).catch((err) => {
				if (err instanceof DOMException && err.name === "AbortError") return;
				window.location.assign(zipHref);
			});
		} catch {
			window.location.assign(zipHref);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl text-ink",
				children: "This copy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => window.dispatchEvent(new Event("rivetcare-check-update")),
				className: "flex min-h-11 items-center text-left text-sm font-semibold text-ink",
				children: [
					"Version ",
					BOOK_VERSION,
					". Check for an update"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: zipHref,
				download: "rivetcare-book.zip",
				onClick: saveProjectZip,
				onMouseEnter: loadZip,
				onFocus: loadZip,
				className: "flex min-h-11 items-center text-sm font-semibold text-ink",
				children: zipBusy && !zipFile ? "Getting the zip…" : "Save the project zip"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "The zip is the app source, not your miles, notes, or photos. Save a copy keeps the records. On iPhone, choose Save to Files if a share sheet opens."
			})
		]
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
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
