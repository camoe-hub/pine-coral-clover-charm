import { cn } from "@/lib/cn";
import { setTheme, subscribeTheme } from "@/lib/theme";
import { Moon, OctagonAlert, Sun, TriangleAlert } from "lucide-react";
import { useEffect, useState, type ButtonHTMLAttributes, type FormEvent, type ReactNode, type Ref } from "react";

export function Sheet({
  children,
  labelledBy,
  dialogId,
  onScrim,
  dialogRef,
  center = false,
  className,
  onSubmit,
}: {
  children: ReactNode;
  labelledBy: string;
  dialogId?: string;
  onScrim?: () => void;
  dialogRef?: Ref<HTMLDivElement>;
  center?: boolean;
  className?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const panel = cn(
    "safe-bottom max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-sheet px-5 pt-5 outline-none",
    center && "sm:rounded-3xl sm:pb-5",
    className,
  );
  const body = onSubmit ? (
    <form
      id={dialogId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={panel}
      onSubmit={onSubmit}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </form>
  ) : (
    <div
      id={dialogId}
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={panel}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </div>
  );
  return (
    <div
      className={cn(
        "no-print fixed inset-0 z-50 flex items-end justify-center bg-inverse/50",
        center && "sm:items-center sm:justify-center",
      )}
      role="presentation"
      onClick={onScrim}
    >
      {body}
    </div>
  );
}

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

/** Page title, set in the same geometric sans as the RivetCare mark. */
export function PageTitle({ children, className = "mt-1 text-3xl text-ink" }: { children: string; className?: string }) {
  const text = typeof children === "string" ? children : "";
  return <h1 className={className.replaceAll("font-display", "font-title")}>{text}</h1>;
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

export function Chip({
  on,
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { on: boolean }) {
  return (
    <button
      type={type}
      aria-pressed={on}
      className={cn(
        "min-h-11 min-w-11 shrink-0 rounded-full px-3 text-sm font-semibold",
        on ? "bg-navy text-on-navy" : "border border-line bg-sheet text-ink",
        className,
      )}
      {...props}
    />
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
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "line" | "danger" | "text" }) {
  const v = {
    primary: "justify-center rounded-full bg-navy px-4 text-on-navy",
    ghost: "justify-center rounded-full bg-transparent px-4 text-accent",
    line: "justify-center rounded-full border border-line bg-sheet px-4 text-ink",
    danger: "justify-center rounded-full bg-danger-soft px-4 text-stop",
    text: "text-accent",
  };
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center gap-2 text-sm font-semibold transition-colors duration-150 active:opacity-80",
        v[variant],
        className,
      )}
      {...props}
    />
  );
}
