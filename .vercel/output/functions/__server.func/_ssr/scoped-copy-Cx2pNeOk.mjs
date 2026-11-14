import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as scopeCopy } from "./year-scope-abgC83Lw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scoped-copy-Cx2pNeOk.js
var import_jsx_runtime = require_jsx_runtime();
/** Other-year sentences stay available, under a line that they are not this coach. */
function ScopedCopy({ text, year }) {
	const scoped = scopeCopy(text, year);
	if (!scoped.aside) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: text });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [scoped.lead ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "block",
		children: scoped.lead
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `block text-muted ${scoped.lead ? "mt-2" : ""}`,
		children: ["Not this coach. ", scoped.aside]
	})] });
}
//#endregion
export { ScopedCopy as t };
