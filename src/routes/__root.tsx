import { useLayoutEffect, useState } from "react";
import "@/lib/zod-config";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { documentCsp } from "@/lib/security-headers";
import appCss from "../styles.css?url";

const APP_NAME = "RivetCare";

/** Exact screen pixels. A size that is off by one pixel is letterboxed, not full screen. */
const SPLASHES = [
  [402, 874, 3],
  [402, 873, 3],
  [440, 956, 3],
  [430, 932, 3],
  [420, 912, 3],
  [393, 852, 3],
  [390, 844, 3],
  [428, 926, 3],
  [414, 896, 3],
  [414, 896, 2],
  [375, 812, 3],
  [375, 667, 2],
  [320, 568, 2],
] as const;

function LaunchSplash() {
  const [show, setShow] = useState(true);
  useLayoutEffect(() => {
    if (window.top !== window.self) {
      document.documentElement.classList.add("in-preview");
      setShow(false);
      return;
    }
    const timer = window.setTimeout(() => setShow(false), 1700);
    return () => window.clearTimeout(timer);
  }, []);
  if (!show) return null;
  return (
    <div className="launch-splash">
      <img src="/splash/brand.jpg?v=2" alt="" />
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" },
      { title: APP_NAME },
      { name: "description", content: "An independent checklist for Airstream owners. Not affiliated with Airstream, Inc." },
      { name: "theme-color", content: "#152A6A" },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "preload", href: "/fonts/outfit-700-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: "/fonts/barlow-400-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: "/fonts/barlow-600-latin.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: "/logo.png", as: "image" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-180.png" },
      ...SPLASHES.map(([width, height, ratio]) => ({
        rel: "apple-touch-startup-image",
        href: `/splash/${width * ratio}x${height * ratio}.png`,
        media: `screen and (device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)`,
      })),
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={documentCsp(import.meta.env.PROD)} />
        <HeadContent />
        <script src="/theme-boot.js" />
      </head>
      <body>
        <LaunchSplash />
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
