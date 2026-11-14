import { n as tasks, t as cadenceLabel } from "./schedule-AmHNloLy.mjs";
import { E as vinOk, O as vinYear, i as checklistById } from "./checklists-CYZuG9Db.mjs";
import { d as readWeightsFile, f as restoreWeightsFile, i as backupWeights, l as mergeWeightsFile, p as savedTicketCount, w as writeWeightsFile } from "./weights-DTEOTqeP.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-DUUzfVvp.js
var DB = "rivetcare-files";
var STORE = "blobs";
var MAX_PDF = 15728640;
var MAX_EDGE = 1600;
var sharedDb = null;
var openingDb = null;
function db() {
	if (sharedDb) return Promise.resolve(sharedDb);
	if (openingDb) return openingDb;
	const pending = new Promise((resolve, reject) => {
		if (typeof indexedDB === "undefined") {
			reject(/* @__PURE__ */ new Error("no-store"));
			return;
		}
		const req = indexedDB.open(DB, 1);
		req.onupgradeneeded = () => {
			if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
		};
		req.onsuccess = () => {
			const base = req.result;
			sharedDb = base;
			const drop = () => {
				if (sharedDb === base) sharedDb = null;
			};
			base.onversionchange = () => {
				base.close();
				drop();
			};
			base.onclose = drop;
			resolve(base);
		};
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("no-store"));
	});
	openingDb = pending;
	pending.finally(() => {
		if (openingDb === pending) openingDb = null;
	});
	return pending;
}
function closeFiles() {
	const base = sharedDb;
	sharedDb = null;
	openingDb = null;
	base?.close();
}
async function putFile(id, blob) {
	const base = await db();
	await new Promise((resolve, reject) => {
		const tx = base.transaction(STORE, "readwrite");
		tx.objectStore(STORE).put(blob, id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("no-store"));
	});
}
async function getFile(id) {
	const base = await db();
	return await new Promise((resolve, reject) => {
		const req = base.transaction(STORE, "readonly").objectStore(STORE).get(id);
		req.onsuccess = () => resolve(req.result ?? null);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("no-store"));
	});
}
async function deleteFile(id) {
	try {
		const base = await db();
		await new Promise((resolve, reject) => {
			const tx = base.transaction(STORE, "readwrite");
			tx.objectStore(STORE).delete(id);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("no-store"));
		});
	} catch {}
}
function cleanName(name, fallback) {
	return name.split(/[/\\]/).pop()?.replace(/[^\w.\- ()]+/g, "").slice(0, 80) || fallback;
}
function isPdf(file) {
	return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}
