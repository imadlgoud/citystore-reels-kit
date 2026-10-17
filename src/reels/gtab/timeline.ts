import timelineJson from "../../../public/gtab/data/timeline.json";
import productsJson from "../../../public/gtab/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// G-Tab T13 reel timeline (reels/gtab/build_timeline.py), shared with its mix.
// 38.5 s long: the VO does not fit 30 s even at 1.1x, so the standing over-30 s approval applies.
export const GTTL = timelineJson as unknown as Timeline;
export const gtscene = (id: string) => sceneIn(GTTL, id);
export const gtev = (k: string) => evIn(GTTL, k);
export const gtevList = (k: string) => evListIn(GTTL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { pair: img("pair"), front: img("front"), back: img("back") };
/** screen inside the front render (x0, y0, x1, y1 fractions), for the overlays drawn on it */
export const FRONT_SCREEN = [0.09, 0.055, 0.92, 0.94] as const;
