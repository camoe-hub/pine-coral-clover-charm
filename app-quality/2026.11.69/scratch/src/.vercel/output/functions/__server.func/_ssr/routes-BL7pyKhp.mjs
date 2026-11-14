import { i as __toESM } from "../_runtime.mjs";
import { C as tasks, D as vinProblem, E as vinOk, O as vinYear, T as vinMismatch, c as coachYear, m as modelGroups, p as modelById, y as procedureFits } from "./coach-KEaWY9VI.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { t as WEIGHTS_KEY } from "./weights-DTEOTqeP.mjs";
import { q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as screenTitle, F as putFile, G as supplyAges, K as tabFor, P as prepareFile, S as jobMark, T as nextDue, X as todayIso, Y as tirePhotoIds, b as getFile, et as useApp, f as daysBetween, h as dueWhy, k as pickNextTask, m as dueOf, n as LEVEL_KEY, p as deleteFile, w as maintainBand, x as homeTireLine, y as formatWhen, z as retorqueWatch } from "./store-C3gr-Jyz.mjs";
import { i as previewPathPrefix, n as MISSING_SCREEN, r as isMissingScreen } from "./router-DrBUOS9N.mjs";
import { A as ChevronLeft, D as ClipboardList, F as BookOpen, M as Camera, N as Calendar, P as Box, _ as Moon, a as TriangleAlert, b as KeyRound, c as Shield, d as Scale, f as Ruler, g as OctagonAlert, k as ChevronRight, l as Search, m as Plus, n as X, o as Sun, r as Wrench, v as MapPin, x as House, y as ListChecks } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/routes-BL7pyKhp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DB$1 = "rivetcare-undo";
var META = "meta";
var BLOBS = "blobs";
var META_KEY = "current";
var BOOK_KEY = "rivetcare-v1";
var RESTORE_NOTE = "rivetcare-restore-note";
var writing = false;
var applying = false;
var listeners$3 = /* @__PURE__ */ new Set();
var known = false;
function restoreApplying() {
	return applying;
}
function setRestoreApplying(on) {
	applying = on;
}
var shared = null;
var opening = null;
function photoIdsOnPhone(state) {
	const ids = /* @__PURE__ */ new Set();
	const take = (coach) => {
		if (!coach) return;
		if (coach.photoId) ids.add(coach.photoId);
		for (const entry of coach.log ?? []) for (const file of entry.files ?? []) if (file.id) ids.add(file.id);
		for (const files of Object.values(coach.shots ?? {})) for (const file of files) if (file.id) ids.add(file.id);
		for (const file of coach.logDraft?.files ?? []) if (file.id) ids.add(file.id);
		for (const id of tirePhotoIds(coach.tires)) ids.add(id);
	};
	take(state);
	for (const coach of Object.values(state.coaches ?? {})) take(coach);
	return [...ids];
}
function storedBookOk(raw) {
	if (raw == null) return true;
	try {
		const parsed = JSON.parse(raw);
		return !!parsed && typeof parsed === "object" && !Array.isArray(parsed);
	} catch {
		return false;
	}
}
function restoredBookOk(raw) {
	return raw != null && storedBookOk(raw);
}
function blobMatches(saved, size, type) {
	if (saved.size !== size) return false;
	if (type && type !== saved.type) return false;
	return true;
}
function sameSnapshot(saved, read) {
	if (saved.book !== read.book || saved.weights !== read.weights) return false;
	if ((saved.level ?? null) !== (read.level ?? null)) return false;
	if (saved.files.length !== read.files.length) return false;
	const by = new Map(read.files.map((file) => [file.id, file]));
	return saved.files.every((file) => {
		const got = by.get(file.id);
		return !!got && got.size === file.size && got.type === file.type;
	});
}
function subscribeRestoreHold(fn) {
	listeners$3.add(fn);
	fn(known);
	refreshRestoreHold();
	return () => {
		listeners$3.delete(fn);
	};
}
function emit$1(on) {
	known = on;
	for (const fn of listeners$3) fn(on);
}
function closeRestoreUndo() {
	const base = shared;
	shared = null;
	opening = null;
	base?.close();
}
function openDb() {
	if (shared) return Promise.resolve(shared);
	if (opening) return opening;
	const pending = new Promise((resolve, reject) => {
		if (typeof indexedDB === "undefined") {
			reject(/* @__PURE__ */ new Error("no-store"));
			return;
		}
		const req = indexedDB.open(DB$1, 1);
		req.onupgradeneeded = () => {
			const base = req.result;
			if (!base.objectStoreNames.contains(META)) base.createObjectStore(META);
			if (!base.objectStoreNames.contains(BLOBS)) base.createObjectStore(BLOBS);
		};
		req.onsuccess = () => {
			const base = req.result;
			shared = base;
			shared.onversionchange = () => closeRestoreUndo();
			shared.onclose = () => {
				if (shared === base) shared = null;
			};
			resolve(base);
		};
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("no-store"));
	});
	opening = pending;
	pending.finally(() => {
		if (opening === pending) opening = null;
	});
	return pending;
}
function readRaw(key) {
	if (typeof localStorage === "undefined") return null;
	return localStorage.getItem(key);
}
function writeRaw(key, value) {
	if (value == null) localStorage.removeItem(key);
	else localStorage.setItem(key, value);
}
async function readMeta() {
	const base = await openDb();
	return await new Promise((resolve, reject) => {
		const req = base.transaction(META, "readonly").objectStore(META).get(META_KEY);
		req.onsuccess = () => resolve(req.result ?? null);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("no-store"));
	});
}
async function writeMeta(snap) {
	const base = await openDb();
	await new Promise((resolve, reject) => {
		const tx = base.transaction(META, "readwrite");
		tx.objectStore(META).put(snap, META_KEY);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("no-store"));
	});
}
async function readBlob(id) {
	const base = await openDb();
	return await new Promise((resolve, reject) => {
		const req = base.transaction(BLOBS, "readonly").objectStore(BLOBS).get(id);
		req.onsuccess = () => resolve(req.result ?? null);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("no-store"));
	});
}
async function writeBlob(id, blob) {
	const base = await openDb();
	await new Promise((resolve, reject) => {
		const tx = base.transaction(BLOBS, "readwrite");
		tx.objectStore(BLOBS).put(blob, id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("no-store"));
	});
}
async function clearRestoreUndo() {
	try {
		const base = await openDb();
		await new Promise((resolve, reject) => {
			const tx = base.transaction([META, BLOBS], "readwrite");
			tx.objectStore(META).clear();
			tx.objectStore(BLOBS).clear();
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("no-store"));
		});
	} catch {}
	emit$1(false);
}
async function refreshRestoreHold() {
	try {
		const snap = await readMeta();
		emit$1(!!snap && storedBookOk(snap.book));
	} catch {
		emit$1(false);
	}
}
async function verify(saved) {
	const snap = await readMeta();
	if (!snap || !sameSnapshot(saved, snap) || !storedBookOk(snap.book)) return false;
	for (const file of saved.files) {
		const blob = await readBlob(file.id);
		if (!blob || !blobMatches(file, blob.size, blob.type)) return false;
	}
	return true;
}
/** Copy the log and the photos a restore might replace. Refuse when that copy cannot be read back. */
async function takeRestoreSnapshot(ids) {
	if (writing || applying) return {
		ok: false,
		message: "A restore is already running."
	};
	writing = true;
	try {
		let existing = null;
		try {
			existing = await readMeta();
		} catch {
			return {
				ok: false,
				message: "Could not save a copy of the current log. Nothing was replaced."
			};
		}
		if (existing) return {
			ok: false,
			message: "Undo the last restore, or keep it, before restoring another file."
		};
		let book;
		let weights;
		let level;
		try {
			book = readRaw(BOOK_KEY);
			weights = readRaw(WEIGHTS_KEY);
			level = readRaw(LEVEL_KEY);
		} catch {
			return {
				ok: false,
				message: "Could not save a copy of the current log. Nothing was replaced."
			};
		}
		if (!storedBookOk(book)) return {
			ok: false,
			message: "The log on this phone could not be read. Nothing was replaced."
		};
		const notes = [];
		try {
			for (const id of new Set(ids)) {
				const blob = await getFile(id);
				if (!blob) continue;
				const copy = blob.slice(0, blob.size, blob.type);
				await writeBlob(id, copy);
				notes.push({
					id,
					size: copy.size,
					type: copy.type
				});
			}
			const saved = {
				book,
				weights,
				level,
				files: notes,
				added: []
			};
			await writeMeta(saved);
			if (!await verify(saved)) {
				await clearRestoreUndo();
				return {
					ok: false,
					message: "The copy of the current log could not be read back. Nothing was replaced."
				};
			}
		} catch {
			await clearRestoreUndo();
			return {
				ok: false,
				message: "Could not save a copy of the current log. Nothing was replaced."
			};
		}
		return { ok: true };
	} finally {
		writing = false;
	}
}
async function noteRestoredFiles(ids) {
	try {
		const snap = await readMeta();
		if (!snap) return;
		const had = new Set(snap.files.map((file) => file.id));
		snap.added = [...new Set(ids.filter((id) => !had.has(id)))];
		await writeMeta(snap);
	} catch {}
}
async function confirmRestore() {
	await clearRestoreUndo();
}
/** Put the pre-restore log and photos back. The caller reloads so the screen matches. */
async function undoRestore() {
	let snap;
	try {
		snap = await readMeta();
	} catch {
		return false;
	}
	if (!snap || !storedBookOk(snap.book)) return false;
	try {
		for (const file of snap.files) {
			const blob = await readBlob(file.id);
			if (!blob || !blobMatches(file, blob.size, blob.type)) return false;
			await putFile(file.id, blob);
		}
		for (const id of snap.added) if (!snap.files.some((file) => file.id === id)) await deleteFile(id);
		writeRaw(BOOK_KEY, snap.book);
		writeRaw(WEIGHTS_KEY, snap.weights);
		if (snap.level !== void 0) writeRaw(LEVEL_KEY, snap.level);
		const bookNow = readRaw(BOOK_KEY);
		const weightsNow = readRaw(WEIGHTS_KEY);
		if (bookNow !== snap.book || weightsNow !== snap.weights) return false;
		if (snap.level !== void 0 && readRaw("rivetcare-level") !== snap.level) return false;
	} catch {
		return false;
	}
	await clearRestoreUndo();
	return true;
}
var closers = [];
var listeners$2 = /* @__PURE__ */ new Set();
function emit() {
	listeners$2.forEach((listener) => listener());
}
/** The top sheet closes first. Returns false when nothing is open. */
function closeBackLayer() {
	const close = closers.pop();
	if (!close) return false;
	close();
	return true;
}
function backLayerCount() {
	return closers.length;
}
function addBackLayer(close) {
	if (closers.includes(close)) return;
	closers.push(close);
}
function removeBackLayer(close) {
	const index = closers.lastIndexOf(close);
	if (index >= 0) closers.splice(index, 1);
}
function onBackLayers(listener) {
	listeners$2.add(listener);
	return () => listeners$2.delete(listener);
}
/** While `open` is true, the phone's Back button closes this instead of leaving. `resetKey` rebuilds the step when a stack grows. */
function useBackLayer(open, close, resetKey = 0) {
	const closeRef = (0, import_react.useRef)(close);
	closeRef.current = close;
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const fn = () => closeRef.current();
		closers.push(fn);
		emit();
		return () => {
			const index = closers.lastIndexOf(fn);
			if (index >= 0) closers.splice(index, 1);
			emit();
		};
	}, [open, resetKey]);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var KEY = "rivetcare-theme";
