import { todayIso } from "@/lib/date";

const SPOKE = "rivetcare-spoke";
const CHOICE = "rivetcare-notices";

export type ReminderStatus = "unsupported" | "needs-install" | "default" | "granted" | "denied";

type Note = { tag?: string; close: () => void };

type NotifyReg = {
  showNotification: (title: string, options: Record<string, unknown>) => Promise<void>;
  getNotifications?: () => Promise<Note[]>;
};

/** iPhone only delivers a web notification from an installed Home Screen app. */
export function reminderStatus(input: { notification: boolean; permission: NotificationPermission | "default"; ios: boolean; installed: boolean }): ReminderStatus {
  if (!input.notification) return "unsupported";
  if (input.ios && !input.installed) return "needs-install";
  if (input.permission === "granted") return "granted";
  if (input.permission === "denied") return "denied";
  return "default";
}

/** The switch stays where the owner set it. A granted phone stays on until they turn it off. */
export function noticesAreOn(status: ReminderStatus, choice: "on" | "off" | null): boolean {
  if (choice === "on") return true;
  if (choice === "off") return false;
  return status === "granted";
}

export function readNoticesChoice(): "on" | "off" | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const value = localStorage.getItem(CHOICE);
    return value === "on" || value === "off" ? value : null;
  } catch {
    return null;
  }
}

function rememberNotices(choice: "on" | "off") {
  try {
    localStorage.setItem(CHOICE, choice);
  } catch {
    /* a private window can still finish this tap */
  }
}

export function readReminderStatus(): ReminderStatus {
  if (typeof window === "undefined" || typeof Notification === "undefined") return "unsupported";
  const nav = navigator as Navigator & { standalone?: boolean };
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const installed = window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
  return reminderStatus({ notification: true, permission: Notification.permission, ios, installed });
}

async function registration(): Promise<NotifyReg | undefined> {
  if (!("serviceWorker" in navigator)) return undefined;
  return (await navigator.serviceWorker.getRegistration()) as NotifyReg | undefined;
}

function noticeBody(titles: string[]): string {
  if (titles.length <= 1) return titles[0] ?? "";
  return `${titles.length} jobs are due.`;
}

async function post(title: string, body: string, tag: string) {
  const options = { body, tag, icon: "/icon-192.png", badge: "/icon-192.png", data: { url: "/" } };
  const reg = await registration();
  if (reg) await reg.showNotification(title, options);
  else new Notification(title, options);
}

async function closePosted() {
  const reg = await registration();
  const list = (await reg?.getNotifications?.()) ?? [];
  for (const note of list) {
    if (note.tag === "due" || note.tag === "reminders-on") note.close();
  }
}

async function clearBadge() {
  const nav = navigator as Navigator & { clearAppBadge?: () => Promise<void> };
  try {
    await nav.clearAppBadge?.();
  } catch {
    /* the icon badge is optional */
  }
}

/** Badge, and one short notice a day when the switch is on. */
export async function speakDue(titles: string[]) {
  if (readNoticesChoice() === "off") {
    await clearBadge();
    await closePosted();
    return;
  }
  const nav = navigator as Navigator & { setAppBadge?: (n?: number) => Promise<void>; clearAppBadge?: () => Promise<void> };
  try {
    if (titles.length > 0) await nav.setAppBadge?.(titles.length);
    else await nav.clearAppBadge?.();
  } catch {
    /* the icon badge is optional */
  }
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
  } catch {
    /* a blocked notification should not break the page */
  }
}

/** Call from a tap. The choice is saved even when this view cannot post a notice. */
export async function enableReminders(titles: string[]): Promise<ReminderStatus> {
  rememberNotices("on");
  const status = readReminderStatus();
  if (status === "unsupported" || status === "needs-install" || status === "denied") return status;
  let permission = Notification.permission;
  if (permission === "default") {
    try {
      permission = await Notification.requestPermission();
    } catch {
      return status;
    }
  }
  const next = reminderStatus({
    notification: true,
    permission,
    ios: /iphone|ipad|ipod/i.test(navigator.userAgent),
    installed: true,
  });
  if (permission !== "granted") return next;
  rememberNotices("on");
  const body = noticeBody(titles);
  if (!body) return "granted";
  try {
    await post("RivetCare", body, "due");
    try {
      localStorage.setItem(SPOKE, todayIso());
    } catch {
      /* the notice already posted */
    }
  } catch {
    /* permission can be granted and the notice still fail */
  }
  return "granted";
}

/** Stops today's notice. The phone's own Settings can block it for good. */
export async function disableReminders(): Promise<ReminderStatus> {
  rememberNotices("off");
  forgetSpoke();
  await clearBadge();
  await closePosted();
  return readReminderStatus();
}

export function forgetSpoke() {
  try {
    localStorage.removeItem(SPOKE);
  } catch {
    /* ignore */
  }
}
