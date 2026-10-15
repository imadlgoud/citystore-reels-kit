import timelineJson from "../../../public/readers/data/timeline.json";
import productsJson from "../../../public/readers/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// E-readers comparison reel timeline (reels/readers/build_timeline.py), shared with its mix.
// 36.5 s long: the VO does not fit 30 s even at 1.1x, so the standing over-30 s approval applies.
export const RTL_READERS = timelineJson as unknown as Timeline;
export const rscene = (id: string) => sceneIn(RTL_READERS, id);
export const rev = (k: string) => evIn(RTL_READERS, k);
export const revList = (k: string) => evListIn(RTL_READERS, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { kobo: img("kobo"), colorsoft: img("colorsoft"), paperwhite: img("paperwhite"), hand: img("hand") };
/** screen rectangles as fractions of each cut-out image (x0, y0, x1, y1), for overlays drawn on the screens */
export const SCREEN = {
  kobo: [0.065, 0.055, 0.748, 0.937],
  colorsoft: [0.41, 0.204, 0.95, 0.887],
} as const;
/** Kobo page-turn buttons (centre x, centre y as fractions of the image) */
export const KOBO_BUTTONS: [number, number][] = [[0.933, 0.388], [0.933, 0.6]];