var SHOWABLE = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp"
]);
function isOddImage(file) {
	const type = file.type.toLowerCase().split(";")[0].trim();
	return type === "image/avif" || type === "image/tiff" || type === "image/bmp" || /\.(avif|tiff?|bmp)$/i.test(file.name);
}
function isHeic(file) {
	return file.type === "image/heic" || file.type === "image/heif" || /\.hei[cf]$/i.test(file.name);
}
function isImage(file) {
	return isHeic(file) || file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif)$/i.test(file.name);
}
async function shrinkImage(file) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
	const w = Math.max(1, Math.round(bitmap.width * scale));
	const h = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		bitmap.close();
		throw new Error("unreadable");
	}
	ctx.drawImage(bitmap, 0, 0, w, h);
	bitmap.close();
	const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", .72));
	if (!blob) throw new Error("unreadable");
	return {
		blob,
		mime: "image/jpeg",
		name: `${cleanName(file.name, "photo").replace(/\.[^.]+$/, "") || "photo"}.jpg`
	};
}
async function prepareFile(file) {
	if (!file.size) throw new Error("unreadable");
	if (isPdf(file)) {
		if (file.size > MAX_PDF) throw new Error("too-big");
		if (!await hasMagic(file, "application/pdf")) throw new Error("bad-type");
		return {
			blob: file,
			mime: "application/pdf",
			name: cleanName(file.name, "repair.pdf").replace(/\.pdf$/i, "") + ".pdf"
		};
	}
	if (!isImage(file)) throw new Error("bad-type");
	try {
		return await shrinkImage(file);
	} catch {
		if (isHeic(file)) throw new Error("heic");
		const type = file.type.toLowerCase().split(";")[0].trim();
		if (SHOWABLE.has(type)) {
			if (file.size > MAX_PDF) throw new Error("too-big");
			if (!await hasMagic(file, type)) throw new Error("unreadable");
			return {
				blob: file,
				mime: type,
				name: cleanName(file.name, "photo")
			};
		}
		if (isOddImage(file)) throw new Error("odd-image");
		throw new Error("unreadable");
	}
}
async function blobToBase64(blob) {
	const bytes = new Uint8Array(await blob.arrayBuffer());
	const size = 24576;
	let out = "";
	for (let i = 0; i < bytes.length; i += size) {
		const slice = bytes.subarray(i, Math.min(bytes.length, i + size));
		out += btoa(String.fromCharCode.apply(null, slice));
		if (i + size < bytes.length) await new Promise((resolve) => setTimeout(resolve, 0));
	}
	return out;
}
async function hasMagic(file, type) {
	return magicOk(type, new Uint8Array(await file.slice(0, 16).arrayBuffer()));
}
var SAFE_TYPES = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"application/pdf"
]);
function startsWith(bytes, sig) {
	if (bytes.length < sig.length) return false;
	return sig.every((b, i) => bytes[i] === b);
}
function ascii(bytes, start, text) {
	if (bytes.length < start + text.length) return false;
	for (let i = 0; i < text.length; i++) if (bytes[start + i] !== text.charCodeAt(i)) return false;
	return true;
}
function magicOk(type, bytes) {
	if (type === "application/pdf") return ascii(bytes, 0, "%PDF");
	if (type === "image/jpeg") return startsWith(bytes, [
		255,
		216,
		255
	]);
	if (type === "image/png") return startsWith(bytes, [
		137,
		80,
		78,
		71
	]);
	if (type === "image/gif") return ascii(bytes, 0, "GIF87a") || ascii(bytes, 0, "GIF89a");
	if (type === "image/webp") return ascii(bytes, 0, "RIFF") && ascii(bytes, 8, "WEBP");
	return false;
}
/** A backup may only restore a real photo or PDF. HTML with a fake type is refused. */
function backupBlob(data, mime) {
	const type = mime.toLowerCase().split(";")[0].trim();
	if (!SAFE_TYPES.has(type)) return null;
	let binary;
	try {
		binary = atob(data);
	} catch {
		return null;
	}
	if (!binary.length || binary.length > MAX_PDF) return null;
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	if (!magicOk(type, bytes)) return null;
	return new Blob([bytes], { type });
}
async function trustedBlob(blob, mime) {
	const type = mime.toLowerCase().split(";")[0].trim();
	if (!SAFE_TYPES.has(type) || blob.size > MAX_PDF) return null;
	if (!magicOk(type, new Uint8Array(await blob.slice(0, 16).arrayBuffer()))) return null;
	return blob.type === type ? blob : new Blob([await blob.arrayBuffer()], { type });
}
var BACKUP_APP = "RivetCare";
function backupVersion(value) {
	if (value === void 0) return "ok";
	if (typeof value !== "number" || !Number.isInteger(value) || value < 1) return "bad";
	if (value > 1) return "future";
	return "ok";
}
function backupAppOk(value) {
	if (value == null || value === "") return true;
	if (typeof value !== "string") return false;
	const name = value.trim().toLowerCase();
	return name === "RivetCare".toLowerCase() || name === "SilverBullet".toLowerCase();
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
/** Calendar date for the screen. Same year drops the year: Oct 27. */
function formatWhen(iso) {
	const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
	if (!match) return iso;
	const year = Number(match[1]);
	const month = MONTHS[Number(match[2]) - 1];
	const day = Number(match[3]);
	if (!month || !day) return iso;
	return year === (/* @__PURE__ */ new Date()).getFullYear() ? `${month} ${day}` : `${month} ${day}, ${year}`;
}
/** The calendar date on this phone. UTC would roll over at 6 PM in Denver. */
function todayIso(now = /* @__PURE__ */ new Date()) {
	return stamp(now);
}
function stamp(date) {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}
/** True for a real YYYY-MM-DD. 2026-02-31 is not one. */
function realDay(iso) {
	return /^\d{4}-\d{2}-\d{2}$/.test(iso) && atNoon(iso) !== null;
}
/** A real day, or the last real day of that month. Null when the text is not a date. */
function repairDay(iso) {
	if (realDay(iso)) return iso;
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
	if (!match) return null;
	const year = Number(match[1]);
	const month = Number(match[2]);
	if (year < 1960 || year > 2100 || month < 1 || month > 12) return null;
	const last = new Date(year, month, 0).getDate();
	const day = Math.min(Number(match[3]), last);
	if (day < 1) return null;
	const next = `${match[1]}-${match[2]}-${String(day).padStart(2, "0")}`;
	return realDay(next) ? next : null;
}
function atNoon(iso) {
	const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
	if (!match) return null;
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const date = new Date(year, month - 1, day, 12, 0, 0, 0);
	if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
	return date;
}
/** Calendar days from `fromIso` to `toIso`. Negative when `toIso` is earlier. */
function daysBetween(fromIso, toIso) {
	const from = atNoon(fromIso);
	const to = atNoon(toIso);
	if (!from || !to) return null;
	return Math.round((to.getTime() - from.getTime()) / 864e5);
}
function shiftIso(iso, days) {
	const date = atNoon(iso);
	if (!date || !Number.isFinite(days)) return null;
	date.setDate(date.getDate() + days);
	return stamp(date);
}
/** Same month and day, N years later. Feb 29 lands on Mar 1 in a non-leap year. */
function shiftYears(iso, years) {
	const date = atNoon(iso);
	if (!date || !Number.isInteger(years)) return null;
	date.setFullYear(date.getFullYear() + years);
	return stamp(date);
}
var WHEELS = [
	{
		id: "lf",
		label: "Road front"
	},
	{
		id: "lr",
		label: "Road rear"
	},
	{
		id: "rf",
		label: "Curb front"
	},
	{
		id: "rr",
		label: "Curb rear"
	},
	{
		id: "spare",
		label: "Spare"
	}
];
var emptyWheel = () => ({
	dot: "",
	on: "",
	tread: "",
	side: ""
});
var emptyTires = {
	psi: "",
	endLb: "",
	dot: "",
	on: "",
	rotated: "",
	wheels: {},
	checks: [],
	photos: {
		placard: null,
		side: {}
	}
};
var CHECKS_MAX = 12;
var TREAD_REPLACE = 2;
function yearsSince$1(then, now = Date.now()) {
	return (now - then.getTime()) / 315576e5;
}
function isoFrom(date) {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}
function pastDay(value) {
	if (typeof value !== "string" || !realDay(value) || value > todayIso()) return "";
	return value;
}
function asEnd(value) {
	if (typeof value !== "string" && typeof value !== "number") return "";
	const digits = String(value).replace(/[^\d]/g, "").slice(0, 5);
	if (!digits) return "";
	const n = Number(digits);
	if (!Number.isFinite(n) || n <= 0 || n > 2e4) return "";
	return String(n);
}
function asPsi(value) {
	if (typeof value !== "string") return "";
	const digits = value.replace(/[^\d]/g, "").slice(0, 3);
	if (!digits) return "";
	return String(Number(digits));
}
function asDot(value) {
	return typeof value === "string" ? value.replace(/[^\d]/g, "").slice(0, 4) : "";
}
function asTread(value) {
	if (value === "ok" || value === "replace") return value;
	if (typeof value !== "string") return "";
	const digits = value.replace(/[^\d]/g, "").slice(0, 2);
	if (!digits) return "";
	const n = Number(digits);
	if (n > 32) return "";
	return String(n);
}
function asSide(value) {
	return value === "ok" || value === "replace" ? value : "";
}
function wheelId(value) {
	return WHEELS.some((wheel) => wheel.id === value) ? value : null;
}
function photoIdOk(id) {
	return id !== "__proto__" && id !== "constructor" && id !== "prototype" && /^[A-Za-z0-9._-]{1,80}$/.test(id);
}
function asPhoto(value) {
	if (!value || typeof value !== "object") return null;
	const row = value;
	if (typeof row.id !== "string" || !photoIdOk(row.id)) return null;
	const mime = typeof row.mime === "string" ? row.mime.toLowerCase().split(";")[0].trim() : "";
	if (mime !== "image/jpeg" && mime !== "image/png" && mime !== "image/gif" && mime !== "image/webp") return null;
	const name = typeof row.name === "string" ? row.name.replace(/[\r\n]/g, "").slice(0, 80) : "photo.jpg";
	return {
		id: row.id,
		name: name || "photo.jpg",
		mime
	};
}
function asWheel(value) {
	if (!value || typeof value !== "object") return null;
	const row = value;
	const wheel = {
		dot: asDot(row.dot),
		on: pastDay(row.on),
		tread: asTread(row.tread),
		side: asSide(row.side)
	};
	if (!wheel.dot && !wheel.on && !wheel.tread && !wheel.side) return null;
	return wheel;
}
function asWheels(value) {
	const wheels = {};
	if (!value || typeof value !== "object") return wheels;
	for (const [key, row] of Object.entries(value)) {
		const id = wheelId(key);
		if (!id) continue;
		const wheel = asWheel(row);
		if (wheel) wheels[id] = wheel;
	}
	return wheels;
}
function asCheck(value) {
	if (!value || typeof value !== "object") return null;
	const row = value;
	const on = pastDay(row.on);
	if (!on) return null;
	const psi = {};
	if (row.psi && typeof row.psi === "object") for (const [key, reading] of Object.entries(row.psi)) {
		const id = wheelId(key);
		const clean = asPsi(reading);
		if (id && clean) psi[id] = clean;
	}
	const note = typeof row.note === "string" ? row.note.replace(/[\r\n]/g, " ").trim().slice(0, 80) : "";
	if (!note && Object.keys(psi).length === 0) return null;
	return {
		on,
		psi,
		note
	};
}
function asChecks(value) {
	if (!Array.isArray(value)) return [];
	const checks = [];
	const seen = /* @__PURE__ */ new Set();
	for (const item of value) {
		if (checks.length >= CHECKS_MAX) break;
		const check = asCheck(item);
		if (!check || seen.has(check.on)) continue;
		seen.add(check.on);
		checks.push(check);
	}
	return checks;
}
function asPhotos(value) {
	const photos = {
		placard: null,
		side: {}
	};
	if (!value || typeof value !== "object") return photos;
	const row = value;
	photos.placard = asPhoto(row.placard);
	if (row.side && typeof row.side === "object") for (const [key, photo] of Object.entries(row.side)) {
		const id = wheelId(key);
		const clean = asPhoto(photo);
		if (id && clean) photos.side[id] = clean;
	}
	return photos;
}
function asTires(value) {
	if (!value || typeof value !== "object") return emptyTires;
	const row = value;
	return {
		psi: asPsi(row.psi),
		endLb: asEnd(row.endLb),
		dot: asDot(row.dot),
		on: pastDay(row.on),
		rotated: pastDay(row.rotated),
		wheels: asWheels(row.wheels),
		checks: asChecks(row.checks),
		photos: asPhotos(row.photos)
	};
}
/** Last four digits of a DOT code are week and year, as in 2323. */
function dotDate(dot) {
	if (dot.length !== 4) return null;
	const week = Number(dot.slice(0, 2));
	const year = 2e3 + Number(dot.slice(2));
	if (week < 1 || week > 53) return null;
	const nowY = (/* @__PURE__ */ new Date()).getFullYear();
	if (year < 2e3 || year > nowY + 1) return null;
	return new Date(year, 0, 1 + (week - 1) * 7);
}
function tireAges(tires, now = Date.now()) {
	const made = dotDate(tires.dot);
	let onYears = null;
	if (tires.on) {
		const mounted = /* @__PURE__ */ new Date(`${tires.on}T12:00:00`);
		if (!Number.isNaN(mounted.getTime())) onYears = yearsSince$1(mounted, now);
	}
	return {
		dotYears: made ? yearsSince$1(made, now) : null,
		onYears
	};
}
/** The oldest DOT on the coach. A single saved code is used until a wheel has its own. */
function oldestTire(tires, now = Date.now()) {
	let best = null;
	const consider = (id, label, dot) => {
		const made = dotDate(dot);
		const iso = made ? isoFrom(made) : null;
		if (!made || !iso) return;
		const years = yearsSince$1(made, now);
		if (years < 0) return;
		if (!best || years > best.years) best = {
			id,
			label,
			dot,
			iso,
			years
		};
	};
	for (const wheel of WHEELS) {
		const dot = tires.wheels[wheel.id]?.dot;
		if (dot) consider(wheel.id, wheel.label, dot);
	}
	if (best) return best;
	if (tires.dot) consider("set", "The set", tires.dot);
	return best;
}
function treadNeedsReplace(tread) {
	if (tread === "replace") return true;
	if (/^\d{1,2}$/.test(tread)) return Number(tread) <= TREAD_REPLACE;
	return false;
}
function sideNeedsReplace(side) {
	return side === "replace";
}
function wheelsToReplace(tires) {
	return WHEELS.filter((wheel) => {
		const row = tires.wheels[wheel.id];
		return !!row && (treadNeedsReplace(row.tread) || sideNeedsReplace(row.side));
	}).map((wheel) => wheel.label);
}
/** Home only speaks up at the existing thresholds: 5 years on a named wheel, 6 on the old single code. */
function homeTireLine(tires, now = Date.now()) {
	const parts = [];
	const marks = wheelsToReplace(tires);
	if (marks.length === 1) parts.push(`${marks[0]} is at the replace line`);
	else if (marks.length > 1) parts.push(`${marks.join(", ")} are at the replace line`);
	const oldest = oldestTire(tires, now);
	if (oldest && oldest.id !== "set" && oldest.years >= 5) parts.push(`Oldest tire: ${oldest.label}, about ${Math.floor(oldest.years)} years (DOT ${oldest.dot})`);
	else if (!oldest || oldest.id === "set") {
		const ages = tireAges(tires, now);
		if (ages.dotYears != null && ages.dotYears >= 6) parts.push(`Tires about ${Math.floor(ages.dotYears)} years from the DOT date`);
		else if (ages.onYears != null && ages.onYears >= 6) parts.push(`Tires mounted about ${Math.floor(ages.onYears)} years ago`);
	}
	return parts.length ? parts.join(". ") : null;
}
/** Readings more than 20% under the placard number. The procedure already says that tire comes off. */
function lowWheels(placard, check) {
	const target = Number(placard);
	if (!Number.isInteger(target) || target <= 0) return [];
	const limit = target * .8;
	return WHEELS.filter((wheel) => {
		const reading = check.psi[wheel.id];
		if (!reading) return false;
		const got = Number(reading);
		return got > 0 && got < limit;
	}).map((wheel) => wheel.id);
}
function withCheck(tires, check) {
	const [row] = asChecks([check]);
	if (!row) return null;
	return asChecks([row, ...tires.checks.filter((item) => item.on !== row.on)]);
}
function withoutCheck(tires, on) {
	return tires.checks.filter((item) => item.on !== on);
}
function tirePhotoIds(tires) {
	const row = asTires(tires);
	const ids = [];
	if (row.photos.placard) ids.push(row.photos.placard.id);
	for (const photo of Object.values(row.photos.side)) if (photo) ids.push(photo.id);
	return ids;
}
function rotateEvery() {
	const task = tasks.find((item) => item.id === "rotate");
	return task?.cadence.type === "miles" ? task.cadence.every : 1e4;
}
/**
* The replace job follows the oldest DOT. A rotation date moves the 6-month side
* without hiding a 10,000-mile job that was never marked.
*/
function jobMark(taskId, mark, tires, odo = 0) {
	if (taskId === "tires-replace") {
		const oldest = oldestTire(tires);
		if (!oldest) return mark;
		return {
			iso: oldest.iso,
			miles: 0,
			...mark?.note ? { note: mark.note } : {}
		};
	}
	if (taskId === "rotate" && tires.rotated) {
		if (!mark) return odo >= rotateEvery() ? mark : {
			iso: tires.rotated,
			miles: 0
		};
		if (tires.rotated > mark.iso) return {
			...mark,
			iso: tires.rotated
		};
	}
	return mark;
}
/** The one schedule job whose title or id is this text. Two matches means no link. */
function taskFromJob(job) {
	const text = job.trim().toLowerCase();
	if (!text) return null;
	const byId = tasks.find((task) => task.id.toLowerCase() === text);
	if (byId) return byId;
	const hits = tasks.filter((task) => task.title.trim().toLowerCase() === text);
	return hits.length === 1 ? hits[0] : null;
}
/** The mark a service record should write. Null when the date is ahead, or the schedule is already later. */
function markFromService(current, iso, miles, today) {
	if (iso > today) return null;
	if (!current) return {
		iso,
		miles
	};
	if (iso > current.iso || iso === current.iso && miles > current.miles) return {
		iso,
		miles,
		...current.note ? { note: current.note } : {}
	};
	return null;
}
function latestService(entries) {
	let best = null;
	for (const entry of entries) if (!best || entry.iso > best.iso || entry.iso === best.iso && entry.miles > best.miles) best = entry;
	return best;
}
/**
* After editing the service that owned the schedule mark, follow the latest linked service.
* Undefined when this edit did not own the mark, so a hand-set date stays.
* Null when no linked service remains.
*/
function markAfterOwnedEdit(mark, owned, linked) {
	if (!mark || mark.iso !== owned.iso || mark.miles !== owned.miles) return void 0;
	const latest = latestService(linked);
	if (!latest) return null;
	return {
		iso: latest.iso,
		miles: latest.miles,
		...mark.note ? { note: mark.note } : {}
	};
}
function accelConvention(input) {
	const agent = input.userAgent ?? "";
	const platform = input.platform ?? "";
	const points = input.maxTouchPoints ?? 0;
	if (/iPhone|iPad|iPod/i.test(agent) || platform === "MacIntel" && points > 1) return "inverted";
	return "w3c";
}
/** iOS reports the opposite sign from the W3C device frame. Flip all three, or refuse. */
function correctAccel(x, y, z, convention) {
	if (convention === "inverted") return {
		x: -x,
		y: -y,
		z: -z
	};
	return {
		x,
		y,
		z
	};
}
function clamp(n, lo, hi) {
	return Math.min(hi, Math.max(lo, n));
}
/** Pitch is positive when the top of the phone is high. Roll is positive when the right side is down. */
function tiltFromAccel(x, y, z) {
	if (![
		x,
		y,
		z
	].every((n) => Number.isFinite(n))) return null;
	const mag = Math.hypot(x, y, z);
	if (mag < 1) return null;
	return {
		pitchDeg: Math.asin(clamp(y / mag, -1, 1)) * 180 / Math.PI,
		rollDeg: Math.atan2(-x, z) * 180 / Math.PI,
		flatDeg: Math.acos(clamp(z / mag, -1, 1)) * 180 / Math.PI,
		mag,
		z
	};
}
function inchesFromDeg(spanIn, deg) {
	return spanIn * Math.tan(deg * Math.PI / 180);
}
/** Same flat angle the motion sensor uses, from the two typed axes. */
function flatFromAxes(pitchDeg, rollDeg) {
	const pitch = pitchDeg * Math.PI / 180;
	const roll = rollDeg * Math.PI / 180;
	const zOverMag = Math.cos(pitch) * Math.cos(roll);
	return Math.acos(clamp(zOverMag, -1, 1)) * 180 / Math.PI;
}
/** A typed Level reading. An empty direction is not level. */
function typedFloorTilt(input) {
	const sideBlank = input.side !== "level" && input.sideDeg.trim() === "";
	const endBlank = input.end !== "level" && input.endDeg.trim() === "";
	if (sideBlank || endBlank) return {
		ok: false,
		message: "Enter the degrees, or set that direction to Level."
	};
	const sideN = input.side === "level" ? 0 : Number(input.sideDeg);
	const endN = input.end === "level" ? 0 : Number(input.endDeg);
	if (!Number.isFinite(sideN) || !Number.isFinite(endN) || sideN < 0 || endN < 0 || sideN > 15 || endN > 15) return {
		ok: false,
		message: "This tool stops at 15 degrees. Reposition, or type a smaller reading."
	};
	const rollDeg = input.side === "roadside" ? -sideN : sideN;
	const pitchDeg = input.end === "tongue" ? -endN : endN;
	const flatDeg = flatFromAxes(pitchDeg, rollDeg);
	if (flatDeg > 15) return {
		ok: false,
		message: "Together those readings are steeper than 15 degrees. This tool stops there."
	};
	return {
		ok: true,
		tilt: {
			pitchDeg,
			rollDeg,
			flatDeg,
			mag: 9.8,
			z: 9.8
		}
	};
}
function quarterIn(inches) {
	return Math.round(inches * 4) / 4;
}
/** Nearest 1/4 in, as an owner would say it. 1.5 → "1-1/2". */
function formatInches(inches) {
	const q = quarterIn(Math.abs(inches));
	const whole = Math.floor(q + 1e-9);
	const frac = Math.round((q - whole) * 4);
	const part = frac === 4 ? "" : [
		"",
		"1/4",
		"1/2",
		"3/4"
	][frac] ?? "";
	const base = frac === 4 ? whole + 1 : whole;
	if (base === 0) return part || "0";
	if (!part) return String(base);
	return `${base}-${part}`;
}
/** Empty is unset. One decimal, 20 through 400. Anything else is not a span. */
function parseSpan(value) {
	const text = value.trim();
	if (!text) return null;
	if (!/^\d{1,3}(\.\d)?$/.test(text)) return null;
	const n = Number(text);
	if (n < 20 || n > 400) return null;
	return n;
}
/** A case offset is a small tilt. Anything steeper is not a zero. */
function phoneZero(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const raw = value;
	if (typeof raw.pitchDeg !== "number" || typeof raw.rollDeg !== "number") return null;
	if (!Number.isFinite(raw.pitchDeg) || !Number.isFinite(raw.rollDeg)) return null;
	if (Math.abs(raw.pitchDeg) > 15 || Math.abs(raw.rollDeg) > 15) return null;
	return {
		pitchDeg: raw.pitchDeg,
		rollDeg: raw.rollDeg
	};
}
/** Take the case and camera out of a later reading. The phone's real flatness stays. */
function applyZero(tilt, zero) {
	if (!zero) return tilt;
	return {
		...tilt,
		pitchDeg: tilt.pitchDeg - zero.pitchDeg,
		rollDeg: tilt.rollDeg - zero.rollDeg
	};
}
/** The attitude to store, or null when this is not a floor reading. */
function zeroFromTilt(tilt) {
	if (tilt.z <= 0 || tilt.flatDeg > 15) return null;
	return phoneZero({
		pitchDeg: tilt.pitchDeg,
		rollDeg: tilt.rollDeg
	});
}
function safeId(key) {
	return key !== "__proto__" && key !== "constructor" && key !== "prototype" && /^[a-z0-9-]{1,32}$/i.test(key);
}
function spanField(value) {
	if (typeof value === "number" && Number.isFinite(value)) return parseSpan(String(Math.round(value * 10) / 10));
	if (typeof value === "string") return parseSpan(value);
	return null;
}
/** Drop bad rows. A coach with neither span is left out. */
function levelRows(value) {
	const out = {};
	if (!value || typeof value !== "object" || Array.isArray(value)) return out;
	for (const [key, row] of Object.entries(value)) {
		if (!safeId(key) || !row || typeof row !== "object" || Array.isArray(row)) continue;
		const raw = row;
		const track = spanField(raw.track);
		const jack = spanField(raw.jack);
		if (track == null && jack == null) continue;
		out[key] = {
			track,
			jack
		};
	}
	return out;
}
/** Incoming coaches replace the same id. Coaches this file does not mention stay. */
function mergeLevelFile(current, incoming) {
	return {
		...levelRows(current),
		...levelRows(incoming)
	};
}
function sideAxis(rollDeg, track) {
	const low = rollDeg > 0;
	const end = low ? "Curbside" : "Roadside";
	const tires = low ? "curbside" : "roadside";
	if (track == null) {
		if (Math.abs(rollDeg) < .2) return {
			title: "Side to side",
			state: "level",
			figure: "0",
			action: "Under 1/8 in."
		};
		return {
			title: "Side to side",
			state: "ask",
			figure: "—",
			action: `${end} is low. Enter the track to see how far.`
		};
	}
	const rise = Math.abs(inchesFromDeg(track, rollDeg));
	if (rise < .125) return {
		title: "Side to side",
		state: "level",
		figure: "0",
		action: "Under 1/8 in."
	};
	if (rise > 8) return {
		title: "Side to side",
		state: "stop",
		figure: "—",
		action: `${end} is low by more than 8 in. Reposition the trailer. This app stops at 8 in of board. That is not a factory limit.`
	};
	return {
		title: "Side to side",
		state: "adjust",
		figure: formatInches(rise),
		action: `${end} is low. About ${formatInches(rise)} in of board under the ${tires} tires.`
	};
}
function lengthAxis(pitchDeg, jack) {
	const tongueLow = pitchDeg < 0;
	if (jack == null) {
		if (Math.abs(pitchDeg) < .2) return {
			title: "Front to rear",
			state: "level",
			figure: "0",
			action: "Under 1/8 in."
		};
		return {
			title: "Front to rear",
			state: "ask",
			figure: "—",
			action: tongueLow ? "Tongue is low. Enter the jack span to see how far." : "Front is high. Enter the jack span to see how far."
		};
	}
	const rise = Math.abs(inchesFromDeg(jack, pitchDeg));
	if (rise < .125) return {
		title: "Front to rear",
		state: "level",
		figure: "0",
		action: "Under 1/8 in."
	};
	if (rise > 24) return {
		title: "Front to rear",
		state: "stop",
		figure: "—",
		action: tongueLow ? `Tongue is low by more than 24 in. Reposition the trailer. This app stops at 24 in of jack travel. That is not a factory limit.` : `Front is high by more than 24 in. Reposition the trailer. This app stops at 24 in of jack travel. That is not a factory limit.`
	};
	return {
		title: "Front to rear",
		state: "adjust",
		figure: formatInches(rise),
		action: tongueLow ? `Tongue is low. Raise the jack about ${formatInches(rise)} in.` : `Front is high. Lower the jack about ${formatInches(rise)} in.`
	};
}
/** Side to side first, then the jack. No number when the phone is not a floor reading. */
function floorRead(tilt, spans, steady) {
	if (!steady || tilt.mag < 8 || tilt.mag > 11.5) return {
		lines: ["Hold still."],
		estimate: false
	};
	if (tilt.z <= 0) return {
		lines: ["Turn the phone screen up. If it already is, this phone's motion reads the other way, and Trailer level will not guess."],
		estimate: false
	};
	if (tilt.flatDeg > 15) return {
		lines: ["Hold the phone flat on the floor."],
		estimate: false
	};
	const axes = [sideAxis(tilt.rollDeg, spans.track), lengthAxis(tilt.pitchDeg, spans.jack)];
	const lines = axes.filter((axis) => axis.state !== "level").map((axis) => axis.action);
	if (!lines.length) return {
		lines: ["Close enough."],
		estimate: false,
		axes
	};
	return {
		lines,
		estimate: lines.some((line) => line.includes("About") || line.includes("about")),
		axes
	};
}
var LEVEL_KEY = "rivetcare-level";
var ZERO_KEY = "rivetcare-level-zero";
var MAX_LEVEL = 2e4;
function readLevelFile() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(LEVEL_KEY);
		if (!raw || raw.length > MAX_LEVEL) return null;
		const rows = levelRows(JSON.parse(raw));
		return Object.keys(rows).length ? rows : null;
	} catch {
		return null;
	}
}
function writeLevelFile(value) {
	if (typeof window === "undefined") return true;
	try {
		const rows = levelRows(value);
		if (!Object.keys(rows).length) {
			localStorage.removeItem(LEVEL_KEY);
			return true;
		}
		const text = JSON.stringify(rows);
		if (text.length > MAX_LEVEL) return false;
		localStorage.setItem(LEVEL_KEY, text);
		return true;
	} catch {
		return false;
	}
}
function restoreLevelFile(value) {
	if (typeof window === "undefined") return;
	if (!value || !Object.keys(value).length) localStorage.removeItem(LEVEL_KEY);
	else writeLevelFile(value);
}
function backupLevel(value) {
	const rows = levelRows(value);
	if (!Object.keys(rows).length) return null;
	return rows;
}
function readSpans(modelId) {
	const row = readLevelFile()?.[modelId];
	return {
		track: row?.track ?? null,
		jack: row?.jack ?? null
	};
}
function writeSpans(modelId, spans) {
	if (modelId === "__proto__" || modelId === "constructor" || modelId === "prototype" || !/^[a-z0-9-]{1,32}$/i.test(modelId)) return false;
	const next = { ...readLevelFile() ?? {} };
	if (spans.track == null && spans.jack == null) delete next[modelId];
	else next[modelId] = {
		track: spans.track,
		jack: spans.jack
	};
	return writeLevelFile(next);
}
function readZero() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(ZERO_KEY);
		if (!raw || raw.length > 200) return null;
		return phoneZero(JSON.parse(raw));
	} catch {
		return null;
	}
}
function writeZero(zero) {
	if (typeof window === "undefined") return;
	try {
		const clean = zero ? phoneZero(zero) : null;
		if (!clean) localStorage.removeItem(ZERO_KEY);
		else localStorage.setItem(ZERO_KEY, JSON.stringify(clean));
	} catch {}
}
var emptySupplies = {
	propane: "",
	battery: ""
};
function asDate(value) {
	return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}
