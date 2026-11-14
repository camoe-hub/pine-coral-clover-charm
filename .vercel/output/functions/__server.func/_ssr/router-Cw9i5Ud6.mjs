import { i as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { _ as lazyRouteComponent, b as useRouter, f as Scripts, g as Outlet, h as createRouter, p as HeadContent, q as require_react, v as createFileRoute, x as require_jsx_runtime, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { _ as Moon, a as TriangleAlert, g as OctagonAlert, o as Sun } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cw9i5Ud6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var listeners = /* @__PURE__ */ new Set();
function subscribeTheme(listener) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
function notify() {
	listeners.forEach((listener) => listener());
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
/** Page title, set in the same geometric sans as the RivetCare mark. */
function PageTitle({ children, className = "mt-1 text-3xl text-ink" }) {
	const text = typeof children === "string" ? children : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: className.replaceAll("font-display", "font-title"),
		children: text
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
/** Thrown when a screen chunk did not load. The service worker answers a miss with 503. */
var MISSING_SCREEN = "This screen isn't on this phone yet.";
/** A failed lazy screen, including the swallowed preload that then reads `.default`. */
function isMissingScreen(error) {
	const message = error instanceof Error ? error.message : typeof error === "string" ? error : "";
	if (!message) return false;
	if (message === "This screen isn't on this phone yet.") return true;
	return /reading ['"]default['"]|dynamically imported module|Failed to fetch dynamically|error loading dynamically imported module|Importing a module script failed|Unable to preload|ChunkLoadError/i.test(message);
}
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function goHome() {
	try {
		sessionStorage.removeItem("rivetcare-preload-reload");
	} catch {}
	const url = new URL(window.location.href);
	url.hash = "";
	window.location.assign(`${url.pathname}${url.search}`);
}
function AppErrorComponent({ error }) {
	const missing = isMissingScreen(error);
	const message = errorMessage(error);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-3 bg-paper px-6 text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] font-semibold uppercase tracking-[0.14em] text-muted",
				children: "RivetCare"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
				className: "font-display text-3xl",
				children: missing ? "This screen isn't on the phone yet" : "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base text-ink",
				children: missing ? "This page is not on this phone yet. Open it once while you have a signal." : "Home is still on this phone. Reload if you have a signal."
			}),
			missing ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: goHome,
					className: "min-h-11 rounded-full bg-navy px-4 text-sm font-semibold text-on-navy",
					children: "Back to Home"
				}), missing ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => window.location.reload(),
					className: "min-h-11 rounded-full border border-line bg-sheet px-4 text-sm font-semibold text-ink",
					children: "Reload"
				})]
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return url.protocol === "https:";
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return url.protocol === "https:" || url.protocol === "http:";
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (url.protocol === "https:" && (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname))) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var SHARED = [
	"default-src 'self'",
	"style-src 'self' 'unsafe-inline'",
	"font-src 'self'",
	"img-src 'self' blob: data: https://grok.com https://*.grok.com",
	"manifest-src 'self'",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"script-src-attr 'none'"
];
function policy(prod) {
	return [
		...SHARED,
		prod ? "script-src 'self' 'unsafe-inline'" : "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
		prod ? "connect-src 'self'" : "connect-src 'self' ws: wss: http: https:",
		prod ? "worker-src 'self'" : "worker-src 'self' blob:",
		prod ? "upgrade-insecure-requests" : ""
	].filter(Boolean).join("; ");
}
/** Meta-tag policy. frame-ancestors is not valid in a meta tag, so it is header-only. */
function documentCsp(prod) {
	return policy(prod);
}
var styles_default = "/assets/styles-C5zOpJMy.css";
var APP_NAME = "RivetCare";
/** Exact screen pixels. A size that is off by one pixel is letterboxed, not full screen. */
var SPLASHES = [
	[
		402,
		874,
		3
	],
	[
		402,
		873,
		3
	],
	[
		440,
		956,
		3
	],
	[
		430,
		932,
		3
	],
	[
		420,
		912,
		3
	],
	[
		393,
		852,
		3
	],
	[
		390,
		844,
		3
	],
	[
		428,
		926,
		3
	],
	[
		414,
		896,
		3
	],
	[
		414,
		896,
		2
	],
	[
		375,
		812,
		3
	],
	[
		375,
		667,
		2
	],
	[
		320,
		568,
		2
	]
];
function LaunchSplash() {
	const [show, setShow] = (0, import_react.useState)(true);
	(0, import_react.useLayoutEffect)(() => {
		if (window.top !== window.self) {
			document.documentElement.classList.add("in-preview");
			setShow(false);
			return;
		}
		const timer = window.setTimeout(() => setShow(false), 1700);
		return () => window.clearTimeout(timer);
	}, []);
	if (!show) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "launch-splash",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/splash/brand.jpg?v=2",
			alt: ""
		})
	});
}
var Route$3 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "An independent checklist for Airstream owners. Not affiliated with Airstream, Inc."
			},
			{
				name: "theme-color",
				content: "#152A6A"
			},
			{
				name: "apple-mobile-web-app-title",
				content: APP_NAME
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent"
			}
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
				sizes: "32x32"
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32.png"
			},
			{
				rel: "preload",
				href: "/fonts/outfit-700-latin.woff2",
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous"
			},
			{
				rel: "preload",
				href: "/fonts/barlow-400-latin.woff2",
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous"
			},
			{
				rel: "preload",
				href: "/fonts/barlow-600-latin.woff2",
				as: "font",
				type: "font/woff2",
				crossOrigin: "anonymous"
			},
			{
				rel: "preload",
				href: "/logo.png",
				as: "image"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/icon-180.png"
			},
			...SPLASHES.map(([width, height, ratio]) => ({
				rel: "apple-touch-startup-image",
				href: `/splash/${width * ratio}x${height * ratio}.png`,
				media: `screen and (device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)`
			}))
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
				httpEquiv: "Content-Security-Policy",
				content: documentCsp(true)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { src: "/theme-boot.js" })
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaunchSplash, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$2 = () => import("./routes-xIOD81ex.mjs").then((n) => n.t);
var Route$2 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./privacy-DIAUsb8M.mjs");
var Route$1 = createFileRoute("/privacy")({
	head: () => ({ meta: [{ title: "Privacy policy · RivetCare" }, {
		name: "description",
		content: "RivetCare stores the trailer records on this phone. It does not sell data or require an account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./support-iLd4wONU.mjs");
var Route = createFileRoute("/support")({
	head: () => ({ meta: [{ title: "Support · RivetCare" }, {
		name: "description",
		content: "How to get help with RivetCare. The model-year manual still governs."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$2.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	PrivacyRoute: Route$1.update({
		id: "/privacy",
		path: "/privacy",
		getParentRoute: () => Route$3
	}),
	SupportRoute: Route.update({
		id: "/support",
		path: "/support",
		getParentRoute: () => Route$3
	})
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Btn as a, Kicker as c, Pill as d, applyTheme as f, isMissingScreen as i, Notice as l, previewPathPrefix as n, Card as o, themeChoice as p, MISSING_SCREEN as r, DarkModeSwitch as s, router_exports as t, PageTitle as u };
