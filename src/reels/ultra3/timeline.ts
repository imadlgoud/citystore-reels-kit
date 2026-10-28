import timelineJson from "../../../public/ultra3/data/timeline.json";
import productsJson from "../../../public/ultra3/data/products.json";
import { evIn, evListIn, sceneIn, Timeline } from "../../timeline";

// Apple Watch Ultra 3 49mm Noir reel timeline (reels/ultra3/build_timeline.py), shared with its mix.
// 30 s: pause trimming, natural speed, VO ends at 27.6 s.
export const U3TL = timelineJson as unknown as Timeline;
export const u3scene = (id: string) => sceneIn(U3TL, id);
export const u3ev = (k: string) => evIn(U3TL, k);
export const u3evList = (k: string) => evListIn(U3TL, k);
type P = { src: string; w: number; h: number };
const PR = productsJson as unknown as Record<string, P>;
const img = (k: string) => ({ src: PR[k].src, aspect: PR[k].h / PR[k].w });
export const OFFICIAL = { front: img("front"), angle: img("angle"), side: img("side") };
