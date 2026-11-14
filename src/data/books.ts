import { models } from "@/data/models";
import type { Part } from "@/data/parts";

export const bookCatalog = [
  { id: "CL", label: "Classic", year: "2026", family: "Classic" },
  { id: "GT", label: "Globetrotter", year: "2025", family: "Globetrotter" },
  { id: "FC", label: "Flying Cloud", year: "2025", family: "Flying Cloud" },
  { id: "IN", label: "International", year: "2025", family: "International" },
  { id: "AI", label: "International EU", year: "2025", family: "International" },
  { id: "TW", label: "Trade Wind", year: "2025", family: "Trade Wind" },
  { id: "PB", label: "Pottery Barn", year: "2024", family: "Flying Cloud" },
  { id: "BA", label: "Bambi", year: "2026", family: "Bambi" },
  { id: "CV", label: "Caravel", year: "2026", family: "Caravel" },
  { id: "C5", label: "Caravel", year: "2025", family: "Caravel" },
  { id: "BC", label: "Basecamp", year: "2026", family: "Basecamp" },
  { id: "BX", label: "Basecamp XE", year: "2026", family: "Basecamp" },
] as const;

export type BookId = (typeof bookCatalog)[number]["id"];

export function bookMeta(id: BookId) {
  return bookCatalog.find((b) => b.id === id) ?? bookCatalog[0];
}

export function bookLabel(id: BookId) {
  const b = bookMeta(id);
  return `${b.year} ${b.label}`;
}

/** The factory book that matches the coach on the home screen. */
export function bookForModel(modelId: string, family: string): BookId | null {
  if (modelId === "bcxe") return "BX";
  const extras = new Set<BookId>(["AI", "C5", "PB", "BX"]);
  return bookCatalog.find((b) => b.family === family && !extras.has(b.id))?.id ?? null;
}

export type BookSection = {
  name: string;
  page: number;
  floors: string[];
  parts: [string, string][];
};

export type BookChapter = {
  book: BookId;
  chapter: string;
  sections: BookSection[];
};

export type BookPart = {
  id: string;
  pn: string;
  name: string;
  book: BookId;
  chapter: string;
  section: string;
  sections: string[];
  page: number;
  floors: string[];
  notForOrder: boolean;
};

export function bookId(book: BookId, pn: string) {
  return `${book.toLowerCase()}-${pn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

const FLOOR_NAME: Record<string, string> = Object.fromEntries(models.map((m) => [m.id, m.short]));

/** The part screen for one factory-book line. Shared by the live book and the offline copy. */
export function bookPartRecord(p: BookPart): Part {
  const meta = bookMeta(p.book);
  const bookName = `${bookLabel(p.book)} parts book`;
  const extra =
    p.sections.length > 1
      ? ` Also listed under ${p.sections.slice(1, 4).join("; ")}${p.sections.length > 4 ? "…" : ""}.`
      : "";
  const floors = !p.floors.length
    ? `All ${meta.label} floor plans in this book.`
    : `Floor plans: ${p.floors.map((f) => FLOOR_NAME[f] ?? f).join(", ")}.`;
  return {
    id: p.id,
    name: p.name,
    pn: p.pn,
    application: `${bookName}, page ${p.page}. ${p.chapter} — ${p.section}.${extra}`,
    notes: p.notForOrder
      ? `The book marks this install number not for order. Order the pieces listed under it. ${floors} Quote the VIN.`
      : `Factory parts-book line. ${floors} Quote the VIN before you order — options change the row.`,
    verify: false as const,
    system: p.chapter,
    book: p.book,
    floors: p.floors.length ? p.floors : undefined,
  };
}
