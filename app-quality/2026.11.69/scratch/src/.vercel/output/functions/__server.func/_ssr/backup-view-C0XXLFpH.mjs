import { i as __toESM } from "../_runtime.mjs";
import { d as readWeightsFile, p as savedTicketCount } from "./weights-DTEOTqeP.mjs";
import { d as require_react_dom, q as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as putFile, I as readLevelFile, X as todayIso, Y as tirePhotoIds, b as getFile, c as blobToBase64, et as useApp, nt as whenFilesDropped, s as backupBlob, t as BACKUP_APP, y as formatWhen } from "./store-C3gr-Jyz.mjs";
import { A as ChevronLeft } from "../_libs/lucide-react.mjs";
import { C as restoredBookOk, E as undoRestore, S as refreshRestoreHold, T as takeRestoreSnapshot, _ as useBackLayer, b as noteRestoredFiles, v as RESTORE_NOTE, w as setRestoreApplying, x as photoIdsOnPhone } from "./routes-BL7pyKhp.mjs";
//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/backup-view-C0XXLFpH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = require_react_dom();
/** Dated name so two saves are not the same file. */
function backupFileName(iso) {
	return `rivetcare-backup-${/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : "undated"}.json`;
}
/** Repeated log or note ids in the file. The file is not applied. */
function repeatedRecordIds(data) {
	const seen = /* @__PURE__ */ new Set();
	let extra = 0;
	const take = (id) => {
		if (typeof id !== "string" || !id) return;
		if (seen.has(id)) extra += 1;
		else seen.add(id);
	};
	const walk = (row) => {
		if (!row || typeof row !== "object" || Array.isArray(row)) return;
		const coach = row;
		if (Array.isArray(coach.log)) {
			for (const entry of coach.log) if (entry && typeof entry === "object") take(entry.id);
		}
		if (Array.isArray(coach.notes)) {
			for (const entry of coach.notes) if (entry && typeof entry === "object") take(entry.id);
		}
	};
	const coaches = data.coaches;
	if (coaches && typeof coaches === "object" && !Array.isArray(coaches)) for (const row of Object.values(coaches)) walk(row);
	else walk(data);
	return extra;
}
function countKeys(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return 0;
	return Object.keys(value).length;
}
function countList(value) {
	return Array.isArray(value) ? value.length : 0;
}
/** What a backup file contains. It does not apply the file. */
function lookAtBackup(data, bytes) {
	const coaches = data.coaches && typeof data.coaches === "object" && !Array.isArray(data.coaches) ? data.coaches : null;
	let service = 0;
	let notes = 0;
	let checks = 0;
	let maintenance = 0;
	if (coaches) for (const row of Object.values(coaches)) {
		if (!row || typeof row !== "object" || Array.isArray(row)) continue;
		const coach = row;
		service += countList(coach.log);
		notes += countList(coach.notes);
		checks += countKeys(coach.checks);
		maintenance += countKeys(coach.done);
	}
	else {
		service = countList(data.log);
		notes = countList(data.notes);
		checks = countKeys(data.checks);
		maintenance = countKeys(data.done);
	}
	return {
		bytes,
		version: typeof data.version === "number" ? String(data.version) : "Not marked",
		coaches: coaches ? Object.keys(coaches).length : typeof data.modelId === "string" ? 1 : 0,
		service,
		notes,
		checks,
		maintenance,
		photos: countKeys(data.files),
		weights: countKeys(data.weights)
	};
}
var K = new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
function rotr(x, n) {
	return x >>> n | x << 32 - n;
}
/** SHA-256 over UTF-8, one piece at a time, so a photo backup is not copied into one string. */
var Sha256 = class {
	h = new Uint32Array([
		1779033703,
		3144134277,
		1013904242,
		2773480762,
		1359893119,
		2600822924,
		528734635,
		1541459225
	]);
	buf = /* @__PURE__ */ new Uint8Array(64);
	bufLen = 0;
	bytes = 0;
	w = /* @__PURE__ */ new Uint32Array(64);
	encoder = new TextEncoder();
	update(text, from = 0, to = text.length) {
		const size = 32768;
		for (let i = from; i < to;) {
			let end = Math.min(to, i + size);
			if (end < to && text.charCodeAt(end - 1) >= 55296 && text.charCodeAt(end - 1) <= 56319) end -= 1;
			if (end <= i) end = Math.min(to, i + size);
			this.feed(this.encoder.encode(text.slice(i, end)));
			i = end;
		}
	}
	feed(data) {
		this.bytes += data.length;
		let offset = 0;
		if (this.bufLen > 0) {
			const take = Math.min(64 - this.bufLen, data.length);
			this.buf.set(data.subarray(0, take), this.bufLen);
			this.bufLen += take;
			offset = take;
			if (this.bufLen === 64) {
				this.compress(this.buf);
				this.bufLen = 0;
			}
		}
		while (offset + 64 <= data.length) {
			this.compress(data.subarray(offset, offset + 64));
			offset += 64;
		}
		if (offset < data.length) {
			this.buf.set(data.subarray(offset), 0);
			this.bufLen = data.length - offset;
		}
	}
	compress(block) {
		const w = this.w;
		for (let i = 0; i < 16; i += 1) {
			const j = i * 4;
			w[i] = (block[j] << 24 | block[j + 1] << 16 | block[j + 2] << 8 | block[j + 3]) >>> 0;
		}
		for (let i = 16; i < 64; i += 1) {
			const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ w[i - 15] >>> 3;
			const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ w[i - 2] >>> 10;
			w[i] = w[i - 16] + s0 + w[i - 7] + s1 >>> 0;
		}
		let a = this.h[0];
		let b = this.h[1];
		let c = this.h[2];
		let d = this.h[3];
		let e = this.h[4];
		let f = this.h[5];
		let g = this.h[6];
		let h = this.h[7];
		for (let i = 0; i < 64; i += 1) {
			const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
			const ch = e & f ^ ~e & g;
			const t1 = h + s1 + ch + K[i] + w[i] >>> 0;
			const t2 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + (a & b ^ a & c ^ b & c) >>> 0;
			h = g;
			g = f;
			f = e;
			e = d + t1 >>> 0;
			d = c;
			c = b;
			b = a;
			a = t1 + t2 >>> 0;
		}
		this.h[0] = this.h[0] + a >>> 0;
		this.h[1] = this.h[1] + b >>> 0;
		this.h[2] = this.h[2] + c >>> 0;
		this.h[3] = this.h[3] + d >>> 0;
		this.h[4] = this.h[4] + e >>> 0;
		this.h[5] = this.h[5] + f >>> 0;
		this.h[6] = this.h[6] + g >>> 0;
		this.h[7] = this.h[7] + h >>> 0;
	}
	hex() {
		const bits = this.bytes * 8;
		const padLen = this.bufLen < 56 ? 64 - this.bufLen : 128 - this.bufLen;
		const pad = new Uint8Array(padLen);
		pad[0] = 128;
		const view = new DataView(pad.buffer);
		view.setUint32(pad.length - 8, Math.floor(bits / 4294967296));
		view.setUint32(pad.length - 4, bits >>> 0);
		const counted = this.bytes;
		this.feed(pad);
		this.bytes = counted;
		return [...this.h].map((word) => word.toString(16).padStart(8, "0")).join("");
	}
};
function hashStrings(parts) {
	const hash = new Sha256();
	for (const part of parts) hash.update(part);
	return hash.hex();
}
/** ok: the checksum matches. none: an older file with no checksum. bad: the file was damaged or cut off. */
function backupIntegrity(raw) {
	const start = raw.charCodeAt(0) === 65279 ? 1 : 0;
	const at = raw.lastIndexOf(",\"integrity\":");
	if (at < start) return "none";
	const match = raw.slice(at).match(/^,"integrity":"([a-f0-9]{64})"}\s*$/);
	if (!match) return "none";
	const hash = new Sha256();
	hash.update(raw, start, at);
	return hash.hex() === match[1] ? "ok" : "bad";
}
function formatBytes(bytes) {
	if (!Number.isFinite(bytes) || bytes <= 0) return "Not saved yet";
	if (bytes < 1024) return `${bytes} bytes`;
	if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
	return `${(bytes / 1048576).toFixed(1)} MB`;
}
function logsOf(coaches, currentId, current) {
	const all = {
		...coaches,
		[currentId]: { log: current }
	};
	return Object.values(all).flatMap((coach) => coach.log);
}
/** The book without the photo blobs. The share step adds files and the scale tickets. */
function backupHead(state) {
	const coaches = {
		...state.coaches,
		[state.modelId]: {
			odometer: state.odometer,
			done: state.done,
			checks: state.checks,
			log: state.log,
			notes: state.notes,
			dealer: state.dealer,
			dealerAddress: state.dealerAddress,
			vin: state.vin,
			nickname: state.nickname,
			modelYear: state.modelYear,
			wheelOff: state.wheelOff,
			lugAck: state.lugAck,
			tires: state.tires,
			supplies: state.supplies,
			plates: state.plates,
			listDone: state.listDone,
			logDraft: state.logDraft,
			winterPlace: state.winterPlace,
			photoId: state.photoId,
			shots: state.shots
		}
	};
	return {
		app: BACKUP_APP,
		version: 1,
		modelId: state.modelId,
		coaches,
		odometer: state.odometer,
		done: state.done,
		checks: state.checks,
		log: state.log,
		notes: state.notes,
		dealer: state.dealer,
		dealerAddress: state.dealerAddress,
		hint: state.hint,
		vin: state.vin,
		wheelOff: state.wheelOff,
		lugAck: state.lugAck,
		ready: state.ready,
		coachSet: state.coachSet,
		tires: state.tires,
		supplies: state.supplies,
		plates: state.plates,
		listDone: state.listDone,
		logDraft: state.logDraft,
		winterPlace: state.winterPlace,
		photoId: state.photoId,
		shots: state.shots
	};
}
/** Builds the file. Saving it is a separate tap, so the phone still has the gesture. */
async function buildBackup() {
	const state = useApp.getState();
	try {
		const head = backupHead(state);
		const coaches = head.coaches;
		const wanted = wantedFiles(coaches, state.modelId, state.log);
		const parts = [JSON.stringify(head).slice(0, -1), ",\"files\":{"];
		let first = true;
		let used = 0;
		let kept = 0;
		let left = 0;
		for (const file of wanted) {
			if (kept >= 200 || used >= 33554432) {
				left += 1;
				continue;
			}
			const blob = await getFile(file.id);
			const mime = blob && blob.type && blob.type !== "application/octet-stream" ? blob.type : file.mime;
			const allowed = mime.startsWith("image/") || !file.imagesOnly && mime === "application/pdf";
			const encoded = blob ? Math.ceil(blob.size / 3) * 4 : 0;
			if (!blob || !allowed || encoded === 0) {
				await new Promise((resolve) => setTimeout(resolve, 0));
				continue;
			}
			if (encoded > 21e6 || used + encoded > 33554432) {
				left += 1;
				await new Promise((resolve) => setTimeout(resolve, 0));
				continue;
			}
			const data = await blobToBase64(blob);
			if (data.length > 21e6 || used + data.length > 33554432) {
				left += 1;
				continue;
			}
			if (!first) parts.push(",");
			first = false;
			used += data.length;
			kept += 1;
			parts.push(`${JSON.stringify(file.id)}:${JSON.stringify({
				mime,
				data
			})}`);
			await new Promise((resolve) => setTimeout(resolve, 0));
		}
		parts.push(`}${left > 0 ? `,"filesLeft":${left}` : ""},"weights":${JSON.stringify(readWeightsFile())},"level":${JSON.stringify(readLevelFile())}`);
		let integrity;
		try {
			integrity = hashStrings(parts);
		} catch {
			return null;
		}
		parts.push(`,"integrity":${JSON.stringify(integrity)}}`);
		const blob = new Blob(parts, { type: "application/json" });
		return {
			file: new File([blob], backupFileName(todayIso()), { type: "application/json" }),
			url: URL.createObjectURL(blob),
			left
		};
	} catch {
		return null;
	}
}
function wantedFiles(coaches, currentId, current) {
	const list = [];
	const seen = /* @__PURE__ */ new Set();
	const add = (id, mime, imagesOnly) => {
		if (!id || seen.has(id)) return;
		seen.add(id);
		list.push({
			id,
			mime,
			imagesOnly
		});
	};
	for (const entry of logsOf(coaches, currentId, current)) for (const file of entry.files ?? []) add(file.id, file.mime, false);
	for (const coach of Object.values(coaches)) {
		for (const file of coach.logDraft?.files ?? []) add(file.id, file.mime, false);
		add(coach.photoId, "image/jpeg", true);
		for (const shot of Object.values(coach.shots ?? {})) for (const file of shot) add(file.id, "image/jpeg", true);
		for (const id of tirePhotoIds(coach.tires)) add(id, "image/jpeg", true);
	}
	return list;
}
function trapTab(event, root) {
	if (event.key !== "Tab") return;
	const list = [...root.querySelectorAll("button, a[href], input, select, textarea")].filter((el) => !el.hasAttribute("disabled"));
	if (!list.length) {
		event.preventDefault();
		root.focus();
		return;
	}
	const first = list[0];
	const last = list[list.length - 1];
	const active = document.activeElement;
	const inside = active instanceof Node && root.contains(active) && active !== root;
	if (event.shiftKey) {
		if (!inside || active === first) {
			event.preventDefault();
			last.focus();
		}
	} else if (!inside || active === last) {
		event.preventDefault();
		first.focus();
	}
}
/** Focus a dialog, keep Tab inside it, and close on Escape. */
function useDialog(onClose) {
	const ref = (0, import_react.useRef)(null);
	const closeRef = (0, import_react.useRef)(onClose);
	closeRef.current = onClose;
	(0, import_react.useEffect)(() => {
		const root = ref.current;
		if (!root) return;
		const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		root.focus({ preventScroll: true });
		const onKey = (event) => {
			if (event.key === "Escape") {
				event.preventDefault();
				closeRef.current();
				return;
			}
			trapTab(event, root);
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
			if (previous?.isConnected) previous.focus({ preventScroll: true });
		};
	}, []);
	return ref;
}
var lastSavedBackup = null;
function lastSavedBackupFile() {
	return lastSavedBackup;
}
function downloadNeedsShare() {
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
function BackupSheet({ onClose }) {
	const lastBackup = useApp((s) => s.lastBackup);
	const dialogRef = useDialog(onClose);
	const [file, setFile] = (0, import_react.useState)(null);
	const [url, setUrl] = (0, import_react.useState)("");
	const [left, setLeft] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const handed = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let objectUrl = "";
		buildBackup().then((built) => {
			if (cancelled || !built) {
				if (built) URL.revokeObjectURL(built.url);
				if (!cancelled) setError("Could not build the backup");
				return;
			}
			objectUrl = built.url;
			setFile(built.file);
			setUrl(built.url);
			setLeft(built.left);
		});
		return () => {
			cancelled = true;
			if (objectUrl && !handed.current) URL.revokeObjectURL(objectUrl);
		};
	}, []);
	function saved() {
		if (file) lastSavedBackup = file;
		useApp.getState().noteBackup(file?.size);
		onClose();
	}
	async function share() {
		if (!file) return false;
		const can = navigator.canShare?.({ files: [file] }) ?? false;
		if (!navigator.share || !can) return false;
		try {
			await navigator.share({
				files: [file],
				title: "RivetCare backup"
			});
			saved();
			return true;
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") return true;
			return false;
		}
	}
	function anchorDownload() {
		if (!url) return false;
		handed.current = true;
		const blobUrl = url;
		const a = document.createElement("a");
		a.href = blobUrl;
		a.download = file?.name || "rivetcare-backup.json";
		a.rel = "noopener";
		document.body.appendChild(a);
		a.click();
		a.remove();
		window.setTimeout(() => URL.revokeObjectURL(blobUrl), 6e4);
		if (file) lastSavedBackup = file;
		useApp.getState().noteBackup(file?.size);
		window.setTimeout(onClose, 400);
		return true;
	}
	async function saveFile() {
		if (!file) return;
		setError("");
		const picker = window.showSaveFilePicker;
		if (picker && !downloadNeedsShare()) try {
			const writable = await (await picker({
				suggestedName: file.name,
				types: [{
					description: "JSON",
					accept: { "application/json": [".json"] }
				}]
			})).createWritable();
			await writable.write(file);
			await writable.close();
			saved();
			return;
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") return;
		}
		if (downloadNeedsShare()) {
			if (!await share()) setError("Could not save the file.");
			return;
		}
		if (!anchorDownload()) setError("Could not save the file.");
	}
	async function copy() {
		if (!file) return;
		setError("");
		if (file.size > 83886080) {
			setError("That backup is too large to copy on this phone.");
			return;
		}
		try {
			const text = await file.text();
			if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
			await navigator.clipboard.writeText(text);
		} catch {
			try {
				const text = await file.text();
				const area = document.createElement("textarea");
				area.value = text;
				area.setAttribute("readonly", "");
				area.style.position = "fixed";
				area.style.left = "-9999px";
				document.body.appendChild(area);
				area.select();
				const ok = document.execCommand("copy");
				area.remove();
				if (!ok) throw new Error("copy failed");
			} catch {
				setError("Could not copy. Use Share or save to Files.");
				return;
			}
		}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 2e3);
	}
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-inverse/40",
		role: "presentation",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: dialogRef,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "backup-title",
			tabIndex: -1,
			className: "w-full max-w-lg rounded-t-3xl bg-sheet px-4 pt-4 outline-none",
			style: { paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" },
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sticky top-0 z-10 -mx-4 flex items-center bg-sheet px-2 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onClose,
						className: "flex min-h-11 items-center text-ink",
						"aria-label": "Back",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
							className: "size-5 shrink-0",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold",
							children: "Back"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "backup-title",
					className: "font-display text-2xl text-ink",
					children: "Save a copy"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-ink",
					children: "This file is your records: every trailer’s miles, service notes, personal notes, photos, and weight tickets. It is not the project zip. Save it to Files, or email it to yourself. On the other phone, open Records and tap Restore. Clearing this phone does not delete that copy."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm font-semibold text-ink",
					children: lastBackup ? `Last backup saved ${formatWhen(lastBackup)}.` : "No backup saved yet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Share or Save file sets that date. Copy does not. Nothing is synced to an account."
				}),
				file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						"This file is ",
						fileSize(file.size),
						"."
					]
				}) : null,
				left > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-ink",
					children: [left === 1 ? "One photo or PDF did not fit" : `${left} photos or PDFs did not fit`, " in this copy, so the phone could build the file. The notes are still in it."]
				}) : null,
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-stop",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: !file,
							onClick: () => void share().then((ok) => {
								if (!ok) setError("Could not open the share sheet.");
							}),
							className: "min-h-12 w-full rounded-full bg-navy font-semibold text-on-navy disabled:opacity-50",
							children: file ? "Share or save to Files" : "Preparing the file…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: !file,
							onClick: () => void saveFile(),
							className: "min-h-12 w-full rounded-full border border-line font-semibold text-ink disabled:opacity-50",
							children: "Save file"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: !file,
							onClick: () => void copy(),
							className: "min-h-12 w-full rounded-full border border-line font-semibold text-ink disabled:opacity-50",
							children: copied ? "Copied" : "Copy to clipboard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "min-h-12 w-full font-semibold text-accent",
							children: "Not now"
						})
					]
				})
			]
		})
	}), document.body);
}
function fileSize(bytes) {
	if (bytes < 1024) return `${bytes} bytes`;
	if (bytes < 1048576) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
	return `${(bytes / 1048576).toFixed(1)} MB`;
}
var BOOK_KEY = "rivetcare-v1";
var ReadPhotoError = class extends Error {};
function readBook() {
	try {
		return localStorage.getItem(BOOK_KEY);
	} catch {
		return null;
	}
}
async function rollBack(message) {
	if (!await undoRestore()) return false;
	try {
		sessionStorage.setItem(RESTORE_NOTE, message);
	} catch {}
	window.location.reload();
	return true;
}
/** Saves a copy of the current log, checks that copy, then writes the backup. Undo stays until the restore is kept. */
async function applyBackupFiles(plan, flash) {
	const ids = new Set(photoIdsOnPhone(useApp.getState()));
	for (const item of plan.files) ids.add(item.id);
	const snap = await takeRestoreSnapshot([...ids]);
	if (!snap.ok) {
		flash(snap.message);
		return;
	}
	setRestoreApplying(true);
	const wrote = [];
	const sizes = /* @__PURE__ */ new Map();
	let saved = 0;
	let skippedDup = 0;
	try {
		for (const item of plan.files) {
			const blob = backupBlob(item.data, item.mime);
			if (!blob) continue;
			try {
				await getFile(item.id);
			} catch {
				throw new ReadPhotoError();
			}
			if (wrote.includes(item.id)) {
				skippedDup += 1;
				continue;
			}
			await putFile(item.id, blob);
			wrote.push(item.id);
			sizes.set(item.id, blob.size);
			saved += 1;
		}
		let applied = false;
		try {
			applied = await Promise.resolve(plan.apply());
		} catch {
			if (!await rollBack("Could not finish the restore. Nothing was replaced.")) flash("The previous log could not be put back.");
			return;
		}
		if (!applied) {
			const toast = useApp.getState().toast;
			if (!await rollBack(toast.startsWith("This phone has a newer copy") || toast.startsWith("Another tab saved first") ? toast : "This phone is full. Nothing was replaced.")) flash("The previous log could not be put back.");
			return;
		}
		await whenFilesDropped();
		let photosOk = true;
		try {
			for (const id of wrote) {
				const blob = await getFile(id);
				if (!blob || blob.size !== sizes.get(id)) photosOk = false;
			}
		} catch {
			photosOk = false;
		}
		if (!photosOk || !restoredBookOk(readBook())) {
			if (!await rollBack("The restored copy could not be checked. Nothing was replaced.")) flash("The previous log could not be put back.");
			return;
		}
		await noteRestoredFiles(wrote);
		await refreshRestoreHold();
		const incomplete = plan.files.length > 0 && saved + skippedDup !== plan.files.length;
		let base = plan.files.length === 0 ? "Backup restored" : incomplete ? "Notes restored. A file that was not a real photo or PDF was left out." : saved > 0 ? "Backup restored, with photos" : "Backup restored";
		if (skippedDup === 1) base += " One repeated photo was left out.";
		else if (skippedDup > 1) base += ` ${skippedDup} repeated photos were left out.`;
		const held = "The previous log stays until you keep it.";
		flash(plan.notice ? `${base}. ${held} ${plan.notice}` : `${base}. ${held}`);
	} catch (err) {
		if (!await rollBack(err instanceof ReadPhotoError ? "A photo already on this phone could not be read. Nothing was replaced." : "This phone is full. Nothing was replaced.")) flash("The previous log could not be put back.");
	} finally {
		setRestoreApplying(false);
	}
}
function noneYet(names) {
	const lower = names.map((name) => name.charAt(0).toLowerCase() + name.slice(1));
	if (lower.length <= 1) return lower[0] ?? "";
	if (lower.length === 2) return `${lower[0]} or ${lower[1]}`;
	return `${lower.slice(0, -1).join(", ")}, or ${lower[lower.length - 1]}`;
}
async function previewBackup(file) {
	if (file.size > 83886080) return {
		ok: false,
		message: "That backup is too large to restore on this phone."
	};
	let text = "";
	try {
		text = await file.text();
	} catch {
		return {
			ok: false,
			message: "That file could not be read."
		};
	}
	const integrity = backupIntegrity(text);
	if (integrity === "bad") return {
		ok: false,
		message: "This file does not match its checksum. It may be damaged. Nothing was replaced."
	};
	let data;
	try {
		data = JSON.parse(text);
	} catch {
		return {
			ok: false,
			message: "That file is not a backup"
		};
	}
	const result = useApp.getState().importBackup(data);
	if (!result.ok) return {
		ok: false,
		message: result.reason === "future" ? "This backup is from a newer copy of the app." : result.reason === "large" ? "That backup is too large to restore on this phone." : "That file is not a backup"
	};
	try {
		const state = useApp.getState();
		const coaches = {
			...state.coaches,
			[state.modelId]: {
				log: state.log,
				notes: state.notes
			}
		};
		let phoneService = 0;
		let phoneNotes = 0;
		for (const row of Object.values(coaches)) {
			const coach = row;
			phoneService += Array.isArray(coach.log) ? coach.log.length : 0;
			phoneNotes += Array.isArray(coach.notes) ? coach.notes.length : 0;
		}
		return {
			ok: true,
			look: {
				name: file.name,
				integrity,
				summary: lookAtBackup(data, file.size),
				plan: result,
				repeated: repeatedRecordIds(data),
				phoneService,
				phoneNotes
			}
		};
	} catch {
		return {
			ok: false,
			message: "That file is not a backup"
		};
	}
}
function BackupView() {
	const push = useApp((s) => s.push);
	const flash = useApp((s) => s.flash);
	const lastBackup = useApp((s) => s.lastBackup);
	const lastBackupBytes = useApp((s) => s.lastBackupBytes);
	const coaches = useApp((s) => s.coaches);
	const modelId = useApp((s) => s.modelId);
	const log = useApp((s) => s.log);
	const notes = useApp((s) => s.notes);
	const done = useApp((s) => s.done);
	const checks = useApp((s) => s.checks);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [look, setLook] = (0, import_react.useState)(null);
	useBackLayer(open, () => setOpen(false));
	useBackLayer(look !== null, () => setLook(null));
	const shots = useApp((s) => s.shots);
	const photos = log.reduce((n, entry) => n + (entry.files?.length ?? 0), 0) + Object.values(shots).reduce((n, files) => n + files.length, 0);
	const coachCount = (/* @__PURE__ */ new Set([...Object.keys(coaches), modelId])).size;
	const counted = [
		["Maintenance marks", Object.keys(done).length],
		["Checklist marks", Object.keys(checks).length],
		["Service records", log.length],
		["Notes", notes.length],
		["Photos and receipts", photos],
		["Scale tickets", savedTicketCount(readWeightsFile())]
	];
	const filled = counted.filter((row) => row[1] > 0);
	const empty = counted.filter((row) => row[1] === 0).map((row) => row[0]);
	async function inspect(file) {
		const result = await previewBackup(file);
		if (!result.ok) {
			flash(result.message);
			return;
		}
		setLook(result.look);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl text-ink",
				children: "Backup"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-ink",
				children: "A backup is a file you save. This app does not upload one. A restore keeps the previous log on this phone until you tap Keep this restore."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-card border border-line bg-sheet p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-ink",
						children: "On this phone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Last backup saved",
								value: lastBackup ? formatWhen(lastBackup) : "None yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Last file size",
								value: formatBytes(lastBackupBytes)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Backup version",
								value: String(1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Trailers",
								value: String(coachCount)
							}),
							filled.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label,
								value: String(value)
							}, label))
						]
					}),
					empty.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-ink",
						children: [
							"None yet: ",
							noneYet(empty),
							"."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-ink",
						children: lastBackup ? "Last backup saved is the date you saved the file, not a check that the file still opens. Tap Verify backup and choose that file. A checksum catches a damaged or cut-off file. It does not show that nobody edited it." : "No backup file to check yet. The records are only on this phone until you save one."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "The file also includes the VIN, the year, appliance plates, tire notes, and the hitch setup, when you have entered them."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setOpen(true),
				className: "min-h-12 w-full rounded-full bg-navy px-4 font-semibold text-on-navy",
				children: "Export complete backup"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full border border-line bg-sheet px-4 font-semibold text-ink",
				children: ["Verify backup", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: "application/json,.json",
					className: "sr-only",
					onChange: (e) => {
						const file = e.target.files?.[0];
						e.target.value = "";
						if (file) inspect(file);
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "-mt-2 text-sm text-muted",
				children: "Checks the file and shows what would change. Nothing is replaced until you confirm."
			}),
			lastSavedBackupFile() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void inspect(lastSavedBackupFile()),
				className: "block min-h-11 w-full text-left text-sm font-semibold text-accent",
				children: "Verify the copy just saved"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => push({ name: "history" }),
				className: "block min-h-11 w-full text-left text-sm font-semibold text-accent",
				children: "Owner's history, to print or save as PDF"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => push({ name: "privacy" }),
				className: "block min-h-11 w-full text-left text-sm font-semibold text-accent",
				children: "Privacy and where the data stays"
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackupSheet, { onClose: () => setOpen(false) }),
			look && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RestoreSheet, {
				look,
				onClose: () => setLook(null),
				onRestore: () => {
					const plan = look.plan;
					setLook(null);
					(async () => {
						try {
							await applyBackupFiles(plan, flash);
						} catch {
							flash("Could not restore. Nothing was replaced.");
						}
					})();
				}
			})
		]
	});
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-3 border-b border-rule py-2 last:border-b-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm text-ink",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-sm font-semibold tabular-nums text-ink",
			children: value
		})]
	});
}
function RestoreSheet({ look, onClose, onRestore }) {
	const summary = look.summary;
	const dialogRef = useDialog(onClose);
	return (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-inverse/40",
		role: "presentation",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: dialogRef,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "look-title",
			tabIndex: -1,
			className: "max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-sheet px-4 pt-4 outline-none",
			style: { paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" },
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sticky top-0 z-10 -mx-4 flex items-center bg-sheet px-2 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onClose,
						className: "flex min-h-11 items-center text-ink",
						"aria-label": "Back",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
							className: "size-5 shrink-0",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold",
							children: "Back"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "look-title",
					className: "font-display text-2xl text-ink",
					children: "Inside this file"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: look.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "File size",
							value: formatBytes(summary.bytes)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Backup version",
							value: summary.version
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "File check",
							value: look.integrity === "ok" ? "Matches. This only catches a damaged file." : "No checksum. Older file."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Trailers",
							value: String(summary.coaches)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Maintenance marks",
							value: String(summary.maintenance)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Checklist marks",
							value: String(summary.checks)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Service records",
							value: String(summary.service)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Notes",
							value: String(summary.notes)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Photos and receipts",
							value: String(summary.photos)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Scale tickets",
							value: String(summary.weights)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-ink",
					children: [
						"Nothing has been replaced. Service records: ",
						look.phoneService,
						" on this phone, ",
						summary.service,
						" in this file. Notes: ",
						look.phoneNotes,
						" on this phone, ",
						summary.notes,
						" in this file. Restoring writes these trailers over the matching ones. Other trailers stay. The previous log stays on this phone until you keep this restore. A file that does not say setup was finished does not finish it, unless that coach already has miles or notes."
					]
				}),
				look.repeated > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm font-semibold text-ink",
					children: [
						"This file repeats ",
						look.repeated,
						" record ",
						look.repeated === 1 ? "id" : "ids",
						". A repeated id is kept once."
					]
				}) : null,
				look.plan.notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm font-semibold text-ink",
					children: look.plan.notice
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onRestore,
					className: "mt-4 min-h-12 w-full rounded-full bg-navy font-semibold text-on-navy",
					children: "Restore this backup"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "mt-2 min-h-12 w-full font-semibold text-accent",
					children: "Don't restore"
				})
			]
		})
	}), document.body);
}
//#endregion
export { BackupView, RestoreSheet, BackupSheet as n, previewBackup, applyBackupFiles as t };
