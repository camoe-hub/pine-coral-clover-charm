import raw from "./manuals.json";
import type { Family } from "@/data/models";

export type ManualLink = {
  year: number;
  title: string;
  kind: "manual" | "parts";
  brand: string;
  url: string;
};

export const manualLinks = raw as ManualLink[];

/** The revision printed in the factory file name, such as rev04. Null when the file name has none. */
export function manualRevision(url: string): string | null {
  const match = /rev(\d+)/i.exec(url);
  if (!match) return null;
  return `rev${match[1].padStart(2, "0")}`;
}

export const manualYears = [...new Set(manualLinks.map((m) => m.year))].sort((a, b) => b - a);

export const LIBRARY_URL = "https://www.airstream.com/support-tools/owner-resources/owners-manuals-parts-books/";

const FAMILY_BOOK: Partial<Record<Family, string>> = {
  Bambi: "Bambi Parts Book",
  Basecamp: "Basecamp Parts Book",
  Caravel: "Caravel Parts Book",
  "Flying Cloud": "Flying Cloud Parts Book",
  International: "International Parts Book",
  Globetrotter: "Globetrotter Parts Book",
  "Trade Wind": "Trade Wind Parts Book",
  Classic: "Classic Parts Book",
};

export type PartsBookLink = {
  title: string;
  year: number | null;
  url: string;
  fallback: string;
  note: string;
};

/** The factory PDF for this coach. The file stays on Airstream’s site. */
export function partsBookFor(modelId: string, family: Family, year: number | null): PartsBookLink {
  const title = modelId === "bcxe" ? "Basecamp Xe Parts Book" : FAMILY_BOOK[family];
  const fallback = LIBRARY_URL;
  if (!title) {
    return {
      title: "Airstream parts books",
      year: null,
      url: fallback,
      fallback,
      note: "No single book is listed for this coach. This opens Airstream’s manuals page. Needs a signal. Nothing is stored in this app.",
    };
  }
  const rows = manualLinks.filter((m) => m.kind === "parts" && m.title === title);
  if (!rows.length) {
    return {
      title,
      year: null,
      url: fallback,
      fallback,
      note: "This opens Airstream’s manuals page. Needs a signal. Nothing is stored in this app.",
    };
  }
  const newest = rows.slice().sort((a, b) => b.year - a.year)[0];
  const revision = (url: string) => {
    const rev = manualRevision(url);
    return rev ? ` The file name says ${rev}.` : "";
  };
  if (year == null) {
    return {
      title,
      year: newest.year,
      url: newest.url,
      fallback,
      note: `Year not set. This opens the ${newest.year} book, the newest one listed, until you set a year.${revision(newest.url)} Needs a signal. This app does not store the file.`,
    };
  }
  const exact = rows.find((row) => row.year === year);
  if (exact) {
    return {
      title: `${exact.year} ${title}`,
      year: exact.year,
      url: exact.url,
      fallback,
      note: `Opens Airstream’s PDF.${revision(exact.url)} Needs a signal. This app does not store the file.`,
    };
  }
  const nearest = rows.slice().sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year) || b.year - a.year)[0];
  return {
    title: `${nearest.year} ${title}`,
    year: nearest.year,
    url: nearest.url,
    fallback,
    note: `No ${year} file is listed. This opens the ${nearest.year} book.${revision(nearest.url)} If that file does not open, use Airstream’s manuals page. Needs a signal.`,
  };
}