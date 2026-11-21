import timelineJson from "../../../public/note15/data/timeline.json";
import productsJson from "../../../public/note15/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Redmi Note 15 5G timeline (reels/note15/build_timeline.py), shared with its mix.
// 30 s: pause trimming at natural speed, VO ends at 27.4 s.
export const N15TL = timelineJson as unknown as Timeline;
export const nscene = (id: string) => sceneIn(N15TL, id);
export const nev = (k: string) => evIn(N15TL, k);
export const nevList = (k: string) => evListIn(N15TL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { full: img("full"), front: img("front"), back: img("back") };
