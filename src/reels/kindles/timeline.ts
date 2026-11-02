import timelineJson from "../../../public/kindles/data/timeline.json";
import productsJson from "../../../public/kindles/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Kindle Colorsoft + Kindle Scribe reel timeline (reels/kindles/build_timeline.py), shared with its mix.
// 35 s: VO sped up on request (trim + max 1.10x), ends at 31.6 s; over 30 s under the standing approval.
export const KDTL = timelineJson as unknown as Timeline;
export const kdscene = (id: string) => sceneIn(KDTL, id);
export const kdev = (k: string) => evIn(KDTL, k);
export const kdevList = (k: string) => evListIn(KDTL, k);
type P = { src: string; w: number; h: number; note?: number[] };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w, note: PR[k].note ?? [0, 0, 0, 0] });
/** scribe.note = blanked handwriting area of the note panel, as image fractions [x0, y0, x1, y1] */
export const OFFICIAL = { colorsoft: img("colorsoft"), scribe: img("scribe") };