function themeChoice() {
	try {
		const value = localStorage.getItem(KEY);
		if (value === "light" || value === "dark") return value;
	} catch {}
	return "system";
}
function appearanceDark(choice = themeChoice()) {
	if (choice === "dark") return true;
	if (choice === "light") return false;
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function applyTheme(choice = themeChoice()) {
	const dark = appearanceDark(choice);
	document.documentElement.classList.toggle("dark", dark);
	document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", "#152A6A");
	return dark;
}
var listeners$1 = /* @__PURE__ */ new Set();
function subscribeTheme(listener) {
	listeners$1.add(listener);
	return () => {
		listeners$1.delete(listener);
	};
}
function notify() {
	listeners$1.forEach((listener) => listener());
}
function setTheme(choice) {
	try {
		localStorage.setItem(KEY, choice);
	} catch {}
	applyTheme(choice);
	notify();
}
function Card({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-card border border-rule bg-sheet", className),
		children
	});
}
function Kicker({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted",
		children
	});
}
function Pill({ tone = "navy", children }) {
	const tones = {
		navy: "bg-navy text-on-navy",
		blue: "bg-blue-soft text-accent",
		sage: "bg-sage-soft text-ok",
		warn: "bg-warn-soft text-caution",
		due: "bg-signal-soft text-signal",
		danger: "bg-danger-soft text-stop",
		line: "bg-paper text-muted border border-line"
	};
	const dot = tone === "due" ? "bg-signal" : tone === "warn" ? "bg-caution" : tone === "blue" ? "bg-accent" : tone === "sage" ? "bg-ok" : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone]),
		children: [dot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("size-1.5 shrink-0 rounded-full", dot),
			"aria-hidden": true
		}) : null, children]
	});
}
function DarkModeSwitch({ onNavy = false, className }) {
	const [dark, setDark] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setDark(document.documentElement.classList.contains("dark"));
		return subscribeTheme(() => setDark(document.documentElement.classList.contains("dark")));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "switch",
		"aria-checked": dark,
		"aria-label": dark ? "Switch to light mode" : "Switch to dark mode",
		onClick: () => setTheme(dark ? "light" : "dark"),
		className: cn("grid h-11 w-14 shrink-0 place-items-center", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("relative h-7 w-12 rounded-full", onNavy ? "bg-white/25" : "border border-line bg-sheet"),
			"aria-hidden": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("absolute top-0.5 grid size-6 place-items-center rounded-full bg-knob text-navy shadow-sm", dark ? "right-0.5" : "left-0.5"),
				children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3.5" })
			})
		})
	});
}
function Notice({ tone, title, children }) {
	const stop = tone === "stop";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex gap-3 border-l-4 px-3 py-3 text-sm text-ink", stop ? "border-signal bg-signal-soft" : "border-caution bg-warn-soft"),
		role: stop ? "alert" : "note",
		children: [stop ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, {
			className: "mt-0.5 size-5 shrink-0 text-signal",
			"aria-hidden": true
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
			className: "mt-0.5 size-5 shrink-0 text-caution",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("font-semibold", stop ? "text-signal" : "text-caution"),
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1",
			children
		})] })]
	});
}
function Btn({ variant = "primary", className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors duration-150 active:opacity-80", {
			primary: "bg-navy text-on-navy",
			ghost: "bg-transparent text-accent",
			line: "border border-line bg-sheet text-ink",
			danger: "bg-danger-soft text-stop"
		}[variant], className),
		...props
	});
}
/** Shown when no due date can be calculated yet. */
function unsetScheduleCopy(count) {
	if (count < 1) return null;
	return {
		title: "Maintenance schedule not established",
		body: `${count === 1 ? "1 maintenance item needs" : `${count} maintenance items need`} a starting date before due dates can be calculated.`
	};
}
var MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
function monthCells(year, month) {
	const start = new Date(year, month, 1).getDay();
	const count = new Date(year, month + 1, 0).getDate();
	const cells = [];
	for (let i = 0; i < start; i += 1) cells.push(null);
	for (let day = 1; day <= count; day += 1) cells.push(day);
	return cells;
}
function DayPicker({ iso, onPick }) {
	const today = todayIso();
	const [cursor, setCursor] = (0, import_react.useState)((iso || today).slice(0, 7));
	const [year, month] = cursor.split("-").map(Number);
	const cells = monthCells(year, month - 1);
	function shift(by) {
		const next = new Date(year, month - 1 + by, 1);
		const stamp = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
		if (stamp > today.slice(0, 7)) return;
		if (next.getFullYear() < (/* @__PURE__ */ new Date()).getFullYear() - 40) return;
		setCursor(stamp);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 rounded-[18px] border border-line bg-paper p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => shift(-1),
						className: "min-h-11 min-w-11 text-sm font-semibold text-ink",
						"aria-label": "Previous month",
						children: "Prev"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-ink",
						children: [
							MONTHS[month - 1],
							" ",
							year
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => shift(1),
						className: "min-h-11 min-w-11 text-sm font-semibold text-ink",
						"aria-label": "Next month",
						children: "Next"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted",
				children: [
					"S",
					"M",
					"T",
					"W",
					"T",
					"F",
					"S"
				].map((day, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: day }, `${day}${index}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 grid grid-cols-7 gap-1",
				children: cells.map((day, index) => {
					if (!day) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}, `e${index}`);
					const stamp = `${cursor}-${String(day).padStart(2, "0")}`;
					const ahead = stamp > today;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: ahead,
						onClick: () => onPick(stamp),
						className: `min-h-11 rounded-full text-sm font-semibold ${stamp === iso ? "bg-navy text-on-navy" : ahead ? "text-muted" : "text-ink"}`,
						children: day
					}, stamp);
				})
			})
		]
	});
}
/** One date for every maintenance job that does not have one yet. */
function StartAllDates({ onSeparate }) {
	const model = modelById(useApp((s) => s.modelId));
	const year = coachYear(useApp((s) => s.vin), useApp((s) => s.modelYear));
	const done = useApp((s) => s.done);
	const tires = useApp((s) => s.tires);
	const odo = useApp((s) => s.odometer);
	const [open, setOpen] = (0, import_react.useState)(false);
	const ids = tasks.filter((task) => {
		if (task.fit === "classic" && !model.alde && model.family !== "Other") return false;
		if (task.fit === "gt" && model.family !== "Globetrotter" && model.family !== "Other") return false;
		if (task.procedureId && !procedureFits(task.procedureId, model, year)) return false;
		return dueOf(task.cadence, jobMark(task.id, done[task.id], tires, odo), odo) === "unset";
	}).map((task) => task.id);
	const count = ids.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold",
					children: count === 0 ? "Every dated job already has a start date." : count === 1 ? "1 job has no start date." : `${count} jobs have no start date.`
				}),
				" ",
				count === 0 ? "A new date does not replace one. Mile-only checks stay on the odometer." : "One date starts all of them. Each of those jobs gets a line in the service log. A job that already has a date stays as it is. Mile-only checks stay on the odometer."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-expanded": open,
				onClick: () => setOpen((value) => !value),
				className: "min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy",
				children: "Set one date for all"
			}), onSeparate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onSeparate,
				className: "min-h-11 rounded-full border border-line px-4 text-sm font-semibold text-ink",
				children: "Set them separately"
			}) : null]
		}),
		open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicker, { onPick: (stamp) => {
			useApp.getState().setStartDates(ids, stamp);
			setOpen(false);
		} }) : null
	] });
}
function DisclaimerCopy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 text-sm leading-relaxed text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "RivetCare is an independent checklist for the owner of an Airstream trailer. It is not published by, endorsed by, or affiliated with Airstream, Inc. Airstream® is a trademark of Airstream, Inc. Coach and model names are used only to identify the trailer. They are trademarks of Airstream, Inc. This app does not use the Airstream logo." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Truma, Dometic, Atwood, Suburban, Alde, and Battle Born are trademarks of their owners. They are named only to say which equipment is installed. This app does not use their logos." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The steps, fault codes, flowcharts, part numbers, and recall notes are aids. They can be wrong, incomplete, or out of date. They are not the owner’s manual, the factory parts book, a recall campaign, or the instruction of a qualified technician. The manual for your model year, the placard on the trailer, and that technician control. If they disagree with this app, follow them." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Propane, brakes, bearings, 120-volt power, and the hitch can cause fire, shock, a crash, or death. Stop if you are not sure. Do not bypass a safety device because a step seems to allow it. You are responsible for the work you do. The author of this app is not liable for injury or damage from using it, to the extent the law allows." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Copyright © 2026 Charles Moe. All rights reserved. The original text, illustrations, software, and arrangement of RivetCare may not be copied or redistributed without permission. You may use the app, and a backup you save from it, for your own personal use. Records you enter remain yours. This notice does not cover factory manuals, trademarks, part numbers, or other third-party materials. Those remain under their own terms." })
		]
	});
}
function AffiliationNote() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Independent checklist. Not affiliated with Airstream, Inc."
	});
}
var GAS_STOP_FLOWS = /* @__PURE__ */ new Set([
	"lp-flow",
	"furnace-flow",
	"shore"
]);
var HAZARD_FLOWS = /* @__PURE__ */ new Set(["brake-flow"]);
function gasStopFlow(id) {
	return GAS_STOP_FLOWS.has(id);
}
function hazardFlow(id) {
	return HAZARD_FLOWS.has(id);
}
var DB = "rivetcare-books";
var STORE = "parts";
function open() {
	return new Promise((resolve, reject) => {
		if (typeof indexedDB === "undefined") {
			reject(/* @__PURE__ */ new Error("no-store"));
			return;
		}
		const req = indexedDB.open(DB, 1);
		req.onupgradeneeded = () => {
			if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("no-store"));
	});
}
/** Drop a catalog that an older build saved on this phone. */
async function dropBookParts() {
	try {
		const base = await open();
		await new Promise((resolve, reject) => {
			const tx = base.transaction(STORE, "readwrite");
			tx.objectStore(STORE).delete("list");
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("no-store"));
		});
		base.close();
	} catch {}
}
function usableZips(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const entries = Object.entries(value);
	if (entries.length < 1e3) return false;
	for (const [zip, point] of entries) {
		if (!/^\d{5}$/.test(zip) || !Array.isArray(point) || point.length !== 2) return false;
		if (typeof point[0] !== "number" || typeof point[1] !== "number") return false;
	}
	return true;
}
async function readZipTable() {
	const value = await getValue("zips");
	return usableZips(value) ? value : null;
}
async function writeZipTable(table) {
	await putValue("zips", table);
}
async function getValue(key) {
	try {
		const base = await open();
		const value = await new Promise((resolve, reject) => {
			const req = base.transaction(STORE, "readonly").objectStore(STORE).get(key);
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("no-store"));
		});
		base.close();
		return value;
	} catch {
		return null;
	}
}
async function putValue(key, value) {
	try {
		const base = await open();
		await new Promise((resolve, reject) => {
			const tx = base.transaction(STORE, "readwrite");
			tx.objectStore(STORE).put(value, key);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("no-store"));
		});
		base.close();
	} catch {}
}
/** Same string the service worker cache name is stamped with at build time. */
var BOOK_VERSION = {
	name: "app-builder-workspace",
	"private": true,
	version: "2026.11.69",
	sideEffects: false,
	type: "module",
	overrides: {
		"nf3": "0.3.17",
		"seroval": "1.7.5"
	},
	scripts: {
		"dev": "node scripts/with-app-env.mjs vite dev --host 0.0.0.0 --port 8080",
		"build": "node scripts/pack-source.mjs && node scripts/with-app-env.mjs vite build && node scripts/check-built-version.mjs && npm run db:migrate",
		"db:migrate": "node scripts/migrate.mjs",
		"build:dev": "node scripts/with-app-env.mjs vite build --mode development",
		"preview": "node scripts/with-app-env.mjs vite preview",
		"preview:restart": "node scripts/preview.mjs restart",
		"preview:stop": "node scripts/preview.mjs stop",
		"typecheck": "tsc --noEmit",
		"check:auth": "node scripts/check-auth-invariant.mjs",
		"test": "node --test scripts/*.test.mjs && node --experimental-strip-types --test src/lib/app-data/app-data.test.ts src/lib/app-data/readiness-schedule.test.ts src/lib/auth/gate-identity.test.ts src/lib/auth/sign-in-gate.test.ts src/lib/auth/access-decision.test.ts src/lib/preview-path-prefix.test.ts src/lib/weights.test.ts src/lib/backup-look.test.ts src/lib/level.test.ts src/lib/erase-databases.test.ts src/lib/screen-url.test.ts src/lib/worker-script.test.ts src/lib/missing-screen.test.ts src/lib/year-scope.test.ts src/lib/tire-load.test.ts && node --import ./scripts/alias-hooks.mjs --experimental-strip-types --test src/data/fitment.test.ts src/lib/restore-undo.test.ts src/lib/backup-restore.test.ts src/lib/setup-input.test.ts src/lib/schedule-link.test.ts src/lib/safety-class.test.ts src/lib/tires.test.ts src/lib/part-year.test.ts",
		"lint": "eslint .",
		"format": "prettier --write ."
	},
	dependencies: {
		"@electric-sql/pglite": "^0.5.4",
		"@hookform/resolvers": "^5.7.0",
		"@radix-ui/react-accordion": "^1.2.12",
		"@radix-ui/react-alert-dialog": "^1.1.15",
		"@radix-ui/react-avatar": "^1.1.11",
		"@radix-ui/react-checkbox": "^1.3.3",
		"@radix-ui/react-collapsible": "^1.1.12",
		"@radix-ui/react-dialog": "^1.1.15",
		"@radix-ui/react-dropdown-menu": "^2.1.16",
		"@radix-ui/react-label": "^2.1.8",
		"@radix-ui/react-popover": "^1.1.15",
		"@radix-ui/react-progress": "^1.1.8",
		"@radix-ui/react-radio-group": "^1.3.8",
		"@radix-ui/react-scroll-area": "^1.2.10",
		"@radix-ui/react-select": "^2.2.6",
		"@radix-ui/react-separator": "^1.1.8",
		"@radix-ui/react-slider": "^1.3.6",
		"@radix-ui/react-slot": "^1.2.4",
		"@radix-ui/react-switch": "^1.2.6",
		"@radix-ui/react-tabs": "^1.1.13",
		"@radix-ui/react-toggle": "^1.1.10",
		"@radix-ui/react-toggle-group": "^1.1.11",
		"@radix-ui/react-tooltip": "^1.2.8",
		"@tailwindcss/vite": "^4.3.0",
		"@tanstack/react-query": "^5.101.0",
		"@tanstack/react-router": "^1.170.0",
		"@tanstack/react-start": "^1.168.60",
		"@tanstack/react-table": "^8.21.0",
		"@tanstack/router-plugin": "^1.168.0",
		"@vitejs/plugin-react": "^5.2.0",
		"better-auth": "~1.7.16",
		"class-variance-authority": "^0.7.1",
		"clsx": "^2.1.1",
		"cmdk": "^1.1.1",
		"date-fns": "^4.0.0",
		"jose": "6.2.9",
		"kysely": "^0.28.5",
		"lightningcss": "^1.28.0",
		"lucide-react": "^0.510.0",
		"nitro": "3.0.260610-beta",
		"pg": "^8.16.3",
		"react": "^19.2.0",
		"react-day-picker": "^9.14.0",
		"react-dom": "^19.2.0",
		"react-hook-form": "^7.54.0",
		"react-resizable-panels": "^4.6.5",
		"recharts": "^2.13.0",
		"sonner": "^2.0.7",
		"tailwind-merge": "^3.5.0",
		"tailwindcss": "^4.3.0",
		"tw-animate-css": "^1.3.4",
		"typescript": "^5.7.0",
		"vaul": "^1.1.2",
		"vite": "^8.2.0",
		"zod": "^4.6.7",
		"zustand": "^5.0.0"
	},
	devDependencies: {
		"@eslint/js": "^9.20.0",
		"@types/node": "^22.16.5",
		"@types/pg": "^8.11.10",
		"@types/react": "^19.2.0",
		"@types/react-dom": "^19.2.0",
		"eslint": "^9.20.0",
		"eslint-config-prettier": "^10.1.1",
		"eslint-plugin-prettier": "^5.2.6",
		"eslint-plugin-react-hooks": "^5.2.0",
		"eslint-plugin-react-refresh": "^0.4.20",
		"globals": "^15.15.0",
		"playwright": "^1.62.0",
		"prettier": "^3.4.0",
		"typescript-eslint": "^8.56.1"
	}
}.version;
var PLAIN = /* @__PURE__ */ new Set([
	"fix",
	"care",
	"procedures",
	"parts",
	"more",
	"lists",
	"specs",
	"weights",
	"level",
	"tires",
	"supplies",
	"service",
	"recalls",
	"log",
	"records",
	"backup",
	"privacy",
	"history",
	"notes",
	"desk",
	"manuals",
	"tools",
	"about",
	"printout",
	"flows",
	"figures",
	"offline",
	"support"
]);
var WITH_ID = /* @__PURE__ */ new Set([
	"procedure",
	"part",
	"checklist",
	"flow",
	"figure"
]);
function enc(value) {
	return encodeURIComponent(value);
}
function dec(value) {
	try {
		return decodeURIComponent(value);
	} catch {
		return "";
	}
}
function safeId(value) {
	const id = dec(value).slice(0, 80);
	return /^[a-z0-9][a-z0-9._-]*$/i.test(id) ? id : "";
}
/** A bookmarkable address for the open screen. Home stays the plain path. */
function screenToHash(screen) {
	if (screen.name === "home") return "";
	if (screen.name === "symptom") {
		const id = safeId(screen.id);
		if (!id) return "#/fix";
		return `#/symptom/${enc(id)}/${Number.isFinite(screen.step) ? screen.step : 0}`;
	}
	if (screen.name === "codes") {
		const q = new URLSearchParams();
		if (screen.q) q.set("q", screen.q.slice(0, 40));
		if (screen.appliance) q.set("appliance", screen.appliance.slice(0, 80));
		const extra = q.toString();
		return extra ? `#/codes?${extra}` : "#/codes";
	}
	if (screen.name === "supplies") return screen.part === "propane" || screen.part === "battery" ? `#/supplies?part=${screen.part}` : "#/supplies";
	if (screen.name === "sheet") return `#/sheet/${Number.isFinite(screen.page) ? screen.page : 1}`;
	if (screen.name === "table") {
		const id = screen.id ? safeId(screen.id) : "";
		return id ? `#/table/${enc(id)}/${screen.step ?? 0}` : "#/table";
	}
	if (WITH_ID.has(screen.name) && "id" in screen) {
		const id = safeId(screen.id);
		return id ? `#/${screen.name}/${enc(id)}` : `#/${screen.name}`;
	}
	if (PLAIN.has(screen.name)) return `#/${screen.name}`;
	return "";
}
/** The screen named in a shared or reloaded address. Null means Home. */
function screenFromHash(hash) {
	const raw = hash.trim().replace(/^#/, "");
	if (!raw || raw === "/") return null;
	const [path, query = ""] = raw.split("?");
	const parts = path.split("/").filter(Boolean);
	const name = parts[0] ?? "";
	if (name === "symptom") {
		const id = safeId(parts[1] ?? "");
		const step = Number(parts[2] ?? 0);
		if (!id) return null;
		return {
			name: "symptom",
			id,
			step: Number.isFinite(step) ? step : 0
		};
	}
	if (name === "codes") {
		const q = new URLSearchParams(query);
		return {
			name: "codes",
			q: q.get("q")?.slice(0, 40) || void 0,
			appliance: q.get("appliance")?.slice(0, 80) || void 0
		};
	}
	if (name === "supplies") {
		const part = new URLSearchParams(query).get("part");
		return part === "propane" || part === "battery" ? {
			name: "supplies",
			part
		} : { name: "supplies" };
	}
	if (name === "sheet") {
		const page = Number(parts[1] ?? 1);
		return {
			name: "sheet",
			page: Number.isFinite(page) ? page : 1
		};
	}
	if (name === "table") {
		const id = parts[1] ? safeId(parts[1]) : "";
		const step = Number(parts[2] ?? 0);
		return {
			name: "table",
			id: id || void 0,
			step: Number.isFinite(step) ? step : 0
		};
	}
	if (WITH_ID.has(name)) {
		const id = safeId(parts[1] ?? "");
		if (!id) return null;
		return {
			name,
			id
		};
	}
	if (PLAIN.has(name)) return { name };
	return null;
}
/** Published pages. These stay real addresses. Every other screen is a hash. */
var PUBLISHED_PAGE = /* @__PURE__ */ new Set(["privacy", "support"]);
/** Where a plain address such as /recalls should send the browser. Null means leave it. */
function hashLocation(pathname, search = "") {
	if (!pathname.startsWith("/") || pathname === "/" || pathname.includes(".")) return null;
	const screen = screenFromHash(`#${pathname}${search}`);
	if (!screen || PUBLISHED_PAGE.has(screen.name)) return null;
	const hash = screenToHash(screen);
	return hash ? `/${hash}` : null;
}
/** The address to keep when the app starts. A hash is never replaced by Home. */
function bootAddress(pathname, search, hash, screen) {
	const opened = screenFromHash(hash);
	if (opened) return {
		url: `${pathname}${search}${hash.startsWith("#") ? hash : `#${hash}`}`,
		open: opened
	};
	const jump = hashLocation(pathname, search);
	if (jump) {
		const mark = jump.indexOf("#");
		return {
			url: jump,
			open: screenFromHash(mark >= 0 ? jump.slice(mark) : "")
		};
	}
	return {
		url: `${pathname}${search}${screenToHash(screen)}`,
		open: null
	};
}
/**
* First paint follows the address. After that the open screen writes the
* address. A later paint must not read a stale hash and reopen that screen.
*/
function addressAction(pathname, search, hash, screen, booted) {
	if (!booted) return bootAddress(pathname, search, hash, screen);
	return {
		url: `${pathname}${search}${screenToHash(screen)}`,
		open: null
	};
}
var SPOKE = "rivetcare-spoke";
var CHOICE = "rivetcare-notices";
/** iPhone only delivers a web notification from an installed Home Screen app. */
function reminderStatus(input) {
	if (!input.notification) return "unsupported";
	if (input.ios && !input.installed) return "needs-install";
	if (input.permission === "granted") return "granted";
	if (input.permission === "denied") return "denied";
	return "default";
}
/** The switch stays where the owner set it. A granted phone stays on until they turn it off. */
function noticesAreOn(status, choice) {
	if (choice === "on") return true;
	if (choice === "off") return false;
	return status === "granted";
}
function readNoticesChoice() {
	if (typeof localStorage === "undefined") return null;
	try {
		const value = localStorage.getItem(CHOICE);
		return value === "on" || value === "off" ? value : null;
	} catch {
		return null;
	}
}
function rememberNotices(choice) {
	try {
		localStorage.setItem(CHOICE, choice);
	} catch {}
}
function readReminderStatus() {
	if (typeof window === "undefined" || typeof Notification === "undefined") return "unsupported";
	const nav = navigator;
	const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
	const installed = window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
	return reminderStatus({
		notification: true,
		permission: Notification.permission,
		ios,
		installed
	});
}
async function registration() {
	if (!("serviceWorker" in navigator)) return void 0;
	return await navigator.serviceWorker.getRegistration();
}
function noticeBody(titles) {
	if (titles.length <= 1) return titles[0] ?? "";
	return `${titles.length} jobs are due.`;
}
async function post(title, body, tag) {
	const options = {
		body,
		tag,
		icon: "/icon-192.png",
		badge: "/icon-192.png",
		data: { url: "/" }
	};
	const reg = await registration();
	if (reg) await reg.showNotification(title, options);
	else new Notification(title, options);
}
async function closePosted() {
	const list = await (await registration())?.getNotifications?.() ?? [];
	for (const note of list) if (note.tag === "due" || note.tag === "reminders-on") note.close();
}
async function clearBadge() {
	const nav = navigator;
	try {
		await nav.clearAppBadge?.();
	} catch {}
}
/** Badge, and one short notice a day when the switch is on. */
async function speakDue(titles) {
	if (readNoticesChoice() === "off") {
		await clearBadge();
		await closePosted();
		return;
	}
	const nav = navigator;
	try {
		if (titles.length > 0) await nav.setAppBadge?.(titles.length);
		else await nav.clearAppBadge?.();
	} catch {}
	if (titles.length === 0 || typeof Notification === "undefined" || Notification.permission !== "granted") return;
	const day = todayIso();
	try {
		if (localStorage.getItem(SPOKE) === day) return;
		localStorage.setItem(SPOKE, day);
	} catch {
		return;
	}
	try {
		await post("RivetCare", noticeBody(titles), "due");
	} catch {}
}
/** Call from a tap. The choice is saved even when this view cannot post a notice. */
async function enableReminders(titles) {
	rememberNotices("on");
	const status = readReminderStatus();
	if (status === "unsupported" || status === "needs-install" || status === "denied") return status;
	let permission = Notification.permission;
	if (permission === "default") try {
		permission = await Notification.requestPermission();
	} catch {
		return status;
	}
	const next = reminderStatus({
		notification: true,
		permission,
		ios: /iphone|ipad|ipod/i.test(navigator.userAgent),
		installed: true
	});
	if (permission !== "granted") return next;
	rememberNotices("on");
	const body = noticeBody(titles);
	if (!body) return "granted";
	try {
		await post("RivetCare", body, "due");
		try {
			localStorage.setItem(SPOKE, todayIso());
		} catch {}
	} catch {}
	return "granted";
}
/** Stops today's notice. The phone's own Settings can block it for good. */
async function disableReminders() {
	rememberNotices("off");
	forgetSpoke();
	await clearBadge();
	await closePosted();
	return readReminderStatus();
}
function forgetSpoke() {
	try {
		localStorage.removeItem(SPOKE);
	} catch {}
}
var asked = false;
var status = "unknown";
var listeners = /* @__PURE__ */ new Set();
function publish(next) {
	status = next;
	for (const fn of listeners) fn(next);
}
function subscribeStorageHold(fn) {
	listeners.add(fn);
	return () => listeners.delete(fn);
}
/** Read whether this browser has already promised to keep the site. */
async function readStorageHold() {
	if (typeof navigator === "undefined" || !navigator.storage?.persist) {
		publish("unsupported");
		return "unsupported";
	}
	try {
		if (await navigator.storage.persisted?.()) {
			publish("granted");
			return "granted";
		}
	} catch {}
	if (status === "unknown") publish("refused");
	return status;
}
/** Ask the browser to keep this origin. A refusal is reported, not hidden. Call this from a tap. */
function holdStorage() {
	if (typeof navigator === "undefined" || !navigator.storage?.persist) {
		if (typeof navigator !== "undefined") publish("unsupported");
		return;
	}
	if (asked) return;
	asked = true;
	navigator.storage.persist().then((ok) => publish(ok ? "granted" : "refused"), () => publish("refused"));
}
function StorageWarning() {
	const [hold, setHold] = (0, import_react.useState)("unknown");
	(0, import_react.useEffect)(() => {
		let stop = false;
		readStorageHold().then((next) => {
			if (!stop) setHold(next);
		});
		const unsub = subscribeStorageHold((next) => {
			if (!stop) setHold(next);
		});
		return () => {
			stop = true;
			unsub();
		};
	}, []);
	if (hold === "unknown" || hold === "granted") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "mt-0.5 block font-normal text-muted",
		children: "Safari can clear records kept only in the browser after about 7 days without a visit, unless this app is on your Home Screen. This browser has not promised to keep them."
	});
}
function HomeView() {
	const model = modelById(useApp((s) => s.modelId));
	const push = useApp((s) => s.push);
	const installHint = useApp((s) => s.installHint);
	const dismissInstall = useApp((s) => s.dismissInstall);
	const [standalone, setStandalone] = (0, import_react.useState)(false);
	const [installEvent, setInstallEvent] = (0, import_react.useState)(null);
	const [naming, setNaming] = (0, import_react.useState)(false);
	const nickname = useApp((s) => s.nickname);
	const [nameDraft, setNameDraft] = (0, import_react.useState)(nickname);
	(0, import_react.useEffect)(() => {
		setNaming(false);
		setNameDraft(useApp.getState().nickname);
	}, [model.id]);
	(0, import_react.useEffect)(() => {
		const nav = navigator;
		setStandalone(window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true);
		const onPrompt = (e) => {
			e.preventDefault();
			setInstallEvent(e);
		};
		window.addEventListener("beforeinstallprompt", onPrompt);
		return () => window.removeEventListener("beforeinstallprompt", onPrompt);
	}, []);
	const done = useApp((s) => s.done);
	const odo = useApp((s) => s.odometer);
	const wheelOff = useApp((s) => s.wheelOff);
	const lugAck = useApp((s) => s.lugAck);
	const vin = useApp((s) => s.vin);
	const modelYear = useApp((s) => s.modelYear);
	const year = coachYear(vin, modelYear);
	const watch = retorqueWatch(wheelOff, odo, Boolean(done.retorque), lugAck);
	const stages = watch.upcoming;
	const missed = watch.missed;
	const lugNow = watch.current == null ? null : [...missed, ...stages].find((row) => row.miles === watch.current) ?? null;
	const retorqueOn = lugNow != null;
	const mine = tasks.filter((t) => {
		if (t.fit === "classic" && !model.alde && model.family !== "Other") return false;
		if (t.fit === "gt" && model.family !== "Globetrotter" && model.family !== "Other") return false;
		if (t.procedureId && !procedureFits(t.procedureId, model, year)) return false;
		return true;
	});
	const tires = useApp((s) => s.tires);
	const next = mine.filter((t) => {
		const state = dueOf(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo);
		return state === "due" || state === "unset";
	}).map((t) => ({
		t,
		state: dueOf(t.cadence, jobMark(t.id, done[t.id], tires, odo), odo)
	})).sort((a, b) => Number(a.state !== "due") - Number(b.state !== "due"));
	const tireLine = homeTireLine(tires);
	const supply = supplyAges(useApp((s) => s.supplies));
	const supplyLine = supply.propaneYears != null && supply.propaneYears >= 12 ? `Cylinder about ${Math.floor(supply.propaneYears)} years` : supply.batteryYears != null && supply.batteryYears >= 5 ? `Batteries about ${Math.floor(supply.batteryYears)} years` : null;
	const mismatch = vinMismatch(vin, model);
	const vinError = vinProblem(vin);
	const log = useApp((s) => s.log);
	const logDraft = useApp((s) => s.logDraft);
	const lastBackup = useApp((s) => s.lastBackup);
	const coachSet = useApp((s) => s.coachSet);
	const ready = useApp((s) => s.ready);
	const hydrated = useApp((s) => s.hydrated);
	const showInstall = installHint && !standalone;
	const dueTitles = [
		...next.filter((item) => item.state === "due").map((item) => item.t.title),
		...lugNow ? [lugNow.left > 0 ? `Lug re-torque, ${lugNow.miles} mi check, ${lugNow.left.toLocaleString()} mi left` : `Lug re-torque, ${lugNow.miles} mi check is due`] : [],
		...tireLine ? [tireLine] : [],
		...supplyLine ? [supplyLine] : []
	];
	const dueKey = dueTitles.map((title) => JSON.stringify(title)).join(",");
	const dueRef = (0, import_react.useRef)(dueTitles);
	dueRef.current = dueTitles;
	const vinNote = mismatch ? mismatch : vinError ? vinError : vinOk(vin) ? "VIN on file" : "No VIN yet";
	(0, import_react.useEffect)(() => {
		speakDue(dueRef.current);
	}, [dueKey]);
	(0, import_react.useEffect)(() => {
		const onShow = () => {
			if (document.visibilityState === "visible") speakDue(dueRef.current);
		};
		document.addEventListener("visibilitychange", onShow);
		return () => document.removeEventListener("visibilitychange", onShow);
	}, []);
	const [reminders, setReminders] = (0, import_react.useState)("unsupported");
	const [notices, setNotices] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const status = readReminderStatus();
		setReminders(status);
		setNotices(noticesAreOn(status, readNoticesChoice()));
	}, []);
	function setNoticeState(status) {
		setReminders(status);
		setNotices(noticesAreOn(status, readNoticesChoice()));
	}
	const picked = pickNextTask(mine.map((t) => ({
		id: t.id,
		cadence: t.cadence,
		mark: jobMark(t.id, done[t.id], tires, odo)
	})), odo);
	const feature = !(retorqueOn && (!picked || picked.why === "next")) && picked ? mine.find((t) => t.id === picked.id) ?? null : null;
	const featureWhy = retorqueOn && !feature ? lugNow ? lugNow.left > 0 ? `${lugNow.miles} mi check, ${lugNow.left.toLocaleString()} mi left` : `${lugNow.miles} mi check is due` : "Due now" : picked?.why === "due" ? "Due now" : picked?.why === "soon" ? "Due soon" : null;
	const dueNow = retorqueOn && !feature && (!lugNow || lugNow.left <= 0) || picked?.why === "due";
	const featureLine = feature ? feature.id === "tires-replace" && tireLine ? tireLine : picked?.why === "due" ? dueWhy(feature.cadence, jobMark(feature.id, done[feature.id], tires, odo), odo) : nextDue(feature.cadence, jobMark(feature.id, done[feature.id], tires, odo), odo) : missed.length && !stages.length ? "Break-in checks at 5, 10, 25, and 50 miles are past this reading. Mark it done if the lugs were already checked." : null;
	const dueJob = feature ?? (retorqueOn ? mine.find((t) => t.id === "retorque") ?? null : null);
	const procedureId = dueJob?.procedureId && procedureFits(dueJob.procedureId, model, year) ? dueJob.procedureId : "";
	const traveled = watch.start != null && odo > watch.start ? Math.min(50, odo - watch.start) : 0;
	const unsetCount = mine.filter((task) => dueOf(task.cadence, jobMark(task.id, done[task.id], tires, odo), odo) === "unset").length;
	const unsetCopy = !feature && !retorqueOn ? unsetScheduleCopy(unsetCount) : null;
	const overdueCount = mine.filter((task) => maintainBand(task.cadence, jobMark(task.id, done[task.id], tires, odo), odo) === "overdue").length;
	const dueSoonCount = mine.filter((task) => maintainBand(task.cadence, jobMark(task.id, done[task.id], tires, odo), odo) === "days").length;
	const draftOpen = Boolean(logDraft && (logDraft.note.trim() || logDraft.files.length));
	const coachName = `${year ? `${year} ` : ""}${model.name}`;
	const milesLine = odo > 0 ? `${odo.toLocaleString()} mi` : "Miles not set";
	const backupDays = lastBackup ? daysBetween(lastBackup, todayIso()) : null;
	const backupTone = backupDays != null && backupDays >= 30 ? "text-caution" : "text-ok";
	const [installHelp, setInstallHelp] = (0, import_react.useState)(false);
	function addToHome() {
		const prompt = installEvent;
		const ask = prompt?.prompt;
		if (ask) {
			(async () => {
				try {
					await ask();
					if ((await prompt?.userChoice)?.outcome === "accepted") dismissInstall();
				} finally {
					setInstallEvent(null);
				}
			})();
			return;
		}
		if (/iPhone|iPad|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
			const prefix = previewPathPrefix(window.location.hostname, window.location.pathname) ?? "";
			window.location.assign(`${prefix}/?install=1&platform=ios`);
			return;
		}
		setInstallHelp(true);
	}
	async function savePageShots() {
		const href = `${previewPathPrefix(window.location.hostname, window.location.pathname) ?? ""}/rivetcare-pages.pdf`;
		try {
			const res = await fetch(href);
			if (!res.ok) throw new Error("missing");
			const blob = await res.blob();
			const file = new File([blob], "RivetCare-pages.pdf", { type: "application/pdf" });
			const can = navigator.canShare?.({ files: [file] }) ?? false;
			if (navigator.share && can) {
				await navigator.share({
					files: [file],
					title: "RivetCare page shots"
				});
				return;
			}
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") return;
		}
		window.location.assign(href);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [!hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 py-2",
			"aria-busy": "true",
			"aria-label": "Loading your records",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 animate-pulse rounded-full bg-quiet" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-[20px] bg-quiet" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-[20px] bg-quiet" })
			]
		}) : null, hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => useApp.getState().setSearching(true),
				className: "flex min-h-12 w-full items-center gap-2 rounded-full border border-line bg-sheet px-4 text-left text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "size-4 shrink-0",
					"aria-hidden": true
				}), "Search fault codes, parts, notes"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-[20px] border border-line bg-sheet p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrailerMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-1 items-start gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[13px] font-semibold uppercase tracking-[0.14em] text-muted",
									children: "My trailer"
								}),
								naming ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									className: "mt-1",
									onSubmit: (e) => {
										e.preventDefault();
										useApp.getState().setNickname(nameDraft);
										setNaming(false);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "sr-only",
										htmlFor: "trailer-name",
										children: "Nickname"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "trailer-name",
										value: nameDraft,
										onChange: (e) => setNameDraft(e.target.value),
										onBlur: () => {
											useApp.getState().setNickname(nameDraft);
											setNaming(false);
										},
										maxLength: 40,
										autoFocus: true,
										placeholder: "Name this trailer",
										className: "min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-base text-ink"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-0.5 block max-w-full whitespace-normal text-left font-display text-[1.65rem] leading-tight text-ink",
									"aria-label": nickname ? `Name this trailer. Now called ${nickname}` : "Name this trailer",
									onClick: () => {
										setNameDraft(nickname);
										setNaming(true);
									},
									children: nickname || model.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 whitespace-normal text-base font-semibold leading-snug text-ink",
									children: coachName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => useApp.getState().tab("care"),
									className: "mt-1 block min-h-11 w-full tabular-nums text-left text-base font-semibold leading-snug text-ink",
									"aria-label": odo > 0 ? `Trailer miles, ${odo.toLocaleString()}. Change them on Maintain.` : "Miles not set. Set them on Maintain.",
									children: milesLine
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => useApp.getState().setPicker(true),
									className: "block min-h-11 w-full text-left text-sm font-semibold text-ink",
									children: vinNote
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Change trailer",
							onClick: () => useApp.getState().setPicker(true),
							className: "grid size-11 shrink-0 place-items-center text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
								className: "size-5",
								"aria-hidden": true
							})
						})]
					})]
				})
			}),
			ready && !coachSet ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => useApp.getState().setPicker(true),
				className: "w-full rounded-[20px] border border-line bg-sheet px-4 py-3 text-left text-sm font-semibold leading-snug text-ink",
				children: [
					"Showing the ",
					year ?? 2027,
					" ",
					model.name,
					" until you pick yours."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-[20px] border border-line bg-sheet p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[13px] font-semibold uppercase tracking-[0.14em] text-muted",
							children: unsetCopy ? "Schedule" : dueNow ? "Due now" : "Next due"
						}), featureWhy && featureWhy !== "Due now" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-sm font-semibold ${dueNow ? "text-signal" : "text-caution"}`,
							children: featureWhy
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-[1.65rem] leading-tight text-ink",
						children: feature ? feature.title : retorqueOn ? lugNow ? `${lugNow.miles} mi lug check` : "Re-torque the lugs" : unsetCopy ? unsetCopy.title : "Nothing is due"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-ink",
						children: feature ? featureLine || feature.detail : lugNow ? lugNow.left > 0 ? `Star pattern. ${lugNow.miles} mi check, ${lugNow.left.toLocaleString()} mi left.` : `${lugNow.miles} mi check is due. Star pattern.` : unsetCopy ? unsetCopy.body : "The next job with a start date shows here."
					}),
					stages.length > 0 && !feature && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-1.5 overflow-hidden rounded-full bg-paper",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-sage",
							style: { width: `${traveled / 50 * 100}%` }
						})
					}),
					retorqueOn && feature ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mt-3 text-sm ${lugNow && lugNow.left > 0 ? "text-caution" : "text-signal"}`,
						children: lugNow ? lugNow.left > 0 ? `${lugNow.miles} mi check, ${lugNow.left.toLocaleString()} mi left` : `${lugNow.miles} mi check is due` : "Lug re-torque is past the 50 mile check"
					}) : null,
					tireLine || supplyLine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-caution",
						children: [tireLine, supplyLine].filter(Boolean).join(" · ")
					}) : null,
					!unsetCopy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-ink",
						children: [
							overdueCount === 0 ? "None overdue." : overdueCount === 1 ? "1 overdue." : `${overdueCount} overdue.`,
							" ",
							dueSoonCount === 0 ? "None due in 30 days." : dueSoonCount === 1 ? "1 due in 30 days." : `${dueSoonCount} due in 30 days.`,
							" ",
							"Last service: ",
							log[0] ? formatWhen(log[0].iso) : "none yet",
							".",
							draftOpen ? " A service note is still open." : ""
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [
							feature || retorqueOn && !feature ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => useApp.getState().markDone(feature ? feature.id : "retorque", feature ? feature.title : "Re-torque the lugs"),
								className: "min-h-11 flex-1 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy",
								children: "Mark done"
							}) : null,
							procedureId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => push({
									name: "procedure",
									id: procedureId
								}),
								className: "min-h-11 flex-1 rounded-full border border-line px-4 text-sm font-semibold text-ink",
								children: "How to"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => useApp.getState().tab("care"),
								className: unsetCopy ? "min-h-11 w-full rounded-full bg-navy px-4 text-sm font-semibold text-on-navy" : `min-h-11 rounded-full border border-line px-4 text-sm font-semibold text-ink ${feature || retorqueOn && !feature ? "flex-1" : "w-full"}`,
								children: unsetCopy ? "Set starting dates" : "Schedule"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "divide-y divide-rule",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ruler, { className: "size-5" }),
						title: "Trailer level",
						detail: "Which end is low, and about how far",
						onClick: () => push({ name: "level" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-5" }),
						title: "Fix",
						detail: "Flowcharts, symptoms, fixes, checklists, and codes",
						onClick: () => {
							useApp.getState().setSystem("");
							useApp.getState().tab("fix");
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "size-5" }),
						title: "Checklists",
						detail: "Tow, setup, dump, winterize, and storage",
						onClick: () => push({ name: "lists" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-5" }),
						title: "Weight calculator",
						detail: "Axle weights from a truck scale",
						onClick: () => push({ name: "weights" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-5" }),
						title: "Find service",
						detail: "Dealers and shops",
						onClick: () => push({ name: "service" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 px-1 py-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "min-w-0 flex-1 text-sm leading-snug text-ink",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: "Phone reminders"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-sm font-normal text-muted",
						children: !notices ? "Off." : reminders === "granted" ? "On. One short notice a day." : reminders === "denied" ? "On here. Allow notifications in Settings." : "On. Open from the Home Screen icon to deliver it."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					role: "switch",
					"aria-checked": notices,
					"aria-label": "Phone reminders",
					onClick: () => {
						if (notices) {
							disableReminders().then(setNoticeState);
							return;
						}
						enableReminders(dueRef.current).then(setNoticeState);
					},
					className: "grid h-11 w-12 shrink-0 place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `relative h-6 w-10 rounded-full ${notices ? "bg-navy" : "border border-line bg-paper"}`,
						"aria-hidden": true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 size-5 rounded-full bg-knob shadow-sm ${notices ? "right-0.5" : "left-0.5"}` })
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 px-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
					className: `mt-3 size-5 shrink-0 ${lastBackup ? backupTone : "text-caution"}`,
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => push({ name: "backup" }),
					className: "min-h-11 min-w-0 flex-1 py-2 text-left text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `block font-semibold ${lastBackup ? backupTone : "text-ink"}`,
							children: lastBackup ? `Last backup saved ${formatWhen(lastBackup)}.` : "These records are only on this phone."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mt-0.5 block font-normal ${lastBackup ? backupTone : "text-muted"}`,
							children: lastBackup ? "Not checked again after you save the file. Open Backup and tap Verify backup." : "Save a copy keeps the records. The project zip does not."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorageWarning, {})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					savePageShots();
				},
				className: "min-h-11 w-full px-1 text-left text-sm font-semibold text-muted",
				children: "Save the page shots PDF"
			}),
			showInstall ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-1 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-ink",
						children: "Add it to your Home Screen"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Opens full screen. Start from the icon, or save a backup before you add it. An address typed in Safari does not move onto the Home Screen icon."
					}),
					installHelp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-ink",
						children: "On iPhone, Add opens the Home Screen steps. On this computer, use the install icon in the address bar."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: addToHome,
							className: "min-h-11 flex-1 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy",
							children: "Add"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: dismissInstall,
							className: "min-h-11 rounded-full px-4 text-sm font-semibold text-ink",
							children: "Not now"
						})]
					})
				]
			}) : null
		] }) : null]
	});
}
function Action({ icon, title, detail, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex min-h-14 w-full items-center gap-3 py-2.5 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-9 shrink-0 place-items-center rounded-xl bg-sheet text-ok",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-[15px] font-semibold leading-tight text-ink",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 block text-sm leading-snug text-muted",
				children: detail
			})]
		})]
	});
}
function TrailerMark() {
	const photoId = useApp((s) => s.photoId);
	const [url, setUrl] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!photoId) {
			setUrl(null);
			return;
		}
		let alive = true;
		let object = "";
		getFile(photoId).then((blob) => {
			if (!alive || !blob) return;
			object = URL.createObjectURL(blob);
			setUrl(object);
		});
		return () => {
			alive = false;
			if (object) URL.revokeObjectURL(object);
		};
	}, [photoId]);
	async function onPick(file) {
		if (!file) return;
		setErr("");
		try {
			const prepared = await prepareFile(file);
			if (!prepared.mime.startsWith("image/")) {
				setErr("Use a photo.");
				return;
			}
			const nextId = crypto.randomUUID();
			await putFile(nextId, prepared.blob);
			useApp.getState().setTrailerPhoto(nextId);
		} catch (error) {
			setErr(error instanceof Error && error.message === "heic" ? "This photo is HEIC. Set the iPhone camera to Most Compatible, or choose a JPEG." : "That photo couldn't be saved.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shrink-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block w-[7.5rem] cursor-pointer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-[72px] w-[7.5rem] place-items-center overflow-hidden rounded-2xl bg-paper text-muted",
						children: url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: url,
							alt: "",
							className: "size-full object-cover"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
							className: "size-7",
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-[13px] font-semibold text-muted",
						children: url ? "Replace photo" : "Add a photo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-[13px] leading-snug text-muted",
						children: "Stays on this phone. It is not uploaded."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						className: "sr-only",
						"aria-label": "Add a trailer photo. It stays on this phone.",
						onChange: (e) => {
							onPick(e.target.files?.[0]);
							e.target.value = "";
						}
					})
				]
			}),
			url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-1 text-[13px] font-semibold text-muted",
				onClick: () => useApp.getState().setTrailerPhoto(null),
				children: "Remove"
			}) : null,
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-[150px] text-[13px] font-semibold text-stop",
				children: err
			}) : null
		]
	});
}
/** A new copy uses a new script address, so a host that caches /sw.js cannot keep the old worker. */
function bookWorkerScript(version) {
	return `/sw.js?v=${encodeURIComponent(version)}`;
}
function workerIsCurrent(scriptURL, version) {
	try {
		const url = new URL(scriptURL, "https://rivetcare.local");
		return url.pathname === "/sw.js" && url.searchParams.get("v") === version;
	} catch {
		return false;
	}
}
var SET_KEY = "rivetcare-offline-set";
/** Loaded only when the owner taps Save for offline. Not on first paint. */
var SCREEN_LOADS = [
	() => import("./fix-view-wfMC69kV.mjs"),
	() => import("./care-view-D1m-53tr.mjs"),
	() => import("./parts-view-CN_KRU1B.mjs"),
	() => import("./more-view-Bnoj4bcT.mjs"),
	() => import("./flow-view-C6nCYyEh.mjs"),
	() => import("./figure-view-DMLHB3W7.mjs"),
	() => import("./records-view-CYCH79fs.mjs"),
	() => import("./notes-view-6lY_SS3M.mjs"),
	() => import("./shop-sheet-DUyvXrLM.mjs"),
	() => import("./print-view-CMmQFtIr.mjs"),
	() => import("./table-view-C_KldGH5.mjs"),
	() => import("./manuals-view-CMUbN7tu.mjs"),
	() => import("./weights-view-CKlEy7dY.mjs"),
	() => import("./level-view-CZ8DZ1QD.mjs"),
	() => import("./service-view-CEcwgY_h.mjs"),
	() => import("./tires-view-BjBkuol3.mjs"),
	() => import("./supplies-view-CyZquaOv.mjs"),
	() => import("./privacy-view-D5Mn_cLK.mjs"),
	() => import("./support-view-CmLpRHKA.mjs"),
	() => import("./legal-copy-HLcWwbVZ.mjs"),
	() => import("./backup-view-C0XXLFpH.mjs"),
	() => import("./search-BjR82i3B.mjs"),
	() => import("./weights-DTEOTqeP.mjs").then((n) => n.C).then((n) => n.E)
];
function savedOfflineVersion() {
	try {
		return localStorage.getItem(SET_KEY);
	} catch {
		return null;
	}
}
function rememberOfflineSet() {
	try {
		localStorage.setItem(SET_KEY, BOOK_VERSION);
	} catch {}
}
function assetPaths() {
	const paths = /* @__PURE__ */ new Set();
	const add = (raw) => {
		if (!raw) return;
		try {
			const path = new URL(raw, window.location.origin).pathname;
			if (path.startsWith("/assets/") && /\.(?:js|css)$/.test(path)) paths.add(path);
		} catch {}
	};
	for (const entry of performance.getEntriesByType("resource")) add(entry.name);
	for (const el of document.querySelectorAll("script[src], link[rel='stylesheet']")) add(el.getAttribute("src") ?? el.getAttribute("href"));
	return [...paths];
}
function saveIsComplete(report) {
	return report.shellOk && report.fontsWanted > 0 && report.fontsHave >= report.fontsWanted && report.screensWanted > 0 && report.screensHave >= report.screensWanted;
}
function withTimeout(work, ms) {
	return new Promise((resolve, reject) => {
		const timer = window.setTimeout(() => reject(/* @__PURE__ */ new Error("timeout")), ms);
		work.then((value) => {
			window.clearTimeout(timer);
			resolve(value);
		}, (error) => {
			window.clearTimeout(timer);
			reject(error);
		});
	});
}
async function controllingWorker() {
	if (!("serviceWorker" in navigator)) throw new Error("no-worker");
	const reg = await registerBookWorker();
	try {
		await withTimeout(reg.update(), 4e3);
	} catch {}
	if (!navigator.serviceWorker.controller) await withTimeout(new Promise((resolve) => {
		const done = () => {
			navigator.serviceWorker.removeEventListener("controllerchange", done);
			resolve();
		};
		navigator.serviceWorker.addEventListener("controllerchange", done);
	}), 4e3).catch(() => void 0);
	const ready = await withTimeout(navigator.serviceWorker.ready, 8e3);
	const worker = navigator.serviceWorker.controller ?? ready.active ?? reg.active;
	if (!worker) throw new Error("no-controller");
	return worker;
}
async function registerBookWorker() {
	if (!("serviceWorker" in navigator)) throw new Error("no-worker");
	const want = bookWorkerScript(BOOK_VERSION);
	const regs = await navigator.serviceWorker.getRegistrations();
	await Promise.all(regs.map((reg) => {
		const script = reg.active?.scriptURL || reg.waiting?.scriptURL || reg.installing?.scriptURL || "";
		if (!script || workerIsCurrent(script, BOOK_VERSION)) return void 0;
		let path = "";
		try {
			path = new URL(script).pathname;
		} catch {
			return;
		}
		if (path !== "/sw.js") return void 0;
		return reg.unregister();
	}));
	const once = (options) => navigator.serviceWorker.register(want, options);
	return once({ updateViaCache: "none" }).catch(() => once());
}
async function saveForOffline() {
	const worker = await controllingWorker();
	let failed = 0;
	await Promise.all(SCREEN_LOADS.map(async (load) => {
		try {
			await load();
		} catch {
			failed += 1;
		}
	}));
	const urls = assetPaths();
	const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
	const report = await new Promise((resolve, reject) => {
		const channel = new MessageChannel();
		const finish = (data) => {
			if (!data || data.type !== "save-offline-done" || data.id && data.id !== id) return;
			window.clearTimeout(timer);
			navigator.serviceWorker.removeEventListener("message", onMessage);
			resolve(data);
		};
		const timer = window.setTimeout(() => {
			navigator.serviceWorker.removeEventListener("message", onMessage);
			reject(/* @__PURE__ */ new Error("timeout"));
		}, 2e4);
		const onMessage = (event) => finish(event.data);
		channel.port1.onmessage = (event) => finish(event.data);
		navigator.serviceWorker.addEventListener("message", onMessage);
		try {
			worker.postMessage({
				type: "save-offline",
				id,
				urls
			}, [channel.port2]);
		} catch {
			worker.postMessage({
				type: "save-offline",
				id,
				urls
			});
		}
	});
	if (failed > 0) {
		report.screensHave = 0;
		report.screensWanted = Math.max(report.screensWanted, failed);
	}
	if (saveIsComplete(report)) rememberOfflineSet();
	return report;
}
var reference = [
	{
		title: "Owner’s manuals and parts books",
		to: "manuals",
		tone: "signal",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5" })
	},
	{
		title: "Parts",
		detail: "Service numbers stay on this phone. The factory book opens on Airstream’s site.",
		to: "parts",
		tone: "offline",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "size-5" })
	},
	{
		title: "Glovebox specs",
		to: "specs",
		tone: "offline",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-5" })
	},
	{
		title: "Weight calculator",
		detail: "Axle weights from a truck scale. A CAT Scale ticket works.",
		to: "weights",
		tone: "offline",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-5" })
	},
	{
		title: "Trailer level",
		detail: "Which end is low, and about how far. The phone stays on the floor.",
		to: "level",
		tone: "offline",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ruler, { className: "size-5" })
	},
	{
		title: "Recalls, 2024 and later",
		detail: "The notes are on this phone. Checking a campaign opens NHTSA.",
		to: "recalls",
		tone: "offline",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-5" })
	},
	{
		title: "Find a dealer or shop",
		to: "service",
		tone: "signal",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-5" })
	}
];
var also = [
	{
		title: "Charts and diagrams",
		detail: "Teaching sketches, not factory pages. Open one on a signal and it stays.",
		to: "figures",
		tone: "once"
	},
	{
		title: "About the numbers",
		detail: "Where the intervals and codes come from",
		to: "about",
		tone: "offline"
	},
	{
		title: "Trip checklists",
		detail: "Tow, setup, dump, winterize, and storage",
		to: "lists",
		tone: "offline"
	},
	{
		title: "Procedures",
		detail: "Winterize, bearings, brakes, sealant",
		to: "procedures",
		tone: "offline"
	},
	{
		title: "On-board kit",
		detail: "What to actually carry",
		to: "tools",
		tone: "offline"
	},
	{
		title: "Shop sheet",
		detail: "The weights, tires, and notes to hand a shop",
		to: "desk",
		tone: "offline"
	},
	{
		title: "Checks table",
		detail: "The same checks, in columns",
		to: "table",
		tone: "offline"
	},
	{
		title: "Printable checklist",
		detail: "Every symptom, check, and action",
		to: "printout",
		tone: "offline"
	},
	{
		title: "Privacy",
		detail: "What stays on this phone, and how to delete it",
		to: "privacy",
		tone: "offline"
	},
	{
		title: "Support",
		detail: "A wrong step, and this copy of the book",
		to: "support",
		tone: "offline"
	}
];
var badge = {
	signal: {
		label: "Needs a signal",
		className: "bg-warn-soft text-caution"
	},
	offline: {
		label: "Works offline",
		className: "bg-sage-soft text-ok"
	},
	once: {
		label: "Needs a signal once",
		className: "bg-warn-soft text-caution"
	}
};
function openLibrary(to) {
	if (to === "fix") {
		useApp.getState().setSystem("");
		useApp.getState().tab("fix");
		return;
	}
	useApp.getState().push({ name: to });
}
function MoreView() {
	const [offline, setOffline] = (0, import_react.useState)("checking");
	(0, import_react.useEffect)(() => {
		setOffline(savedOfflineVersion() === BOOK_VERSION ? "saved" : "not");
	}, []);
	function pillFor(tone) {
		if (tone === "offline") return null;
		return badge[tone];
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => openLibrary("offline"),
			className: "mb-4 block min-h-11 w-full text-left text-sm font-semibold text-ink",
			children: offline === "checking" ? "Checking offline." : offline === "saved" ? "Saved for offline." : "Not saved for offline yet."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[13px] font-semibold uppercase tracking-[0.14em] text-muted",
			children: "Reference"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-2",
			children: reference.map((item) => {
				const pill = pillFor(item.tone);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => openLibrary(item.to),
					className: "flex w-full items-center gap-3 rounded-[18px] border border-line bg-sheet px-3 py-3 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 shrink-0 place-items-center rounded-xl bg-paper text-ok",
							"aria-hidden": true,
							children: item.icon
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-semibold text-ink",
									children: item.title
								}),
								item.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-sm text-muted",
									children: item.detail
								}) : null,
								pill ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `mt-1 inline-flex rounded-full px-2 py-0.5 text-[13px] font-semibold ${pill.className}`,
									children: pill.label
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
							className: "size-5 shrink-0 self-center text-muted",
							"aria-hidden": true
						})
					]
				}) }, item.title);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-[18px] border border-dashed border-line px-4 py-3 text-sm text-muted",
			children: [
				"Looking for fault codes, flowcharts, or procedures? They live under ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "font-semibold text-ink underline",
					onClick: () => openLibrary("fix"),
					children: "Fix"
				}),
				" and ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "font-semibold text-ink underline",
					onClick: () => useApp.getState().tab("care"),
					children: "Maintain"
				}),
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-sans text-[13px] font-semibold uppercase leading-snug tracking-[0.14em] text-muted",
				children: "Also"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 overflow-hidden rounded-[18px] border border-line bg-sheet",
				children: also.map((item, i) => {
					const pill = pillFor(item.tone);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: i === also.length - 1 ? "" : "border-b border-rule",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => openLibrary(item.to),
							className: "flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-semibold text-ink",
										children: item.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm text-muted",
										children: item.detail
									}),
									pill ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `mt-1 inline-flex rounded-full px-2 py-0.5 text-[13px] font-semibold ${pill.className}`,
										children: pill.label
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
								className: "size-5 shrink-0 self-center text-muted",
								"aria-hidden": true
							})]
						})
					}, item.title);
				})
			})]
		})
	] });
}
function SetupView() {
	const model = modelById(useApp((s) => s.modelId));
	const storedVin = useApp((s) => s.vin);
	const storedYear = useApp((s) => s.modelYear);
	const setVin = useApp((s) => s.setVin);
	const setYear = useApp((s) => s.setModelYear);
	const setPicker = useApp((s) => s.setPicker);
	const finish = useApp((s) => s.finishSetup);
	const [miles, setMiles] = (0, import_react.useState)("");
	const [vinDraft, setVinDraft] = (0, import_react.useState)(storedVin);
	const [yearDraft, setYearDraft] = (0, import_react.useState)(storedYear ? String(storedYear) : "");
	const [error, setError] = (0, import_react.useState)("");
	const problem = vinDraft ? vinProblem(vinDraft) : null;
	const decoded = vinOk(vinDraft) ? vinYear(vinDraft) : null;
	const typedYear = /^\d{4}$/.test(yearDraft) ? Number(yearDraft) : null;
	function done(confirmCoach) {
		holdStorage();
		if (!confirmCoach) {
			finish(null, false);
			return;
		}
		let milesValue = null;
		if (miles !== "") {
			const n = Number(miles);
			if (!/^\d{1,7}$/.test(miles) || !Number.isInteger(n) || n > 1e6) {
				setError("Use a mileage from 0 to 1,000,000. Digits only.");
				return;
			}
			milesValue = n;
		}
		if (yearDraft && (typedYear == null || typedYear < 1960 || typedYear > 2039)) {
			setError("Use a model year from 1960 to 2039, or leave it blank.");
			return;
		}
		if (vinDraft && problem) {
			setError(problem);
			return;
		}
		setError("");
		setYear(typedYear);
		setVin(vinDraft);
		finish(milesValue, true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "no-print fixed inset-0 z-40 flex items-end bg-inverse/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "setup-title",
			className: "safe-bottom max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-sheet px-5 pb-6 pt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted",
					children: "This phone"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "setup-title",
					className: "mt-1 font-display text-3xl text-ink",
					children: "Set up this trailer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Pick the coach. A model year is enough. A VIN is optional, and you can change any of this later."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setPicker(true),
					className: "mt-4 flex min-h-14 w-full items-center justify-between rounded-card border border-rule bg-paper px-4 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs font-semibold uppercase tracking-wider text-muted",
						children: "Coach"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold text-ink",
						children: model.name
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold text-accent",
						children: "Change"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block text-sm font-semibold text-ink",
					htmlFor: "setup-year",
					children: ["Model year, optional", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "setup-year",
						inputMode: "numeric",
						value: yearDraft,
						onChange: (e) => {
							setError("");
							setYearDraft(e.target.value.replace(/\D/g, "").slice(0, 4));
						},
						className: "mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base tabular-nums text-ink"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block text-sm font-semibold text-ink",
					htmlFor: "setup-miles",
					children: ["Lifetime miles, optional", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "setup-miles",
						inputMode: "numeric",
						value: miles,
						onChange: (e) => {
							setError("");
							setMiles(e.target.value.slice(0, 12));
						},
						"aria-invalid": error.startsWith("Use a mileage"),
						className: "mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base tabular-nums text-ink"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block text-sm font-semibold text-ink",
					htmlFor: "setup-vin",
					children: ["VIN, optional", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "setup-vin",
						value: vinDraft,
						onChange: (e) => {
							setError("");
							setVinDraft(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17));
						},
						autoCapitalize: "characters",
						autoCorrect: "off",
						spellCheck: false,
						maxLength: 17,
						placeholder: "17 characters",
						"aria-invalid": problem !== null,
						className: "mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4 font-mono text-base uppercase tracking-wide text-ink"
					})]
				}),
				decoded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm font-semibold text-ink",
					children: [
						"This VIN is a ",
						decoded,
						" ",
						model.name,
						"."
					]
				}) : null,
				typedYear && !decoded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-ink",
					children: [
						typedYear,
						" ",
						model.name,
						". A VIN is not required."
					]
				}) : null,
				typedYear && decoded && typedYear !== decoded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm font-semibold text-stop",
					children: [
						"The year you typed is ",
						typedYear,
						". The VIN says ",
						decoded,
						". The typed year is the one this app will use."
					]
				}) : null,
				problem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm font-semibold text-stop",
					children: problem
				}) : null,
				error && error !== problem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm font-semibold text-stop",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					className: "mt-4 w-full",
					onClick: () => done(true),
					children: "Continue"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => done(false),
					className: "mt-1 min-h-11 w-full text-sm font-semibold text-muted",
					children: "Not now"
				})
			]
		})
	});
}
async function cacheInfo(prefix) {
	try {
		if (typeof caches === "undefined") return {
			has: false,
			count: 0
		};
		const name = (await caches.keys()).find((key) => key === prefix || key.startsWith(`${prefix}-`));
		if (!name) return {
			has: false,
			count: 0
		};
		const count = (await (await caches.open(name)).keys()).length;
		return {
			has: count > 0,
			count
		};
	} catch {
		return {
			has: false,
			count: 0
		};
	}
}
function OfflineView() {
	const lastBackup = useApp((s) => s.lastBackup);
	const [shell, setShell] = (0, import_react.useState)("checking");
	const [figures, setFigures] = (0, import_react.useState)("checking");
	const [figureCount, setFigureCount] = (0, import_react.useState)(0);
	const [zips, setZips] = (0, import_react.useState)("checking");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [saveError, setSaveError] = (0, import_react.useState)("");
	const [zipError, setZipError] = (0, import_react.useState)("");
	const [report, setReport] = (0, import_react.useState)(null);
	const [savedVersion, setSavedVersion] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		(async () => {
			try {
				const [shellInfo, figureInfo, table] = await Promise.all([
					cacheInfo("rivetcare-shell"),
					cacheInfo("rivetcare-figures"),
					readZipTable().catch(() => null)
				]);
				if (!live) return;
				setShell(shellInfo.has ? "yes" : "no");
				setFigures(figureInfo.has ? "yes" : "no");
				setFigureCount(figureInfo.count);
				setZips(table ? "yes" : "no");
				setSavedVersion(savedOfflineVersion());
			} catch {
				if (!live) return;
				setShell("no");
				setFigures("no");
				setZips("no");
			}
		})();
		return () => {
			live = false;
		};
	}, []);
	async function saveSet() {
		if (saving) return;
		setSaving(true);
		setSaveError("");
		try {
			const next = await saveForOffline();
			setReport(next);
			setSavedVersion(savedOfflineVersion());
			if (next.shellOk) setShell("yes");
			if (!saveIsComplete(next)) setSaveError("Not complete. Stay on a signal and save again.");
		} catch (error) {
			const timedOut = error instanceof Error && error.message === "timeout";
			setSaveError(timedOut ? "The save did not finish. Stay on a signal and try again." : "That save needs a signal, and the app has to be open in this tab.");
		} finally {
			setSaving(false);
		}
	}
	async function saveDistances() {
		if (saving) return;
		setSaving(true);
		setZipError("");
		try {
			const { saveShopDistances } = await import("./service-DKXVEeby.mjs");
			if (await saveShopDistances()) setZips("yes");
			else setZipError("Could not save the ZIP list on this phone.");
		} catch {
			setZipError("That save needs a signal.");
		} finally {
			setSaving(false);
		}
	}
	const complete = !!report && saveIsComplete(report);
	const screensReady = report ? report.screensWanted > 0 && report.screensHave >= report.screensWanted ? "yes" : "no" : shell === "checking" ? "checking" : "no";
	const fontsReady = report ? report.fontsWanted > 0 && report.fontsHave >= report.fontsWanted ? "yes" : "no" : shell === "checking" ? "checking" : "no";
	const screenDetail = report && report.screensWanted > 0 ? `${report.screensHave} of ${report.screensWanted} screen files.` : "";
	const fontDetail = report ? `${report.fontsHave} of ${report.fontsWanted}.` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base font-semibold text-ink",
				children: shell === "checking" ? "Checking what is already on this phone." : shell === "yes" && screensReady === "yes" && fontsReady === "yes" ? "Saved for offline." : "Not saved for offline yet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void saveSet(),
				disabled: saving,
				className: "min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy disabled:opacity-40",
				children: saving ? "Saving…" : complete ? "Saved" : "Save for offline"
			}),
			saveError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-stop",
				children: saveError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink",
				children: "There is no account and no sync time. What you typed stays in this browser until the browser erases it. A backup file is a copy you save yourself. It is not the same as working offline."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-[20px] border border-line bg-sheet p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-ink",
						children: "On this phone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 grid gap-3 text-sm text-ink",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "App shell",
								ready: shell,
								missing: "Not saved for offline yet. Save while you have a signal."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Screen code",
								ready: screensReady,
								missing: savedVersion === BOOK_VERSION && !report ? "Last save was this version. Save again to check that it is still here." : savedVersion && savedVersion !== BOOK_VERSION ? "This version is not saved yet. Save again while you have a signal." : "Not saved as a set yet. Save while you have a signal.",
								detail: screenDetail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Fonts",
								ready: fontsReady,
								missing: "Not checked yet. Save while you have a signal.",
								detail: fontDetail
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Diagrams you have opened",
								ready: figures,
								missing: "None saved yet. Open a diagram while you have a signal.",
								detail: figureCount > 0 ? `${figureCount} on this phone. The ones you open stay.` : ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Shop distances",
								ready: zips,
								missing: "Not on this phone yet. The ZIP list is saved on its own."
							})
						]
					}),
					zips === "no" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => void saveDistances(),
							disabled: saving,
							className: "min-h-11 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-ink disabled:opacity-40",
							children: saving ? "Saving…" : "Save shop distances"
						}), zipError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm font-semibold text-stop",
							children: zipError
						}) : null]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Checks, fault codes, flowcharts, procedures, weights, and your notes and log do not need a signal once this save finishes. Factory manuals and the factory parts book are not part of it. The VIN year is calculated on the phone."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-[20px] border border-line bg-sheet p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-ink",
					children: "Needs a signal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-ink",
					children: "Factory manuals, the factory parts book, Apple Maps, and the NHTSA recall lookup open on the network. They are not stored here."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: lastBackup ? `Last backup saved ${formatWhen(lastBackup)}.` : "No backup file saved yet."
			})
		]
	});
}
function Row({ label, ready, missing, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-semibold",
			children: label
		}),
		ready === "checking" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 block text-sm text-muted",
			children: "Checking…"
		}) : null,
		ready === "yes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 block text-sm text-muted",
			children: detail ? `Saved. ${detail}` : "Saved"
		}) : null,
		ready === "no" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-0.5 block text-sm text-muted",
			children: missing
		}) : null
	] });
}
/** Catches a screen chunk that never arrived. The tabs outside this boundary still work. */
var ScreenBoundary = class extends import_react.Component {
	state = { error: null };
	static getDerivedStateFromError(error) {
		return { error };
	}
	render() {
		if (this.state.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MissingScreen, { error: this.state.error });
		return this.props.children;
	}
};
function MissingScreen({ error }) {
	const tab = useApp((s) => s.tab);
	const push = useApp((s) => s.push);
	const missing = isMissingScreen(error);
	const detail = error instanceof Error && error.message ? error.message : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl text-ink",
				children: missing ? "This screen isn't on the phone yet" : "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base text-ink",
				children: missing ? "Open it once while you have a signal, or save the book from Offline. Home, and the tabs along the bottom, are already on this phone." : "Home is still on this phone. Reload if you have a signal."
			}),
			detail && detail !== "This screen isn't on this phone yet." && !missing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm break-words text-muted",
				children: detail
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => tab("home"),
					className: "min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy",
					children: "Back to Home"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => push({ name: "offline" }),
					className: "min-h-11 rounded-full border border-line bg-sheet px-4 text-sm font-semibold text-ink",
					children: "Open Offline"
				})]
			})
		]
	});
}
function loadNamed(load, key) {
	return load().then((mod) => {
		const Comp = mod?.[key];
		if (typeof Comp !== "function") throw new Error(MISSING_SCREEN);
		return { default: Comp };
	});
}
var FixView = (0, import_react.lazy)(() => loadNamed(() => import("./fix-view-wfMC69kV.mjs"), "FixView"));
var SymptomView = (0, import_react.lazy)(() => loadNamed(() => import("./fix-view-wfMC69kV.mjs"), "SymptomView"));
var CareView = (0, import_react.lazy)(() => loadNamed(() => import("./care-view-D1m-53tr.mjs"), "CareView"));
var ProcedureView = (0, import_react.lazy)(() => loadNamed(() => import("./care-view-D1m-53tr.mjs"), "ProcedureView"));
var PartsView = (0, import_react.lazy)(() => loadNamed(() => import("./parts-view-CN_KRU1B.mjs"), "PartsView"));
var PartView = (0, import_react.lazy)(() => loadNamed(() => import("./parts-view-CN_KRU1B.mjs"), "PartView"));
var AboutView = (0, import_react.lazy)(() => loadNamed(() => import("./more-view-Bnoj4bcT.mjs"), "AboutView"));
var ChecklistView = (0, import_react.lazy)(() => loadNamed(() => import("./more-view-Bnoj4bcT.mjs"), "ChecklistView"));
var ChecklistsView = (0, import_react.lazy)(() => loadNamed(() => import("./more-view-Bnoj4bcT.mjs"), "ChecklistsView"));
var CodesView = (0, import_react.lazy)(() => loadNamed(() => import("./more-view-Bnoj4bcT.mjs"), "CodesView"));
var LogView = (0, import_react.lazy)(() => loadNamed(() => import("./more-view-Bnoj4bcT.mjs"), "LogView"));
var RecordsView = (0, import_react.lazy)(() => loadNamed(() => import("./records-view-CYCH79fs.mjs"), "RecordsView"));
var BackupView = (0, import_react.lazy)(() => loadNamed(() => import("./backup-view-C0XXLFpH.mjs"), "BackupView"));
var PrivacyView = (0, import_react.lazy)(() => loadNamed(() => import("./privacy-view-D5Mn_cLK.mjs"), "PrivacyView"));
var SupportView = (0, import_react.lazy)(() => loadNamed(() => import("./support-view-CmLpRHKA.mjs"), "SupportView"));
var NotesView = (0, import_react.lazy)(() => loadNamed(() => import("./notes-view-6lY_SS3M.mjs"), "NotesView"));
var ShopSheet = (0, import_react.lazy)(() => loadNamed(() => import("./shop-sheet-DUyvXrLM.mjs"), "ShopSheet"));
var OwnerHistory = (0, import_react.lazy)(() => loadNamed(() => import("./shop-sheet-DUyvXrLM.mjs"), "OwnerHistory"));
var ProceduresView = (0, import_react.lazy)(() => loadNamed(() => import("./more-view-Bnoj4bcT.mjs"), "ProceduresView"));
var RecallsView = (0, import_react.lazy)(() => loadNamed(() => import("./more-view-Bnoj4bcT.mjs"), "RecallsView"));
var SpecsView = (0, import_react.lazy)(() => loadNamed(() => import("./more-view-Bnoj4bcT.mjs"), "SpecsView"));
var ToolsView = (0, import_react.lazy)(() => loadNamed(() => import("./more-view-Bnoj4bcT.mjs"), "ToolsView"));
var PrintView = (0, import_react.lazy)(() => loadNamed(() => import("./print-view-CMmQFtIr.mjs"), "PrintView"));
var TableView = (0, import_react.lazy)(() => loadNamed(() => import("./table-view-C_KldGH5.mjs"), "TableView"));
var FlowView = (0, import_react.lazy)(() => loadNamed(() => import("./flow-view-C6nCYyEh.mjs"), "FlowView"));
var FlowsView = (0, import_react.lazy)(() => loadNamed(() => import("./flow-view-C6nCYyEh.mjs"), "FlowsView"));
var FigureView = (0, import_react.lazy)(() => loadNamed(() => import("./figure-view-DMLHB3W7.mjs"), "FigureView"));
var FiguresView = (0, import_react.lazy)(() => loadNamed(() => import("./figure-view-DMLHB3W7.mjs"), "FiguresView"));
var SheetView = (0, import_react.lazy)(() => loadNamed(() => import("./figure-view-DMLHB3W7.mjs"), "SheetView"));
var ManualsView = (0, import_react.lazy)(() => loadNamed(() => import("./manuals-view-CMUbN7tu.mjs"), "ManualsView"));
var WeightsView = (0, import_react.lazy)(() => loadNamed(() => import("./weights-view-CKlEy7dY.mjs"), "WeightsView"));
var LevelView = (0, import_react.lazy)(() => loadNamed(() => import("./level-view-CZ8DZ1QD.mjs"), "LevelView"));
var ServiceView = (0, import_react.lazy)(() => loadNamed(() => import("./service-view-CEcwgY_h.mjs"), "ServiceView"));
var TiresView = (0, import_react.lazy)(() => loadNamed(() => import("./tires-view-BjBkuol3.mjs"), "TiresView"));
var SuppliesView = (0, import_react.lazy)(() => loadNamed(() => import("./supplies-view-CyZquaOv.mjs"), "SuppliesView"));
var prompts = [
	"no hot water",
	"E-1",
	"glycol",
	"110",
	"brake grab",
	"winterize"
];
function Shell() {
	const hydrate = useApp((s) => s.hydrate);
	const trail = useApp((s) => s.trail);
	const cursor = useApp((s) => s.cursor);
	const screen = trail[cursor]?.screen ?? { name: "home" };
	const back = useApp((s) => s.back);
	const canBack = cursor > 0;
	function goBack() {
		if (!closeBackLayer()) back();
	}
	const tab = useApp((s) => s.tab);
	const push = useApp((s) => s.push);
	const searching = useApp((s) => s.searching);
	const setSearching = useApp((s) => s.setSearching);
	const picker = useApp((s) => s.picker);
	const setPicker = useApp((s) => s.setPicker);
	const setModel = useApp((s) => s.setModel);
	const modelId = useApp((s) => s.modelId);
	const vin = useApp((s) => s.vin);
	const toast = useApp((s) => s.toast);
	const keptRaw = useApp((s) => s.keptRaw);
	const undo = useApp((s) => s.undo);
	const runUndo = useApp((s) => s.runUndo);
	const ready = useApp((s) => s.ready);
	const hydrated = useApp((s) => s.hydrated);
	const accepted = useApp((s) => s.accepted);
	const acceptDisclaimer = useApp((s) => s.acceptDisclaimer);
	const [q, setQ] = (0, import_react.useState)("");
	const [coachQ, setCoachQ] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!picker) setCoachQ("");
	}, [picker]);
	const [updateReady, setUpdateReady] = (0, import_react.useState)(false);
	const [updateCurrent, setUpdateCurrent] = (0, import_react.useState)(false);
	const updateReg = (0, import_react.useRef)(null);
	const reloadOnClaim = (0, import_react.useRef)(false);
	const urlBooted = (0, import_react.useRef)(false);
	const holdHistory = (0, import_react.useRef)(false);
	const adoptAddress = () => {
		const opened = screenFromHash(window.location.hash);
		const now = useApp.getState().trail[useApp.getState().cursor]?.screen ?? { name: "home" };
		const wanted = opened ? screenToHash(opened) : "";
		if (screenToHash(now) === wanted) return;
		holdHistory.current = true;
		try {
			while (closeBackLayer());
			const live = useApp.getState();
			const liveNow = live.trail[live.cursor]?.screen ?? { name: "home" };
			if (screenToHash(liveNow) === wanted) return;
			if (opened) live.push(opened);
			else if (liveNow.name !== "home") live.tab("home");
		} finally {
			holdHistory.current = false;
		}
	};
	const model = modelById(modelId);
	const coachNeedle = coachQ.trim().toLowerCase();
	const coachGroups = modelGroups().map((group) => ({
		...group,
		models: group.models.filter((item) => !coachNeedle || `${group.family} ${item.name} ${item.short} ${item.tire}`.toLowerCase().includes(coachNeedle))
	})).filter((group) => group.models.length > 0);
	(0, import_react.useEffect)(() => {
		applyTheme();
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const onMq = () => {
			try {
				if (themeChoice() !== "system") return;
			} catch {
				return;
			}
			applyTheme();
		};
		mq.addEventListener("change", onMq);
		return () => {
			mq.removeEventListener("change", onMq);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		readStorageHold();
		const ask = () => holdStorage();
		window.addEventListener("pointerdown", ask, {
			capture: true,
			once: true
		});
		return () => window.removeEventListener("pointerdown", ask, { capture: true });
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		const path = window.location.pathname;
		const search = window.location.search;
		const hash = window.location.hash;
		const write = (url) => {
			if (`${path}${search}${hash}` !== url) window.history.replaceState(window.history.state, "", url);
		};
		if (!urlBooted.current) {
			const decision = addressAction(path, search, hash, screen, false);
			if (decision.open && screenToHash(decision.open) !== screenToHash(screen)) {
				const live = useApp.getState();
				const liveScreen = live.trail[live.cursor]?.screen ?? { name: "home" };
				if (screenToHash(decision.open) !== screenToHash(liveScreen)) live.push(decision.open);
				write(decision.url);
				return;
			}
			urlBooted.current = true;
			write(decision.url);
			return;
		}
		write(addressAction(path, search, hash, screen, true).url);
	}, [hydrated, screen]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		const onHash = () => adoptAddress();
		window.addEventListener("hashchange", onHash);
		return () => window.removeEventListener("hashchange", onHash);
	}, [hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		let depth = 0;
		let suppress = 0;
		let inPop = false;
		let syncing = false;
		let wasSearching = useApp.getState().searching;
		let wasPicker = useApp.getState().picker;
		const closeSearch = () => useApp.getState().setSearching(false);
		const closePicker = () => useApp.getState().setPicker(false);
		if (wasSearching) addBackLayer(closeSearch);
		if (wasPicker) addBackLayer(closePicker);
		const alignStoreLayers = () => {
			const state = useApp.getState();
			if (state.searching !== wasSearching) {
				wasSearching = state.searching;
				if (state.searching) addBackLayer(closeSearch);
				else removeBackLayer(closeSearch);
			}
			if (state.picker !== wasPicker) {
				wasPicker = state.picker;
				if (state.picker) addBackLayer(closePicker);
				else removeBackLayer(closePicker);
			}
		};
		const applyDepth = (target) => {
			const delta = target - depth;
			if (delta === 0) return;
			depth = target;
			if (delta > 0) {
				for (let i = 0; i < delta; i += 1) history.pushState({ sb: 1 }, "");
				return;
			}
			suppress += 1;
			history.go(delta);
		};
		const sync = () => {
			if (syncing) return;
			syncing = true;
			try {
				alignStoreLayers();
				if (inPop) return;
				const target = useApp.getState().cursor + backLayerCount();
				if (holdHistory.current) {
					depth = target;
					return;
				}
				applyDepth(target);
			} finally {
				syncing = false;
			}
		};
		const onPop = () => {
			if (suppress > 0) {
				suppress -= 1;
				return;
			}
			const marker = window.history.state;
			if (!marker || marker.sb !== 1) {
				adoptAddress();
				return;
			}
			inPop = true;
			depth = Math.max(0, depth - 1);
			try {
				if (!closeBackLayer() && useApp.getState().cursor > 0) useApp.getState().back();
			} finally {
				inPop = false;
			}
		};
		window.addEventListener("popstate", onPop);
		const unsubStore = useApp.subscribe(sync);
		const unsubLayers = onBackLayers(sync);
		sync();
		return () => {
			window.removeEventListener("popstate", onPop);
			unsubStore();
			unsubLayers();
			removeBackLayer(closeSearch);
			removeBackLayer(closePicker);
		};
	}, [hydrated]);
	(0, import_react.useEffect)(() => {
		hydrate();
		let removeController;
		const cacheShell = () => {
			const controller = navigator.serviceWorker?.controller;
			if (!controller) return;
			const urls = performance.getEntriesByType("resource").map((entry) => {
				try {
					return new URL(entry.name).pathname;
				} catch {
					return "";
				}
			});
			controller.postMessage({
				type: "cache-shell",
				urls
			});
		};
		const askVersion = () => {
			const prefix = previewPathPrefix(window.location.hostname, window.location.pathname) ?? "";
			return fetch(`${prefix}/version.txt?ts=${Date.now()}`, { cache: "no-store" }).then((res) => res.ok ? res.text() : "").then((text) => {
				const remote = text.trim();
				const newer = /^\d{4}\.\d{2}\.\d{2}$/.test(remote) && remote !== BOOK_VERSION;
				if (newer) setUpdateReady(true);
				return newer;
			}).catch(() => false);
		};
		if ("serviceWorker" in navigator) {
			const onChange = () => {
				if (reloadOnClaim.current) window.location.reload();
				else cacheShell();
			};
			navigator.serviceWorker.addEventListener("controllerchange", onChange);
			removeController = () => navigator.serviceWorker.removeEventListener("controllerchange", onChange);
			registerBookWorker().then(async (reg) => {
				updateReg.current = reg;
				const watch = (worker) => {
					if (!worker) return;
					if (worker.state === "installed" && navigator.serviceWorker.controller) setUpdateReady(true);
					worker.addEventListener("statechange", () => {
						if (worker.state === "installed" && navigator.serviceWorker.controller) setUpdateReady(true);
					});
				};
				watch(reg.installing);
				watch(reg.waiting);
				reg.addEventListener("updatefound", () => watch(reg.installing));
				try {
					await reg.update();
				} catch {}
				watch(reg.waiting);
			}).catch(() => void 0);
		}
		askVersion();
		const onCheck = () => {
			askVersion().then((newer) => {
				const worker = updateReg.current?.waiting ?? updateReg.current?.installing;
				if (newer || worker) {
					setUpdateReady(true);
					setUpdateCurrent(false);
					return;
				}
				setUpdateReady(false);
				setUpdateCurrent(true);
			});
		};
		window.addEventListener("rivetcare-check-update", onCheck);
		const id = window.setTimeout(cacheShell, 700);
		const poll = window.setInterval(() => {
			updateReg.current?.update().catch(() => void 0);
			askVersion();
		}, 6e4);
		const onVisible = () => {
			if (document.visibilityState !== "visible") return;
			updateReg.current?.update().catch(() => void 0);
			askVersion();
		};
		document.addEventListener("visibilitychange", onVisible);
		return () => {
			window.clearTimeout(id);
			window.clearInterval(poll);
			document.removeEventListener("visibilitychange", onVisible);
			window.removeEventListener("rivetcare-check-update", onCheck);
			removeController?.();
		};
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		const onPreload = (event) => {
			event.preventDefault();
			if (typeof navigator !== "undefined" && navigator.onLine === false) return;
			const key = "rivetcare-preload-reload";
			try {
				if (sessionStorage.getItem(key)) return;
				sessionStorage.setItem(key, "1");
			} catch {}
			window.location.reload();
		};
		window.addEventListener("vite:preloadError", onPreload);
		return () => window.removeEventListener("vite:preloadError", onPreload);
	}, []);
	(0, import_react.useEffect)(() => {
		if (searching) {
			window.scrollTo(0, 0);
			document.getElementById("guide-search")?.focus();
		}
	}, [searching]);
	(0, import_react.useEffect)(() => {
		const title = screen.name === "home" ? "RivetCare" : `${screenTitle(screen)} · RivetCare`;
		document.title = title;
	}, [screen]);
	(0, import_react.useEffect)(() => {
		if (!picker) return;
		const onKey = (e) => {
			if (e.key === "Escape") setPicker(false);
		};
		window.addEventListener("keydown", onKey);
		const onTab = (e) => trapTab(e, document.getElementById("coach-dialog"));
		window.addEventListener("keydown", onTab);
		document.getElementById("coach-dialog")?.focus();
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("keydown", onTab);
		};
	}, [picker, setPicker]);
	const showDisclaimer = hydrated && !accepted;
	const showSetup = hydrated && !ready && !showDisclaimer;
	(0, import_react.useEffect)(() => {
		if (!showDisclaimer) return;
		const dialog = document.getElementById("disclaimer-dialog");
		if (dialog) {
			dialog.scrollTop = 0;
			dialog.focus();
		}
		const onTab = (e) => trapTab(e, document.getElementById("disclaimer-dialog"));
		window.addEventListener("keydown", onTab);
		return () => window.removeEventListener("keydown", onTab);
	}, [showDisclaimer]);
	const [hits, setHits] = (0, import_react.useState)([]);
	const [searched, setSearched] = (0, import_react.useState)("");
	const [searchDown, setSearchDown] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!searching || !q.trim()) return;
		let cancel = false;
		const timer = window.setTimeout(() => {
			const miss = () => {
				if (cancel) return;
				setHits([]);
				setSearched(q);
				setSearchDown(true);
			};
			import("./search-BjR82i3B.mjs").then(({ searchAll, searchSaved, savedRowsFrom, mergeHits }) => {
				if (cancel) return;
				import("./weights-DTEOTqeP.mjs").then((n) => n.C).then((n) => n.E).then(({ weightSearchBlob }) => {
					if (cancel) return;
					const live = useApp.getState();
					const saved = searchSaved(q, savedRowsFrom({
						notes: live.notes,
						log: live.log,
						weights: weightSearchBlob(live.modelId)
					}));
					setHits(mergeHits(saved, searchAll(q, model, coachYear(live.vin, live.modelYear))));
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
		searching,
		model,
		vin
	]);
	const section = tabFor(screen);
	function closeSearch() {
		setSearching(false);
	}
	function openHit(to) {
		push(to);
	}
	const lock = picker || showDisclaimer || showSetup;
	const tabTitle = screen.name === "home" ? "RivetCare" : screen.name === "care" ? "Maintain" : screen.name === "fix" ? "Fix" : screen.name === "records" ? "My records" : screen.name === "more" ? "Library" : "";
	const tabRoot = tabTitle !== "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-h-dvh max-w-lg bg-paper text-ink print:max-w-none print:bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#content",
				className: "skip-link no-print",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: `no-print sticky top-0 z-30 bg-paper ${updateReady || updateCurrent ? "" : "safe-top"}`,
				children: [updateReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "safe-top flex items-center justify-between gap-3 bg-[#152A6A] px-4 pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-white",
						children: "A newer copy is ready."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 shrink-0 rounded-full bg-white px-4 text-sm font-semibold text-[#152A6A]",
						style: {
							backgroundColor: "#ffffff",
							color: "#152A6A"
						},
						onClick: () => {
							setUpdateReady(false);
							reloadOnClaim.current = true;
							const waiting = updateReg.current?.waiting ?? updateReg.current?.installing;
							if (waiting) {
								waiting.postMessage("skip-waiting");
								window.setTimeout(() => {
									if (reloadOnClaim.current) window.location.reload();
								}, 4e3);
								return;
							}
							window.location.reload();
						},
						children: "Update"
					})]
				}) : updateCurrent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "safe-top flex items-center justify-between gap-3 border-b border-line bg-sheet px-4 pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-ink",
						children: "This copy is current."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 shrink-0 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-ink",
						onClick: () => setUpdateCurrent(false),
						children: "OK"
					})]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					inert: lock || void 0,
					children: searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						role: "search",
						className: "px-4 pb-3 pt-2",
						onSubmit: (e) => {
							e.preventDefault();
							if (hits[0]) openHit(hits[0].to);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, { onClick: closeSearch }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-1 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
									className: "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted",
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "guide-search",
									value: q,
									onChange: (e) => setQ(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Escape") closeSearch();
									},
									placeholder: "Search fault codes, parts, notes",
									"aria-label": "Search symptoms, codes, and parts",
									enterKeyHint: "search",
									inputMode: "search",
									autoCapitalize: "off",
									autoCorrect: "off",
									spellCheck: false,
									className: "box-border min-h-12 w-full min-w-0 max-w-full rounded-full border border-line bg-sheet pl-10 pr-12 text-base text-ink placeholder:text-muted focus:border-navy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "absolute right-0.5 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-ink",
									"aria-label": "Close search",
									onClick: closeSearch,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
										className: "size-5",
										"aria-hidden": true
									})
								})
							]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 pb-3 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-11 items-center",
								children: [canBack ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, { onClick: goBack }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ml-auto flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DarkModeSwitch, {}), screen.name === "records" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => push({ name: "log" }),
										className: "inline-flex h-11 items-center gap-1 rounded-full bg-navy px-3.5 text-sm font-semibold text-on-navy",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
											className: "size-4",
											"aria-hidden": true
										}), "Add"]
									}) : screen.name === "home" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setSearching(true),
										"aria-expanded": searching,
										"aria-label": "Search",
										className: "grid size-11 shrink-0 place-items-center text-ink",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
											className: "size-6",
											"aria-hidden": true
										})
									})]
								})]
							}),
							tabRoot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-[2rem] leading-tight text-ink",
								children: tabTitle
							}) : null,
							tabRoot && screen.name !== "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrailerStrip, {}) : null
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestoreHold, {}),
			searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "content",
				className: "relative z-10 px-4 py-3 pb-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "sr-only",
						children: "Search results"
					}),
					!q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: prompts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setQ(p),
							className: "min-h-11 rounded-full border border-line bg-sheet px-3 text-sm font-semibold",
							children: p
						}, p))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"aria-live": "polite",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-2",
								children: hits.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openHit(h.to),
									className: "w-full min-w-0 rounded-card border border-line bg-sheet px-3 py-3 text-left wrap-anywhere",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold uppercase tracking-wider text-muted",
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
								}) }, i))
							}),
							q && searched === q && hits.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-sm text-muted",
								children: searchDown ? "That list needs a signal." : "Nothing matches that."
							}),
							q && searched !== q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-sm text-muted",
								children: "Searching…"
							})
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "content",
				inert: lock || void 0,
				className: "relative z-10 px-4 pb-28 pt-1 print:px-0 print:pb-0 print:pt-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenSkeleton, {}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenBody, { screen })
				}) }, screenToHash(screen) || "/"), screen.name === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 px-1 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-ink",
							children: "RivetCare"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "@RivetCareApp"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AffiliationNote, {})
					]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Sections",
				inert: lock || void 0,
				className: "safe-bottom no-print fixed inset-x-0 bottom-0 z-20 border-t border-rule bg-paper",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-5 px-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "size-5" }),
								label: "Home",
								on: section === "home",
								go: () => tab("home")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-5" }),
								label: "Maintain",
								on: section === "care",
								go: () => tab("care")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-5" }),
								label: "Records",
								on: section === "records",
								go: () => tab("records")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-5" }),
								label: "Fix",
								on: section === "fix",
								go: () => tab("fix")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tab, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5" }),
								label: "Library",
								on: section === "more",
								go: () => tab("more")
							})
						]
					})
				})
			}),
			showSetup && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetupView, {}),
			picker && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-end bg-inverse/40",
				onClick: () => setPicker(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "coach-dialog",
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "coach-title",
					tabIndex: -1,
					className: "safe-bottom max-h-[80vh] w-full overflow-y-auto rounded-t-3xl bg-sheet px-4 pt-4 outline-none",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sticky top-0 z-10 -mx-4 flex items-center bg-sheet px-4 pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, { onClick: () => setPicker(false) })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "coach-title",
							className: "font-display text-2xl text-ink",
							children: "Which trailer?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "2027 travel trailers, from the owner’s manuals. Your weight sticker governs. Other is a year or model that is not on this list."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center justify-between gap-3 border-t border-rule pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-ink",
								children: "Light or dark"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DarkModeSwitch, {})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachIdentity, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm font-semibold text-ink",
							children: "Floor plan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "sr-only",
							htmlFor: "coach-search",
							children: "Search floor plans"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "coach-search",
							value: coachQ,
							onChange: (e) => setCoachQ(e.target.value),
							placeholder: "Classic, 28, Globetrotter…",
							autoCapitalize: "off",
							autoCorrect: "off",
							spellCheck: false,
							className: "mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4 text-base text-ink"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-4 pb-4",
							children: [coachGroups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: "Nothing matches that."
							}) : null, coachGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted",
								children: group.family
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-2",
								children: group.models.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setModel(m.id),
									className: `flex min-h-14 w-full items-center rounded-card border px-3 py-2 text-left ${modelId === m.id ? "border-navy bg-navy text-on-navy" : "border-line bg-paper text-ink"}`,
									"aria-pressed": modelId === m.id,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-semibold",
											children: m.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-sm ${modelId === m.id ? "text-on-navy/80" : "text-muted"}`,
											children: m.gvwr === "—" ? `${m.length} · weights not listed` : `${m.gvwr} GVWR · ${m.tire}`
										})]
									})
								}) }, m.id))
							})] }, group.family))]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-24 z-50 flex justify-center px-4",
				role: "status",
				"aria-live": "polite",
				children: toast || keptRaw ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex max-w-full items-center gap-3 rounded-full bg-inverse px-4 py-2 text-sm font-semibold text-on-navy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0",
							children: toast || "The saved copy on this phone could not be read. It was kept."
						}),
						keptRaw ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const file = new Blob([keptRaw], { type: "text/plain" });
								const url = URL.createObjectURL(file);
								const a = document.createElement("a");
								a.href = url;
								a.download = "rivetcare-unreadable.txt";
								a.rel = "noopener";
								document.body.appendChild(a);
								a.click();
								a.remove();
								URL.revokeObjectURL(url);
							},
							className: "min-h-11 shrink-0 underline",
							children: "Save copy"
						}) : null,
						undo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: runUndo,
							className: "min-h-11 underline",
							children: "Undo"
						}) : null
					]
				}) : null
			}),
			showDisclaimer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-print fixed inset-0 z-50 flex items-end bg-inverse/50 sm:items-center sm:justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "disclaimer-dialog",
					tabIndex: -1,
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "disclaimer-title",
					className: "safe-bottom max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-sheet px-5 pt-5 sm:max-w-lg sm:rounded-3xl sm:pb-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted",
							children: "Before you use this"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "disclaimer-title",
							className: "mt-1 font-display text-3xl text-ink",
							children: "Disclaimer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DisclaimerCopy, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							id: "disclaimer-accept",
							type: "button",
							onClick: () => acceptDisclaimer(),
							className: "mt-4 mb-2 min-h-12 w-full rounded-full bg-navy text-sm font-semibold text-on-navy",
							children: "I understand"
						})
					]
				})
			})
		]
	});
}
function trapTab(e, root) {
	if (e.key !== "Tab" || !root) return;
	const list = [...root.querySelectorAll("button, a[href], input, select, textarea")].filter((el) => !el.hasAttribute("disabled"));
	if (!list.length) return;
	const first = list[0];
	const last = list[list.length - 1];
	const inside = root.contains(document.activeElement);
	if (e.shiftKey && (document.activeElement === first || !inside)) {
		e.preventDefault();
		last.focus();
	} else if (!e.shiftKey && document.activeElement === last) {
		e.preventDefault();
		first.focus();
	}
}
function CoachIdentity() {
	const vin = useApp((s) => s.vin);
	const setVin = useApp((s) => s.setVin);
	const modelYear = useApp((s) => s.modelYear);
	const model = modelById(useApp((s) => s.modelId));
	const [yearDraft, setYearDraft] = (0, import_react.useState)(modelYear ? String(modelYear) : "");
	(0, import_react.useEffect)(() => {
		setYearDraft(modelYear ? String(modelYear) : "");
	}, [modelYear, model.id]);
	const decoded = vinOk(vin) ? vinYear(vin) : null;
	const year = coachYear(vin, modelYear);
	const vinError = vinProblem(vin);
	const mismatch = vinMismatch(vin, model);
	const yearLine = decoded && modelYear && decoded !== modelYear ? `The year you typed is ${modelYear}. The VIN says ${decoded}. The typed year is the one this app will use.` : mismatch ? mismatch : decoded ? `${decoded} from the VIN. Confirm the plate.` : year ? `${year} on this coach. A VIN can confirm it.` : "Type the model year, or a 17-character VIN.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-4 block text-sm font-semibold text-ink",
			htmlFor: "coach-year",
			children: ["Model year", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "coach-year",
				inputMode: "numeric",
				value: yearDraft,
				onChange: (e) => setYearDraft(e.target.value.replace(/\D/g, "").slice(0, 4)),
				onBlur: () => {
					if (!yearDraft) {
						useApp.getState().setModelYear(null);
						return;
					}
					const n = Number(yearDraft);
					if (yearDraft.length < 4 || n < 1960 || n > 2039) {
						useApp.getState().flash("Enter a year from 1960 to 2039");
						setYearDraft(modelYear ? String(modelYear) : "");
						return;
					}
					useApp.getState().setModelYear(n);
				},
				placeholder: "2021",
				className: "mt-1 min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-base text-ink"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-4 block text-sm font-semibold text-ink",
			htmlFor: "coach-vin",
			children: ["VIN", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: "coach-vin",
				value: vin,
				onChange: (e) => setVin(e.target.value),
				autoCapitalize: "characters",
				autoCorrect: "off",
				spellCheck: false,
				maxLength: 17,
				placeholder: "17 characters",
				"aria-describedby": vinError ? "vin-error" : "vin-status",
				"aria-invalid": vinError !== null,
				className: "mt-1 min-h-11 w-full rounded-xl border border-line bg-paper px-3 font-mono text-sm uppercase tracking-wide text-ink placeholder:normal-case placeholder:tracking-normal placeholder:text-muted"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			id: "vin-status",
			className: "mt-1 text-sm text-muted",
			children: yearLine
		}),
		vinError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			id: "vin-error",
			className: "mt-1 text-sm font-semibold text-stop",
			children: vinError
		}) : null
	] });
}
function TrailerStrip() {
	const model = modelById(useApp((s) => s.modelId));
	const nickname = useApp((s) => s.nickname);
	const odo = useApp((s) => s.odometer);
	const vin = useApp((s) => s.vin);
	const year = coachYear(vin, useApp((s) => s.modelYear));
	const miles = odo > 0 ? `${odo.toLocaleString()} mi` : "miles not set";
	const sub = `${year ? `${year} ` : ""}${model.family} ${model.short} · ${miles}`;
	const setPicker = useApp((s) => s.setPicker);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 flex min-h-14 items-center gap-2 rounded-full bg-sheet px-4 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setPicker(true),
			"aria-haspopup": "dialog",
			className: "min-w-0 flex-1 text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Change trailer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate font-semibold text-ink",
					children: nickname || model.short
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-sm text-muted",
					children: sub
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "min-h-11 shrink-0 px-1 text-sm font-semibold text-ink",
			onClick: () => setPicker(true),
			children: "Change"
		})]
	});
}
function RestoreHold() {
	const flash = useApp((s) => s.flash);
	const [on, setOn] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const note = sessionStorage.getItem(RESTORE_NOTE);
			if (note) {
				sessionStorage.removeItem(RESTORE_NOTE);
				useApp.getState().flash(note);
			}
		} catch {}
		return subscribeRestoreHold(setOn);
	}, []);
	if (!on) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "no-print border-b border-line bg-sheet px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-ink",
			children: "The previous log is still on this phone."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: busy,
				className: "min-h-11 flex-1 rounded-full bg-navy font-semibold text-on-navy disabled:opacity-40",
				onClick: () => {
					if (restoreApplying() || busy) return;
					setBusy(true);
					undoRestore().then((ok) => {
						if (!ok) {
							setBusy(false);
							flash("Could not put the previous log back.");
							return;
						}
						window.location.reload();
					});
				},
				children: "Undo restore"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: busy,
				className: "min-h-11 flex-1 rounded-full border border-line font-semibold text-ink disabled:opacity-40",
				onClick: () => {
					if (restoreApplying() || busy) return;
					setBusy(true);
					confirmRestore().finally(() => setBusy(false));
				},
				children: "Keep this restore"
			})]
		})]
	});
}
function BackButton({ onClick, iconOnly = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex h-11 shrink-0 items-center text-ink",
		"aria-label": "Back",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
			className: "size-6 shrink-0",
			"aria-hidden": true
		}), iconOnly ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-semibold",
			children: "Back"
		})]
	});
}
function ScreenSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 py-2",
		"aria-busy": "true",
		"aria-label": "Loading",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-2/3 animate-pulse rounded-lg bg-quiet" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-[20px] bg-quiet" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-28 animate-pulse rounded-[20px] bg-quiet" })
		]
	});
}
function Tab({ icon, label, on, go }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: go,
		"aria-current": on ? "page" : void 0,
		className: "flex min-h-14 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: `flex min-w-0 flex-col items-center gap-1 px-1 py-1 text-center text-sm leading-tight ${on ? "font-semibold text-accent" : "font-medium text-muted"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: `grid size-8 place-items-center rounded-full [&_svg]:size-5 ${on ? "bg-navy text-on-navy" : ""}`,
				children: icon
			}), label]
		})
	});
}
function ScreenBody({ screen }) {
	switch (screen.name) {
		case "home": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeView, {});
		case "fix": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FixView, {});
		case "symptom": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SymptomView, {
			id: screen.id,
			step: screen.step
		}, `${screen.id}-${screen.step}`);
		case "care": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CareView, {});
		case "procedure": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProcedureView, { id: screen.id });
		case "procedures": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProceduresView, {});
		case "parts": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartsView, {});
		case "part": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartView, { id: screen.id });
		case "more": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreView, {});
		case "checklist": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecklistView, { id: screen.id });
		case "lists": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecklistsView, {});
		case "specs": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecsView, {});
		case "weights": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeightsView, {});
		case "level": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelView, {});
		case "tires": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiresView, {});
		case "supplies": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuppliesView, {});
		case "service": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceView, {});
		case "recalls": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecallsView, {});
		case "codes": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodesView, {
			initialQuery: screen.q ?? "",
			initialAppliance: screen.appliance ?? "All"
		});
		case "log": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogView, {});
		case "records": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordsView, {});
		case "backup": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackupView, {});
		case "privacy": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrivacyView, {});
		case "history": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OwnerHistory, {});
		case "notes": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesView, {});
		case "desk": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopSheet, {});
		case "manuals": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManualsView, {});
		case "tools": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolsView, {});
		case "about": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutView, {});
		case "printout": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrintView, {});
		case "table": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableView, {
			id: screen.id,
			step: screen.step
		});
		case "flows": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowsView, {});
		case "flow": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowView, { id: screen.id }, screen.id);
		case "figures": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiguresView, {});
		case "figure": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FigureView, { id: screen.id });
		case "sheet": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetView, { page: screen.page });
		case "offline": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineView, {});
		case "support": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SupportView, {});
	}
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => SplitComponent });
var SplitComponent = Shell;
//#endregion
export { restoredBookOk as C, undoRestore as E, refreshRestoreHold as S, takeRestoreSnapshot as T, useBackLayer as _, writeZipTable as a, noteRestoredFiles as b, hazardFlow as c, unsetScheduleCopy as d, Btn as f, Pill as g, Notice as h, readZipTable as i, DayPicker as l, Kicker as m, BOOK_VERSION as n, DisclaimerCopy as o, Card as p, dropBookParts as r, gasStopFlow as s, routes_exports as t, StartAllDates as u, RESTORE_NOTE as v, setRestoreApplying as w, photoIdsOnPhone as x, closeRestoreUndo as y };
