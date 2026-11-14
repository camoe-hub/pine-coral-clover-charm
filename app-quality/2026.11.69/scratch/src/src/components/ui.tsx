import { cn } from "@/lib/cn";
import { setTheme, subscribeTheme } from "@/lib/theme";
import { Moon, OctagonAlert, Sun, TriangleAlert } from "lucide-react";
import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-card border border-rule bg-sheet", className)}>{children}</div>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-[13px] font-semibold uppercase leading-snug tracking-wider text-muted">{children}</p>
  );
}

export function Pill({
  tone = "navy",
  children,
}: {
  tone?: "navy" | "blue" | "sage" | "warn" | "due" | "danger" | "line";
  children: ReactNode;
}) {
  const tones = {
    navy: "bg-navy text-on-navy",
    blue: "bg-blue-soft text-accent",
    sage: "bg-sage-soft text-ok",
    warn: "bg-warn-soft text-caution",
    due: "bg-signal-soft text-signal",
    danger: "bg-danger-soft text-stop",
    line: "bg-paper text-muted border border-line",
  };
  const dot = tone === "due" ? "bg-signal" : tone === "warn" ? "bg-caution" : tone === "blue" ? "bg-accent" : tone === "sage" ? "bg-ok" : "";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {dot ? <span className={cn("size-1.5 shrink-0 rounded-full", dot)} aria-hidden /> : null}
      {children}
    </span>
  );
}

export function DarkModeSwitch({ onNavy = false, className }: { onNavy?: boolean; className?: string }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    return subscribeTheme(() => setDark(document.documentElement.classList.contains("dark")));
  }, []);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={cn("grid h-11 w-14 shrink-0 place-items-center", className)}
    >
      <span
        className={cn("relative h-7 w-12 rounded-full", onNavy ? "bg-white/25" : "border border-line bg-sheet")}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-0.5 grid size-6 place-items-center rounded-full bg-knob text-navy shadow-sm",
            dark ? "right-0.5" : "left-0.5",
          )}
        >
          {dark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
        </span>
      </span>
    </button>
  );
}

export function Notice({ tone, title, children }: { tone: "caution" | "stop"; title: string; children: ReactNode }) {
  const stop = tone === "stop";
  return (
    <div
      className={cn("flex gap-3 border-l-4 px-3 py-3 text-sm text-ink", stop ? "border-signal bg-signal-soft" : "border-caution bg-warn-soft")}
      role={stop ? "alert" : "note"}
    >
      {stop ? <OctagonAlert className="mt-0.5 size-5 shrink-0 text-signal" aria-hidden /> : <TriangleAlert className="mt-0.5 size-5 shrink-0 text-caution" aria-hidden />}
      <div>
        <p className={cn("font-semibold", stop ? "text-signal" : "text-caution")}>{title}</p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

export function Btn({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "line" | "danger" }) {
  const v = {
    primary: "bg-navy text-on-navy",
    ghost: "bg-transparent text-accent",
    line: "border border-line bg-sheet text-ink",
    danger: "bg-danger-soft text-stop",
  };
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors duration-150 active:opacity-80",
        v[variant],
        className,
      )}
      {...props}
    />
  );
}
