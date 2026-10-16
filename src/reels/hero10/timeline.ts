import timelineJson from "../../../public/hero10/data/timeline.json";
import productsJson from "../../../public/hero10/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// GoPro HERO10 Black (used) reel timeline (reels/hero10/build_timeline.py), shared with its mix. 30 s.
export const H10TL = timelineJson as unknown as Timeline;
export const hscene = (id: string) => sceneIn(H10TL, id);
export const hev = (k: string) => evIn(H10TL, k);
export const hevList = (k: string) => evListIn(H10TL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
// product-only cut-outs of City Store's own photos of the unit (reels/hero10/cutout.py)
export const OFFICIAL = { hero: img("front"), back: img("back"), battery: img("battery"), case: img("case"), kit: img("kit") };
/** lens centre inside the front image (fractions), for flashes */
export const LENS = { x: 0.75, y: 0.33 };
/** front screen inside the front image (x0, y0, x1, y1 fractions) */
export const FRONT_SCREEN = [0.11, 0.3, 0.53, 0.76] as const;