function asSupplies(value) {
	if (!value || typeof value !== "object") return emptySupplies;
	const row = value;
	return {
		propane: asDate(row.propane),
		battery: asDate(row.battery)
	};
}
function yearsSince(iso) {
	if (!iso) return null;
	const then = (/* @__PURE__ */ new Date(`${iso}T12:00:00`)).getTime();
	if (Number.isNaN(then)) return null;
	return (Date.now() - then) / 315576e5;
}
function supplyAges(record) {
	return {
		propaneYears: yearsSince(record.propane),
		batteryYears: yearsSince(record.battery)
	};
}
var PLATE_FIELDS = [
	{
		key: "water",
		label: "Water heater",
		placeholder: "Read the plate"
	},
	{
		key: "fridge",
		label: "Fridge",
		placeholder: "Read the plate"
	},
	{
		key: "furnace",
		label: "Furnace",
		placeholder: "Read the plate"
	},
	{
		key: "ac",
		label: "Air conditioner",
		placeholder: "Read the plate"
	},
	{
		key: "axle",
		label: "Axle",
		placeholder: "Dexter Torflex"
	}
];
var emptyPlates = {
	water: "",
	fridge: "",
	furnace: "",
	ac: "",
	axle: ""
};
var FLOW_PLATE = {
	hot: "water",
	"fridge-flow": "fridge",
	"furnace-flow": "furnace",
	"alde-heat": "furnace",
	"ac-flow": "ac",
	"brake-flow": "axle",
	"tires-flow": "axle"
};
function cleanPlate(value) {
	if (typeof value !== "string") return "";
	let text = "";
	for (const ch of value) {
		const code = ch.codePointAt(0) ?? 0;
		text += code >= 32 ? ch : " ";
	}
	return text.replace(/\s+/g, " ").trim().slice(0, 80);
}
function asPlates(value) {
	const row = value && typeof value === "object" ? value : {};
	return {
		water: cleanPlate(row.water),
		fridge: cleanPlate(row.fridge),
		furnace: cleanPlate(row.furnace),
		ac: cleanPlate(row.ac),
		axle: cleanPlate(row.axle)
	};
}
function plateKeyForFlow(flowId) {
	return FLOW_PLATE[flowId] ?? null;
}
function plateLabel(key) {
	return PLATE_FIELDS.find((field) => field.key === key)?.label ?? key;
}
/** 2027 floor card. Do not name a heater the manual for that floor does not name. */
function waterHeaterSpec(model) {
	if (model.alde) return "Alde glycol boiler. Not a Suburban tank and not a tankless. The 2027 model number was not opened, so this card does not say 3030. Read the boiler plate.";
	if (model.id === "bcxe" || model.family === "World Traveler") return "Truma Combi. It is the furnace and the water heater. No anode. Do not blow air through it.";
	if (model.id === "bc16") return "Read the plate. Through 2022 the books name a Truma Combi. A 2026 book names a Suburban IW60. Do not mix those codes.";
	if (model.id === "cv19") return "Not in the 2027 spec set. Read the plate.";
	if (model.family === "Globetrotter") return "2027 brochure: recirculating tankless, maker not named. Do not write Suburban ST-65 unless the plate says it.";
	if (model.family === "Trade Wind" || model.family === "Bambi" || model.family === "Caravel" || model.family === "Frank Lloyd Wright" || model.family === "Stetson") return "Tankless on this 2027 floor. The maker is not named. No anode. Read the plate.";
	return "The 2027 maker is not named. Read the plate. Do not assume a Suburban ST-65.";
}
function platePlaceholder(model, key) {
	if (key === "water") {
		if (model.alde) return "Alde, read the boiler plate";
		if (model.id === "bcxe" || model.family === "World Traveler") return "Truma Combi";
		if (model.family === "Globetrotter" || model.family === "Trade Wind") return "Tankless, read the plate";
		return "Read the plate";
	}
	if (key === "furnace") {
		if (model.alde) return "Alde";
		if (model.id === "bcxe" || model.family === "World Traveler") return "Truma Combi";
		return "Read the plate";
	}
	return PLATE_FIELDS.find((field) => field.key === key)?.placeholder ?? "";
}
/** What to show on a matching flowchart. Empty when that plate has not been typed. */
function plateOnFlow(flowId, plates) {
	const key = plateKeyForFlow(flowId);
	if (!key) return null;
	const value = plates[key];
	if (!value) return null;
	const saysAlde = /alde/i.test(value);
	let warn = "";
	if (flowId === "alde-heat" && !saysAlde) warn = "This chart is the Alde. That plate does not say Alde. Stop if this is not the heater on the coach.";
	else if (flowId === "furnace-flow" && saysAlde) warn = "This chart is the ducted furnace. That plate says Alde. Stop if this coach has an Alde.";
	return {
		line: `Plate on this coach: ${plateLabel(key)}, ${value}.`,
		warn
	};
}
function pathSteps(flow, trail) {
	const steps = [];
	let id = flow.start;
	for (const answer of trail) {
		const node = flow.nodes[id];
		if (!node || node.type !== "ask" || !node.q || !node.yes || !node.no) break;
		steps.push({
			q: node.q,
			answer
		});
		id = answer === "Yes" ? node.yes : node.no;
	}
	return steps;
}
function serviceTotal(partsCost, laborCost) {
	const read = (value) => {
		if (!value) return null;
		const cleaned = value.replace(/[$,\s]/g, "");
		if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
		const n = Number(cleaned);
		return Number.isFinite(n) ? n : null;
	};
	const parts = read(partsCost);
	const labor = read(laborCost);
	if (parts == null && labor == null) return "";
	const cents = Math.round(((parts ?? 0) + (labor ?? 0)) * 100);
	const text = (cents / 100).toFixed(2);
	const trimmed = text.endsWith(".00") ? String(cents / 100) : text.replace(/0$/, "").replace(/\.$/, "");
	return `${partsCost ?? ""} ${laborCost ?? ""}`.includes("$") ? `$${trimmed}` : trimmed;
}
var KEY = "rivetcare-v1";
var BROKEN_KEY = "rivetcare-v1-unreadable";
var RAW_KEY = "rivetcare-v1-before-trim";
var UNREADABLE_TOAST = "The saved copy on this phone could not be read. It was kept. This change was not saved.";
var NEWER_TOAST = "This phone has a newer copy of the book. This version will not change it.";
var STALE_TOAST = "Another tab saved first. This change was not saved.";
var saveBlocked = false;
var saveProblem = "";
var seenRev = 0;
var listening = false;
var roots = /* @__PURE__ */ new Set([
	"home",
	"fix",
	"care",
	"parts",
	"more",
	"log",
	"records"
]);
function resumeWinter(place) {
	if (!place) return {};
	const frame = place.page === "flow" ? {
		screen: {
			name: "flow",
			id: "winter"
		},
		tab: "fix"
	} : place.page === "procedure" ? {
		screen: {
			name: "procedure",
			id: "winterize"
		},
		tab: "care"
	} : {
		screen: {
			name: "checklist",
			id: "winter"
		},
		tab: "care"
	};
	return {
		trail: [{
			screen: { name: "home" },
			tab: "home"
		}, frame],
		cursor: 1,
		activeTab: frame.tab
	};
}
function keepBroken(raw) {
	try {
		localStorage.setItem(BROKEN_KEY, raw);
	} catch {}
}
function load() {
	if (typeof window === "undefined") return {
		data: {},
		block: false,
		kept: ""
	};
	let raw = null;
	try {
		raw = localStorage.getItem(KEY);
	} catch {
		return {
			data: {},
			block: false,
			kept: ""
		};
	}
	if (!raw) return {
		data: {},
		block: false,
		kept: ""
	};
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		keepBroken(raw);
		saveBlocked = "unreadable";
		return {
			data: {},
			block: "unreadable",
			kept: raw
		};
	}
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
		keepBroken(raw);
		saveBlocked = "unreadable";
		return {
			data: {},
			block: "unreadable",
			kept: raw
		};
	}
	const row = parsed;
	if (typeof row.schema === "number" && row.schema > 1) {
		saveBlocked = "newer";
		return {
			data: {},
			block: "newer",
			kept: ""
		};
	}
	seenRev = typeof row.rev === "number" && Number.isFinite(row.rev) && row.rev >= 0 ? row.rev : 0;
	saveBlocked = false;
	return {
		data: row,
		block: false,
		kept: ""
	};
}
var saveInside = false;
function save(p, quiet = false) {
	const locks = typeof document !== "undefined" && typeof navigator !== "undefined" ? navigator.locks : void 0;
	if (locks && !saveInside) return locks.request("rivetcare-v1", () => {
		saveInside = true;
		try {
			return saveNow(p, quiet);
		} finally {
			saveInside = false;
		}
	});
	return saveNow(p, quiet);
}
var dropped = false;
function saveNow(p, quiet = false) {
	if (typeof window === "undefined") return true;
	if (dropped) {
		saveProblem = "stale";
		return false;
	}
	saveProblem = "";
	if (saveBlocked === "newer") {
		saveProblem = "newer";
		return false;
	}
	let currentRev = 0;
	try {
		const raw = localStorage.getItem(KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
				const row = parsed;
				if (typeof row.schema === "number" && row.schema > 1) {
					saveBlocked = "newer";
					saveProblem = "newer";
					return false;
				}
				if (typeof row.rev === "number" && Number.isFinite(row.rev) && row.rev >= 0) currentRev = row.rev;
			}
		} else if (seenRev > 0) {
			dropped = true;
			saveProblem = "stale";
			window.location.reload();
			return false;
		}
	} catch {}
	if (currentRev > seenRev) {
		saveProblem = "stale";
		adoptExternalSave("quiet");
		return false;
	}
	const nextRev = currentRev + 1;
	try {
		localStorage.setItem(KEY, JSON.stringify({
			...p,
			schema: 1,
			rev: nextRev
		}));
		seenRev = nextRev;
		if (saveBlocked === "unreadable") saveBlocked = false;
		if (clearKeptRaw) {
			clearKeptRaw = false;
			try {
				localStorage.removeItem(RAW_KEY);
			} catch {}
		}
		return true;
	} catch {
		saveProblem = "full";
		if (!quiet) try {
			useApp.getState().flash("This phone is full. That change was not saved.");
		} catch {}
		return false;
	}
}
var clearKeptRaw = false;
var commitTail = Promise.resolve();
/** Run a save after any save already waiting. In Node each save runs immediately. */
function enqueue(job) {
	if (!(typeof document !== "undefined" && typeof navigator !== "undefined" && navigator.locks)) return job();
	const run = commitTail.then(() => Promise.resolve(job()));
	commitTail = run.then(() => void 0, () => void 0);
	return run;
}
/** Write the change first. The screen updates only when the phone accepts it. */
function commit(source) {
	if (saveBlocked === "unreadable") {
		useApp.setState({ toast: UNREADABLE_TOAST });
		return false;
	}
	if (saveBlocked === "newer") {
		useApp.setState({ toast: NEWER_TOAST });
		return false;
	}
	return enqueue(() => applyCommit(source));
}
function applyCommit(source) {
	const live = useApp.getState();
	const patch = typeof source === "function" ? source(live) : source;
	if (!patch) return false;
	if (!Object.keys(patch).length) return true;
	const wrote = save(persisted({
		...live,
		...patch
	}), true);
	const finish = (ok) => {
		if (!ok) {
			const toast = saveProblem === "newer" ? NEWER_TOAST : saveProblem === "stale" ? STALE_TOAST : "This phone is full. That change was not saved.";
			useApp.setState({ toast });
			if (saveProblem !== "stale") window.setTimeout(() => {
				if (useApp.getState().toast === toast) useApp.setState({ toast: "" });
			}, 1600);
			return false;
		}
		useApp.setState({
			...patch,
			keptRaw: ""
		});
		return true;
	};
	return wrote instanceof Promise ? wrote.then(finish) : finish(wrote);
}
/** Which bottom tab a screen belongs to. A push from Home must light this, not Home. */
function tabFor(screen) {
	switch (screen.name) {
		case "home": return "home";
		case "fix":
		case "symptom":
		case "codes":
		case "flow":
		case "flows":
		case "table": return "fix";
		case "care":
		case "procedure":
		case "procedures":
		case "tires":
		case "supplies": return "care";
		case "records":
		case "log":
		case "notes":
		case "history":
		case "backup":
		case "desk": return "records";
		default: return "more";
	}
}
var MAX_TRAIL = 40;
function safeKey(key) {
	return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
function ownCoach(map, id) {
	return safeKey(id) && /^[a-z0-9-]{1,32}$/i.test(id) && Object.prototype.hasOwnProperty.call(map, id);
}
var FILE_ID_MAX = 200;
var MILES_MAX = 1e6;
var LOG_MAX = 200;
function pushLog(prev, entries) {
	const all = [...entries, ...prev];
	return {
		log: all.slice(0, LOG_MAX),
		dropped: all.slice(LOG_MAX)
	};
}
var NOTE_MAX = 100;
var trim = {
	files: 0,
	logs: 0,
	notes: 0,
	repaired: 0,
	today: 0,
	miles: 0,
	dup: 0
};
function beginRead() {
	trim = {
		files: 0,
		logs: 0,
		notes: 0,
		repaired: 0,
		today: 0,
		miles: 0,
		dup: 0
	};
}
function trimMessage() {
	const left = [];
	const fixed = [];
	if (trim.logs) left.push(trim.logs === 1 ? "1 log line past 200" : `${trim.logs} log lines past 200`);
	if (trim.notes) left.push(trim.notes === 1 ? "1 note past 100" : `${trim.notes} notes past 100`);
	if (trim.miles) left.push(trim.miles === 1 ? "a mileage out of range" : `${trim.miles} mileages out of range`);
	if (trim.files) left.push(trim.files === 1 ? "a photo id too long to match" : `${trim.files} photo ids too long to match`);
	if (trim.dup) left.push(trim.dup === 1 ? "1 repeated record id" : `${trim.dup} repeated record ids`);
	if (trim.repaired) fixed.push(trim.repaired === 1 ? "A date was corrected" : `${trim.repaired} dates were corrected`);
	if (trim.today) fixed.push(trim.today === 1 ? "A date was set to today" : `${trim.today} dates were set to today`);
	const parts = [];
	if (left.length) parts.push(`Left out ${left.join(", ")}`);
	parts.push(...fixed);
	if (!parts.length) return "";
	return `${parts.join(". ")}.`;
}
/** A missing date becomes today and is not announced. A bad day is repaired. Anything else becomes today. */
function settledIso(value) {
	const raw = typeof value === "string" ? value : "";
	if (!raw) return todayIso();
	if (realDay(raw)) return raw;
	const fixed = repairDay(raw);
	if (fixed) {
		trim.repaired += 1;
		return fixed;
	}
	trim.today += 1;
	return todayIso();
}
function readMiles(value) {
	const n = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : 0;
	if (!Number.isFinite(n)) return 0;
	const miles = Math.round(n);
	if (miles < 0) {
		trim.miles += 1;
		return 0;
	}
	if (miles > MILES_MAX) {
		trim.miles += 1;
		return MILES_MAX;
	}
	return miles;
}
function keepFileId(id) {
	if (typeof id !== "string" || !id || !safeKey(id)) return null;
	if (id.length > FILE_ID_MAX) {
		trim.files += 1;
		return null;
	}
	return id;
}
function asFiles(value) {
	if (!Array.isArray(value)) return void 0;
	const files = [];
	for (const item of value) {
		if (!item || typeof item !== "object") continue;
		const row = item;
		if (typeof row.id !== "string" || !safeKey(row.id) || typeof row.name !== "string" || typeof row.mime !== "string") continue;
		const id = keepFileId(row.id);
		if (!id) continue;
		const mime = row.mime.toLowerCase().split(";")[0].trim();
		if (mime !== "image/jpeg" && mime !== "image/png" && mime !== "image/gif" && mime !== "image/webp" && mime !== "application/pdf") continue;
		const role = row.role === "before" || row.role === "after" || row.role === "receipt" || row.role === "invoice" ? row.role : void 0;
		files.push({
			id,
			name: row.name.slice(0, 80),
			mime,
			...role ? { role } : {}
		});
		if (files.length === 6) break;
	}
	return files.length ? files : void 0;
}
function clipText(value, max) {
	if (typeof value !== "string") return void 0;
	return value.trim().slice(0, max) || void 0;
}
function readService(value) {
	const row = value && typeof value === "object" ? value : {};
	return {
		work: clipText(row.work, 200),
		provider: clipText(row.provider, 80),
		parts: clipText(row.parts, 200),
		partsCost: clipText(row.partsCost, 20),
		laborCost: clipText(row.laborCost, 20),
		cost: clipText(row.cost, 20),
		warranty: clipText(row.warranty, 200),
		tech: clipText(row.tech, 80),
		phone: clipText(row.phone, 40)
	};
}
function serviceText(detail) {
	if (!detail) return false;
	return Object.values(detail).some((value) => typeof value === "string" && value.trim());
}
function fileIds(entries) {
	return entries.flatMap((e) => e.files?.map((f) => f.id) ?? []);
}
var dropTail = Promise.resolve();
function trackDrop(job) {
	const settled = Promise.resolve(job).then(() => void 0, () => void 0);
	dropTail = dropTail.then(() => settled);
}
/** Resolves when photo deletes started by a restore have finished. */
function whenFilesDropped() {
	return dropTail;
}
function coachHoldsFile(coach, id) {
	if (coach.photoId === id) return true;
	if (shotIds(coach).includes(id)) return true;
	if (tirePhotoIds(coach.tires).includes(id)) return true;
	if ((coach.log ?? []).some((entry) => entry.files?.some((file) => file.id === id))) return true;
	return !!coach.logDraft?.files?.some((file) => file.id === id);
}
/** True when the open coach, or any other coach saved on this phone, still points at this photo. */
function fileStillUsed(id) {
	if (!id) return false;
	const state = useApp.getState();
	if (coachHoldsFile(state, id)) return true;
	for (const [coachId, coach] of Object.entries(state.coaches)) {
		if (coachId === state.modelId) continue;
		if (coachHoldsFile(coach, id)) return true;
	}
	return false;
}
function dropFiles(prev, next, alsoKeep = []) {
	const keep = new Set(fileIds(next));
	for (const id of alsoKeep) keep.add(id);
	const state = useApp.getState();
	for (const [id, coach] of Object.entries(state.coaches)) {
		if (id === state.modelId) continue;
		for (const fileId of fileIds(coach.log)) keep.add(fileId);
		if (coach.photoId) keep.add(coach.photoId);
		for (const fileId of shotIds(coach)) keep.add(fileId);
		for (const fileId of tirePhotoIds(coach.tires)) keep.add(fileId);
		for (const file of coach.logDraft?.files ?? []) keep.add(file.id);
	}
	if (state.photoId) keep.add(state.photoId);
	for (const fileId of shotIds(state)) keep.add(fileId);
	for (const fileId of tirePhotoIds(state.tires)) keep.add(fileId);
	for (const file of state.logDraft?.files ?? []) keep.add(file.id);
	const jobs = [];
	for (const id of fileIds(prev)) if (!keep.has(id)) jobs.push(deleteFile(id));
	trackDrop(Promise.all(jobs));
}
function emptyCoach() {
	return {
		odometer: 0,
		done: {},
		checks: {},
		log: [],
		notes: [],
		dealer: "",
		dealerAddress: "",
		vin: "",
		nickname: "",
		modelYear: null,
		wheelOff: null,
		lugAck: 0,
		tires: emptyTires,
		supplies: emptySupplies,
		plates: emptyPlates,
		listDone: {},
		logDraft: null,
		winterPlace: null,
		photoId: null,
		shots: {}
	};
}
function snapshot(s) {
	return {
		odometer: s.odometer,
		done: s.done,
		checks: s.checks,
		log: s.log,
		notes: s.notes,
		dealer: s.dealer,
		dealerAddress: s.dealerAddress,
		vin: s.vin,
		nickname: s.nickname,
		modelYear: s.modelYear,
		wheelOff: s.wheelOff,
		lugAck: s.lugAck,
		tires: s.tires,
		supplies: s.supplies,
		plates: s.plates,
		listDone: s.listDone,
		logDraft: s.logDraft,
		winterPlace: s.winterPlace,
		photoId: s.photoId,
		shots: s.shots
	};
}
/** A log line, miles, a mark, a note, a photo, or an unsaved note. Each one counts. */
function countCoachEdits(coach) {
	let n = 0;
	if ((coach.odometer ?? 0) > 0) n += 1;
	const log = coach.log ?? [];
	n += log.length;
	for (const entry of log) n += entry.files?.length ?? 0;
	n += Object.keys(coach.done ?? {}).length;
	n += coach.notes?.length ?? 0;
	if (coach.photoId) n += 1;
	for (const files of Object.values(coach.shots ?? {})) n += files?.length ?? 0;
	n += tirePhotoIds(coach.tires).length;
	const draft = coach.logDraft;
	if (draft && (draft.note?.trim() || (draft.files?.length ?? 0) > 0)) n += 1;
	return n;
}
/** A missing flag is an older save. Another coach, a year, or a VIN counts as a choice. */
function coachWasChosen(modelId, modelYear, vin, stored) {
	if (stored === true) return true;
	if (stored === false) return false;
	if (modelId !== "c28") return true;
	if (modelYear != null) return true;
	if (vin.trim()) return true;
	return false;
}
function recordEdits(s) {
	const coaches = {
		...s.coaches,
		[s.modelId]: {
			odometer: s.odometer,
			log: s.log,
			done: s.done,
			notes: s.notes,
			photoId: s.photoId,
			shots: s.shots,
			tires: s.tires,
			logDraft: s.logDraft
		}
	};
	return Object.values(coaches).reduce((n, coach) => n + countCoachEdits(coach), 0) + savedTicketCount();
}
function readCopyNudge(value) {
	if (!value || typeof value !== "object") return null;
	const row = value;
	if (typeof row.edits !== "number" || !Number.isInteger(row.edits) || row.edits < 0 || row.edits > 1e5) return null;
	if (typeof row.iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(row.iso)) return null;
	return {
		edits: row.edits,
		iso: row.iso
	};
}
function readDone(value) {
	const done = {};
	if (!value || typeof value !== "object") return done;
	for (const [id, mark] of Object.entries(value)) {
		if (!safeKey(id) || !mark || typeof mark !== "object" || typeof mark.iso !== "string" || typeof mark.miles !== "number") continue;
		const iso = mark.iso;
		const note = typeof mark.note === "string" ? mark.note.trim().slice(0, 200) : "";
		done[id] = {
			iso: settledIso(iso),
			miles: readMiles(mark.miles),
			...note ? { note } : {}
		};
	}
	return done;
}
function readChecks(value) {
	const checks = {};
	if (!value || typeof value !== "object") return checks;
	for (const [listId, items] of Object.entries(value)) {
		if (!safeKey(listId) || !items || typeof items !== "object" || Array.isArray(items)) continue;
		const row = {};
		for (const [itemId, on] of Object.entries(items)) {
			if (!safeKey(itemId)) continue;
			row[itemId] = !!on;
		}
		checks[listId] = row;
	}
	return checks;
}
function readWinterPlace(value) {
	if (!value || typeof value !== "object") return null;
	const row = value;
	const page = row.page === "flow" || row.page === "procedure" || row.page === "checklist" ? row.page : null;
	if (!page) return null;
	return {
		page,
		trail: Array.isArray(row.trail) ? row.trail.filter((answer) => answer === "Yes" || answer === "No").slice(0, 12) : []
	};
}
function readLogDraft(value) {
	if (!value || typeof value !== "object") return null;
	const row = value;
	const note = typeof row.note === "string" ? row.note.slice(0, 800) : "";
	const job = typeof row.job === "string" ? row.job.trim().slice(0, 80) : "";
	const files = asFiles(row.files) ?? [];
	if (!note.trim() && !job && files.length === 0) return null;
	return {
		note,
		job,
		files
	};
}
function readNotes(value) {
	if (!Array.isArray(value)) return [];
	const notes = [];
	for (const item of value) {
		if (!item || typeof item !== "object") continue;
		const row = item;
		const text = typeof row.text === "string" ? row.text.trim().slice(0, 2e3) : "";
		if (!text) continue;
		const iso = settledIso(row.iso);
		if (notes.length === NOTE_MAX) {
			trim.notes += 1;
			continue;
		}
		const id = typeof row.id === "string" && row.id && row.id.length <= FILE_ID_MAX ? row.id : crypto.randomUUID();
		if (notes.some((note) => note.id === id)) {
			trim.dup += 1;
			continue;
		}
		notes.push({
			id,
			iso,
			text
		});
	}
	return notes;
}
function readLog(value, fallback) {
	if (!Array.isArray(value)) return fallback;
	const rows = value.filter((e) => e && typeof e.iso === "string" && (typeof e.note === "string" || typeof e.job === "string"));
	if (rows.length > LOG_MAX) trim.logs += rows.length - LOG_MAX;
	const seen = /* @__PURE__ */ new Set();
	const log = [];
	for (const entry of rows.slice(0, LOG_MAX).map((e) => {
		const job = typeof e.job === "string" ? e.job.trim().slice(0, 80) : "";
		const taskId = typeof e.taskId === "string" ? e.taskId : "";
		return {
			id: String(e.id || crypto.randomUUID()),
			iso: settledIso(e.iso),
			miles: readMiles(e.miles),
			note: typeof e.note === "string" ? e.note : "",
			job: job || void 0,
			files: asFiles(e.files),
			taskId: /^[a-z0-9-]{1,40}$/i.test(taskId) ? taskId : void 0,
			...readService(e)
		};
	})) {
		if (seen.has(entry.id)) {
			trim.dup += 1;
			continue;
		}
		seen.add(entry.id);
		log.push(entry);
	}
	return log;
}
function readModelYear(value) {
	if (typeof value !== "number" || !Number.isInteger(value) || value < 1960 || value > 2039) return null;
	return value;
}
function readShots(value) {
	const shots = {};
	if (!value || typeof value !== "object") return shots;
	for (const [key, files] of Object.entries(value)) {
		if (!/^(care|procedure):[a-z0-9-]{1,40}$/i.test(key)) continue;
		const list = asFiles(files);
		if (list?.length) shots[key] = list.slice(0, 3);
	}
	return shots;
}
function readCoach(raw, fallbackLog = []) {
	const data = raw && typeof raw === "object" ? raw : {};
	const odometer = readMiles(data.odometer);
	return {
		odometer,
		done: readDone(data.done),
		checks: readChecks(data.checks),
		log: readLog(data.log, fallbackLog),
		notes: readNotes(data.notes),
		dealer: typeof data.dealer === "string" ? data.dealer.slice(0, 80) : "",
		dealerAddress: typeof data.dealerAddress === "string" ? data.dealerAddress.slice(0, 120) : "",
		vin: typeof data.vin === "string" ? data.vin.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17) : "",
		nickname: typeof data.nickname === "string" ? data.nickname.trim().slice(0, 40) : "",
		modelYear: readModelYear(data.modelYear),
		wheelOff: settledWheel(data.wheelOff, odometer),
		lugAck: keptLugAck(settledWheel(data.wheelOff, odometer), odometer, data.lugAck),
		tires: asTires(data.tires),
		supplies: asSupplies(data.supplies),
		plates: asPlates(data.plates),
		listDone: asListDone(data.listDone),
		logDraft: readLogDraft(data.logDraft),
		winterPlace: readWinterPlace(data.winterPlace),
		photoId: keepFileId(data.photoId),
		shots: readShots(data.shots)
	};
}
function shotIds(coach) {
	return Object.values(coach.shots ?? {}).flatMap((files) => files.map((file) => file.id));
}
function extraBackupIds(coaches) {
	const ids = [];
	for (const coach of Object.values(coaches)) {
		if (coach.photoId) ids.push(coach.photoId);
		ids.push(...shotIds(coach));
		ids.push(...tirePhotoIds(coach.tires));
		for (const file of coach.logDraft?.files ?? []) ids.push(file.id);
	}
	return ids;
}
function draftAsLog(coaches) {
	return Object.values(coaches).flatMap((coach) => coach.logDraft?.files?.length ? [{
		id: "draft",
		iso: "",
		miles: 0,
		note: "",
		files: coach.logDraft.files
	}] : []);
}
function coachLogs(coaches) {
	return Object.values(coaches).flatMap((coach) => coach.log);
}
var DISCLAIMER_REV = 2;
function persisted(s) {
	return {
		modelId: s.modelId,
		hint: s.hint,
		installHint: s.installHint,
		accepted: s.accepted,
		disclaimerRev: s.accepted ? DISCLAIMER_REV : 0,
		ready: s.ready,
		lastBackup: s.lastBackup,
		lastBackupBytes: s.lastBackupBytes,
		coachSet: s.coachSet,
		copyNudge: s.copyNudge,
		systemFilter: s.systemFilter,
		coaches: {
			...s.coaches,
			[s.modelId]: snapshot(s)
		}
	};
}
function fieldsFrom(p) {
	beginRead();
	const modelId = typeof p.modelId === "string" && p.modelId ? p.modelId : "c28";
	const coaches = {};
	if (p.coaches && typeof p.coaches === "object") for (const [id, raw] of Object.entries(p.coaches)) {
		if (!safeKey(id) || !raw || typeof raw !== "object") continue;
		coaches[id] = readCoach(raw);
	}
	if (!coaches[modelId]) coaches[modelId] = readCoach(p);
	const active = coaches[modelId];
	const hasHistory = active.odometer > 0 || !!active.vin || active.log.length > 0 || active.notes.length > 0 || Object.keys(active.done).length > 0;
	return {
		modelId,
		coaches,
		hint: p.hint !== false,
		installHint: p.installHint !== false,
		accepted: p.accepted === true && p.disclaimerRev === DISCLAIMER_REV,
		ready: p.ready === true || p.ready !== false && hasHistory,
		lastBackup: typeof p.lastBackup === "string" ? p.lastBackup : "",
		lastBackupBytes: typeof p.lastBackupBytes === "number" && p.lastBackupBytes > 0 ? Math.round(p.lastBackupBytes) : 0,
		coachSet: coachWasChosen(modelId, active.modelYear, active.vin, p.coachSet),
		copyNudge: readCopyNudge(p.copyNudge),
		systemFilter: typeof p.systemFilter === "string" ? p.systemFilter : "",
		...active
	};
}
function listen() {
	if (listening || typeof window === "undefined" || typeof window.addEventListener !== "function") return;
	listening = true;
	window.addEventListener("storage", (event) => {
		if (event.key !== KEY) return;
		if (event.newValue == null) {
			dropped = true;
			window.location.reload();
			return;
		}
		adoptExternalSave("tab");
	});
}
/** Another tab wrote the phone copy. Adopt it. A quiet adopt is the stale save refusing to overwrite. */
function adoptExternalSave(why = "tab") {
	if (typeof window === "undefined") return;
	let raw = null;
	try {
		raw = localStorage.getItem(KEY);
	} catch {
		return;
	}
	if (!raw) return;
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return;
	}
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
	const row = parsed;
	if (typeof row.schema === "number" && row.schema > 1) {
		saveBlocked = "newer";
		saveProblem = "newer";
		useApp.setState({
			toast: NEWER_TOAST,
			keptRaw: ""
		});
		return;
	}
	const rev = typeof row.rev === "number" && Number.isFinite(row.rev) && row.rev >= 0 ? row.rev : 0;
	if (rev <= seenRev) return;
	seenRev = rev;
	if (saveBlocked === "newer") saveBlocked = false;
	useApp.setState({
		...fieldsFrom(row),
		keptRaw: "",
		...why === "tab" ? { toast: "Updated from another tab." } : {}
	});
}
var useApp = create((set, get) => ({
	hydrated: false,
	modelId: "c28",
	odometer: 0,
	done: {},
	checks: {},
	log: [],
	notes: [],
	dealer: "",
	dealerAddress: "",
	hint: true,
	installHint: true,
	vin: "",
	nickname: "",
	modelYear: null,
	accepted: false,
	wheelOff: null,
	lugAck: 0,
	ready: false,
	tires: emptyTires,
	supplies: emptySupplies,
	plates: emptyPlates,
	listDone: {},
	logDraft: null,
	winterPlace: null,
	photoId: null,
	shots: {},
	lastBackup: "",
	lastBackupBytes: 0,
	coachSet: false,
	copyNudge: null,
	coaches: {},
	trail: [{
		screen: { name: "home" },
		tab: "home"
	}],
	cursor: 0,
	activeTab: "home",
	picker: false,
	searching: false,
	toast: "",
	keptRaw: "",
	undo: null,
	undoCommit: null,
	systemFilter: "",
	partsBook: null,
	guideQuery: "",
	hydrate: () => {
		listen();
		const loaded = load();
		if (loaded.block === "newer") {
			set({
				hydrated: true,
				toast: NEWER_TOAST,
				keptRaw: ""
			});
			return;
		}
		const fields = fieldsFrom(loaded.data);
		const notice = trimMessage();
		set({
			hydrated: true,
			...fields,
			keptRaw: loaded.kept,
			...loaded.block === "unreadable" ? { toast: UNREADABLE_TOAST } : notice ? { toast: notice } : {},
			...resumeWinter(fields.winterPlace ?? null)
		});
		if (notice && loaded.block !== "unreadable") {
			let raw = "";
			try {
				raw = localStorage.getItem(KEY) ?? "";
			} catch {
				raw = "";
			}
			let kept = !raw;
			if (raw) try {
				if (!localStorage.getItem(RAW_KEY)) localStorage.setItem(RAW_KEY, raw);
				kept = true;
			} catch {
				kept = false;
			}
			if (!kept) set({ toast: `${notice} The original was not overwritten.` });
			else {
				const wrote = save(persisted(useApp.getState()), true);
				const finish = (ok) => {
					if (!ok) return;
					set({
						keptRaw: raw,
						toast: `${notice} The original was kept.`
					});
				};
				if (wrote instanceof Promise) wrote.then((ok) => {
					finish(ok);
					if (ok) clearKeptRaw = true;
				}).catch(() => void 0);
				else {
					finish(wrote);
					if (wrote) clearKeptRaw = true;
				}
			}
		}
	},
	setModel: (id) => {
		if (!id) return;
		if (id !== get().modelId) dropUndo();
		commit((live) => {
			if (id === live.modelId) return {
				picker: false,
				partsBook: null,
				coachSet: true
			};
			const coaches = {
				...live.coaches,
				[live.modelId]: snapshot(live)
			};
			return {
				coaches,
				modelId: id,
				picker: false,
				partsBook: null,
				coachSet: true,
				...coaches[id] ?? emptyCoach()
			};
		});
	},
	setOdo: (n) => {
		if (!Number.isInteger(n) || n < 0 || n > MILES_MAX) {
			get().flash("Miles have to be from 0 to 1,000,000.");
			return false;
		}
		commit((live) => ({
			odometer: n,
			...settleLug(live.wheelOff, n, live.lugAck)
		}));
		return true;
	},
	setTires: (patch) => {
		return commit((live) => ({ tires: asTires({
			...live.tires,
			...patch
		}) }));
	},
	setSupplies: (patch) => {
		commit((live) => ({ supplies: asSupplies({
			...live.supplies,
			...patch
		}) }));
	},
	setPlates: (patch) => {
		commit((live) => ({ plates: asPlates({
			...live.plates,
			...patch
		}) }));
	},
	finishSetup: (miles, confirmCoach = false) => {
		if (miles != null && (!Number.isInteger(miles) || miles < 0 || miles > MILES_MAX)) {
			get().flash("Miles have to be from 0 to 1,000,000.");
			return;
		}
		commit((live) => {
			const wheel = miles != null ? settleLug(live.wheelOff, miles, live.lugAck) : null;
			return {
				ready: true,
				coachSet: live.coachSet || confirmCoach,
				...wheel ? {
					odometer: miles,
					...wheel
				} : {}
			};
		});
	},
	addTripMiles: async (delta, note) => {
		const add = Math.round(delta);
		if (!Number.isFinite(add) || add <= 0) return;
		if (add > 5e3) {
			get().flash("Add 5,000 miles or less. Use Set total for a lifetime reading.");
			return;
		}
		const iso = todayIso();
		const text = (note ?? "").trim().slice(0, 80);
		const entryNote = text ? `${text}, ${add.toLocaleString()} miles` : `Drove ${add.toLocaleString()} miles`;
		const id = crypto.randomUUID();
		const origin = get().modelId;
		let tooFar = false;
		let prevLog = [];
		let nextLog = [];
		if (!await commit((live) => {
			if (live.modelId !== origin) return null;
			const miles = live.odometer + add;
			if (miles > MILES_MAX) {
				tooFar = true;
				return null;
			}
			prevLog = live.log;
			nextLog = [{
				id,
				iso,
				miles,
				note: entryNote
			}, ...live.log].slice(0, LOG_MAX);
			return {
				odometer: miles,
				...settleLug(live.wheelOff, miles, live.lugAck),
				log: nextLog
			};
		})) {
			if (tooFar) get().flash("Miles have to be from 0 to 1,000,000.");
			return;
		}
		dropFiles(prevLog, nextLog);
		get().flash(`${add.toLocaleString()} miles logged`);
	},
	setDealer: (dealer) => {
		commit({ dealer: dealer.slice(0, 80) });
	},
	setDealerAddress: (dealerAddress) => {
		commit({ dealerAddress: dealerAddress.slice(0, 120) });
	},
	setVin: (vin) => {
		const next = vin.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17);
		commit((live) => {
			const year = live.modelYear == null && vinOk(next) ? vinYear(next) : null;
			return year ? {
				vin: next,
				modelYear: year
			} : { vin: next };
		});
	},
	setNickname: (nickname) => {
		commit({ nickname: nickname.trim().slice(0, 40) });
	},
	setModelYear: (modelYear) => {
		commit({ modelYear: readModelYear(modelYear) });
	},
	setTrailerPhoto: async (photoId) => {
		const origin = get().modelId;
		const captured = get().photoId;
		if (captured === photoId) return;
		if (!await commit((live) => {
			if (live.modelId !== origin) return null;
			if (live.photoId === photoId) return {};
			return { photoId };
		})) {
			if (photoId && !fileStillUsed(photoId)) deleteFile(photoId);
			return;
		}
		if (captured && captured !== photoId && !fileStillUsed(captured)) deleteFile(captured);
	},
	addShot: (key, file) => {
		if (!/^(care|procedure):[a-z0-9-]{1,40}$/i.test(key)) return false;
		const current = get().shots[key] ?? [];
		if (current.length >= 3) {
			get().flash("Three photos is the limit on one section.");
			return false;
		}
		if (current.some((row) => row.id === file.id)) return true;
		return commit((live) => {
			const current = live.shots[key] ?? [];
			if (current.length >= 3 || current.some((row) => row.id === file.id)) return current.some((row) => row.id === file.id) ? {} : null;
			return { shots: {
				...live.shots,
				[key]: [...current, file]
			} };
		});
	},
	removeShot: async (key, fileId) => {
		const origin = get().modelId;
		if (!await commit((live) => {
			if (live.modelId !== origin) return null;
			const current = live.shots[key] ?? [];
			return { shots: {
				...live.shots,
				[key]: current.filter((file) => file.id !== fileId)
			} };
		})) return;
		if (!fileStillUsed(fileId)) deleteFile(fileId);
	},
	importBackup: (raw) => {
		if (typeof raw === "string" && raw.length > 83886080) return {
			ok: false,
			reason: "large"
		};
		let data;
		if (typeof raw === "string") try {
			data = JSON.parse(raw);
		} catch {
			return { ok: false };
		}
		else data = raw;
		if (!data || typeof data !== "object" || Array.isArray(data)) return { ok: false };
		const version = backupVersion(data.version);
		if (version === "future") return {
			ok: false,
			reason: "future"
		};
		if (version === "bad") return { ok: false };
		if (!backupAppOk(data.app)) return { ok: false };
		if (!("log" in data) && !("done" in data) && !("modelId" in data) && !("coaches" in data)) return { ok: false };
		beginRead();
		const current = get();
		const coaches = {
			...current.coaches,
			[current.modelId]: snapshot(current)
		};
		const brought = {};
		if (data.coaches && typeof data.coaches === "object" && !Array.isArray(data.coaches)) {
			let imported = 0;
			for (const [id, rawCoach] of Object.entries(data.coaches)) {
				if (imported >= 20) break;
				if (!safeKey(id) || !/^[a-z0-9-]{1,32}$/i.test(id) || !rawCoach || typeof rawCoach !== "object" || Array.isArray(rawCoach)) continue;
				const coach = readCoach(rawCoach);
				coaches[id] = coach;
				brought[id] = coach;
				imported += 1;
			}
		} else {
			const id = typeof data.modelId === "string" && safeKey(data.modelId) && /^[a-z0-9-]{1,32}$/i.test(data.modelId) ? data.modelId : current.modelId;
			const coach = readCoach(data, "log" in data ? [] : current.log);
			coaches[id] = coach;
			brought[id] = coach;
		}
		const requested = typeof data.modelId === "string" ? data.modelId : "";
		const files = backupFiles(data.files, coachLogs(coaches), extraBackupIds(coaches));
		const weights = backupWeights(data.weights);
		const level = backupLevel(data.level);
		return {
			ok: true,
			files,
			notice: trimMessage(),
			apply: () => enqueue(() => {
				const live = get();
				const before = {
					...live.coaches,
					[live.modelId]: snapshot(live)
				};
				const mergedCoaches = {
					...before,
					...brought
				};
				const modelId = ownCoach(mergedCoaches, requested) ? requested : live.modelId;
				const active = ownCoach(mergedCoaches, modelId) ? mergedCoaches[modelId] : readCoach(data, live.log);
				const hasHistory = active.odometer > 0 || !!active.vin || active.log.length > 0 || active.notes.length > 0 || Object.keys(active.done).length > 0;
				const coachSet = typeof data.coachSet === "boolean" ? data.coachSet : live.coachSet;
				const next = {
					...live,
					coaches: mergedCoaches,
					modelId,
					...active,
					accepted: data.disclaimerRev === DISCLAIMER_REV && typeof data.accepted === "boolean" ? data.accepted : live.accepted,
					ready: typeof data.ready === "boolean" ? data.ready : hasHistory ? true : live.ready,
					coachSet
				};
				const previousWeights = readWeightsFile();
				const merged = weights ? mergeWeightsFile(previousWeights, weights) : null;
				if (merged && !writeWeightsFile(merged)) return false;
				const previousLevel = readLevelFile();
				const mergedLevel = level ? mergeLevelFile(previousLevel, level) : null;
				if (mergedLevel && !writeLevelFile(mergedLevel)) {
					if (weights) restoreWeightsFile(previousWeights);
					return false;
				}
				const wrote = save(persisted(next), true);
				const finish = (ok) => {
					if (!ok) {
						if (weights) restoreWeightsFile(previousWeights);
						if (level) restoreLevelFile(previousLevel);
						const toast = saveProblem === "newer" ? NEWER_TOAST : saveProblem === "stale" ? STALE_TOAST : "";
						if (toast) set({ toast });
						return false;
					}
					const kept = /* @__PURE__ */ new Set([
						...fileIds(coachLogs(mergedCoaches)),
						...fileIds(draftAsLog(mergedCoaches)),
						...extraBackupIds(mergedCoaches)
					]);
					dropFiles(coachLogs(before), [...coachLogs(mergedCoaches), ...draftAsLog(mergedCoaches)], kept);
					const jobs = [];
					for (const coach of Object.values(before)) {
						if (coach.photoId && !kept.has(coach.photoId)) jobs.push(deleteFile(coach.photoId));
						for (const id of shotIds(coach)) if (!kept.has(id)) jobs.push(deleteFile(id));
						for (const id of tirePhotoIds(coach.tires)) if (!kept.has(id)) jobs.push(deleteFile(id));
						for (const file of coach.logDraft?.files ?? []) if (!kept.has(file.id)) jobs.push(deleteFile(file.id));
					}
					trackDrop(Promise.all(jobs));
					set({
						coaches: mergedCoaches,
						modelId,
						...active,
						accepted: next.accepted,
						ready: next.ready,
						coachSet: next.coachSet,
						keptRaw: ""
					});
					return true;
				};
				return wrote instanceof Promise ? wrote.then(finish) : finish(wrote);
			})
		};
	},
	dismissHint: () => {
		commit({ hint: false });
	},
	dismissInstall: () => {
		commit({ installHint: false });
	},
	dismissCopyNudge: () => {
		commit((live) => ({ copyNudge: {
			edits: recordEdits(live),
			iso: todayIso()
		} }));
	},
	acceptDisclaimer: () => {
		commit({ accepted: true });
	},
	markDone: async (taskId, title) => {
		const task = tasks.find((t) => t.id === taskId);
		if (task?.cadence.type === "miles" && !(get().odometer > 0)) {
			get().flash("Set trailer miles first. A zero-mile mark makes the next interval wrong.");
			return;
		}
		const iso = todayIso();
		const id = crypto.randomUUID();
		const origin = get().modelId;
		let prev;
		let prevWheel = null;
		let prevAck = 0;
		let dropped;
		let needMiles = false;
		if (!await commit((live) => {
			if (live.modelId !== origin) return null;
			if (task?.cadence.type === "miles" && !(live.odometer > 0)) {
				needMiles = true;
				return null;
			}
			prev = live.done[taskId];
			prevWheel = live.wheelOff;
			prevAck = live.lugAck;
			const miles = live.odometer;
			let note = title;
			let wheelOff = prevWheel;
			let lugAck = prevAck;
			if (taskId === "retorque") {
				const start = retorqueOrigin(prevWheel, miles, Boolean(prev), prevAck);
				const stage = start == null ? null : nextLugStage(prevAck);
				if (stage == null || stage >= 50) {
					wheelOff = null;
					lugAck = 0;
					if (stage != null) note = `${title}, ${stage} mi check`;
				} else {
					note = `${title}, ${stage} mi check`;
					lugAck = stage;
					wheelOff = start === 0 ? null : start;
				}
			}
			dropped = live.log.length >= LOG_MAX ? live.log[live.log.length - 1] : void 0;
			const log = [{
				id,
				iso,
				miles,
				note,
				taskId
			}, ...live.log].slice(0, LOG_MAX);
			return {
				done: {
					...live.done,
					[taskId]: {
						iso,
						miles
					}
				},
				log,
				wheelOff,
				lugAck
			};
		})) {
			if (needMiles) get().flash("Set trailer miles first. A zero-mile mark makes the next interval wrong.");
			return;
		}
		const lost = dropped;
		get().offerUndo("Logged", () => {
			commit((live) => {
				if (live.modelId !== origin) return null;
				const done = { ...live.done };
				if (prev) done[taskId] = prev;
				else delete done[taskId];
				let log = live.log.filter((row) => row.id !== id);
				if (lost && !log.some((row) => row.id === lost.id)) log = [...log, lost];
				return {
					done,
					log,
					wheelOff: prevWheel,
					lugAck: prevAck
				};
			});
		}, () => {
			if (lost && !get().log.some((row) => row.id === lost.id)) dropFiles([lost], get().log);
		});
	},
	setDoneDate: async (taskId, iso) => {
		if (!realDay(iso)) return;
		const age = daysBetween(iso, todayIso());
		if (age == null || age < 0) {
			get().flash("That date is ahead of today.");
			return;
		}
		if (age > 14600) {
			get().flash("That date is too far back.");
			return;
		}
		const task = tasks.find((t) => t.id === taskId);
		if (!task) return;
		const milesOnly = task.cadence.type === "miles" && !task.cadence.alsoDays;
		if (milesOnly && !get().done[taskId] && !(get().odometer > 0)) {
			get().flash("Set trailer miles first. A zero-mile mark makes the next interval wrong.");
			return;
		}
		const origin = get().modelId;
		const lineId = crypto.randomUUID();
		let prev;
		let prevLog = [];
		let dropped = [];
		let changed = false;
		let needMiles = false;
		if (!await commit((live) => {
			if (live.modelId !== origin) return null;
			prev = live.done[taskId];
			if (prev?.iso === iso) return {};
			if (milesOnly && !prev && !(live.odometer > 0)) {
				needMiles = true;
				return null;
			}
			const miles = prev?.miles ?? live.odometer;
			const done = {
				...live.done,
				[taskId]: {
					iso,
					miles,
					...prev?.note ? { note: prev.note } : {}
				}
			};
			const linked = prev ? live.log.find((entry) => entry.taskId === taskId && entry.iso === prev.iso) : void 0;
			const line = linked ? {
				...linked,
				iso,
				miles
			} : {
				id: lineId,
				iso,
				miles,
				note: prev ? "Date changed" : "Start date",
				job: task.title,
				taskId
			};
			prevLog = live.log;
			const packed = pushLog(linked ? live.log.filter((entry) => entry.id !== linked.id) : live.log, [line]);
			dropped = packed.dropped;
			changed = true;
			return {
				done,
				log: packed.log
			};
		}) || !changed) {
			if (needMiles) get().flash("Set trailer miles first. A zero-mile mark makes the next interval wrong.");
			return;
		}
		get().offerUndo("Date set", () => {
			commit((live) => {
				if (live.modelId !== origin) return null;
				const done = { ...live.done };
				if (prev) done[taskId] = prev;
				else delete done[taskId];
				return {
					done,
					log: prevLog
				};
			});
		}, () => {
			if (dropped.length && !dropped.every((entry) => get().log.some((item) => item.id === entry.id))) dropFiles(dropped, get().log);
		});
	},
	setStartDates: async (taskIds, iso) => {
		if (!realDay(iso)) return;
		const age = daysBetween(iso, todayIso());
		if (age == null || age < 0) {
			get().flash("That date is ahead of today.");
			return;
		}
		if (age > 14600) {
			get().flash("That date is too far back.");
			return;
		}
		const origin = get().modelId;
		let prev = {};
		let prevLog = [];
		let dropped = [];
		let started = 0;
		let none = false;
		if (!await commit((live) => {
			if (live.modelId !== origin) return null;
			const done = { ...live.done };
			const lines = [];
			const miles = live.odometer;
			for (const taskId of taskIds) {
				if (!safeKey(taskId) || done[taskId]) continue;
				const task = tasks.find((item) => item.id === taskId);
				if (!task || task.cadence.type === "trip") continue;
				if (task.cadence.type === "miles" && !task.cadence.alsoDays) continue;
				done[taskId] = {
					iso,
					miles
				};
				lines.push({
					id: crypto.randomUUID(),
					iso,
					miles,
					note: "Start date",
					job: task.title,
					taskId
				});
			}
			if (!lines.length) {
				none = true;
				return null;
			}
			prev = live.done;
			prevLog = live.log;
			const packed = pushLog(live.log, lines);
			dropped = packed.dropped;
			started = lines.length;
			return {
				done,
				log: packed.log
			};
		})) {
			if (none) get().flash("Those jobs already have a start date.");
			return;
		}
		get().offerUndo(`Started ${started} ${started === 1 ? "job" : "jobs"}`, () => {
			commit((live) => live.modelId === origin ? {
				done: prev,
				log: prevLog
			} : null);
		}, () => {
			if (dropped.length && !dropped.every((entry) => get().log.some((item) => item.id === entry.id))) dropFiles(dropped, get().log);
		});
	},
	clearDone: async (taskId) => {
		const origin = get().modelId;
		if (!get().done[taskId]) return;
		if (!await commit((live) => {
			if (live.modelId !== origin || !live.done[taskId]) return null;
			const done = { ...live.done };
			delete done[taskId];
			return {
				done,
				lugAck: taskId === "retorque" ? previousLugAck(live.lugAck) : live.lugAck
			};
		})) return;
		get().flash("Mark cleared");
	},
	setDoneNote: async (taskId, note) => {
		const text = note.trim().slice(0, 200);
		const origin = get().modelId;
		await commit((live) => {
			if (live.modelId !== origin) return null;
			const prev = live.done[taskId];
			if (!prev || (prev.note ?? "") === text) return {};
			return { done: {
				...live.done,
				[taskId]: text ? {
					...prev,
					note: text
				} : {
					iso: prev.iso,
					miles: prev.miles
				}
			} };
		});
	},
	startWheelOff: async () => {
		if (!(get().odometer > 0)) return;
		if (!await commit((live) => live.odometer > 0 ? {
			wheelOff: live.odometer,
			lugAck: 0
		} : null)) return;
		get().flash("Re-torque countdown started");
	},
	clearWheelOff: () => {
		commit({
			wheelOff: null,
			lugAck: 0
		});
	},
	toggleCheck: (listId, itemId) => {
		commit((live) => {
			const checks = { ...live.checks };
			const list = { ...checks[listId] || {} };
			list[itemId] = !list[itemId];
			checks[listId] = list;
			return {
				checks,
				listDone: stampList(listId, checks, live.listDone)
			};
		});
	},
	clearList: (listId) => {
		commit((live) => {
			const checks = {
				...live.checks,
				[listId]: {}
			};
			const listDone = { ...live.listDone };
			delete listDone[listId];
			return {
				checks,
				listDone
			};
		});
	},
	addLog: async (note, files, job, keepDraft, when) => {
		const attached = (files ?? []).filter((f) => f.id && f.name && f.mime).slice(0, 6);
		const text = note.trim();
		const named = (job ?? "").trim().slice(0, 80);
		const service = readService(when?.detail);
		const hasService = serviceText(service);
		if (!text && !named && attached.length === 0 && !hasService) return false;
		let iso = todayIso();
		if (when?.iso) {
			if (!realDay(when.iso)) {
				get().flash("Use a real date");
				return false;
			}
			iso = when.iso;
		}
		if (when && typeof when.miles === "number") {
			if (!Number.isFinite(when.miles) || when.miles < 0 || when.miles > MILES_MAX) {
				get().flash("Miles should be a number");
				return false;
			}
		}
		const task = (when?.taskId ? tasks.find((task) => task.id === when.taskId) : void 0) ?? (named ? taskFromJob(named) : null);
		const entryId = crypto.randomUUID();
		const origin = get().modelId;
		let toast = "";
		let prevDone = {};
		let prevLog = [];
		let wroteLog = [];
		let dropped = [];
		if (!await commit((live) => {
			if (live.modelId !== origin) return null;
			const miles = when && typeof when.miles === "number" ? Math.round(when.miles) : live.odometer;
			const entry = {
				id: entryId,
				iso,
				miles,
				note: text || (named ? "" : attached.length === 1 ? attached[0].name.replace(/\.[^.]+$/, "") : `${attached.length} files`),
				job: named || void 0,
				files: attached.length ? attached : void 0,
				...service
			};
			if (task) {
				entry.taskId = task.id;
				if (!entry.job) entry.job = task.title;
			}
			prevDone = live.done;
			prevLog = live.log;
			let done = live.done;
			toast = "";
			if (task && task.cadence.type !== "trip") {
				if (task.cadence.type === "miles" && !task.cadence.alsoDays && !(miles > 0)) toast = "Saved in the log. Set trailer miles before this job can move the schedule.";
				else if (iso > todayIso()) toast = "Saved. That date is ahead of today, so the schedule was not moved.";
				else {
					const nextMark = markFromService(live.done[task.id], iso, miles, todayIso());
					if (nextMark) done = {
						...live.done,
						[task.id]: nextMark
					};
					else if (live.done[task.id]) toast = "Saved. The schedule already has a later date.";
				}
			}
			const packed = pushLog(live.log, [entry]);
			dropped = packed.dropped;
			wroteLog = packed.log;
			return done === live.done ? { log: packed.log } : {
				log: packed.log,
				done
			};
		})) return false;
		if (task) get().offerUndo(toast || "Saved. The schedule uses this date.", () => {
			commit((live) => {
				if (live.modelId !== origin) return null;
				let restored = live.log.filter((item) => item.id !== entryId);
				for (const old of dropped) if (!restored.some((item) => item.id === old.id)) restored = [...restored, old];
				return {
					log: restored.slice(0, LOG_MAX),
					done: prevDone
				};
			});
		}, () => {
			if (dropped.length && !dropped.every((old) => get().log.some((item) => item.id === old.id))) dropFiles(dropped, get().log);
		});
		else dropFiles(prevLog, wroteLog);
		if (!keepDraft) get().setLogDraft(null);
		return true;
	},
	setLogDraft: (draft) => {
		const next = draft && (draft.note.trim() || draft.job.trim() || draft.files.length > 0) ? {
			note: draft.note.slice(0, 800),
			job: draft.job.trim().slice(0, 80),
			files: draft.files.slice(0, 6)
		} : null;
		const cur = get().logDraft;
		if (!next && !cur) return true;
		if (next && cur && next.note === cur.note && next.job === cur.job && next.files.length === cur.files.length && next.files.every((file, i) => file.id === cur.files[i]?.id && file.name === cur.files[i]?.name)) return true;
		return commit({ logDraft: next });
	},
	setWinterPlace: (place) => {
		const cur = get().winterPlace;
		if (JSON.stringify(cur) === JSON.stringify(place)) return;
		commit({ winterPlace: place });
	},
	updateLog: async (id, note, when) => {
		const text = note.trim().slice(0, 800);
		const prev = get().log.find((entry) => entry.id === id);
		if (!text && !prev?.job && !prev?.files?.length && !serviceText(when?.detail) && !serviceText(prev)) {
			get().flash("The note needs some text");
			return false;
		}
		if (!prev) return false;
		let iso = prev.iso;
		if (when?.iso) {
			if (!realDay(when.iso)) {
				get().flash("Use a real date");
				return false;
			}
			const age = daysBetween(when.iso, todayIso());
			if (age == null || age < 0) {
				get().flash("That date is ahead of today.");
				return false;
			}
			iso = when.iso;
		}
		let miles = prev.miles;
		if (when && typeof when.miles === "number") {
			if (!Number.isFinite(when.miles) || when.miles < 0 || when.miles > MILES_MAX) {
				get().flash("Miles have to be from 0 to 1,000,000.");
				return false;
			}
			miles = Math.round(when.miles);
		}
		const service = when?.detail ? readService(when.detail) : readService(prev);
		const nextEntry = {
			...prev,
			note: text,
			iso,
			miles,
			work: service.work,
			provider: service.provider,
			parts: service.parts,
			partsCost: service.partsCost,
			laborCost: service.laborCost,
			cost: service.cost,
			warranty: service.warranty,
			tech: service.tech,
			phone: service.phone
		};
		if (JSON.stringify({
			...prev,
			id: ""
		}) === JSON.stringify({
			...nextEntry,
			id: ""
		})) return true;
		const taskId = prev.taskId;
		const origin = get().modelId;
		const prevMark = taskId ? get().done[taskId] : void 0;
		const movesMark = !!taskId && !!prevMark && prevMark.iso === prev.iso && prevMark.miles === prev.miles;
		if (!await commit((live) => {
			if (live.modelId !== origin || !live.log.some((entry) => entry.id === id)) return null;
			const log = live.log.map((entry) => entry.id === id ? nextEntry : entry);
			if (!movesMark || !taskId) return { log };
			const mark = live.done[taskId];
			const nextMark = markAfterOwnedEdit(mark, {
				iso: prev.iso,
				miles: prev.miles
			}, log.filter((entry) => entry.taskId === taskId));
			if (nextMark === void 0 || nextMark && nextMark.iso === mark?.iso && nextMark.miles === mark?.miles && nextMark.note === mark?.note) return { log };
			if (!nextMark) {
				const done = { ...live.done };
				delete done[taskId];
				return {
					log,
					done
				};
			}
			return {
				log,
				done: {
					...live.done,
					[taskId]: nextMark
				}
			};
		})) return false;
		get().offerUndo("Note updated", () => {
			commit((live) => {
				if (live.modelId !== origin) return null;
				const log = live.log.map((entry) => entry.id === id ? prev : entry);
				if (!movesMark || !taskId) return { log };
				const done = { ...live.done };
				if (prevMark) done[taskId] = prevMark;
				else delete done[taskId];
				return {
					log,
					done
				};
			});
		});
		return true;
	},
	removeLog: async (id) => {
		if (!get().log.some((entry) => entry.id === id)) return;
		const origin = get().modelId;
		const found = [];
		let index = 0;
		let prevDone = {};
		const ok = await commit((live) => {
			if (live.modelId !== origin) return null;
			const at = live.log.findIndex((item) => item.id === id);
			if (at < 0) return null;
			const row = live.log[at];
			found[0] = row;
			index = at;
			const next = live.log.filter((item) => item.id !== id);
			prevDone = live.done;
			let done = live.done;
			if (row.taskId && tasks.some((task) => task.id === row.taskId && task.cadence.type !== "trip")) {
				const mark = live.done[row.taskId];
				if (mark && mark.iso === row.iso && mark.miles === row.miles) {
					const latest = latestService(next.filter((item) => item.taskId === row.taskId));
					done = { ...live.done };
					if (latest) done[row.taskId] = {
						iso: latest.iso,
						miles: latest.miles,
						...mark.note ? { note: mark.note } : {}
					};
					else delete done[row.taskId];
				}
			}
			return done === live.done ? { log: next } : {
				log: next,
				done
			};
		});
		const entry = found[0];
		if (!ok || !entry) return;
		const at = index;
		const doneBefore = prevDone;
		get().offerUndo("Removed", () => {
			let current = null;
			let capped = [];
			Promise.resolve(commit((live) => {
				if (live.modelId !== origin || live.log.some((item) => item.id === entry.id)) return {};
				current = live.log;
				const log = live.log.slice();
				log.splice(Math.min(at, log.length), 0, entry);
				capped = log.slice(0, LOG_MAX);
				return {
					log: capped,
					done: doneBefore
				};
			})).then((written) => {
				if (written && current) dropFiles(current, capped);
			}).catch(() => void 0);
		}, () => {
			if (!get().log.some((item) => item.id === entry.id)) dropFiles([entry], []);
		});
	},
	removeLogFile: async (entryId, fileId) => {
		const origin = get().modelId;
		let prev = [];
		let next = [];
		if (!await commit((live) => {
			if (live.modelId !== origin) return null;
			prev = live.log;
			next = live.log.map((e) => {
				if (e.id !== entryId || !e.files) return e;
				const files = e.files.filter((f) => f.id !== fileId);
				return {
					...e,
					files: files.length ? files : void 0
				};
			});
			return { log: next };
		})) return;
		dropFiles(prev, next);
	},
	addNote: (text) => {
		const body = text.trim().slice(0, 2e3);
		if (!body) return false;
		const origin = get().modelId;
		return commit((live) => {
			if (live.modelId !== origin) return null;
			if (live.notes.length >= 100) {
				queueMicrotask(() => useApp.getState().flash("100 notes is the limit. Remove one first."));
				return null;
			}
			return { notes: [{
				id: crypto.randomUUID(),
				iso: todayIso(),
				text: body
			}, ...live.notes] };
		});
	},
	updateNote: async (id, text) => {
		const body = text.trim().slice(0, 2e3);
		const prev = get().notes.find((note) => note.id === id);
		if (!body) {
			get().flash("The note needs some text");
			return false;
		}
		if (!prev || prev.text === body) return true;
		const origin = get().modelId;
		if (!await commit((live) => {
			if (live.modelId !== origin) return null;
			if (!live.notes.some((note) => note.id === id)) return null;
			return { notes: live.notes.map((note) => note.id === id ? {
				...note,
				text: body,
				iso: todayIso()
			} : note) };
		})) return false;
		get().offerUndo("Note updated", () => {
			commit((live) => {
				if (live.modelId !== origin) return null;
				return { notes: live.notes.map((note) => note.id === id ? prev : note) };
			});
		});
		return true;
	},
	removeNote: async (id) => {
		const note = get().notes.find((item) => item.id === id);
		if (!note) return;
		const origin = get().modelId;
		if (!await commit((live) => {
			if (live.modelId !== origin || !live.notes.some((item) => item.id === id)) return null;
			return { notes: live.notes.filter((item) => item.id !== id) };
		})) return;
		get().offerUndo("Removed", () => {
			commit((live) => {
				if (live.modelId !== origin || live.notes.some((item) => item.id === note.id)) return {};
				return { notes: [note, ...live.notes].slice(0, 100) };
			});
		});
	},
	push: (screen) => {
		const tab = tabFor(screen);
		const { trail, cursor } = get();
		const next = trail.slice(0, cursor + 1);
		next.push({
			screen,
			tab
		});
		const sized = next.length > MAX_TRAIL ? next.slice(next.length - MAX_TRAIL) : next;
		set({
			trail: sized,
			cursor: sized.length - 1,
			activeTab: tab,
			searching: false
		});
	},
	back: () => {
		const { trail, cursor } = get();
		if (cursor <= 0) return;
		const next = cursor - 1;
		set({
			cursor: next,
			activeTab: trail[next].tab,
			searching: false
		});
		if (roots.has(trail[next].screen.name)) get().setWinterPlace(null);
	},
	forward: () => {
		const { trail, cursor } = get();
		if (cursor >= trail.length - 1) return;
		const next = cursor + 1;
		set({
			cursor: next,
			activeTab: trail[next].tab,
			searching: false
		});
	},
	tab: (name) => {
		if (name === "home") {
			const { cursor, activeTab, trail } = get();
			if (!(activeTab === "home" && cursor === 0 && trail[cursor]?.screen.name === "home")) {
				set({
					trail: [{
						screen: { name: "home" },
						tab: "home"
					}],
					cursor: 0,
					activeTab: "home",
					searching: false,
					picker: false
				});
				get().setWinterPlace(null);
			}
			return;
		}
		const { trail, cursor, activeTab } = get();
		const open = (nextTrail, nextCursor, nextTab) => {
			set({
				trail: nextTrail,
				cursor: nextCursor,
				activeTab: nextTab,
				searching: false,
				picker: false
			});
			if (roots.has(nextTrail[nextCursor].screen.name)) get().setWinterPlace(null);
		};
		if (name === activeTab) {
			let i = cursor;
			while (i > 0 && trail[i - 1].tab === name) i -= 1;
			if (trail[i].screen.name === name) {
				if (i !== cursor) open(trail, i, name);
				return;
			}
			const next = trail.slice(0, i);
			next.push({
				screen: { name },
				tab: name
			});
			open(next, next.length - 1, name);
			return;
		}
		const next = trail.slice(0, cursor + 1);
		next.push({
			screen: { name },
			tab: name
		});
		const sized = next.length > MAX_TRAIL ? next.slice(next.length - MAX_TRAIL) : next;
		open(sized, sized.length - 1, name);
	},
	setPicker: (picker) => set({ picker }),
	setSearching: (searching) => set({ searching }),
	setSystem: (systemFilter) => {
		set({ systemFilter });
		commit({ systemFilter });
	},
	setPartsBook: (partsBook) => set({ partsBook }),
	setGuideQuery: (guideQuery) => set({ guideQuery }),
	noteBackup: (bytes) => {
		const size = typeof bytes === "number" && Number.isFinite(bytes) && bytes > 0 ? Math.round(bytes) : get().lastBackupBytes;
		commit({
			lastBackup: todayIso(),
			lastBackupBytes: size
		});
	},
	flash: (toast) => {
		undoToken += 1;
		const commit = get().undoCommit;
		set({
			toast,
			undo: null,
			undoCommit: null
		});
		commit?.();
		const token = undoToken;
		if (typeof window === "undefined") return;
		window.setTimeout(() => {
			if (token !== undoToken) return;
			if (get().toast === toast) set({ toast: "" });
		}, 1600);
	},
	offerUndo: (toast, revert, commitUndo) => {
		const origin = get().modelId;
		undoToken += 1;
		const previous = get().undoCommit;
		set({
			toast,
			undo: () => {
				if (get().modelId !== origin) return;
				revert();
			},
			undoCommit: commitUndo ?? null
		});
		previous?.();
		const token = undoToken;
		globalThis.setTimeout(() => {
			if (token !== undoToken) return;
			const pending = get().undoCommit;
			set({
				toast: "",
				undo: null,
				undoCommit: null
			});
			pending?.();
		}, 5e3);
	},
	dismissToast: () => {
		if (!get().toast && !get().undo) return;
		undoToken += 1;
		const pending = get().undoCommit;
		set({
			toast: "",
			undo: null,
			undoCommit: null
		});
		pending?.();
	},
	runUndo: () => {
		const revert = get().undo;
		undoToken += 1;
		set({
			toast: "",
			undo: null,
			undoCommit: null
		});
		revert?.();
	}
}));
var RETORQUE_MILES = [
	5,
	10,
	25,
	50
];
/** Keep a missed 50-mile check on screen for another 100 miles, then stop. */
var RETORQUE_KEEP = 150;
var undoToken = 0;
function dropUndo() {
	undoToken += 1;
	const pending = useApp.getState().undoCommit;
	useApp.setState({
		toast: "",
		undo: null,
		undoCommit: null
	});
	pending?.();
}
function readLugAck(value) {
	return value === 5 || value === 10 || value === 25 || value === 50 ? value : 0;
}
function keptLugAck(wheelOff, odo, value) {
	const ack = readLugAck(value);
	if (!ack) return 0;
	if (wheelOff != null) return ack;
	if (odo > 0 && odo < RETORQUE_KEEP) return ack;
	return 0;
}
function settleLug(wheelOff, odo, ack) {
	const kept = settledWheel(wheelOff, odo);
	if (wheelOff != null && kept == null) return {
		wheelOff: null,
		lugAck: 0
	};
	return {
		wheelOff: kept,
		lugAck: keptLugAck(kept, odo, ack)
	};
}
function previousLugAck(ack) {
	if (ack === 50) return 25;
	if (ack === 25) return 10;
	if (ack === 10) return 5;
	return 0;
}
function settledWheel(start, odo) {
	if (typeof start !== "number" || !Number.isFinite(start) || start < 0) return null;
	if (odo >= start + RETORQUE_KEEP) return null;
	return start;
}
function nextLugStage(ack) {
	return RETORQUE_MILES.find((miles) => miles > ack) ?? null;
}
function retorqueDue(start, odo, ack = 0) {
	if (start === null) return [];
	return RETORQUE_MILES.filter((miles) => miles > ack && odo < start + miles).map((miles) => ({
		miles,
		at: start + miles,
		left: Math.max(0, start + miles - odo)
	}));
}
/** Where the 5 / 10 / 25 / 50 count starts. A trailer still near those first miles counts from 0 until a stage is marked. */
function retorqueOrigin(wheelOff, odo, marked, ack = 0) {
	if (!(odo > 0)) return null;
	if (ack >= 50) return null;
	if (wheelOff != null && wheelOff >= 0 && odo < wheelOff + RETORQUE_KEEP) return wheelOff;
	if (wheelOff != null) return null;
	if (marked && ack === 0) return null;
	if (odo < RETORQUE_KEEP) return 0;
	return null;
}
function retorqueWatch(wheelOff, odo, marked, ack = 0) {
	const start = retorqueOrigin(wheelOff, odo, marked, ack);
	const current = start == null ? null : nextLugStage(ack);
	return {
		start,
		upcoming: retorqueDue(start, odo, ack),
		missed: start == null ? [] : RETORQUE_MILES.filter((miles) => miles > ack && odo >= start + miles).map((miles) => ({
			miles,
			at: start + miles,
			left: 0
		})),
		current
	};
}
function backupFiles(value, log, extra = []) {
	const wanted = new Set(log.flatMap((e) => e.files?.map((f) => f.id) ?? []));
	for (const id of extra) if (id) wanted.add(id);
	if (!value || typeof value !== "object" || Array.isArray(value)) return [];
	const files = [];
	for (const [id, row] of Object.entries(value)) {
		if (files.length >= 200) break;
		if (!safeKey(id) || !wanted.has(id) || id.length > FILE_ID_MAX || !row || typeof row !== "object") continue;
		const mime = row.mime;
		const data = row.data;
		if (typeof mime !== "string" || typeof data !== "string" || !data || data.length > 21e6) continue;
		const type = mime.toLowerCase().split(";")[0].trim();
		if (type !== "image/jpeg" && type !== "image/png" && type !== "image/gif" && type !== "image/webp" && type !== "application/pdf") continue;
		files.push({
			id,
			mime: type,
			data
		});
	}
	return files;
}
function dueOf(cadence, mark, odo) {
	if (cadence.type === "trip") return "trip";
	if (!mark) return "unset";
	const today = todayIso();
	const dateDue = (iso) => {
		if (!iso) return null;
		return today >= iso;
	};
	if (cadence.type === "days") {
		const due = dateDue(shiftIso(mark.iso, cadence.every));
		return due == null ? "unset" : due ? "due" : "ok";
	}
	if (cadence.type === "years") {
		const due = dateDue(shiftYears(mark.iso, cadence.every));
		return due == null ? "unset" : due ? "due" : "ok";
	}
	if (cadence.type === "season") {
		const due = dateDue(shiftIso(mark.iso, 180));
		return due == null ? "unset" : due ? "due" : "ok";
	}
	const byMiles = odo > 0 && mark.miles > 0 && odo - mark.miles >= cadence.every;
	const byDays = cadence.alsoDays ? dateDue(shiftIso(mark.iso, cadence.alsoDays)) : false;
	if (byDays == null && !byMiles) return "unset";
	return byMiles || byDays ? "due" : "ok";
}
function asListDone(value) {
	if (!value || typeof value !== "object") return {};
	const out = {};
	for (const [id, iso] of Object.entries(value)) {
		if (!safeKey(id) || typeof iso !== "string" || !realDay(iso) || id.length === 0 || id.length >= 40) continue;
		out[id] = iso;
	}
	return out;
}
function stampList(listId, checks, listDone) {
	const next = { ...listDone };
	const items = checklistById(listId)?.groups.flatMap((group) => group.items) ?? [];
	const state = checks[listId] || {};
	if (items.length > 0 && items.every((item) => state[item.id])) next[listId] = todayIso();
	else delete next[listId];
	return next;
}
function ageDays(iso) {
	return daysBetween(iso, todayIso());
}
function nextDateIso(cadence, mark) {
	if (cadence.type === "days") return shiftIso(mark.iso, cadence.every);
	if (cadence.type === "years") return shiftYears(mark.iso, cadence.every);
	if (cadence.type === "season") return shiftIso(mark.iso, 180);
	if (cadence.type === "miles" && cadence.alsoDays) return shiftIso(mark.iso, cadence.alsoDays);
	return null;
}
/** The one calendar date for this job. Null for trip items, mile-only jobs, and anything not yet marked. */
function calendarDate(cadence, mark) {
	if (!mark) return null;
	if (cadence.type === "trip") return null;
	if (cadence.type === "miles" && !cadence.alsoDays) return null;
	return nextDateIso(cadence, mark);
}
function nextMilesLeft(cadence, mark, odo) {
	if (cadence.type !== "miles" || !(mark.miles > 0) || !(odo > 0)) return null;
	return mark.miles + cadence.every - odo;
}
function dueWhy(cadence, mark, odo) {
	const state = dueOf(cadence, mark, odo);
	const label = cadenceLabel(cadence);
	if (state === "unset" && cadence.type === "miles") return `No start mileage · ${label}`;
	if (state === "unset") return `No date yet · ${label}`;
	if (state === "ok") return `OK · ${label}`;
	if (state !== "due" || !mark) return label;
	const age = ageDays(mark.iso);
	if (cadence.type === "miles") {
		const miles = odo > 0 && mark.miles > 0 ? odo - mark.miles : 0;
		const byMiles = mark.miles > 0 && miles >= cadence.every;
		const byDays = cadence.alsoDays != null && age != null && age >= cadence.alsoDays;
		if (byMiles && byDays) return `Due · ${miles.toLocaleString()} miles and ${age} days`;
		if (byMiles) return `Due · ${miles.toLocaleString()} miles`;
		if (byDays && age != null) return `Due · ${age} days`;
	}
	if (age != null && age >= 0) return `Due · ${age} days`;
	return `Due · ${label}`;
}
/** The next mile reading or calendar date from the last mark. Null once that limit has passed. */
function nextDue(cadence, mark, odo) {
	if (cadence.type === "trip") return null;
	if (!mark || dueOf(cadence, mark, odo) !== "ok") return null;
	const when = nextDateIso(cadence, mark);
	const dateText = when ? formatWhen(when) : null;
	if (cadence.type === "days" || cadence.type === "years" || cadence.type === "season") return dateText ? `Next ${dateText}` : null;
	if (cadence.type !== "miles") return null;
	const left = nextMilesLeft(cadence, mark, odo);
	const at = mark.miles > 0 ? mark.miles + cadence.every : null;
	const mileText = at == null || left == null || left <= 0 ? null : `Next ${at.toLocaleString()} mi · ${left.toLocaleString()} left`;
	if (dateText && mileText) return `${mileText} or ${dateText}`;
	return mileText ?? (dateText ? `Next ${dateText}` : null);
}
/** Calendar days until the next date, while the job is still ahead. */
function daysUntilNext(cadence, mark, odo) {
	if (!mark || dueOf(cadence, mark, odo) !== "ok") return null;
	const when = nextDateIso(cadence, mark);
	const left = when ? daysBetween(todayIso(), when) : null;
	return left != null && left > 0 ? left : null;
}
/** Last completion and the next date and miles. Nulls stay off the card. Intervals are the ones already on the job. */
function serviceWindow(cadence, mark, _odo) {
	const lastDate = mark ? formatWhen(mark.iso) : null;
	const lastMiles = mark && mark.miles > 0 ? `${mark.miles.toLocaleString()} mi` : null;
	const when = mark ? nextDateIso(cadence, mark) : null;
	const nextDate = when ? formatWhen(when) : null;
	let nextMiles = null;
	if (cadence.type === "miles") {
		if (mark && mark.miles > 0) nextMiles = `${(mark.miles + cadence.every).toLocaleString()} mi`;
	}
	return {
		lastDate,
		lastMiles,
		nextDate,
		nextMiles
	};
}
/** Overdue, the 30-day window, the 500-mile window, a recent mark, or no mark. A job is in only one of these. */
function maintainBand(cadence, mark, odo) {
	if (cadence.type === "trip") return "trip";
	if (dueOf(cadence, mark, odo) === "due") return "overdue";
	if (!mark) return "none";
	const left = soonLeft(cadence, mark, odo);
	if (left?.days != null) return "days";
	if (left?.miles != null) return "miles";
	const age = daysBetween(mark.iso, todayIso());
	if (age != null && age >= 0 && age <= 90) return "recent";
	return "later";
}
/**
* The job that should sit on the Next due card.
* Overdue first, then the soonest date still ahead. Trip items, including lug re-torque, are not in this list.
*/
function pickNextTask(rows, odo) {
	let best = null;
	for (const row of rows) {
		const rank = rankDue(row.cadence, row.mark, odo);
		if (!rank) continue;
		if (!best || rank.key < best.key) best = {
			id: row.id,
			why: rank.why,
			key: rank.key
		};
	}
	return best ? {
		id: best.id,
		why: best.why
	} : null;
}
function rankDue(cadence, mark, odo) {
	if (cadence.type === "trip") return null;
	if (!mark) return null;
	const state = dueOf(cadence, mark, odo);
	if (state !== "due" && state !== "ok") return null;
	const when = nextDateIso(cadence, mark);
	const daysLeft = when ? daysBetween(todayIso(), when) : null;
	const milesLeft = nextMilesLeft(cadence, mark, odo);
	if (state === "due") {
		const pastDays = daysLeft != null && daysLeft <= 0 ? -daysLeft : 0;
		const pastMiles = milesLeft != null && milesLeft <= 0 ? -milesLeft : 0;
		return {
			why: "due",
			key: -(pastDays * 1e6 + pastMiles)
		};
	}
	const dayScore = daysLeft != null && daysLeft > 0 ? daysLeft : null;
	const mileScore = milesLeft != null && milesLeft > 0 ? milesLeft : null;
	if (dayScore == null && mileScore == null) return null;
	const why = dueSoon(cadence, mark, odo) ? "soon" : "next";
	if (dayScore != null) return {
		why,
		key: 1e6 + dayScore
	};
	return {
		why,
		key: 2e6 + (mileScore ?? 0)
	};
}
/**
* Still inside a longer interval, and inside the last 30 days or the last 500 miles.
* A monthly job is not "soon" the day it is marked. It stays OK until it is due.
*/
function dueSoon(cadence, mark, odo) {
	return soonLeft(cadence, mark, odo) != null;
}
/** What put the job in the soon window. Null when it is not in that window. */
function soonWhy(cadence, mark, odo) {
	const left = soonLeft(cadence, mark, odo);
	if (!left) return null;
	const parts = [];
	if (left.days != null) parts.push(`${left.days} days left`);
	if (left.miles != null) parts.push(`${left.miles.toLocaleString()} miles left`);
	return parts.join(" · ");
}
function soonLeft(cadence, mark, odo) {
	if (dueOf(cadence, mark, odo) !== "ok" || !mark) return null;
	const span = cadence.type === "days" ? cadence.every : cadence.type === "years" ? cadence.every * 365 : cadence.type === "season" ? 180 : cadence.type === "miles" ? cadence.alsoDays ?? 0 : 0;
	const when = nextDateIso(cadence, mark);
	const left = when ? daysBetween(todayIso(), when) : null;
	const days = span > 30 && left != null && left > 0 && left <= 30 ? left : null;
	if (cadence.type !== "miles") return days == null ? null : {
		days,
		miles: null
	};
	const milesLeft = nextMilesLeft(cadence, mark, odo);
	const miles = cadence.every > 500 && milesLeft != null && milesLeft > 0 && milesLeft <= 500 ? milesLeft : null;
	if (days == null && miles == null) return null;
	return {
		days,
		miles
	};
}
function screenTitle(s) {
	switch (s.name) {
		case "home": return "RivetCare";
		case "fix": return "Fix";
		case "symptom": return "Check";
		case "care": return "Maintain";
		case "procedure": return "Procedure";
		case "procedures": return "Procedures";
		case "parts": return "Parts";
		case "part": return "Part";
		case "more": return "Library";
		case "checklist": return "Checklist";
		case "lists": return "Checklists";
		case "specs": return "Glovebox card";
		case "weights": return "Weights";
		case "level": return "Trailer level";
		case "tires": return "Tires";
		case "supplies": return s.part === "battery" ? "Batteries" : s.part === "propane" ? "Propane cylinders" : "Cylinders";
		case "service": return "Service";
		case "recalls": return "Recalls";
		case "codes": return "Fault codes";
		case "log": return "Service log";
		case "records": return "Records";
		case "backup": return "Backup";
		case "privacy": return "Privacy";
		case "history": return "Owner's history";
		case "notes": return "Notes";
		case "desk": return "Shop sheet";
		case "manuals": return "Manuals";
		case "tools": return "On-board kit";
		case "about": return "About";
		case "printout": return "Print checklist";
		case "table": return "Checks table";
		case "flows": return "Flowcharts";
		case "flow": return "Flowchart";
		case "figures": return "Figures";
		case "figure": return "Figure";
		case "sheet": return "Figures";
		case "offline": return "Offline";
		case "support": return "Support";
	}
}
//#endregion
export { trustedBlob as $, pickNextTask as A, retorqueWatch as B, jobMark as C, oldestTire as D, nextDue as E, prepareFile as F, soonWhy as G, serviceTotal as H, putFile as I, tiltFromAccel as J, supplyAges as K, readLevelFile as L, plateLabel as M, plateOnFlow as N, parseSpan as O, platePlaceholder as P, treadNeedsReplace as Q, readSpans as R, homeTireLine as S, maintainBand as T, serviceWindow as U, screenTitle as V, sideNeedsReplace as W, tirePhotoIds as X, tireAges as Y, todayIso as Z, emptyWheel as _, accelConvention as a, withoutCheck as at, formatWhen as b, blobToBase64 as c, zeroFromTilt as ct, correctAccel as d, typedFloorTilt as et, daysBetween as f, dueWhy as g, dueOf as h, WHEELS as i, withCheck as it, plateKeyForFlow as j, pathSteps as k, calendarDate as l, deleteFile as m, LEVEL_KEY as n, waterHeaterSpec as nt, applyZero as o, writeSpans as ot, daysUntilNext as p, tabFor as q, PLATE_FIELDS as r, whenFilesDropped as rt, backupBlob as s, writeZero as st, BACKUP_APP as t, useApp as tt, closeFiles as u, fileStillUsed as v, lowWheels as w, getFile as x, floorRead as y, readZero as z };
