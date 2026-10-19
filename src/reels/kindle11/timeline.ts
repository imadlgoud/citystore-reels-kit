import timelineJson from "../../../public/kindle11/data/timeline.json";
import productsJson from "../../../public/kindle11/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Amazon Kindle 11th gen reel timeline (reels/kindle11/build_timeline.py), shared with its mix. 30 s.
export const K11TL = timelineJson as unknown as Timeline;
export const k11scene = (id: string) => sceneIn(K11TL, id);
export const k11ev = (k: string) => evIn(K11TL, k);
export const k11evList = (k: string) => evListIn(K11TL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
export const OFFICIAL = { front: { src: PR.front.src, aspect: PR.front.h / PR.front.w } };
/** screen inside the front render (x0, y0, x1, y1 fractions), measured from the render */
export const SCREEN = [0.085, 0.063, 0.914, 0.816] as const;
