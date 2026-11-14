import shops from "@/data/shops.json";
import { readZipTable, writeZipTable } from "@/lib/book-cache";

export type ShopType =
  | "airstream_dealer_with_service"
  | "independent_airstream_shop"
  | "mobile_airstream_tech"
  | "factory_service_center";

export type Shop = {
  name: string;
  type: ShopType;
  street: string;
  city: string;
  state: string;
  postal: string;
  phone: string;
  web: string;
  hours: string;
  certified: boolean;
  lat: number | null;
  lng: number | null;
  approx: boolean;
  /** States this shop says it will travel to, when that is more than the shop address. */
  area?: string;
};

export type RangeMiles = 25 | 50 | 100 | 150 | "all";
export type ShopKind = "all" | "mobile" | "shop";

export const RANGES: { id: RangeMiles; label: string }[] = [
  { id: 25, label: "25 miles" },
  { id: 50, label: "50 miles" },
  { id: 100, label: "100 miles" },
  { id: 150, label: "150 miles" },
  { id: "all", label: "Nationwide" },
];

const list = shops as Shop[];

let zipTable: Record<string, [number, number]> | null = null;

async function zips(): Promise<Record<string, [number, number]>> {
  if (zipTable) return zipTable;
  const cached = await readZipTable();
  if (cached) {
    zipTable = cached;
    return cached;
  }
  // US Census Bureau 2024 Gazetteer, ZCTA internal points. Public-domain government work.
  const mod = await import("@/data/zips.json");
  zipTable = mod.default as unknown as Record<string, [number, number]>;
  await writeZipTable(zipTable);
  return zipTable;
}

/** The ZIP list is about 1 MB, so the app shell does not cache it. Save it on this phone. */
export async function saveShopDistances(): Promise<boolean> {
  try {
    await zips();
    return (await readZipTable()) != null;
  } catch {
    return false;
  }
}

export function milesBetween(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 3958.8;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export type ShopHit = { shop: Shop; miles: number | null };

export function shopsNear(
  lat: number,
  lng: number,
  range: RangeMiles,
  kind: ShopKind = "all",
  state = "",
): ShopHit[] {
  const hits: ShopHit[] = [];
  const unplaced: ShopHit[] = [];
  for (const shop of list) {
    if (kind === "mobile" && shop.type !== "mobile_airstream_tech") continue;
    if (kind === "shop" && shop.type === "mobile_airstream_tech") continue;
    if (shop.lat == null || shop.lng == null) {
      unplaced.push({ shop, miles: null });
      continue;
    }
    const miles = milesBetween(lat, lng, shop.lat, shop.lng);
    if (range !== "all" && miles > range) continue;
    hits.push({ shop, miles });
  }
  hits.sort((a, b) => (a.miles ?? 0) - (b.miles ?? 0));
  const extra =
    range === "all" ? unplaced : state ? unplaced.filter((hit) => servedStates(hit.shop).includes(state)) : [];
  hits.push(...extra);
  return hits;
}

/** First match wins, so the one-code exceptions sit before the wide ranges. */
const ZIP_STATE: [number, number, string][] = [
  [501, 544, "NY"],
  [1001, 2791, "MA"],
  [2801, 2940, "RI"],
  [3031, 3897, "NH"],
  [3901, 4992, "ME"],
  [5001, 5495, "VT"],
  [5501, 5544, "MA"],
  [5601, 5907, "VT"],
  [6001, 6389, "CT"],
  [6390, 6390, "NY"],
  [6401, 6928, "CT"],
  [7001, 8989, "NJ"],
  [10001, 14975, "NY"],
  [15001, 19640, "PA"],
  [19701, 19980, "DE"],
  [20001, 20099, "DC"],
  [20101, 20198, "VA"],
  [20201, 20599, "DC"],
  [20601, 21930, "MD"],
  [22001, 24658, "VA"],
  [24701, 26886, "WV"],
  [27006, 28909, "NC"],
  [29001, 29948, "SC"],
  [30001, 31999, "GA"],
  [32003, 34997, "FL"],
  [35004, 36925, "AL"],
  [37010, 38589, "TN"],
  [38601, 39776, "MS"],
  [39801, 39901, "GA"],
  [40003, 42788, "KY"],
  [43001, 45999, "OH"],
  [46001, 47997, "IN"],
  [48001, 49971, "MI"],
  [50001, 52809, "IA"],
  [53001, 54990, "WI"],
  [56901, 56999, "DC"],
  [55001, 56763, "MN"],
  [57001, 57799, "SD"],
  [58001, 58856, "ND"],
  [59001, 59937, "MT"],
  [60001, 62999, "IL"],
  [63001, 65899, "MO"],
  [66002, 67954, "KS"],
  [68001, 69367, "NE"],
  [70001, 71497, "LA"],
  [71601, 72959, "AR"],
  [73001, 73199, "OK"],
  [73301, 73344, "TX"],
  [73401, 74966, "OK"],
  [75001, 75501, "TX"],
  [75502, 75502, "AR"],
  [75503, 79999, "TX"],
  [80001, 81658, "CO"],
  [82001, 83128, "WY"],
  [83201, 83877, "ID"],
  [84001, 84791, "UT"],
  [85001, 86556, "AZ"],
  [87001, 88441, "NM"],
  [88510, 88595, "TX"],
  [88901, 89883, "NV"],
  [90001, 96162, "CA"],
  [96701, 96898, "HI"],
  [97001, 97920, "OR"],
  [98001, 99403, "WA"],
  [99501, 99950, "AK"],
];

export function stateForZip(zip: string): string {
  const n = Number(zip);
  if (!Number.isFinite(n)) return "";
  for (const [lo, hi, state] of ZIP_STATE) {
    if (n >= lo && n <= hi) return state;
  }
  return "";
}

function servedStates(shop: Shop): string[] {
  const raw = shop.area?.trim() ? shop.area : shop.state;
  return raw.toUpperCase().split(/[^A-Z]+/).filter((part) => part.length === 2);
}

async function stateAt(lat: number, lng: number): Promise<string> {
  const table = await zips();
  let best = "";
  let bestD = Infinity;
  for (const [zip, point] of Object.entries(table)) {
    const dlat = point[0] - lat;
    const dlng = point[1] - lng;
    const d = dlat * dlat + dlng * dlng;
    if (d < bestD) {
      bestD = d;
      best = zip;
    }
  }
  return stateForZip(best);
}

export async function nearestShops(
  zip: string,
  range: RangeMiles,
  kind: ShopKind = "all",
): Promise<{ hits: ShopHit[]; zipKnown: boolean }> {
  const table = await zips();
  const point = table[zip];
  if (!point) return { hits: [], zipKnown: false };
  const [lat, lng] = point;
  return { hits: shopsNear(lat, lng, range, kind, stateForZip(zip)), zipKnown: true };
}

/** Same search as a ZIP, using the nearest ZIP's state for shops that have no map point. */
export async function shopsAt(lat: number, lng: number, range: RangeMiles, kind: ShopKind = "all"): Promise<ShopHit[]> {
  return shopsNear(lat, lng, range, kind, await stateAt(lat, lng));
}

export function typeLabel(type: ShopType): string {
  switch (type) {
    case "airstream_dealer_with_service":
      return "Dealer";
    case "factory_service_center":
      return "Factory service";
    case "mobile_airstream_tech":
      return "Mobile tech";
    default:
      return "Independent shop";
  }
}
