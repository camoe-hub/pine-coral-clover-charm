import type { Screen } from "@/lib/store";
import type { Model } from "@/data/models";

/**
 * Diagrams are not in this edition. The checks stay in words.
 * The helpers remain so an old link does not crash.
 */
export type Figure = {
  id: string;
  src?: string;
  num: string;
  title: string;
  group: string;
  links: { label: string; to: Screen }[];
};

export const figures: Figure[] = [];

export function figureForCoach(_id: string, _coach: { family: string; alde: boolean }) {
  return false;
}

export function figureApplies(_id: string, _model: Model, _year?: number | null) {
  return false;
}

export function figureById(id: string) {
  return figures.find((f) => f.id === id);
}

export function figuresForProcedure(id: string) {
  return figures.filter((f) => f.links.some((l) => l.to.name === "procedure" && l.to.id === id));
}

export function figuresForFlow(id: string) {
  return figures.filter((f) => f.links.some((l) => l.to.name === "flow" && l.to.id === id));
}
