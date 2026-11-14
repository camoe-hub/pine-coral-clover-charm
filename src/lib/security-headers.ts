/**
 * Response headers for the live preview and the deployed app.
 * Framing is limited to grok.com. Do not add X-Frame-Options: the preview
 * is a grok.com iframe, and DENY or SAMEORIGIN would blank it.
 * The theme boot script is /theme-boot.js. Production script-src still
 * allows 'unsafe-inline' because TanStack emits a per-request hydration
 * script. A static hash cannot cover it, and a nonce cannot live in the
 * build-time meta policy. style-src keeps 'unsafe-inline' as well.
 * upgrade-insecure-requests is added in production only.
 */

const FRAME_ANCESTORS = "frame-ancestors https://grok.com https://*.grok.com";

const SHARED = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' blob: data: https://grok.com https://*.grok.com",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "script-src-attr 'none'",
];

function policy(prod: boolean) {
  return [
    ...SHARED,
    prod ? "script-src 'self' 'unsafe-inline'" : "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
    prod ? "connect-src 'self'" : "connect-src 'self' ws: wss: http: https:",
    prod ? "worker-src 'self'" : "worker-src 'self' blob:",
    prod ? "upgrade-insecure-requests" : "",
  ].filter(Boolean).join("; ");
}

/** Meta-tag policy. frame-ancestors is not valid in a meta tag, so it is header-only. */
export function documentCsp(prod: boolean) {
  return policy(prod);
}

const PERMISSIONS = "camera=(self), microphone=(), geolocation=(self), payment=(), usb=(), clipboard-write=(self), notifications=(self)";

export function securityHeaders(prod: boolean): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Security-Policy": `${documentCsp(prod)}; ${FRAME_ANCESTORS}`,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": PERMISSIONS,
  };
  if (prod) headers["Strict-Transport-Security"] = "max-age=15552000";
  return headers;
}
