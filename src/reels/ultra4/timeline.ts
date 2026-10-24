import timelineJson from "../../../public/ultra4/data/timeline.json";
import productsJson from "../../../public/ultra4/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Apple Watch Ultra 4 (49 mm, Natural Titanium) reel timeline (reels/ultra4/build_timeline.py), shared with its mix.
// 37 s long: the VO does not fit 30 s even at 1.1x, so the standing over-30 s approval applies.
export const U4TL = timelineJson as unknown as Timeline;
export const u4scene = (id: string) => sceneIn(U4TL, id);
export const u4ev = (k: string) => evIn(U4TL, k);
export const u4evList = (k: string) => evListIn(U4TL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { front: img("front"), angle: img("angle"), side: img("side") };
