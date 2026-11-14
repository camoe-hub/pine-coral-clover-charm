import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region ../../../../node_modules/.nitro/vite/services/ssr/assets/public-page-DjnyM1ue.js
var import_jsx_runtime = require_jsx_runtime();
function PublicPage({ kicker, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh max-w-lg bg-paper px-4 py-8 text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] font-semibold uppercase tracking-[0.14em] text-muted",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl text-ink",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-5 text-base leading-relaxed",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "font-semibold text-accent",
						href: "/",
						children: "RivetCare"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "font-semibold text-accent",
						href: "/privacy",
						children: "Privacy"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "font-semibold text-accent",
						href: "/support",
						children: "Support"
					})
				]
			})
		]
	});
}
//#endregion
export { PublicPage as t };
